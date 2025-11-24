import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "CIRA - Ngôi Nhà Kỷ Niệm Cho Gia Đình Việt",
  description: "CIRA giúp bố mẹ, ông bà của bạn lưu giữ và nghe lại những kỷ niệm quý giá qua giọng AI ấm áp. Đăng ký waitlist để nhận ưu đãi 10%.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
