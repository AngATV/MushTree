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

    // 1) Tentative via SDK (sans token, sur Vercel)
    try {
      const blob = await put(filename, file, {
        access: "public",
        contentType: file.type || "application/octet-stream",
      });
      return Response.json({ url: blob.url });
    } catch {}

    // 2) Fallback REST (nécessite BLOB_READ_WRITE_TOKEN)
    const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_RW_TOKEN;
    if (!token) return Response.json({ error: "Missing BLOB_READ_WRITE_TOKEN" }, { status: 500 });
    const fd = new FormData();
    fd.append("file", file, filename);
    const resp = await fetch("https://api.vercel.com/v2/blobs", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!resp.ok) {
      const txt = await resp.text();
      return Response.json({ error: txt || "Blob upload failed" }, { status: 500 });
    }
    const json = await resp.json();
    return Response.json({ url: json.url });
  } catch (e: any) {
    return Response.json({ error: e?.message ?? "Upload failed" }, { status: 500 });
  }
}


