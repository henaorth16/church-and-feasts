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
    if (!data.saintName || !data.commemorationDate) {
      return NextResponse.json({ message: "Feast name and date are required" }, { status: 400 })
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

    // Create the feast in a transaction to ensure both feast and church-feast relation are created
    const result = await prisma.$transaction(async (tx) => {
      // Create the feast
      const feast = await tx.feast.create({
        data: {
          saintName: data.saintName,
          commemorationDate: new Date(data.commemorationDate),
          description: data.description,
        },
      })

      // Create the church-feast relationship
      const churchFeast = await tx.churchFeast.create({
        data: {
          churchId: church.id,
          feastId: feast.id,
          specialNotes: data.specialNotes,
        },
      })

      return { feast, churchFeast }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Create feast error:", error)
    return NextResponse.json({ message: "An error occurred while creating the feast" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
