import { put } from "@vercel/blob";
import { getAuthUserFromCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await getAuthUserFromCookies();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const form = await req.formData();
    const file = form.get("file") as unknown as File | null;
    if (!file) return Response.json({ error: "Missing file" }, { status: 400 });

    const filename = `banners/${crypto.randomUUID()}-${file.name}`.replace(/\s+/g, "-");
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type || "application/octet-stream",
    });
    return Response.json({ url: blob.url });
  } catch (e: any) {
    return Response.json({ error: e?.message ?? "Upload failed" }, { status: 500 });
  }
}


