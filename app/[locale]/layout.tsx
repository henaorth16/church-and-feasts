import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
// import { getMessages } from "next-intl/server";
import { getLocale } from "next-intl/server";
import { isMiddlewareFile } from "next/dist/build/utils";

export const metadata: Metadata = {
  title: "debrat ena bealat",
  description: "you can get churches data and the holiday data",
  keywords: "church, directory, feast, holiday, debrat ena bealat",
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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
