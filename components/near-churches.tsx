"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

type Church = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
};

export default function ChurchesPage() {
  const [churches, setChurches] = useState<Church[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [sortedChurches, setSortedChurches] = useState<ChurchWithDistance[]>(
    []
  );
  const t = useTranslations("HomePage");
  useEffect(() => {
    // 1. Fetch churches from API
    fetch("/api/featured-churches")
      .then((res) => res.json())
      .then(setChurches);

    // 2. Get user geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setUserLocation(location);
      },
      () => alert("Failed to get your location.")
    );
  }, []);

  useEffect(() => {
    if (userLocation && churches.length) {
      const withDistance = churches
        .filter((c) => c.latitude !== null && c.longitude !== null)
        .map((c) => ({
          ...c,
          distance: getDistanceFromLatLonInKm(
            userLocation.lat,
            userLocation.lon,
            c.latitude!,
            c.longitude!
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      setSortedChurches(withDistance);
    }
  }, [userLocation, churches]);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{t("home.nearestChurches")}</h2>
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
            {sortedChurches.map((church) => (
              <Card key={church.id}>
                <CardHeader>
                  <CardTitle>{church.name}</CardTitle>
                  {church.address && (
                    <CardDescription className="flex items-center gap-1 text-primary">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>
                        {church.address || "No address"} —{" "}
                        {church.distance.toFixed(2)} km {t("home.away")}
                      </span>
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
  );
}

type ChurchWithDistance = Church & { distance: number };

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
