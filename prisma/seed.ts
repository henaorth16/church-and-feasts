import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Check if admin already exists
  const adminExists = await prisma.user.findUnique({
    where: {
      username: "admin",
    },
  })

  if (!adminExists) {
    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10)
    await prisma.user.create({
      data: {
        username: "admin",
        password: hashedPassword,
        role: "ADMIN",
      },
    })
    console.log("Admin user created")
  } else {
    console.log("Admin user already exists")
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
