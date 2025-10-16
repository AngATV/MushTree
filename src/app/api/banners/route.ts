import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookies } from "@/lib/auth";

export async function GET() {
  const banners = await prisma.banner.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json(banners);
}

export async function POST(req: Request) {
  const user = await getAuthUserFromCookies();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const { title, imageUrl, linkUrl } = await req.json();
  if (!title || !imageUrl || !linkUrl) return new Response("Bad Request", { status: 400 });
  const banner = await prisma.banner.create({ data: { title, imageUrl, linkUrl } });
  return Response.json(banner, { status: 201 });
}


