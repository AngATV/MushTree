import { sql } from "@vercel/postgres";
import { setSiteCookie } from "@/lib/auth";
import { ensureSchema } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function exchangeCodeForToken(code: string, redirectUri: string) {
  const params = new URLSearchParams();
  params.set("client_id", process.env.DISCORD_CLIENT_ID!);
  params.set("client_secret", process.env.DISCORD_CLIENT_SECRET!);
  params.set("grant_type", "authorization_code");
  params.set("code", code);
  params.set("redirect_uri", redirectUri);
  const res = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {}
    throw new Error(`token exchange failed: ${detail}`);
  }
  return res.json();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;
  if (!code) return new Response("Missing code", { status: 400 });
  if (!clientId || !clientSecret || !redirectUri) {
    console.error("Discord OAuth misconfigured", { hasClientId: !!clientId, hasClientSecret: !!clientSecret, hasRedirectUri: !!redirectUri });
    return new Response("Discord OAuth non configuré", { status: 500 });
  }
  try {
    await ensureSchema();
    const token = await exchangeCodeForToken(code, redirectUri);
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `${token.token_type} ${token.access_token}` },
    });
    if (!userRes.ok) {
      let detail = "";
      try {
        detail = await userRes.text();
      } catch {}
      throw new Error(`user fetch failed: ${detail}`);
    }
    const profile = await userRes.json();
    const email = profile.email as string | undefined;
    const discordId = profile.id as string;
    const username = (profile.global_name as string | undefined) || (profile.username as string | undefined) || "Discord User";
    const avatarHash = profile.avatar as string | null;
    const isAnimated = !!avatarHash && avatarHash.startsWith("a_");
    const avatarExt = isAnimated ? "gif" : "png";
    const avatarUrl = avatarHash
      ? `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.${avatarExt}?size=128`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;
    const id = discordId;
    await sql`INSERT INTO users (id, email, password, username, avatar_url) VALUES (${id}, ${email ?? `${discordId}@discord.local`}, ${"oauth"}, ${username}, ${avatarUrl})
             ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, username = EXCLUDED.username, avatar_url = EXCLUDED.avatar_url`;
    await setSiteCookie({ userId: id, email: email ?? "discord" });
    const home = new URL("/", url.origin).toString();
    return Response.redirect(home, 302);
  } catch (e) {
    console.error("Discord OAuth error:", e);
    return new Response("Discord OAuth error", { status: 500 });
  }
}


