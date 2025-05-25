"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface FeastsFilterProps {
  currentMonth: number;
  search: string;
  date?: string;
}

export function FeastsFilter({
  currentMonth,
  search,
  date: initialDate,
}: FeastsFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("feastPage");
  const [searchTerm, setSearchTerm] = useState(search);
  const [month, setMonth] = useState(currentMonth.toString());
  const [date, setDate] = useState(initialDate || "");
  // const t = useTranslations("feasts")
  // Apply filters when month changes
  function handleMonthChange(value: string) {
    setMonth(value);
    setDate(""); // Clear date when changing month
    const params = new URLSearchParams();

    if (value !== "all") {
      params.set("month", value);
    }

    if (searchTerm) {
      params.set("search", searchTerm);
    }

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  }

  // function handleDateChange(value: string) {
  //   setDate(value)
  //   setMonth("all") // Clear month when selecting specific date

  //   const params = new URLSearchParams()

  //   if (value) {
  //     params.set("date", value)
  //   }

  //   if (searchTerm) {
  //     params.set("search", searchTerm)
  //   }

  //   const queryString = params.toString()
  //   router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
  // }

  // Apply filters when search is submitted
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (month !== "all") {
      params.set("month", month);
    }

    if (searchTerm) {
      params.set("search", searchTerm);
    }

    if (date) {
      params.set("date", date);
    }

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
      <div className="flex-1">
        <Select value={month} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select month" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("months.allMonths")}</SelectItem>
            <SelectItem value="9">{t("months.september")}</SelectItem>
            <SelectItem value="10">{t("months.october")}</SelectItem>
            <SelectItem value="11">{t("months.november")}</SelectItem>
            <SelectItem value="12">{t("months.december")}</SelectItem>
            <SelectItem value="1">{t("months.january")}</SelectItem>
            <SelectItem value="2">{t("months.february")}</SelectItem>
            <SelectItem value="3">{t("months.march")}</SelectItem>
            <SelectItem value="4">{t("months.april")}</SelectItem>
            <SelectItem value="5">{t("months.may")}</SelectItem>
            <SelectItem value="6">{t("months.june")}</SelectItem>
            <SelectItem value="7">{t("months.july")}</SelectItem>
            <SelectItem value="8">{t("months.august")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* <div className="flex-1">
        <div className="relative">
          <Input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full"
            placeholder="Select specific date"
          />
          {date && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => handleDateChange("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear date</span>
            </Button>
          )}
        </div>
      </div> */}

      <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
        <Input
          type="text"
          placeholder="Search saints..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
