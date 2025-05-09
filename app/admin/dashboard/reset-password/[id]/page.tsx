import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { jwtVerify } from "jose"
import { PrismaClient } from "@prisma/client"
import { AdminDashboardHeader } from "@/components/admin-dashboard-header"
import { ResetPasswordForm } from "@/components/reset-password-form"

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

async function getChurchAccount(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
      role: "CHURCH",
    },
  })
}

export default async function ResetPasswordPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await getUserFromToken()

  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  const churchAccount = await getChurchAccount(params.id)

  if (!churchAccount) {
    redirect("/admin/dashboard")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminDashboardHeader username={user.username as string} />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Reset Password</h1>
        <div className="max-w-md mx-auto">
          <ResetPasswordForm userId={params.id} username={churchAccount.username} />
        </div>
      </main>
    </div>
  )
}
