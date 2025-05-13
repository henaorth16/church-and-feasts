//@ts-nocheck
import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { jwtVerify } from "jose"

const prisma = new PrismaClient()

async function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  if (!token) {
    return null
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || user.role !== "CHURCH") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ message: "Church name is required" }, { status: 400 })
    }
    // Create church profile
    const church = await prisma.church.create({
      data: {
        name: data.name,
        nameAmh: data.nameAmh,
        address: data.address,
        email: data.email,
        phone: data.phone,
        latitude: data.latitude,
        longitude: data.longitude,
        profileImage: data.profileImage,
        servantCount: data.servantCount,
        description: data.description,
        userId: user.id as string,
      },
    })

    return NextResponse.json(church, { status: 201 })
  } catch (error) {
    console.error("Create church profile error:", error)
    return NextResponse.json({ message: "An error occurred while creating the profile" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || user.role !== "CHURCH") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ message: "Church name is required" }, { status: 400 })
    }

    // Find existing church profile
    const existingChurch = await prisma.church.findFirst({
      where: {
        userId: user.id as string,
      },
    })

    if (!existingChurch) {
      return NextResponse.json({ message: "Church profile not found" }, { status: 404 })
    }

    // Update church profile
    const church = await prisma.church.update({
      where: {
        id: existingChurch.id,
      },
      data: {
        name: data.name,
        address: data.address,
        email: data.email,
        phone: data.phone,
        latitude: data.latitude,
        longitude: data.longitude,
        profileImage: data.profileImage,
        servantCount: data.servantCount,
        description: data.description,
      },
    })

    return NextResponse.json(church, { status: 200 })
  } catch (error) {
    console.error("Update church profile error:", error)
    return NextResponse.json({ message: "An error occurred while updating the profile" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
