"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  language: "vi" | "en";
  toggleLanguage: () => void;
  ctaText: string;
  onCtaClick: () => void;
}

export function Navbar({ language, toggleLanguage, ctaText, onCtaClick }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity">
              CIRA
            </Link>
            
            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
              <Link
                href="/pricing"
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === "/pricing" ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {language === "vi" ? "Bảng giá" : "Pricing"}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2"
            >
              {language === "vi" ? "🇻🇳" : "🇺🇸"} {language === "vi" ? "EN" : "VI"}
            </Button>
            <Button
              size="sm"
              className="rounded-full"
              onClick={onCtaClick}
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
