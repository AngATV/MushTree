import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

async function main() {
  const email = "admin@example.com";
  const prisma = new PrismaClient();
  const password = await bcrypt.hash("admin1234", 10);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password },
  });
  console.log("Seed done");
}

main().catch((e) => { console.error(e); process.exit(1); });


