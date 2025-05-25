import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
//@ts-ignore
import { toEthiopian } from "ethiopian-date";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ethiopianMonths = [
  //amharic names of the Ethiopian months
  "መስከረም",
  "ጥቅምት",
  "ኅዳር",
  "ታህሳስ",
  "ጥር",
  "የካቲት",
  "መጋቢት",
  "ሚያዝያ",
  "ግንቦት",
  "ሰኔ",
  "ሐምሌ",
  "ነሃሴ",
  "ጳጉሜ",
];

/// Function to format a date based on the locale
/// If the locale is "am", it converts the date to Ethiopian format
/// Otherwise, it formats the date in the standard "en-US" format
export function formatDate(date: Date, locale: string = "en"): string {
  if (locale === "am") {
    const dateValue = new Date(date);
    const ethiopianDate = toEthiopian(
      dateValue.getFullYear(),
      dateValue.getMonth() + 1,
      dateValue.getDate()
    );
    // Ethiopian date is returned in the format "YYYY-MM-DD"
    return ethiopianMonths[ethiopianDate[1] - 1] + " " + ethiopianDate[2];
  } else {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  }
}
