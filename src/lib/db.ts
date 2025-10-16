import { sql } from "@vercel/postgres";

export async function ensureSchema() {
  await sql`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );`;
  await sql`CREATE TABLE IF NOT EXISTS banners (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );`;
  await sql`CREATE TABLE IF NOT EXISTS clicks (
    id TEXT PRIMARY KEY,
    banner_id TEXT NOT NULL REFERENCES banners(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    ip TEXT NOT NULL,
    user_agent TEXT NOT NULL
  );`;
}


