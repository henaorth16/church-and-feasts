import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { FeastsFilter } from "@/components/feasts-filter";
import NavPublic from "@/components/nav-public";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
const prisma = new PrismaClient();
interface FeastsPageProps {
  searchParams: {
    month?: string;
    search?: string;
    date?: string;
  };
}

async function getFeasts(month?: string, search?: string, date?: string) {
  const whereClause: any = {};

  // Filter by specific date if provided
  if (date) {
    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    whereClause.commemorationDate = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }
  // Filter by month if provided and date is not provided
  else if (month) {
    const monthNumber = Number.parseInt(month);
    if (!isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
      const startDate = new Date(new Date().getFullYear(), monthNumber - 1, 1);
      const endDate = new Date(new Date().getFullYear(), monthNumber, 0);

      whereClause.commemorationDate = {
        gte: startDate, // gte stands for "greater than or equal to"
        lte: endDate, // lte stands for "less than or equal to"
      };
    }
  }

  // Search by saint name if provided
  if (search) {
    whereClause.saintName = {
      contains: search,
      //   mode: "insensitive",
    };
  }

  return prisma.feast.findMany({
    where: whereClause,
    orderBy: {
      commemorationDate: "asc",
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

export default async function FeastsPage({ searchParams }: FeastsPageProps) {
  const { month, search, date } = searchParams;
  const feasts = await getFeasts(month, search, date);
  const t = await getTranslations("feastPage");
  const locale = await getLocale();
  // Get current month for the filter
  const currentMonth = month
    ? Number.parseInt(month)
    : new Date().getMonth() + 1;

  return (
    <div className="min-h-screen bg-slate-50">
      <NavPublic />

      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t("pageTitle")}</h1>
            <p className="text-muted-foreground">{t("pageDescription")}</p>
          </div>
          <FeastsFilter currentMonth={currentMonth} search={search || ""} />
          {date && (
            <div className="mt-4 p-4 bg-slate-100 rounded-lg">
              <h2 className="text-xl font-semibold">
                {t("feastsOn")}{" "}
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              {feasts.length === 0 ? (
                <p className="text-muted-foreground mt-2">
                  {t("noFeastsFound")}{" "}
                </p>
              ) : (
                <p className="text-muted-foreground mt-2">{t("feastsFound")}</p>
              )}
            </div>
          )}
        </div>

        {feasts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t("noFeastsFound")}
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/feasts">{t("clearFilters")}</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {feasts.map((feast) => (
              <Card
                key={feast.id}
                className="px-4 py-2 min-w-[250px]"
              >
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-base">{feast.saintName}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(feast.commemorationDate, locale)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {feast.description || "No description available."}
                    </p>

                    {feast.churchFeasts.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-1">
                          {t("celebratedAt")}
                        </p>
                        <ul className="text-sm text-muted-foreground">
                          {feast.churchFeasts.slice(0, 3).map((churchFeast) => (
                            <li key={churchFeast.id}>
                              - {churchFeast.church.name}
                            </li>
                          ))}
                          {feast.churchFeasts.length > 3 && (
                            <li>
                              +{feast.churchFeasts.length - 3} {t("more")}
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-0 mt-3">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full text-sm py-1.5"
                  >
                    <Link href={`/feasts/${feast.id}`}>{t("viewDetails")}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
