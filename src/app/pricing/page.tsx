"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Language = "vi" | "en";
type BillingCycle = "monthly" | "yearly";

const iOSPlans = [
  {
    key: "starter",
    name: "Starter",
    vi: {
      target: "Người dùng mới",
      storage: "20 ảnh / 1 câu chuyện",
      aiVoice: "1 câu chuyện tự động",
      sharing: "3 chương",
      duration: "30 ngày"
    },
    en: {
      target: "New users",
      storage: "20 photos / 1 story",
      aiVoice: "1 automated story",
      sharing: "3 chapters",
      duration: "30 days"
    },
    monthlyPrice: 0,
    yearlyPrice: 0,
    isPopular: false,
  },
  {
    key: "personal",
    name: "Personal",
    vi: {
      target: "Cá nhân",
      storage: "200 ảnh / 10 câu chuyện",
      aiVoice: "AI kể chuyện ấm áp",
      sharing: "Bảng tin gia đình",
      duration: "Vĩnh viễn"
    },
    en: {
      target: "Individuals",
      storage: "200 photos / 10 stories",
      aiVoice: "Warm AI storytelling",
      sharing: "Family feed",
      duration: "Forever"
    },
    monthlyPrice: 79000,
    yearlyPrice: 899000,
    isPopular: false,
  },
  {
    key: "family",
    name: "Family",
    vi: {
      target: "Gia đình 2-5 người",
      storage: "1.000 ảnh",
      aiVoice: "Giọng nói tự chọn",
      sharing: "Bảng tin chia sẻ",
      duration: "Vĩnh viễn"
    },
    en: {
      target: "Family of 2-5",
      storage: "1,000 photos",
      aiVoice: "Custom voice",
      sharing: "Shared family feed",
      duration: "Forever"
    },
    monthlyPrice: 179000,
    yearlyPrice: 2040000,
    isPopular: true,
  },
  {
    key: "premium",
    name: "Premium",
    vi: {
      target: "Gia đình không giới hạn",
      storage: "Dung lượng vô hạn",
      aiVoice: "Nhân bản giọng nói riêng",
      sharing: "Quản lý nhóm thả ga",
      duration: "Trọn đời"
    },
    en: {
      target: "Unlimited families",
      storage: "Infinite Capacity",
      aiVoice: "Custom voice cloning",
      sharing: "Full group control",
      duration: "Lifetime"
    },
    monthlyPrice: 499000,
    yearlyPrice: 5599000,
    isPopular: false,
  }
];

