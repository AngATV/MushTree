import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const banner = await prisma.banner.findUnique({ where: { id: params.id } });
  if (!banner) return new Response("Not Found", { status: 404 });
  // Collecte minimale de tracking
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  await prisma.clickEvent.create({
    data: { bannerId: banner.id, ip, userAgent },
  });
  return Response.redirect(banner.linkUrl, 302);
}


