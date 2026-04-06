import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: "Email and strong password (min 6 chars) are required" }, { status: 400 });
    }

    // Use admin privileges to instantly create the user with automatically confirmed email
    const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password: password,
      email_confirm: true, // Forces immediate verification!
    });

    if (error) {
       if (error.message.includes('already registered')) {
         return NextResponse.json({ error: "Email đã được sử dụng. Vui lòng đăng nhập." }, { status: 409 });
       }
       throw error;
    }

    return NextResponse.json({ success: true, user: user.user });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: error.message || "Failed to register account" }, { status: 500 });
  }
}
