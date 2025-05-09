import Link from "next/link"
import { PrismaClient } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Search } from "lucide-react"
import { formatDate } from "@/lib/utils"
import {prisma} from "@/lib/prisma"

async function getFeaturedChurches() {
  return prisma.church.findMany({
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  })
}

async function getUpcomingFeasts() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

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
  })
}

async function getTodaysFeasts() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

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
  })
}

export default async function Home() {
  const [churches, upcomingFeasts, todaysFeasts] = await Promise.all([
    getFeaturedChurches(),
    getUpcomingFeasts(),
    getTodaysFeasts(),
  ])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className=" border-b" style={
        {
          background: "linear-gradient(90deg, #ffc1a0, #ffc1a0)",
        }
      }>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Church Directory
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/directory">Churches</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/feasts">Feasts</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className=")]  text-white py-32" style={{
        backgroundColor: "rgba(0, 0, 0, 0.78)",
        backgroundImage: "url('https://www.gpsmycity.com/img/gd_cover/5205.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "multiply",
      }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Church Directory & Feast Calendar</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover churches in your area and learn about saint commemorations and feast days throughout the year.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-slate-800 hover:bg-slate-100">
              <Link href="/directory">
                <MapPin className="mr-2 h-5 w-5" />
                Find Churches
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white bg-transparent border-white">
              <Link href="/feasts">
                <Calendar className="mr-2 h-5 w-5" />
                View Feast Calendar
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Today's Feasts */}
      {todaysFeasts.length > 0 && (
        <section className="py-8 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Today's Commemorations</h2>
              <Button asChild variant="ghost">
                <Link href={`/feasts?date=${new Date().toISOString().split("T")[0]}`}>View All</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {todaysFeasts.map((feast) => (
                <Card key={feast.id}>
                  <CardHeader>
                    <CardTitle>{feast.saintName}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(feast.commemorationDate)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {feast.description || "No description available."}
                    </p>
                    {feast.churchFeasts.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Celebrated at {feast.churchFeasts.length} church(es)</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/feasts/${feast.id}`}>View Details</Link>
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
            <h2 className="text-2xl font-bold">Featured Churches</h2>
            <Button asChild variant="ghost">
              <Link href="/directory">View All</Link>
            </Button>
          </div>

          {churches.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No churches have been added yet.</p>
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
                      {church.description || "No description available."}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/directory/${church.id}`}>View Details</Link>
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
            <h2 className="text-2xl font-bold">Upcoming Feasts</h2>
            <Button asChild variant="ghost">
              <Link href="/feasts">View All</Link>
            </Button>
          </div>

          {upcomingFeasts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No upcoming feasts have been added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingFeasts.map((feast) => (
                <Card key={feast.id}>
                  <CardHeader>
                    <CardTitle>{feast.saintName}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(feast.commemorationDate)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {feast.description || "No description available."}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/feasts/${feast.id}`}>View Details</Link>
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
          <h2 className="text-2xl font-bold mb-4">Looking for Something Specific?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Search for churches or feasts by name, location, or date.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/search" className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Search Directory
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
