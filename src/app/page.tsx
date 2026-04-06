"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { translations } from "@/lib/translations";

type Language = "vi" | "en";

export default function Home() {
  const [language, setLanguage] = useState<Language>("vi");
  const router = useRouter();

  const toggleLanguage = () => {
    setLanguage(language === "vi" ? "en" : "vi");
  };

  const t = translations[language];

  // Open the CIRA app store link
  const handleAppStoreClick = () => {
    window.open("https://apps.apple.com/vn/app/cira/id6760659914?l=vi", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        language={language}
        toggleLanguage={toggleLanguage}
        ctaText={t.nav.cta}
        onCtaClick={handleAppStoreClick}
      />

      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                  ✨ {t.hero.badge}
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight">
                {t.hero.title.line1} <br />
                <span className="text-muted-foreground">{t.hero.title.line2}</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                {t.hero.description}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button 
                  size="lg" 
                  onClick={handleAppStoreClick}
                  className="w-full sm:w-auto text-lg h-14 px-8 rounded-xl font-semibold shadow-md active:scale-95 transition-all"
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91 1.65.17 3.16.82 4.11 2.21-3.32 1.95-2.77 6.46.46 7.84-.71 1.05-1.53 2.1-2.43 2.85M15.42 4.61c.69-.87 1.15-2.07.98-3.29-1.03.05-2.32.74-3.05 1.61-.59.7-.1 1.94.13 3.1 1.13.08 2.37-.62 1.94-1.42"/>
                  </svg>
                  {t.hero.ctaButton}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => router.push('/pricing')}
                  className="w-full sm:w-auto text-lg h-14 px-8 rounded-xl font-semibold border-2 active:scale-95 transition-all"
                >
                  {t.hero.secondaryCtaButton}
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t.hero.formNote}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm font-medium mt-2">
                <span>{t.hero.trustBadge}</span>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border bg-black/5">
                <Image
                  src="/images/cira_hero_image.png"
                  alt={t.hero.imageAlt}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-extrabold">10,000+</div>
              <div className="text-sm text-muted-foreground mt-1 font-medium">{t.trust.stat1}</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold">4.9★</div>
              <div className="text-sm text-muted-foreground mt-1 font-medium">{t.trust.stat2}</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold">100%</div>
              <div className="text-sm text-muted-foreground mt-1 font-medium">{t.trust.stat3}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
              {t.video.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t.video.subtitle}
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-video bg-muted border">
            <video
              className="w-full h-full object-cover"
              controls
              poster="/images/cira_hero_image.png"
            >
              <source src="/videos/PromoVideo.mp4" type="video/mp4" />
              {t.video.placeholder}
            </video>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
              {t.features.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.items.map((feature, index) => (
              <Card key={index} className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                  <div className="text-4xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
              {t.pricing.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t.pricing.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {t.pricing.plans.map((plan, index) => (
              <Card
                key={index}
                className={`border bg-card shadow-sm ${plan.featured ? 'border-primary shadow-lg ring-2 ring-primary ring-offset-2' : ''}`}
              >
                <CardContent className="p-8">
                  {plan.featured && (
                    <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full mb-6">
                      {t.pricing.popularBadge}
                    </span>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4 flex items-end gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                    <span className="text-muted-foreground mb-1">{t.pricing.perMonth}</span>
                  </div>
                  <p className="text-sm font-semibold mb-6">
                    {t.pricing.discountText} <span className="text-primary">{plan.discountPrice}</span>
                  </p>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm font-medium">
                        <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={plan.featured ? "default" : "outline"} 
                    className="w-full font-bold"
                    onClick={() => router.push('/pricing')}
                  >
                    {t.cta.pricingButton}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-card border-t border-b">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border">
              <Image
                src="/images/family_connection_moment.png"
                alt={t.social.imageAlt}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="space-y-8">
              <div className="bg-secondary/30 p-8 rounded-2xl border">
                <div className="text-6xl text-primary/40 font-serif mb-2 leading-none">&quot;</div>
                <p className="text-xl font-medium leading-relaxed mb-6">
                  {t.social.testimonial.quote}
                </p>
                <div>
                  <div className="font-bold text-lg">{t.social.testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{t.social.testimonial.role}</div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                {t.social.badges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium text-muted-foreground">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            {t.cta.title.line1} <br />
            {t.cta.title.line2}
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto text-primary-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.cta.description }} />

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button 
               size="lg" 
               onClick={handleAppStoreClick}
               className="bg-background text-foreground hover:bg-background/90 text-lg h-14 px-10 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91 1.65.17 3.16.82 4.11 2.21-3.32 1.95-2.77 6.46.46 7.84-.71 1.05-1.53 2.1-2.43 2.85M15.42 4.61c.69-.87 1.15-2.07.98-3.29-1.03.05-2.32.74-3.05 1.61-.59.7-.1 1.94.13 3.1 1.13.08 2.37-.62 1.94-1.42"/>
              </svg>
              {t.cta.button}
            </Button>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-primary-foreground/80">
              {t.cta.privacyNote}
            </p>
            <p className="text-sm font-medium bg-primary-foreground/10 px-4 py-1.5 rounded-full" dangerouslySetInnerHTML={{ __html: t.cta.urgency }} />
          </div>
        </div>
      </section >

      {/* Footer */}
      <footer className="py-16 bg-background border-t">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 md:gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl font-extrabold tracking-tight">CIRA</span>
              </div>
              <p className="text-muted-foreground font-medium">
                {t.footer.tagline}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">{t.footer.product.title}</h4>
              <div className="space-y-4 font-medium text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer transition-colors">{t.footer.product.features}</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">{t.footer.product.pricing}</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">{t.footer.product.faq}</div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">{t.footer.company.title}</h4>
              <div className="space-y-4 font-medium text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer transition-colors">{t.footer.company.about}</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">{t.footer.company.contact}</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">{t.footer.company.privacy}</div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">{t.footer.support.title}</h4>
              <div className="space-y-4 font-medium text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer transition-colors">{t.footer.support.help}</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">{t.footer.support.community}</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">{t.footer.support.email}</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t text-center font-medium text-muted-foreground">
            {t.footer.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
