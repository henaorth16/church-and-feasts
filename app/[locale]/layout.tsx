import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
// import { getMessages } from "next-intl/server";
import { getLocale, getMessages } from "next-intl/server";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "debrat ena bealat",
  description: "you can get churches data and the holiday data",
  keywords:
    "church, directory, feast, holiday, debrat ena bealat, debrat, bealat, baelat,ethiopian orthodox feasts,የኦርቶዶክስ በአላት, የኦርቶዶክስ በዓላት, ደብራትና በዓላት, ደብራትና በዓላት, ደብረትና በአላአት, ደብረታን በኣላት",
  authors: [{ name: "debrat ena bealat" }],
  generator: "Next.js",
  applicationName: "debrat ena bealat",
};

export default async function RootLayout({
  children,
}: // params: { locale },
Readonly<{
  children: React.ReactNode;
  // params: { locale: string };
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <head>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon.ico"
        />
      </head>
      <body data-inmaintabuse="1">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}

/*
import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import 'leaflet/dist/leaflet.css';

export const metadata: Metadata = {
  title: "debrat ena bealat",
  description: "you can get churches data and the holiday data",
  keywords: "church, directory, feast, holiday, debrat ena bealat, debrat, bealat, baelat,ethiopian orthodox feasts,የኦርቶዶክስ በአላት, የኦርቶዶክስ በዓላት, ደብራትና በዓላት, ደብራትና በዓላት, ደብረትና በአላአት, ደብረታን በኣላት",
  authors: [{ name: "debrat ena bealat" }],
  generator: "Next.js",
  applicationName: "debrat ena bealat",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const baseUrl = "https://your-domain.com"; // <-- Change to your real domain

  return (
    <html lang={locale}>
      <head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
        <meta name="keywords" content={metadata.keywords as string} />
        <meta name="author" content={metadata.authors?.[0]?.name} />
        <meta name="application-name" content={metadata.applicationName as string} />
        <meta name="generator" content={metadata.generator as string} />

       // Open Graph
        <meta property="og:title" content={metadata.title as string} />
        <meta property="og:description" content={metadata.description as string} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={locale} />
        <meta property="og:url" content={`${baseUrl}/${locale}`} />
        <meta property="og:site_name" content={metadata.applicationName as string} />
        <meta property="og:image" content={`${baseUrl}/og-image.png`} />

        // Twitter
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title as string} />
        <meta name="twitter:description" content={metadata.description as string} />
        <meta name="twitter:image" content={`${baseUrl}/og-image.png`} />

        // Other meta tags
        <link rel="canonical" href={`${baseUrl}/${locale}`} />

        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
*/