// Reusable SVG Icons for the list
const StorageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const VoiceIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const GroupIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const TimeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function PricingPage() {
  const [language, setLanguage] = useState<Language>("vi");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  const [selectedPlan, setSelectedPlan] = useState<string>("family");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const toggleLanguage = () => {
    setLanguage(language === "vi" ? "en" : "vi");
  };

  const handleSubscribe = async () => {
    const plan = iOSPlans.find(p => p.key === selectedPlan);
    if (!plan || isSubmitting) return;

    setIsSubmitting(true);
    const price = billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
    
    // Always navigate to Auth (passing data in query string)
    router.push(`/auth?plan=${encodeURIComponent(plan.name)}&price=${price}&cycle=${billingCycle}&lang=${language}`);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + " đ";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar 
        language={language}
        toggleLanguage={toggleLanguage}
        ctaText={language === "vi" ? "Đăng Ký Ngay" : "Sign Up Now"}
        onCtaClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
      />

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            {language === "vi" ? "Lưu giữ kỷ niệm vô giá" : "Keep memories forever"}
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            {language === "vi" ? "Chọn gói chức năng phù hợp nhất để gia đình quây quần mỗi ngày." : "Choose the right plan to bring your family together."}
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="bg-secondary p-1.5 rounded-2xl flex items-center shadow-inner">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                billingCycle === "monthly" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {language === "vi" ? "Thanh toán tháng" : "Monthly billing"}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex flex-col items-center justify-center space-y-0.5 ${
                billingCycle === "yearly" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{language === "vi" ? "Thanh toán năm" : "Yearly billing"}</span>
              <span className="text-[10px] text-foreground font-extrabold uppercase tracking-wide bg-foreground/10 px-2 rounded-sm">
                {language === "vi" ? "Tiết Kiệm 15%" : "Save 15%"}
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {iOSPlans.map((plan) => {
            const isSelected = selectedPlan === plan.key;
            const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const priceText = price === 0 ? (language === "vi" ? "Miễn phí" : "Free") : formatPrice(price);
            
            // Hero inversion for the popular plan
            const bgClass = plan.isPopular ? "bg-slate-900 text-white border-slate-800" : "bg-card text-card-foreground border-border";
            const focusClass = isSelected ? "ring-2 ring-slate-900 ring-offset-4 ring-offset-background" : "hover:border-foreground/30";
            
            return (
              <Card 
                key={plan.key}
                onClick={() => setSelectedPlan(plan.key)}
                className={`relative cursor-pointer transition-all duration-300 border-2 shadow-sm ${bgClass} ${focusClass} ${plan.isPopular ? "scale-[1.03] shadow-2xl z-10" : ""}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-background text-foreground border-2 border-slate-900 px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                      {language === "vi" ? "Khuyên Dùng" : "Recommended"}
                    </span>
                  </div>
                )}
                
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="mb-8">
                    <h3 className="text-2xl font-extrabold tracking-tight">{plan.name}</h3>
                    <p className={`text-sm mt-1.5 font-medium ${plan.isPopular ? "text-white/80" : "text-muted-foreground"}`}>
                      {plan[language].target}
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <div className="text-4xl font-extrabold tracking-tight">
                      {priceText}
                    </div>
                    {price > 0 && (
                      <div className={`text-sm font-medium mt-2 ${plan.isPopular ? "text-white/70" : "text-muted-foreground"}`}>
                        / {billingCycle === "monthly" ? (language === "vi" ? "tháng" : "month") : (language === "vi" ? "năm" : "year")}
                      </div>
                    )}
                  </div>
                  
                  <hr className={`my-8 border-t ${plan.isPopular ? "border-white/10" : "border-border"}`} />
                  
                  <ul className="space-y-5 mb-10 flex-1">
                    <li className="flex items-start gap-4">
                      <StorageIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.isPopular ? "text-white/70" : "text-muted-foreground"}`} />
                      <span className="font-medium text-sm leading-relaxed">{plan[language].storage}</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <VoiceIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.isPopular ? "text-white/70" : "text-muted-foreground"}`} />
                      <span className="font-medium text-sm leading-relaxed">{plan[language].aiVoice}</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <GroupIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.isPopular ? "text-white/70" : "text-muted-foreground"}`} />
                      <span className="font-medium text-sm leading-relaxed">{plan[language].sharing}</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <TimeIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.isPopular ? "text-white/70" : "text-muted-foreground"}`} />
                      <span className="font-medium text-sm leading-relaxed">{plan[language].duration}</span>
                    </li>
                  </ul>
                  
                  <div className="mt-auto pt-2">
                    <div className={`w-full h-12 rounded-xl flex items-center justify-center font-bold text-sm tracking-wide transition-colors ${
                      isSelected 
                        ? (plan.isPopular ? "bg-background text-slate-900 shadow-lg" : "bg-foreground text-background shadow-md") 
                        : (plan.isPopular ? "bg-background text-slate-900 hover:bg-background/90 shadow-md" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")
                    }`}>
                      {isSelected ? (language === "vi" ? "Đã chọn" : "Selected") : (language === "vi" ? "Chọn gói" : "Select Plan")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-20 text-center max-w-xl mx-auto">
          <Button 
            onClick={handleSubscribe} 
            disabled={isSubmitting || !selectedPlan}
            size="lg"
            className="w-full text-lg h-16 font-extrabold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting 
              ? (language === "vi" ? "Đang xử lý..." : "Processing...") 
              : (selectedPlan 
                  ? `${language === "vi" ? "Tiếp tục đăng ký" : "Continue with"} ${iOSPlans.find(p => p.key === selectedPlan)?.name}` 
                  : (language === "vi" ? "Chọn một gói" : "Choose a plan")
                )
            }
          </Button>
          <div className="text-sm font-medium text-muted-foreground mt-6 flex items-center justify-center gap-1.5 flex-wrap">
            <span>{language === "vi" ? "Bằng việc đăng ký, bạn đồng ý với" : "By subscribing, you agree to our"}</span>
            <a href="#" className="text-foreground underline underline-offset-4 hover:opacity-80">{language === "vi" ? "Điều khoản" : "Terms"}</a>
            <span>{language === "vi" ? "và" : "and"}</span>
            <a href="#" className="text-foreground underline underline-offset-4 hover:opacity-80">{language === "vi" ? "Chính sách bảo mật" : "Privacy Policy"}</a>
          </div>
        </div>
      </main>
    </div>
  );
}
