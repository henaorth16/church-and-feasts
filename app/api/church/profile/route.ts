import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { jwtVerify } from "jose"
import cloudinary from "@/lib/cloudinary"

const prisma = new PrismaClient()

async function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  if (!token) return null

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

// ===========================
// POST - Create Church
// ===========================
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user || user.role !== "CHURCH") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    if (!data.name) {
      return NextResponse.json({ message: "Church name is required" }, { status: 400 })
    }

    let uploadedImageUrl: string | null = null

    if (data.profileImage) {
      try {
        const uploadResult = await cloudinary.uploader.upload(data.profileImage, {
          folder: "church_profiles",
          use_filename: true,
          unique_filename: false,
        })
        uploadedImageUrl = uploadResult.secure_url
      } catch (err) {
        console.error("Cloudinary upload failed:", err)
        return NextResponse.json({ message: "Image upload failed" }, { status: 500 })
      }
    }

    const church = await prisma.church.create({
      data: {
        name: data.name,
        address: data.address,
        email: data.email,
        phone: data.phone,
        latitude: data.latitude,
        longitude: data.longitude,
        profileImage: uploadedImageUrl,
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

// ===========================
// PUT - Update Church
// ===========================
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user || user.role !== "CHURCH") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    if (!data.name) {
      return NextResponse.json({ message: "Church name is required" }, { status: 400 })
    }

    const existingChurch = await prisma.church.findFirst({
      where: { userId: user.id as string },
    })

    if (!existingChurch) {
      return NextResponse.json({ message: "Church profile not found" }, { status: 404 })
    }

    let updatedImageUrl = existingChurch.profileImage

    if (
      data.profileImage &&
      data.profileImage !== existingChurch.profileImage &&
      data.profileImage.startsWith("data:image")
    ) {
      try {
        const uploadResult = await cloudinary.uploader.upload(data.profileImage, {
          folder: "church_profiles",
          use_filename: true,
          unique_filename: false,
        })
        updatedImageUrl = uploadResult.secure_url
      } catch (err) {
        console.error("Cloudinary upload failed:", err)
        return NextResponse.json({ message: "Image upload failed" }, { status: 500 })
      }
    }

    const updatedChurch = await prisma.church.update({
      where: { id: existingChurch.id },
      data: {
        name: data.name,
        address: data.address,
        email: data.email,
        phone: data.phone,
        latitude: data.latitude,
        longitude: data.longitude,
        profileImage: updatedImageUrl,
        servantCount: data.servantCount,
        description: data.description,
      },
    })

    return NextResponse.json(updatedChurch, { status: 200 })
  } catch (error) {
    console.error("Update church profile error:", error)
    return NextResponse.json({ message: "An error occurred while updating the profile" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
