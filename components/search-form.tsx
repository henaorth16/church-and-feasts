"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

interface SearchFormProps {
  initialQuery: string
  initialType: string
  initialDate?: string
}

export function SearchForm({ initialQuery, initialType, initialDate }: SearchFormProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [type, setType] = useState(initialType || "all")
  const [date, setDate] = useState(initialDate || "")

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

    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search churches, feasts, saints..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-40">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Filter by date" />
        </div>
        <Button type="submit">Search</Button>
      </div>

      <RadioGroup value={type} onValueChange={setType} className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all">All</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="churches" id="churches" />
          <Label htmlFor="churches">Churches</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="feasts" id="feasts" />
          <Label htmlFor="feasts">Feasts</Label>
        </div>
      </RadioGroup>
    </form>
  )
}
