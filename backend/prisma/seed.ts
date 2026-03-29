import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../src/env/variables";

const prisma = new PrismaClient();
const rounds = SALT_ROUNDS || 10;

async function main() {
  const password = await bcrypt.hash("password123", rounds);

  await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      email: "test@test.com",
      password,
    },
  });

  console.log("✅ Seed user created");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());