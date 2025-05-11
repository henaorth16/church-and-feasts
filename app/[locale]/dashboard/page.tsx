//@ts-nocheck
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { jwtVerify } from "jose"
import { PrismaClient } from "@prisma/client"
import { DashboardHeader } from "@/components/dashboard-header"
import { ChurchProfileForm } from "@/components/church-profile-form"

const prisma = new PrismaClient()

async function getUserFromToken() {
  const cookieStore = cookies()
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

async function getChurchProfile(userId: string) {
  return prisma.church.findFirst({
    where: {
      userId,
    },
  })
}

export default async function DashboardPage() {
  const user = await getUserFromToken()

  if (!user || user.role !== "CHURCH") {
    redirect("/login")
  }

  const church = await getChurchProfile(user.id as string)

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader username={user.username as string} />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Church Profile</h1>
        <ChurchProfileForm initialData={church} userId={user.id as string} />
      </main>
    </div>
  )
}
