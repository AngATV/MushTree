import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  await clearAuthCookie();
  return new Response(null, { status: 204 });
}


