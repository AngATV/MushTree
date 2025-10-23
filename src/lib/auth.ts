import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { sql } from "@vercel/postgres";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const COOKIE_NAME = "admin_token";
const USER_COOKIE_NAME = "user_token";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

type JwtPayload = { userId: string; email: string };

export function signJwt(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function getAuthUserFromCookies() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyJwt(token);
  if (!payload) return null;
  const { rows } = await sql<{ id: string; email: string }>`SELECT id, email FROM users WHERE id = ${payload.userId} LIMIT 1`;
  const user = rows[0];
  return user ? { id: user.id, email: user.email } : null;
}

export async function setAuthCookie(payload: JwtPayload) {
  const token = signJwt(payload);
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  (await cookies()).set(COOKIE_NAME, "", { httpOnly: true, maxAge: 0, path: "/" });
}

// Site user (public) auth helpers
export async function getSiteUserFromCookies() {
  const token = (await cookies()).get(USER_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyJwt(token);
  if (!payload) return null;
  const { rows } = await sql<{ id: string; email: string }>`SELECT id, email FROM users WHERE id = ${payload.userId} LIMIT 1`;
  const user = rows[0];
  return user ? { id: user.id, email: user.email } : null;
}

export async function setSiteCookie(payload: JwtPayload) {
  const token = signJwt(payload);
  (await cookies()).set(USER_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSiteCookie() {
  (await cookies()).set(USER_COOKIE_NAME, "", { httpOnly: true, maxAge: 0, path: "/" });
}


