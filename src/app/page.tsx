"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { translations } from "@/lib/translations";

type Language = "vi" | "en";


export default function Home() {
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState<Language>("vi");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setShowError(false);
    setShowSuccess(false);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'DUPLICATE_EMAIL') {
          setErrorMessage(language === 'vi'
            ? 'Email này đã đăng ký waitlist rồi!'
            : 'This email is already on the waitlist!');
        } else {
          setErrorMessage(data.error || (language === 'vi'
            ? 'Có lỗi xảy ra. Vui lòng thử lại!'
            : 'An error occurred. Please try again!'));
        }
        setShowError(true);
        return;
      }

      setShowSuccess(true);
      setEmail("");
      setTimeout(() => setShowSuccess(false), 8000);

    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage(language === 'vi'
        ? 'Không thể kết nối. Vui lòng kiểm tra internet!'
        : 'Connection failed. Please check your internet!');
      setShowError(true);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setShowError(false), 6000);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "vi" ? "en" : "vi");
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl"></span>
              <span className="text-xl font-semibold tracking-tight">CIRA</span>
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
              <Button size="sm" className="rounded-full">
                {t.nav.cta}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary rounded-full text-sm font-medium">
                  ✨ {t.hero.badge}
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                {t.hero.title.line1} <br />
                <span className="text-muted-foreground">{t.hero.title.line2}</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                {t.hero.description}
              </p>

              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="inline-block">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-semibold">
                        🎁 {t.hero.offerBadge}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold">
                      {t.hero.offerTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t.hero.offerSubtitle}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder={t.hero.emailPlaceholder}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isSubmitting}
                          className="flex-1"
                        />
                        <Button type="submit" className="whitespace-nowrap" disabled={isSubmitting}>
                          {isSubmitting ? (language === 'vi' ? 'Đang gửi...' : 'Sending...') : t.hero.ctaButton}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t.hero.formNote}
                      </p>
                    </form>

                    {showSuccess && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                        <p className="text-sm text-green-800 font-medium">
                          {t.hero.successMessage}
                        </p>
                      </div>
                    )}

                    {showError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                        <p className="text-sm text-red-800 font-medium">
                          ❌ {errorMessage}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t.hero.trustBadge}</span>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/cira_hero_image.png"
                  alt={t.hero.imageAlt}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">10,000+</div>
              <div className="text-sm text-muted-foreground mt-1">{t.trust.stat1}</div>
            </div>
            <div>
              <div className="text-3xl font-bold">5★</div>
              <div className="text-sm text-muted-foreground mt-1">{t.trust.stat2}</div>
            </div>
            <div>
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-muted-foreground mt-1">{t.trust.stat3}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t.video.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t.video.subtitle}
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video bg-muted">
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
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t.features.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.items.map((feature, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
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
                className={`border-2 ${plan.featured ? 'border-primary shadow-lg scale-105' : ''}`}
              >
                <CardContent className="p-8">
                  {plan.featured && (
                    <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-4">
                      {t.pricing.popularBadge}
                    </span>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{t.pricing.perMonth}</span>
                  </div>
                  <p className="text-sm text-green-600 font-medium mb-6">
                    {t.pricing.discountText} {plan.discountPrice}!
                  </p>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/family_connection_moment.png"
                alt={t.social.imageAlt}
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>

            <div className="space-y-6">
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="text-6xl text-muted-foreground/20 font-serif mb-4">"</div>
                  <p className="text-lg leading-relaxed mb-6">
                    {t.social.testimonial.quote}
                  </p>
                  <div>
                    <div className="font-semibold">{t.social.testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{t.social.testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>{t.social.badges[0]}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>{t.social.badges[1]}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>{t.social.badges[2]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            {t.cta.title.line1} <br />
            {t.cta.title.line2}
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: t.cta.description }} />


          <Card className="max-w-xl mx-auto">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    type="email"
                    placeholder={t.cta.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="flex-1"
                  />
                  <Button type="submit" size="lg" className="whitespace-nowrap bg-foreground text-background hover:bg-foreground/90" disabled={isSubmitting}>
                    {isSubmitting ? (language === 'vi' ? 'Đang gửi...' : 'Sending...') : t.cta.button}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t.cta.privacyNote}
                </p>
              </form>

              {showSuccess && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-in fade-in">
                  <p className="text-sm text-green-800 font-medium">
                    {t.cta.successMessage}
                  </p>
                </div>
              )}

              {showError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-in fade-in">
                  <p className="text-sm text-red-800 font-medium">
                    ❌ {errorMessage}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <p className="mt-6 text-sm opacity-75" dangerouslySetInnerHTML={{ __html: t.cta.urgency }} />
        </div>
      </section >

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-semibold">CIRA</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.footer.tagline}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t.footer.product.title}</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>{t.footer.product.features}</div>
                <div>{t.footer.product.pricing}</div>
                <div>{t.footer.product.faq}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t.footer.company.title}</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>{t.footer.company.about}</div>
                <div>{t.footer.company.contact}</div>
                <div>{t.footer.company.privacy}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t.footer.support.title}</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>{t.footer.support.help}</div>
                <div>{t.footer.support.community}</div>
                <div>{t.footer.support.email}</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            {t.footer.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
