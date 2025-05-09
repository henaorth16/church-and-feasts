import Link from "next/link"
import { notFound } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft, MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"

const prisma = new PrismaClient()

async function getFeast(id: string) {
  return prisma.feast.findUnique({
    where: {
      id,
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

export default async function FeastDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const feast = await getFeast(params.id)

  if (!feast) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
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

      <main className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button asChild variant="ghost" className="pl-0">
            <Link href="/feasts" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Feasts
            </Link>
          </Button>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">{feast.saintName}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(feast.commemorationDate)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {feast.description && (
              <div>
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-muted-foreground whitespace-pre-line">{feast.description}</p>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold mb-2">Churches Celebrating This Feast</h2>
              {feast.churchFeasts.length === 0 ? (
                <p className="text-muted-foreground">No churches are currently associated with this feast.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {feast.churchFeasts.map((churchFeast) => (
                    <Card key={churchFeast.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{churchFeast.church.name}</CardTitle>
                        {churchFeast.church.address && (
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {churchFeast.church.address}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="pt-2">
                        {churchFeast.specialNotes && (
                          <p className="text-sm text-muted-foreground">{churchFeast.specialNotes}</p>
                        )}
                        <Button asChild variant="outline" className="w-full mt-4">
                          <Link href={`/directory/${churchFeast.church.id}`}>View Church</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
