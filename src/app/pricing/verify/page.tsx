"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const cancel = searchParams.get("cancel");
  const success = searchParams.get("success");
  const orderCode = searchParams.get("orderCode");

  const isSuccess = success === "true" && cancel !== "true";
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar 
        language={language}
        toggleLanguage={() => setLanguage(language === "vi" ? "en" : "vi")}
        ctaText={language === "vi" ? "Trang chủ" : "Home"}
        onCtaClick={() => router.push("/")}
      />

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-2 shadow-xl">
          <CardContent className="p-8 text-center">
            {isSuccess ? (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {language === "vi" ? "Thanh toán thành công!" : "Payment Successful!"}
                </h1>
                <p className="text-gray-500">
                  {language === "vi" 
                    ? `Cảm ơn bạn đã đăng ký gói dịch vụ. Mã đơn hàng: ${orderCode}` 
                    : `Thank you for subscribing. Order code: ${orderCode}`
                  }
                </p>
                <Button onClick={() => router.push("/")} className="w-full h-12 text-lg mt-4">
                  {language === "vi" ? "Trở về trang chủ" : "Return Home"}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {language === "vi" ? "Thanh toán đã hủy" : "Payment Cancelled"}
                </h1>
                <p className="text-gray-500">
                  {language === "vi" 
                    ? "Bạn đã hủy thanh toán. Bạn có thể thử lại sau." 
                    : "You have cancelled the payment. You can try again later."
                  }
                </p>
                <div className="flex flex-col gap-3 mt-4">
                  <Button onClick={() => router.push("/pricing")} variant="default" className="w-full h-12 text-lg">
                    {language === "vi" ? "Thử lại" : "Try Again"}
                  </Button>
                  <Button onClick={() => router.push("/")} variant="outline" className="w-full h-12 text-lg">
                    {language === "vi" ? "Trở về trang chủ" : "Return Home"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
