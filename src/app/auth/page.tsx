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
      or: "Hoặc",
      google: "Tiếp tục với Google"
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
      or: "Or",
      google: "Continue with Google"
    }
  };

  const texts = t[lang as keyof typeof t];

  // Check if already authenticated on mount (e.g. returning from Google OAuth)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        routeToCheckout(session.user.email);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user?.email) {
         routeToCheckout(session.user.email);
      }
    });

    return () => {
      if (authListener?.subscription) {
         authListener.subscription.unsubscribe();
      }
    };
  }, [plan, price, cycle, lang]);

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

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth?plan=${encodeURIComponent(plan || '')}&price=${price || ''}&cycle=${cycle || ''}&lang=${lang}`
      }
    });
    
    if (error) {
      setErrorMessage(error.message);
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

          <div className="space-y-4 mb-6">
            <Button 
               variant="outline" 
               type="button" 
               disabled={isSubmitting}
               onClick={handleGoogleAuth}
               className="w-full h-12 font-semibold bg-white text-gray-900 border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-3 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {texts.google}
            </Button>
            
            <div className="relative flex items-center justify-center py-2">
               <div className="absolute border-t border-border w-full"></div>
               <span className="bg-card px-3 text-xs text-muted-foreground relative z-10 uppercase font-medium">{texts.or}</span>
            </div>
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
