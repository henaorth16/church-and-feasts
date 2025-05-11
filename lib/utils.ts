import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
const ethiopic = require('ethiopic-date');

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/// Function to format a date based on the locale
/// If the locale is "am", it converts the date to Ethiopian format
/// Otherwise, it formats the date in the standard "en-US" format
export function formatDate(date: Date, locale: string = "en"): string {
  if (locale === "am") {
    const ethiopianDate = ethiopic.convert(date);
    return ethiopianDate as string;
  } else {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}
