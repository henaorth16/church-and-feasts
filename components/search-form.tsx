"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

interface SearchFormProps {
  initialQuery: string
  initialType: string
  initialDate?: string
}

export function SearchForm({ initialQuery, initialType, initialDate }: SearchFormProps) {
  const router = useRouter()
  const locale = useLocale()
  const [query, setQuery] = useState(initialQuery)
  const [type, setType] = useState(initialType || "all")
  const [date, setDate] = useState(initialDate || "")
  const t = useTranslations("SearchPage")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!query.trim() && !date) return

    const params = new URLSearchParams()

    if (query.trim()) {
      params.set("q", query)
    }

    if (type !== "all") {
      params.set("type", type)
    }

    if (date) {
      params.set("date", date)
    }

    router.push(`/${locale}/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("placeholders.search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-40">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder={t("placeholders.date")}
          />
        </div>
        <Button type="submit">{t("buttons.search")}</Button>
      </div>

      <RadioGroup value={type} onValueChange={setType} className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all">{t("radio.all")}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="churches" id="churches" />
          <Label htmlFor="churches">{t("radio.churches")}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="feasts" id="feasts" />
          <Label htmlFor="feasts">{t("radio.feasts")}</Label>
        </div>
      </RadioGroup>
    </form>
  )
}
