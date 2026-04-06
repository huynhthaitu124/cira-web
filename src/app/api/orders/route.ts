import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, planName, billingCycle, price } = await req.json();

    if (!email || !planName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate a unique short order code like CIRA123456
    const orderCode = 'CIRA' + Date.now().toString().slice(-6);

    // Insert order into Supabase
    const { error } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          email,
          order_code: orderCode,
          plan_name: planName,
          billing_cycle: billingCycle,
          price,
          status: "PENDING"
        }
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to create order in database" }, { status: 500 });
    }

    return NextResponse.json({ orderCode, success: true });
  } catch (err: any) {
    console.error("Orders POST Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
