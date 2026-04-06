"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const planName = searchParams.get("plan") || "Unknown Plan";
  const cycle = searchParams.get("cycle") || "monthly";
  const price = searchParams.get("price") || "0";
  const orderCode = searchParams.get("orderCode") || "UNKNOWN";
  const initialLang = (searchParams.get("lang") as "vi" | "en") || "vi";

  const [language, setLanguage] = useState<"vi" | "en">(initialLang);

  // Bank Info from ENV - NOTE: in a real app, you might fetch this via server components. 
  // For a public landing, providing SePay details in NEXT_PUBLIC env is typically fine, 
  // or we can fetch from an internal API. We'll simulate fetching or display placeholders.
  // We use the common VietQR URL pattern.
  const [bankAccount, setBankAccount] = useState<string>("YOUR_BANK_ACCOUNT");
  const [bankName, setBankName] = useState<string>("YOUR_BANK");
  
  useEffect(() => {
    // In a real environment, you'd fetch this from a protected API
    // GET /api/sepay/config returning the bank details securely.
    fetch('/api/sepay/config')
      .then(r => r.json())
      .then(data => {
        if (data.account && data.bank) {
          setBankAccount(data.account);
          setBankName(data.bank);
        }
      }).catch(console.error);
  }, []);

  const qrUrl = `https://qr.sepay.vn/img?acc=${bankAccount}&bank=${bankName}&amount=${price}&des=${orderCode}`;

  const toggleLanguage = () => {
    setLanguage(language === "vi" ? "en" : "vi");
  };

  const handlePaid = () => {
    router.push(`/pricing/verify?success=true&orderCode=${orderCode}`);
  };

  const handleCancel = () => {
    router.push(`/pricing/verify?cancel=true`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar 
        language={language}
        toggleLanguage={toggleLanguage}
        ctaText={language === "vi" ? "Trang chủ" : "Home"}
        onCtaClick={() => router.push("/")}
      />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Card className="max-w-2xl w-full border-2 shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left side: Order Info */}
            <div className="bg-gray-50 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  {language === "vi" ? "Thông tin thanh toán" : "Payment Information"}
                </h2>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <div className="text-sm text-gray-500">{language === "vi" ? "Gói đăng ký" : "Subscription Plan"}</div>
                    <div className="text-lg font-semibold">{planName} ({cycle === "yearly" ? (language === "vi" ? "Năm" : "Yearly") : (language === "vi" ? "Tháng" : "Monthly")})</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">{language === "vi" ? "Tổng cộng" : "Total amount"}</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Number(price).toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">{language === "vi" ? "Mã chuyển khoản" : "Transfer Content"}</div>
                    <div className="text-lg font-mono font-bold bg-white px-3 py-1 rounded inline-block mt-1 border">
                      {orderCode}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={handlePaid} className="w-full bg-blue-600 hover:bg-blue-700 h-12">
                  {language === "vi" ? "Tôi đã thanh toán" : "I have paid"}
                </Button>
                <Button onClick={handleCancel} variant="ghost" className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 h-12">
                  {language === "vi" ? "Hủy giao dịch" : "Cancel transaction"}
                </Button>
              </div>
            </div>

            {/* Right side: QR Code */}
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <h3 className="font-semibold mb-2">
                {language === "vi" ? "Quét mã để thanh toán" : "Scan QR to pay"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {language === "vi" 
                  ? "Sử dụng App ngân hàng để quét mã VietQR"
                  : "Use your banking app to scan this VietQR"}
              </p>
              
              <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300 w-64 h-64 relative mb-6">
                {/* Fallback image if bank details are not configured yet */}
                <Image 
                  src={qrUrl} 
                  alt="VietQR"
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>

              <p className="text-xs text-gray-400 max-w-[200px]">
                {language === "vi" 
                  ? "SePay sẽ tự động xác nhận khi nhận được thanh toán."
                  : "SePay will automatically confirm upon receiving payment."}
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
