import { put } from "@vercel/blob";
import { getAuthUserFromCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await getAuthUserFromCookies();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as unknown as File | null;
  if (!file) return new Response("Bad Request", { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const filename = `banners/${crypto.randomUUID()}-${file.name}`.replace(/\s+/g, "-");
  const blob = await put(filename, new Uint8Array(arrayBuffer), {
    access: "public",
    contentType: file.type || "application/octet-stream",
  });
  return Response.json({ url: blob.url });
}


