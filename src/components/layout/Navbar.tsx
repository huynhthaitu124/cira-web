"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface NavbarProps {
  language: "vi" | "en";
  toggleLanguage: () => void;
  ctaText: string;
  onCtaClick: () => void;
}

export function Navbar({ language, toggleLanguage, ctaText, onCtaClick }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) setUserEmail(data.session.user.email);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
    });

    return () => {
      if (listener?.subscription) listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    router.refresh();
  };

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

            {userEmail ? (
              <div className="flex items-center gap-3 bg-secondary/50 pl-3 pr-1 py-1 rounded-full border shadow-sm">
                <span className="text-sm font-medium text-muted-foreground truncate max-w-[120px] sm:max-w-[180px]">
                  {userEmail}
                </span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="rounded-full bg-background hover:bg-destructive hover:text-white h-7 px-3 text-xs uppercase font-bold transition-colors"
                  onClick={handleLogout}
                >
                  {language === "vi" ? "Thoát" : "Exit"}
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="rounded-full"
                onClick={onCtaClick}
              >
                {ctaText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
