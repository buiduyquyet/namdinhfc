"use client";

import Link from "next/link";
import Image from "next/image";
import SectionBackground from "./sections/SectionBackground";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href: string }[];
}

export default function PageHero({ title, subtitle, breadcrumbs }: PageHeroProps) {
  return (
    <section style={{ paddingTop: "160px", paddingBottom: "80px" }} className="relative overflow-hidden bg-secondary">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <SectionBackground variant="full" />
      </div>

      {/* Watermark Logo */}
      <div className="absolute -right-20 md:-right-0 top-2/3 -translate-y-1/2 w-[240px] h-[240px] md:w-[380px] md:h-[380px] opacity-[0.08] pointer-events-none z-0">
        <Image
          src="/main-logo.jpg"
          alt="Nam Dinh FC Watermark"
          fill
          className="object-contain mix-blend-screen rounded-full"
        />
      </div>

      <div className="container relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav className="flex items-center gap-2 mb-6 text-sm font-medium">
            <Link href="/" className="text-white/60 hover:text-primary transition-colors">
              Trang Chủ
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                <span className="text-white/30">/</span>
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-primary">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="text-white/60 hover:text-primary transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        )}

        <div className="max-w-3xl">
          <h1 style={{ color: "white" }} className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4 animate-fade-in-up">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/80 font-medium animate-fade-in-up delay-100">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Decorative bottom element */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
    </section>
  );
}
