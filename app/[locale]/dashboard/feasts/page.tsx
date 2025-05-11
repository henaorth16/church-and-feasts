import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { jwtVerify } from "jose"
import { PrismaClient } from "@prisma/client"
import { DashboardHeader } from "@/components/dashboard-header"
import { ChurchFeastsList } from "@/components/church-feasts-list"

const prisma = new PrismaClient()

async function getUserFromToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

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

async function getChurchFeasts(userId: string) {
  const church = await prisma.church.findFirst({
    where: {
      userId,
    },
    include: {
      churchFeasts: {
        include: {
          feast: true,
        },
        orderBy: {
          feast: {
            commemorationDate: "asc",
          },
        },
      },
    },
  })

  return church?.churchFeasts || []
}

async function getAllFeasts() {
  return prisma.feast.findMany({
    orderBy: {
      commemorationDate: "asc",
    },
  })
}

export default async function ChurchFeastsPage() {
  const user = await getUserFromToken()

  if (!user || user.role !== "CHURCH") {
    redirect("/login")
  }

  const [churchFeasts, allFeasts] = await Promise.all([getChurchFeasts(user.id as string), getAllFeasts()])

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader username={user.username as string} />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Manage Feast Days</h1>
        <ChurchFeastsList churchFeasts={churchFeasts} allFeasts={allFeasts} userId={user.id as string} />
      </main>
    </div>
  )
}
