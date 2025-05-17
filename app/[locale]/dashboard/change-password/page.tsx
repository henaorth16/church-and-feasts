import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { jwtVerify } from "jose"
import { DashboardHeader } from "@/components/dashboard-header"
import { ChangePasswordForm } from "@/components/change-password-form"
import { getLocale } from "next-intl/server"


const locale = getLocale();

async function getUserFromToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return notFound()
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}



export default async function ChangePasswordPage() {
  const user = await getUserFromToken()

  if (!user || user.role !== "CHURCH") {
    redirect(`/login`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader username={user.username as string} />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Change Password</h1>
        <div className="max-w-md mx-auto">
          <ChangePasswordForm userId={user.id as string} />
        </div>
      </main>
    </div>
  )
}
