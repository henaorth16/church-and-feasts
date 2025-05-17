import Link from "next/link";
import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Users, ArrowLeft, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Map from "@/components/Map";
import NavPublic from "@/components/nav-public";

const prisma = new PrismaClient();

async function getChurch(id: string) {
  return prisma.church.findUnique({
    where: {
      id,
    },
    include: {
      churchFeasts: {
        include: {
          feast: true,
        },
        orderBy: {
          feast: {
            commemorationDate: "asc",
          },
        },
      },
    },
  });
}

export default async function ChurchDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const church = await getChurch(params.id);

  if (!church) {
    notFound();
  }

  // Group feasts by upcoming and past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingFeasts = church.churchFeasts.filter(
    (cf) => new Date(cf.feast.commemorationDate) >= today
  );

  const pastFeasts = church.churchFeasts
    .filter((cf) => new Date(cf.feast.commemorationDate) < today)
    .reverse();

  return (
    <div className="min-h-screen bg-slate-50">
      <NavPublic/>
      <main className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button asChild variant="ghost" className="pl-0">
            <Link href="/directory" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Directory
            </Link>
          </Button>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">{church.name}</CardTitle>
            {church.address && (
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {church.address}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {church.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>{church.email}</span>
                </div>
              )}
              {church.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>{church.phone}</span>
                </div>
              )}
              {church.servantCount && (
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{church.servantCount} servants</span>
                </div>
              )}
            </div>

            {church.latitude && church.longitude && (
              <div className="aspect-video bg-slate-100 rounded-md flex items-center justify-center">
                <Map latitude={church.latitude} longitude={church.longitude} />
                {/* <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${church.latitude},${church.longitude}&z=15&output=embed`}
                  allowFullScreen
                ></iframe> */}
              </div>

            )}

            {church.description && (
              <div>
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {church.description}
                </p>
              </div>
            )}

            {/* Feasts Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Feast Days</h2>

              {church.churchFeasts.length === 0 ? (
                <p className="text-muted-foreground">
                  No feast days have been added for this church.
                </p>
              ) : (
                <div className="space-y-6">
                  {upcomingFeasts.length > 0 && (
                    <div>
                      <h3 className="text-md font-medium mb-3">
                        Upcoming Feasts
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {upcomingFeasts.map((churchFeast) => (
                          <Card key={churchFeast.id}>
                            <CardContent className="p-4 flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">
                                  {churchFeast.feast.saintName}
                                </h4>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {formatDate(
                                    churchFeast.feast.commemorationDate
                                  )}
                                </p>
                                {churchFeast.specialNotes && (
                                  <p className="text-sm mt-1">
                                    {churchFeast.specialNotes}
                                  </p>
                                )}
                              </div>
                              <Button asChild variant="outline" size="sm">
                                <Link href={`/feasts/${churchFeast.feast.id}`}>
                                  Details
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {pastFeasts.length > 0 && (
                    <div>
                      <h3 className="text-md font-medium mb-3">Past Feasts</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {pastFeasts.slice(0, 3).map((churchFeast) => (
                          <Card key={churchFeast.id}>
                            <CardContent className="p-4 flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">
                                  {churchFeast.feast.saintName}
                                </h4>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {formatDate(
                                    churchFeast.feast.commemorationDate
                                  )}
                                </p>
                              </div>
                              <Button asChild variant="outline" size="sm">
                                <Link href={`/feasts/${churchFeast.feast.id}`}>
                                  Details
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                        {pastFeasts.length > 3 && (
                          <Button asChild variant="ghost" className="mt-2">
                            <Link href={`/feasts?church=${church.id}`}>
                              View all {pastFeasts.length} past feasts
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
