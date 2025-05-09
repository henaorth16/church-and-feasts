import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 })
    }

    const user = {
      id: "1",
      username: "admin",
      password: "admin",
      role: "ADMIN",
    }
    // Find user by username
    // const user = await prisma.user.findUnique({
    //   where: { username },
    // })

    // if (!user) {
    //   return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
    // }
    // console.log(user.password)
    // Check if user is an admin
    // if (user.role !== "ADMIN") {
    //   return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
    // }

    // TODO: for later  Verify password
    // const isPasswordValid = await bcrypt.compare(password, user.password)

    // if (!isPasswordValid) {
    //   return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
    // }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "3d" },
    )

    // Create response
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
      { status: 200 },
    )

    // Set cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 3, // 3 days
    })

    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ message: "An error occurred during login" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
