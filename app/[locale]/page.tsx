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

const prisma = new PrismaClient()

// const t = useTranslations("HomePage");

async function getFeaturedChurches() {
  return prisma.church.findMany({
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getUpcomingFeasts() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.feast.findMany({
    where: {
      commemorationDate: {
        gte: today,
      },
    },
    orderBy: {
      commemorationDate: "asc",
    },
    take: 3,
  });
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
  { params }: {
    params: { locale: string };
  }
) {
  const t = await getTranslations("HomePage");
  const { locale } = params;
  const [churches, upcomingFeasts, todaysFeasts] = await Promise.all([
    getFeaturedChurches(),
    getUpcomingFeasts(),
    getTodaysFeasts(),
  ]);

  
  return (
    <div className="min-h-screen bg-slate-50">
      <NavPublic/>
  
      {/* Hero Section */}
      <HeroSection/>
  
      {/* Today's Feasts */}
      {todaysFeasts.length > 0 && (
        <section className="py-8 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t("home.todaysCommemorations")}</h2>
              <Button asChild variant="outline">
                <Link href="/directory">{t("churches")}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/feasts">{t("nav.feasts")}</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link
                  href={`/feasts?date=${new Date().toISOString().split("T")[0]}`}
                >
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
                      <FormattedDate date={feast.commemorationDate}
                      />
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {feast.description || t("home.noDescription")}
                    </p>
                    {feast.churchFeasts.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">
                          {t("home.celebratedAt", { count: feast.churchFeasts.length })}
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/feasts/${feast.id}`}>{t("home.viewDetails")}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
  
      {/* Featured Churches */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">{t("home.featuredChurches")}</h2>
            <Button asChild variant="ghost">
              <Link href="/directory">{t("home.viewAll")}</Link>
            </Button>
          </div>
  
          {churches.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("home.noDescription")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {churches.map((church) => (
                <Card key={church.id}>
                  <CardHeader>
                    <CardTitle>{church.name}</CardTitle>
                    {church.address && (
                      <CardDescription className="flex items-center gap-1 text-primary">
                        <MapPin className="h-3.5 w-3.5" />
                        {church.address}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {church.description || t("home.noDescription")}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/directory/${church.id}`}>
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
  
      {/* Upcoming Feasts */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">{t("home.upcomingFeasts")}</h2>
            <Button asChild variant="ghost">
              <Link href="/feasts">{t("home.viewAll")}</Link>
            </Button>
          </div>
  
          {upcomingFeasts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("home.noDescription")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingFeasts.map((feast) => (
                <Card key={feast.id}>
                  <CardHeader>
                    <CardTitle>{feast.saintName}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <FormattedDate date={feast.commemorationDate}
                      />
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {feast.description || t("home.noDescription")}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/feasts/${feast.id}`}>{t("home.viewDetails")}</Link>
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
          <h2 className="text-2xl font-bold mb-4">{t("home.searchPrompt")}</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("home.searchHint")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href={`${locale}/search`} className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                {t("home.searchButton")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {/*footer*/}
      <Footer/>
    </div>
  );
  
}
