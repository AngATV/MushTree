import { ensureSchema } from "@/lib/db";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SetupBody = {
  email?: string;
  password?: string;
  token?: string;
};

export async function POST(req: Request) {
  const { email, password, token }: SetupBody = await req.json().catch(() => ({}));

  const installToken = process.env.INSTALL_TOKEN;
  if (!installToken) return new Response("INSTALL_TOKEN non défini", { status: 500 });
  if (!token || token !== installToken) return new Response("Unauthorized", { status: 401 });
  if (!email || !password) return new Response("Bad Request", { status: 400 });

  await ensureSchema();

  const { rows: countRows } = await sql<{ count: number }>`SELECT COUNT(*)::int AS count FROM users`;
  if ((countRows[0]?.count ?? 0) > 0) return new Response("Déjà initialisé", { status: 409 });

  const hash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();
  await sql`INSERT INTO users (id, email, password) VALUES (${id}, ${email}, ${hash})`;
  return new Response(null, { status: 201 });
}


