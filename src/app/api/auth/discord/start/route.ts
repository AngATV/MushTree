export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;
  const scopes = ["identify", "email"]; // email nécessite que l'appli Discord l'autorise
  if (!clientId || !redirectUri) {
    return new Response("Discord OAuth non configuré", { status: 500 });
  }
  const url = new URL("https://discord.com/api/oauth2/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scopes.join(" "));
  url.searchParams.set("prompt", "consent");
  return Response.redirect(url.toString(), 302);
}


