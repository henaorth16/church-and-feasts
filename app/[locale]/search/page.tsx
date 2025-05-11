//@ts-nocheck
import Link from "next/link"
import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar } from "lucide-react"
import { SearchForm } from "@/components/search-form"
import { formatDate } from "@/lib/utils"
import FormattedDate from "@/components/formatted-date"
import { getTranslations } from "next-intl/server"

const prisma = new PrismaClient()

interface SearchPageProps {
  searchParams: {
    q?: string
    type?: string
    date?: string
  }
}

async function searchChurches(query: string) {
  if (!query) return []

  return prisma.church.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
          },
        },
        {
          address: {
            contains: query,
          },
        },
        {
          description: {
            contains: query,
          },
        },
      ],
    },
    orderBy: {
      name: "asc",
    },
  })
}

async function searchFeasts(query: string, date?: string) {
  if (!query && !date) return []

  const whereClause: any = {}

  if (query) {
    whereClause.OR = [
      {
        saintName: {
          contains: query,
        },
      },
      {
        description: {
          contains: query,
        },
      },
    ]
  }

  if (date) {
    const selectedDate = new Date(date)
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    whereClause.commemorationDate = {
      gte: startOfDay,
      lte: endOfDay,
    }
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
  })
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""
  const type = searchParams.type || "all"
  const date = searchParams.date || ""

  let churches = []
  let feasts = []
  const t = await getTranslations('SearchPage')

  if (query || date) {
    if (type === "all" || type === "churches") {
      churches = await searchChurches(query)
    }

    if (type === "all" || type === "feasts") {
      feasts = await searchFeasts(query, date)
    }
  }

  const hasResults = churches.length > 0 || feasts.length > 0
  const activeTab = type === "churches" ? "churches" : type === "feasts" ? "feasts" : "all"

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            {t("headerTitle")}
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/directory">{t("navigationLinks.churches")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/feasts">{t("navigationLinks.feasts")}</Link>
            </Button>
            <Button asChild>
              <Link href="/login">{t("navigationLinks.login")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">{t("pageTitle")}</h1>
        <p className="text-muted-foreground mb-6">{t("pageDescription")}</p>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchForm initialQuery={query} initialType={type} />
        </div>

        {/* Conditional Search Results */}
        {query && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {t("searchResultsTitle", { query })}
            </h2>
            {!hasResults && (
              <p className="text-muted-foreground">
                {t("noResultsMessage")}
              </p>
            )}
          </div>
        )}

        {/* Results Tabs */}
        {hasResults && (
          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">{t("tabs.allResults")}</TabsTrigger>
              <TabsTrigger value="churches">
                {t("tabs.churches", { count: type === "feasts" ? 0 : churches.length })}
              </TabsTrigger>
              <TabsTrigger value="feasts">
                {t("tabs.feasts", { count: type === "churches" ? 0 : feasts.length })}
              </TabsTrigger>
            </TabsList>

            {/* All Results */}
            <TabsContent value="all" className="space-y-8">
              {churches.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t("churchesTitle")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {churches.slice(0, 3).map((church) => (
                      <Card key={church.id}>
                        <CardHeader>
                          <CardTitle>{church.name}</CardTitle>
                          {church.address && (
                            <CardDescription className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {church.address}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {church.description || t("noDescription")}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button asChild variant="outline" className="w-full">
                            <Link href={`/directory/${church.id}`}>{t("viewDetails")}</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  {churches.length > 3 && (
                    <div className="text-center mt-4">
                      <Button asChild variant="outline">
                        <Link href={`/search?q=${query}&type=churches`}>
                          {t("viewAllChurches", { count: churches.length })}
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {feasts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t("feastsTitle")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {feasts.slice(0, 3).map((feast) => (
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
                            {feast.description || t("noDescription")}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button asChild variant="outline" className="w-full">
                            <Link href={`/feasts/${feast.id}`}>{t("viewDetails")}</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  {feasts.length > 3 && (
                    <div className="text-center mt-4">
                      <Button asChild variant="outline">
                        <Link href={`/search?q=${query}&type=feasts`}>
                          {t("viewAllFeasts", { count: feasts.length })}
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Churches Tab */}
            <TabsContent value="churches">
              {churches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {churches.map((church) => (
                    <Card key={church.id}>
                      <CardHeader>
                        <CardTitle>{church.name}</CardTitle>
                        {church.address && (
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {church.address}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {church.description || t("noDescription")}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/directory/${church.id}`}>{t("viewDetails")}</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">{t("noChurchesFound")}</p>
              )}
            </TabsContent>

            {/* Feasts Tab */}
            <TabsContent value="feasts">
              {feasts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {feasts.map((feast) => (
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
                          {feast.description || t("noDescription")}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/feasts/${feast.id}`}>{t("viewDetails")}</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">{t("noFeastsFound")}</p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
