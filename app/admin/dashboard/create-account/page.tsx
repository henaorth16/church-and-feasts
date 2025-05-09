import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { jwtVerify } from "jose"
import { AdminDashboardHeader } from "@/components/admin-dashboard-header"
import { CreateChurchAccountForm } from "@/components/create-church-account-form"

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

export default async function CreateAccountPage() {
  const user = await getUserFromToken()

  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminDashboardHeader username={user.username as string} />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Create Church Account</h1>
        <div className="max-w-md mx-auto">
          <CreateChurchAccountForm />
        </div>
      </main>
    </div>
  )
}
