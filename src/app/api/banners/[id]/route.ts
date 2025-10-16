import { prisma } from "@/lib/prisma";
import { getAuthUserFromCookies } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUserFromCookies();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const { title, imageUrl, linkUrl } = await req.json();
  const updated = await prisma.banner.update({
    where: { id: params.id },
    data: { title, imageUrl, linkUrl },
  });
  return Response.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUserFromCookies();
  if (!user) return new Response("Unauthorized", { status: 401 });
  await prisma.clickEvent.deleteMany({ where: { bannerId: params.id } });
  await prisma.banner.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}


