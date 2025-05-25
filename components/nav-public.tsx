"use client";
import { useLocale, useTranslations } from "use-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LanguageToggler from "./languageToggler";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { HomeIcon, MenuIcon } from "lucide-react";
import { Church, Calendar, Search, LogIn } from "lucide-react";

const links = [
  { href: "/directory", label: "churches", icon: Church },
  { href: "/feasts", label: "feasts", icon: Calendar },
  { href: "/search", label: "search", icon: Search },
  { href: "/login", label: "login", icon: LogIn },
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
                    ? "bg-primary-foreground font-semibold"
                    : ""
                }
              >
                <Link
                  href={`/${locale}${link.href}`}
                  className="flex items-center gap-1"
                >
                  <link.icon className="w-4 h-4" />
                  {t(link.label)}
                </Link>
              </Button>
            ))}
            <LanguageToggler />
          </div>
        </div>
        {/* </header> */}
        {/* ) : ( */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="z-[999] lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="left">
            {/* {logo */}

            <div className="grid py-7">
              <Link
                href={`/${locale}`}
                className="flex w-full items-center my-3 gap-2 font-semibold"
                prefetch={false}
              >
                <HomeIcon className="w-5 h-5" />
                {t("home")}
              </Link>
              <hr className="border-slate-300" />
              {links.map((item, idx) => (
                  <div key={idx}>
                    <Link
                      href={`/${locale}${item.href}`}
                      className="flex w-full items-center my-3 gap-2 font-semibold"
                      prefetch={false}
                    >
                      <item.icon className="w-5 h-5" />
                      {t(item.label)}
                    </Link>
                    <hr className="border-slate-300" />
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
