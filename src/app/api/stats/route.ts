import { prisma } from "@/lib/prisma";

export async function GET() {
  const stats = await prisma.clickEvent.groupBy({
    by: ["bannerId"],
    _count: { bannerId: true },
  });
  return Response.json(stats);
}


