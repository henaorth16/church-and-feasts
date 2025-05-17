"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"

interface ChurchesFilterProps {
  search: string
}

export function ChurchesFilter({ search }: ChurchesFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = useState(search)
  const t = useTranslations("ChurchDirectoryPage")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const params = new URLSearchParams()

    if (searchTerm) {
      params.set("search", searchTerm)
    }

    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
      <Input
        type="text"
        placeholder={t("searchPlaceholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      <Button type="submit" size="icon">
        <Search className="h-4 w-6" />
      </Button>
    </form>
  )
}
