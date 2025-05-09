import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { jwtVerify } from "jose"
import { PrismaClient } from "@prisma/client"
import { AdminDashboardHeader } from "@/components/admin-dashboard-header"
import { ChurchAccountsList } from "@/components/church-accounts-list"

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

async function getChurchAccounts() {
  return prisma.user.findMany({
    where: {
      role: "CHURCH",
    },
    include: {
      church: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export default async function AdminDashboardPage() {
  const user = await getUserFromToken()

  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  const churchAccounts = await getChurchAccounts()

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminDashboardHeader username={user.username as string} />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Church Accounts</h1>
        <ChurchAccountsList accounts={churchAccounts} />
      </main>
    </div>
  )
}
