import { generateUploadUrl } from "@vercel/blob";
import { getAuthUserFromCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = await getAuthUserFromCookies();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const { url } = await generateUploadUrl({ access: 'public' });
  return Response.json({ url });
}


