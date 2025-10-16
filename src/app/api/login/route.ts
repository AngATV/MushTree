import { prisma } from "@/lib/prisma";
import { setAuthCookie, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return new Response("Bad Request", { status: 400 });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return new Response("Unauthorized", { status: 401 });
    const ok = await verifyPassword(password, user.password);
    if (!ok) return new Response("Unauthorized", { status: 401 });
    await setAuthCookie({ userId: user.id, email: user.email });
    return new Response(null, { status: 204 });
  } catch (e) {
    return new Response("Server Error", { status: 500 });
  }
}


