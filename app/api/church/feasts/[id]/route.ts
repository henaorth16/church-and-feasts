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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || user.role !== "CHURCH") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const data = await request.json()

    // Get church ID
    const church = await prisma.church.findFirst({
      where: {
        userId: user.id as string,
      },
    })

    if (!church) {
      return NextResponse.json({ message: "Church not found" }, { status: 404 })
    }

    // Check if church feast exists and belongs to this church
    const churchFeast = await prisma.churchFeast.findFirst({
      where: {
        id,
        churchId: church.id,
      },
    })

    if (!churchFeast) {
      return NextResponse.json({ message: "Church feast not found" }, { status: 404 })
    }

    // Update church feast
    const updatedChurchFeast = await prisma.churchFeast.update({
      where: {
        id,
      },
      data: {
        specialNotes: data.specialNotes,
      },
    })

    return NextResponse.json(updatedChurchFeast, { status: 200 })
  } catch (error) {
    console.error("Update church feast error:", error)
    return NextResponse.json({ message: "An error occurred while updating the feast" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || user.role !== "CHURCH") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Get church ID
    const church = await prisma.church.findFirst({
      where: {
        userId: user.id as string,
      },
    })

    if (!church) {
      return NextResponse.json({ message: "Church not found" }, { status: 404 })
    }

    // Check if church feast exists and belongs to this church
    const churchFeast = await prisma.churchFeast.findFirst({
      where: {
        id,
        churchId: church.id,
      },
    })

    if (!churchFeast) {
      return NextResponse.json({ message: "Church feast not found" }, { status: 404 })
    }

    // Delete church feast
    await prisma.churchFeast.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ message: "Church feast deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Delete church feast error:", error)
    return NextResponse.json({ message: "An error occurred while deleting the feast" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
