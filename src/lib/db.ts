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
  // Colonnes étendues pour les offres
  await sql`ALTER TABLE banners ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;`;
  await sql`ALTER TABLE banners ADD COLUMN IF NOT EXISTS category TEXT;`;
  await sql`ALTER TABLE banners ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';`;
  await sql`ALTER TABLE banners ADD COLUMN IF NOT EXISTS position INT DEFAULT 0;`;
  // Champs offre
  await sql`ALTER TABLE banners ADD COLUMN IF NOT EXISTS deposit_min TEXT;`;
  await sql`ALTER TABLE banners ADD COLUMN IF NOT EXISTS bonus TEXT;`;
  await sql`ALTER TABLE banners ADD COLUMN IF NOT EXISTS cashback TEXT;`;
  await sql`ALTER TABLE banners ADD COLUMN IF NOT EXISTS free_spins TEXT;`;
  await sql`ALTER TABLE banners ADD COLUMN IF NOT EXISTS cta_label TEXT;`;
  await sql`ALTER TABLE banners ADD COLUMN IF NOT EXISTS banner_type TEXT DEFAULT 'square';`;
  await sql`CREATE TABLE IF NOT EXISTS clicks (
    id TEXT PRIMARY KEY,
    banner_id TEXT NOT NULL REFERENCES banners(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    ip TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    country TEXT
  );`;
  // Social links
  await sql`CREATE TABLE IF NOT EXISTS social_links (
    platform TEXT PRIMARY KEY,
    url TEXT NOT NULL
  );`;
}


