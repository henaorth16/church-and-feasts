"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { LanguagesIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function LanguageToggler() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function handleLanguageChange(newLocale: string) {
    // Replace current locale in URL with selected one
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");
    router.push(newPath);
  }

  return (
    // #### enable the below code, if you have more than two options such as amharic, english, oromiffaa, tigrigna...  ####
      <Select value={locale} onValueChange={handleLanguageChange}>
        <SelectTrigger>
          <LanguagesIcon />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="am">አማርኛ</SelectItem>
        </SelectContent>
      </Select>

    // #### enable the below code, if you have only two options amharic and english ####

    // <Button variant="outline" onClick={() => handleLanguageChange(locale === "en" ? "am" : "en")}>
    //   {locale === "en" ? "አማ" : "En"}
    // </Button>
  );
}
