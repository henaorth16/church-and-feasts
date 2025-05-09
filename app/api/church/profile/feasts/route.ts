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
    if (!data.feastId) {
      return NextResponse.json({ message: "Feast ID is required" }, { status: 400 })
    }

    // Get church ID
    const church = await prisma.church.findFirst({
      where: {
        userId: user.id as string,
      },
    })

    if (!church) {
      return NextResponse.json({ message: "Church not found" }, { status: 404 })
    }

    // Check if feast exists
    const feast = await prisma.feast.findUnique({
      where: {
        id: data.feastId,
      },
    })

    if (!feast) {
      return NextResponse.json({ message: "Feast not found" }, { status: 404 })
    }

    // Check if church already has this feast
    const existingChurchFeast = await prisma.churchFeast.findFirst({
      where: {
        churchId: church.id,
        feastId: data.feastId,
      },
    })

    if (existingChurchFeast) {
      return NextResponse.json({ message: "This feast is already associated with your church" }, { status: 400 })
    }

    // Create church feast
    const churchFeast = await prisma.churchFeast.create({
      data: {
        churchId: church.id,
        feastId: data.feastId,
        specialNotes: data.specialNotes,
      },
    })

    return NextResponse.json(churchFeast, { status: 201 })
  } catch (error) {
    console.error("Create church feast error:", error)
    return NextResponse.json({ message: "An error occurred while adding the feast" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
