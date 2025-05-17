"use client";
import { useLocale, useTranslations } from "use-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LanguageToggler from "./languageToggler";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { MenuIcon } from "lucide-react";

const links = [
  { href: "/directory", label: "churches" },
  { href: "/feasts", label: "feasts" },
  { href: "/search", label: "search" },
  { href: "/login", label: "login" },
];

export default function NavPublic() {
  const isMobile = useIsMobile();
  const locale = useLocale();
  const pathName = usePathname();
  const t = useTranslations("nav");
  return (
    // isMobile ? (
    <>
      <header className="border-b flex justify-between lg:block p-2">
        <div className="container mx-auto px-4 hidden lg:flex items-center justify-between">
          <Link href={`/${locale}`} className="text-xl font-bold">
            {t("title")}
          </Link>
          <div className="flex items-center gap-2">
            {links.map((link) => (
              <Button
                key={link.href}
                asChild
                variant="ghost"
                className={
                  pathName === `/${locale}${link.href}`
                    ? "bg-primary-foreground"
                    : ""
                }
              >
                <Link href={`/${locale}/${link.href}`}>{t(link.label)}</Link>
              </Button>
            ))}
            {/* <Button asChild>
                  <Link href={`/${locale}/login`}>{t("login")}</Link>
                </Button> */}

            <LanguageToggler />
          </div>
        </div>
        {/* </header> */}
        {/* ) : ( */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="z-[999] lg:hidden">
              <MenuIcon className="h-6 w-6 fixed" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="left">
            {/* {logo */}

            <div className="grid gap-2 py-6">
              {links.map((item, idx) => (
                <div key={idx}>
                  <Link
                    href={`/${locale}${item.href}`}
                    className="flex w-full items-center text-primary font-semibold"
                    prefetch={false}
                  >
                    {item.label}
                  </Link>
                  <hr className="border-slate-400" />
                </div>
              ))}
              <div className="flex items-center gap-2">
                <LanguageToggler />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        {/* <LanguageToggler /> */}
      </header>
    </>
  );
}
