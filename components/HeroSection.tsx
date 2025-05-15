"use client";
import {useEffect, useState } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const [offsetY, setOffsetY] = useState(0);
  const t = useTranslations("HomePage");

  const handleScroll = () => {
    setOffsetY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
        className="text-white py-32 bg-contain"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.78)",
          backgroundImage: "url('https://www.gpsmycity.com/img/gd_cover/5205.jpg')",
        backgroundAttachment: 'scroll',
        backgroundPosition: `center ${offsetY * -0.5}px`, // parallax effect
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
        transition: 'background-position 0.1s ease-out',
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{t("home.title")}</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">{t("home.description")}</p>
          <div className="flex flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-slate-800 hover:bg-slate-100"
            >
              <Link href="/directory">
                <MapPin className="mr-2 h-5 w-5" />
                {t("home.findChurches")}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white bg-transparent border-white"
            >
              <Link href="/feasts">
                <Calendar className="mr-2 h-5 w-5" />
                {t("home.viewFeasts")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
  );
}
