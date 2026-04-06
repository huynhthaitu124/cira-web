import { NextResponse } from "next/server";

// Securely provides Bank Info to the frontend without exposing API tokens
export async function GET() {
  return NextResponse.json({
    account: process.env.SEPAY_BANK_ACCOUNT || "0123456789", // Fallback
    bank: process.env.SEPAY_BANK_NAME || "MBBank",
  });
}
