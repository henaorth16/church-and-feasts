import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Calendar, Search } from "lucide-react";
// import { prisma } from "@/lib/prisma";
//import prisma client
import { getTranslations } from "next-intl/server";
import FormattedDate from "@/components/formatted-date";
import { Select } from "@/components/ui/select";
import LanguageToggler from "@/components/languageToggler";
import HeroSection from "@/components/HeroSection";
import { PrismaClient } from "@prisma/client";
import Footer from "@/components/footer";
import NavPublic from "@/components/nav-public";
import ChurchesPage from "@/components/near-churches";
import { Input } from "@/components/ui/input";

const prisma = new PrismaClient();

// Todo: get all churches and sort by c
async function getFeaturedChurches() {
  return prisma.church.findMany();
}

async function getUpcomingFeasts() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Convert today's month and day into a comparable number (e.g., May 19 → 519)
  const todayKey = (today.getMonth() + 1) * 100 + today.getDate();

  // Fetch all feasts once from the database
  const allFeasts = await prisma.feast.findMany();

  // Filter and sort based on month and day
  const upcomingFeasts = allFeasts
    .filter((feast) => {
      const date = new Date(feast.commemorationDate);
      const feastKey = (date.getMonth() + 1) * 100 + date.getDate();
      return feastKey >= todayKey;
    })
    .sort((a, b) => {
      const aKey =
        (new Date(a.commemorationDate).getMonth() + 1) * 100 +
        new Date(a.commemorationDate).getDate();
      const bKey =
        (new Date(b.commemorationDate).getMonth() + 1) * 100 +
        new Date(b.commemorationDate).getDate();
      return aKey - bKey;
    })
    .slice(0, 3);

  return upcomingFeasts;
}

async function getTodaysFeasts() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return prisma.feast.findMany({
    where: {
      commemorationDate: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      churchFeasts: {
        include: {
          church: true,
        },
      },
    },
  });
}

export default async function Home(
  //get the current locale from the url
  {
    params,
  }: {
    params: { locale: string };
  }
) {
  const resolvedParams = await params;

  const { locale } = resolvedParams;
  const t = await getTranslations("HomePage");
  const [churches, upcomingFeasts, todaysFeasts] = await Promise.all([
    getFeaturedChurches(),
    getUpcomingFeasts(),
    getTodaysFeasts(),
  ]);
  // const allFeasts = await prisma.feast.findMany();

  return (
    <div className="min-h-screen bg-slate-50">
      <NavPublic />

      {/* Hero Section */}
      <HeroSection />

      {/* Today's Feasts */}
      {todaysFeasts.length > 0 && (
        <section className="py-8 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {t("home.todaysCommemorations")}
              </h2>
              <Button asChild variant="outline">
                <Link href="/directory">{t("home.churches")}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/feasts">{t("home.feasts")}</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link
                  href={`/feasts?date=${
                    new Date().toISOString().split("T")[0]
                  }`}>
                  {t("home.viewAll")}
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {todaysFeasts.map((feast) => (
                <Card key={feast.id}>
                  <CardHeader>
                    <CardTitle>{feast.saintName}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <FormattedDate date={feast.commemorationDate} />
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {feast.description || t("home.noDescription")}
                    </p>
                    {feast.churchFeasts.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">
                          {t("home.celebratedAt", {
                            count: feast.churchFeasts.length,
                          })}
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full">
                      <Link href={`/feasts/${feast.id}`}>
                        {t("home.viewDetails")}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Churches */}

      <ChurchesPage />

      {/* Upcoming Feasts */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              {t("home.upcomingFeasts")}
            </h2>
            <Button asChild variant="ghost">
              <Link href="/feasts">{t("home.viewAll")}</Link>
            </Button>
          </div>

          {upcomingFeasts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {t("home.noDescription")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingFeasts.map((feast) => (
                <Card key={feast.id}>
                  <CardHeader>
                    <CardTitle>{feast.saintName}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <FormattedDate date={feast.commemorationDate} />
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {feast.description || t("home.noDescription")}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full">
                      <Link href={`/feasts/${feast.id}`}>
                        {t("home.viewDetails")}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-slate-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {t("home.searchPrompt")}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("home.searchHint")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link
                href={`${locale}/search`}
                className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                {t("home.searchButton")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {/*footer*/}
      {/* <Footer /> */}
    </div>
  );
}
