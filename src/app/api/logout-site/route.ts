import { clearSiteCookie } from "@/lib/auth";

export async function POST() {
  await clearSiteCookie();
  return new Response(null, { status: 204 });
}


