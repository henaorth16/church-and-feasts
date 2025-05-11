import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { jwtVerify } from "jose"
import { PrismaClient } from "@prisma/client"
import { AdminDashboardHeader } from "@/components/admin-dashboard-header"
import { AdminFeastsList } from "../../../../../components/admin-feasts-list"

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

async function getFeasts() {
  return prisma.feast.findMany({
    orderBy: {
      commemorationDate: "asc",
    },
    include: {
      churchFeasts: {
        include: {
          church: true,
        },
      },
    },
  })
}

export default async function AdminFeastsPage() {
  const user = await getUserFromToken()

  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  const feasts = await getFeasts()

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminDashboardHeader username={user.username as string} />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Manage Feasts</h1>
        <AdminFeastsList feasts={feasts} />
      </main>
    </div>
  )
}
