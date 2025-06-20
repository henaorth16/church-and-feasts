import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Users, ArrowRight } from "lucide-react";
import { ChurchesFilter } from "@/components/churches-filter";
import { getTranslations } from "next-intl/server";
import LanguageToggler from "@/components/languageToggler";
import NavPublic from "@/components/nav-public";

const prisma = new PrismaClient();

interface DirectoryPageProps {
  searchParams: {
    search?: string;
  };
}

async function getChurches(search?: string) {
  const whereClause: any = {};

  // Search by name or address if provided
  if (search) {
    whereClause.OR = [
      {
        name: {
          contains: search,
          // mode: "insensitive",
        },
      },
      {
        address: {
          contains: search,
          // mode: "insensitive",
        },
      },
    ];
  }

  return prisma.church.findMany({
    where: whereClause,
    orderBy: {
      name: "asc",
    },
  });
}

export default async function DirectoryPage({
  searchParams,
}: DirectoryPageProps) {
  const { search } = searchParams;
  const churches = await getChurches(search);
  const t = await getTranslations("ChurchDirectoryPage");

  return (
    <div className="min-h-screen bg-slate-50">
      <NavPublic />
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t("pageTitle")}</h1>
            <p className="text-muted-foreground">
              {t("pageDescription")}
            </p>
          </div>
          <ChurchesFilter search={search || ""} />
        </div>

        {churches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t("noChurchesFound")}
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/directory">{t("clearFilters")}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {churches.map((church) => (
              <Card
                className="overflow-hidden rounded-xl shadow-md"
                key={church.id}
              >
                {/* Church Image */}
                <div className="relative h-[200px] w-full">
                  <img
                    src={
                     church.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYSacUz3fD4yiSKbTbXVhxSS0yMHVY0IYhag&s"
                    }

                    alt={church.name}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Text Content */}
                <CardHeader className="pb-1">
                  <CardTitle className="text-lg">{church.name}</CardTitle>
                  {church.address && (
                    <CardDescription className="flex items-center gap-1 text-primary text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {church.address}
                      </span>
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="pt-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {church.description || t("home.noDescription")}
                  </p>
                </CardContent>

                <CardFooter className="flex flex-col justify-between items-end p-4">
                  <Button asChild className="float-right rounded-full">
                    <Link href={`/directory/${church.id}`}>
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
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
