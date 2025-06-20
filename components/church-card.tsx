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
import { ArrowRight, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ChurchCard({
  church,
  churchinKm,
}: {
  church: {
    id: string;
    name: string;
    description: string | null;
    address: string | null;
    email: string | null;
    phone: string | null;
    latitude: number | null;
    longitude: number | null;
    profileImage: string | null;
  };
  churchinKm?: number | null;
}) {
  const t = useTranslations("HomePage");
  return (
    <Card className="overflow-hidden rounded-xl shadow-md">
      {/* Church Image */}
      <div className="relative h-[200px] w-full">
        <img
          src={
            church.profileImage ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYSacUz3fD4yiSKbTbXVhxSS0yMHVY0IYhag&s"
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
              {church.address} — {churchinKm?.toFixed(2)} km {t("home.away")}
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
            {t("home.viewDetails")}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
