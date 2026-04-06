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
    accentColor: "bg-gray-500",
    textAccent: "text-gray-500",
    borderAccent: "border-gray-500"
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
    accentColor: "bg-blue-500",
    textAccent: "text-blue-500",
    borderAccent: "border-blue-500"
  },
  {
    key: "family",
    name: "Family",
    vi: {
      target: "Gia đình 2-5 người",
      storage: "1.000 ảnh",
      aiVoice: "Giọng nói riêng",
      sharing: "Bảng tin gia đình",
      duration: "Vĩnh viễn"
    },
    en: {
      target: "Family of 2-5",
      storage: "1,000 photos",
      aiVoice: "Custom voice",
      sharing: "Family feed",
      duration: "Forever"
    },
    monthlyPrice: 179000,
    yearlyPrice: 2040000,
    isPopular: true,
    accentColor: "bg-orange-500",
    textAccent: "text-orange-500",
    borderAccent: "border-orange-500"
  },
  {
    key: "premium",
    name: "Premium",
    vi: {
      target: "Gia đình lớn",
      storage: "Không giới hạn",
      aiVoice: "Giọng nói riêng",
      sharing: "Bảng tin gia đình",
      duration: "Trọn đời"
    },
    en: {
      target: "Large families",
      storage: "Unlimited",
      aiVoice: "Custom voice",
      sharing: "Family feed",
      duration: "Lifetime"
    },
    monthlyPrice: 499000,
    yearlyPrice: 5599000,
    isPopular: false,
    accentColor: "bg-purple-500",
    textAccent: "text-purple-500",
    borderAccent: "border-purple-500"
  }
];

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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {language === "vi" ? "Lưu giữ kỷ niệm mãi mãi" : "Keep memories forever"}
          </h1>
          <p className="text-xl text-muted-foreground">
            {language === "vi" ? "Chọn gói phù hợp với gia đình bạn" : "Choose the right plan for your family"}
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-xl flex items-center shadow-inner">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-8 py-3 rounded-lg text-sm font-semibold transition-all ${
                billingCycle === "monthly" 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {language === "vi" ? "Hàng tháng" : "Monthly"}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-8 py-3 rounded-lg text-sm font-semibold transition-all flex flex-col items-center ${
                billingCycle === "yearly" 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{language === "vi" ? "Hàng năm" : "Yearly"}</span>
              <span className="text-[10px] text-green-600 font-bold -mt-1">
                {language === "vi" ? "Tiết kiệm 15%" : "Save 15%"}
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {iOSPlans.map((plan) => {
            const isSelected = selectedPlan === plan.key;
            const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const priceText = price === 0 ? (language === "vi" ? "Miễn phí" : "Free") : formatPrice(price);
            
            return (
              <Card 
                key={plan.key}
                onClick={() => setSelectedPlan(plan.key)}
                className={`relative cursor-pointer transition-all duration-200 border-2 ${
                  isSelected ? `${plan.borderAccent} shadow-xl scale-105 z-10` : 'border-transparent hover:border-gray-200'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className={`${plan.accentColor} text-white px-3 py-1 text-xs font-bold rounded-full shadow-md`}>
                      {language === "vi" ? "Phổ biến" : "Popular"}
                    </span>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-gray-500">{plan[language].target}</p>
                  </div>
                  
                  <div className="mb-6 h-[60px]">
                    <div className={`text-3xl font-bold ${plan.textAccent}`}>
                      {priceText}
                    </div>
                    {price > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        / {billingCycle === "monthly" ? (language === "vi" ? "tháng" : "month") : (language === "vi" ? "năm" : "year")}
                      </div>
                    )}
                  </div>
                  
                  <hr className="border-gray-100 my-6" />
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-gray-400">📸</span>
                      <span>{plan[language].storage}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-gray-400">🎙️</span>
                      <span>{plan[language].aiVoice}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-gray-400">👥</span>
                      <span>{plan[language].sharing}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-gray-400">⏳</span>
                      <span>{plan[language].duration}</span>
                    </li>
                  </ul>
                  
                  <div className="mt-auto">
                    <div className={`w-full h-10 rounded-lg flex items-center justify-center font-medium ${
                      isSelected ? `${plan.accentColor} text-white shadow-md` : 'bg-gray-50 text-gray-700'
                    }`}>
                      {isSelected ? 'Đã chọn' : 'Chọn gói'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-16 text-center max-w-md mx-auto">
          <Button 
            onClick={handleSubscribe} 
            disabled={isSubmitting}
            size="lg"
            className={`w-full text-lg h-14 ${
              selectedPlan 
                ? iOSPlans.find(p => p.key === selectedPlan)?.accentColor 
                : 'bg-primary'
            } hover:opacity-90`}
          >
            {isSubmitting 
              ? (language === "vi" ? "Đang xử lý..." : "Processing...") 
              : (selectedPlan 
                  ? `${language === "vi" ? "Đăng ký" : "Subscribe to"} ${iOSPlans.find(p => p.key === selectedPlan)?.name}` 
                  : (language === "vi" ? "Chọn một gói" : "Choose a plan")
                )
            }
          </Button>
          <div className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-1">
            <span>{language === "vi" ? "Đăng ký là bạn đồng ý với" : "By subscribing, you agree to our"}</span>
            <a href="#" className="text-blue-500 hover:underline">{language === "vi" ? "Điều khoản" : "Terms"}</a>
            <span>{language === "vi" ? "và" : "and"}</span>
            <a href="#" className="text-blue-500 hover:underline">{language === "vi" ? "Chính sách bảo mật" : "Privacy Policy"}</a>
          </div>
        </div>
      </main>


    </div>
  );
}
