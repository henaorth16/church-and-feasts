"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut, User, Lock, Calendar } from "lucide-react"
import logo from "@/assets/home.png";
import Image from "next/image";

interface DashboardHeaderProps {
  username: string
}

export function DashboardHeader({ username }: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-bold">
          <Image
                        className="rounded-full"
                        src={logo}
                        alt="Home icon"
                        width="40"
                        height="40"
                      />
      
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4">
            <Button asChild variant={pathname === "/dashboard" ? "default" : "ghost"}>
              <Link href="/dashboard">Profile</Link>
            </Button>
            <Button asChild variant={pathname === "/dashboard/feasts" ? "default" : "ghost"}>
              <Link href="/dashboard/feasts" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Feast Days
              </Link>
            </Button>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {username}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild className="md:hidden">
                <Link href="/dashboard">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="md:hidden">
                <Link href="/dashboard/feasts" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Feast Days
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/change-password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Change Password
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
