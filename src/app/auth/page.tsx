"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

function AuthComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const plan = searchParams.get("plan");
  const price = searchParams.get("price");
  const cycle = searchParams.get("cycle");
  const lang = searchParams.get("lang") || "vi";

  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const t = {
    vi: {
      registerTitle: "Tạo tài khoản CIRA",
      loginTitle: "Đăng nhập CIRA",
      registerSub: "Bước 1: Đăng ký web để liên kết thanh toán gói",
      loginSub: "Đăng nhập để thanh toán gói CIRA của bạn",
      email: "Email",
      password: "Mật khẩu (tối thiểu 6 ký tự)",
      registerBtn: "Tạo tài khoản",
      loginBtn: "Đăng nhập",
      submitting: "Đang xử lý...",
      switchLog: "Đã có tài khoản? Đăng nhập",
      switchReg: "Chưa có tài khoản? Đăng ký ngay",
    },
    en: {
      registerTitle: "Create CIRA Account",
      loginTitle: "Log in to CIRA",
      registerSub: "Step 1: Register to link your payment",
      loginSub: "Log in to proceed with payment",
      email: "Email",
      password: "Password (min 6 characters)",
      registerBtn: "Create Account",
      loginBtn: "Log In",
      submitting: "Processing...",
      switchLog: "Already have an account? Log in",
      switchReg: "Don't have an account? Register now",
    }
  };

  const texts = t[lang as keyof typeof t];

  // Helper to trigger the real order creation & routing
  const routeToCheckout = async (userEmail: string) => {
    if (!plan || !price || !cycle) {
      // Just logged in with no package target, route to App promo
      router.push("/download");
      return;
    }

    const priceNum = parseInt(price);
    if (priceNum === 0 || plan.toLowerCase() === "starter") {
      router.push("/download");
      return;
    }

    try {
      // Create pendng order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          planName: plan,
          billingCycle: cycle,
          price: priceNum
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      router.push(`/pricing/checkout?plan=${encodeURIComponent(plan)}&price=${price}&cycle=${cycle}&orderCode=${data.orderCode}&lang=${lang}`);
    } catch (err) {
      console.error(err);
      setErrorMessage("Lỗi tạo đơn hàng. Vui lòng thử lại!");
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || isSubmitting) return;

    if (password.length < 6) {
      setErrorMessage(lang === "vi" ? "Mật khẩu phải từ 6 ký tự" : "Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (isLogin) {
        // Direct supabase authentication
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
        if (error) throw error;
        
        await routeToCheckout(email.trim());
      } else {
        // Use our Server Bypass API
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        });

        const data = await response.json();

        if (!response.ok) {
           if (response.status === 409) {
             setErrorMessage(data.error);
             setIsLogin(true); // Switch user to login
             setIsSubmitting(false);
             return;
           }
           throw new Error(data.error || "Gặp lỗi đăng ký");
        }

        // Successfully registered directly on the backend!
        await routeToCheckout(email.trim());
      }
    } catch (err: any) {
      console.error("Auth Fail:", err);
      // Nice error mapping
      if (err.message.includes("Invalid login")) {
        setErrorMessage(lang === "vi" ? "Email hoặc mật khẩu không đúng." : "Invalid email or password.");
      } else {
        setErrorMessage(err.message || "Failed to authenticate");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full mb-8 text-center cursor-pointer" onClick={() => router.push('/')}>
         <span className="text-3xl font-extrabold tracking-tight">CIRA</span>
      </div>
      <Card className="max-w-md w-full shadow-lg border-2">
        <CardContent className="p-8">
          <div className="text-center mb-8">
             <h2 className="text-2xl font-bold mb-2">
               {isLogin ? texts.loginTitle : texts.registerTitle}
             </h2>
             <p className="text-sm text-muted-foreground">
               {isLogin ? texts.loginSub : texts.registerSub}
             </p>
             {plan && (
                <div className="mt-4 px-4 py-2 bg-secondary/30 rounded-lg inline-block text-sm font-medium">
                  {plan} • {price === "0" ? "Miễn Phí" : parseInt(price || "0").toLocaleString('vi-VN')} {price !== "0" && "đ"}
                </div>
             )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">{texts.email}</label>
              <Input
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">{texts.password}</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            {errorMessage && (
              <div className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg">
                ❌ {errorMessage}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-bold mt-2" 
              disabled={isSubmitting}
            >
              {isSubmitting ? texts.submitting : (isLogin ? texts.loginBtn : texts.registerBtn)}
            </Button>
            
            <div className="text-center pt-2">
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                {isLogin ? texts.switchReg : texts.switchLog}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center text-sm text-muted-foreground cursor-pointer" onClick={() => router.back()}>
        ← Quay lại thao tác trước
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthComponent />
    </Suspense>
  );
}
