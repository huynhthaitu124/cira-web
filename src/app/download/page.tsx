"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function RegisterPromoPage() {
  const handleAppStoreClick = () => {
    window.open("https://apps.apple.com/vn/app/cira/id6760659914?l=vi", "_blank");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl overflow-hidden border">
        {/* Header Illustration / Cover */}
        <div className="h-40 bg-secondary/30 w-full relative border-b flex items-center justify-center">
             <div className="text-6xl">📱</div>
        </div>
        
        <div className="p-8 text-center space-y-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Tạo tài khoản CIRA
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Cảm ơn bạn đã lựa chọn gói <strong>Starter (Miễn phí)</strong>. <br />
            Để đảm bảo trải nghiệm bảo mật và đồng bộ tốt nhất, mọi đăng ký tài khoản mới hiện được thực hiện thông qua Ứng dụng CIRA trên iOS.
          </p>
          
          <Button 
            onClick={handleAppStoreClick}
            className="w-full h-12 text-lg font-bold mt-4"
          >
            Tải App & Đăng Ký Trực Tiếp
          </Button>

          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="w-full text-muted-foreground mt-2"
          >
            Quay lại Bảng Giá
          </Button>
        </div>
      </div>
    </div>
  );
}
