import bcrypt from "bcrypt";
import { sql } from "@vercel/postgres";

async function main() {
  const email = "admin@example.com";
  const password = await bcrypt.hash("admin1234", 10);
  const id = crypto.randomUUID();
  await sql`INSERT INTO users (id, email, password) VALUES (${id}, ${email}, ${password}) ON CONFLICT (email) DO NOTHING`;
  console.log("Seed done");
}

main().catch((e) => { console.error(e); process.exit(1); });


