import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Webhook Token Security
    const authHeader = req.headers.get("Authorization");
    const configuredToken = process.env.SEPAY_API_TOKEN;

    if (configuredToken) {
      if (!authHeader || (!authHeader.includes(`Apikey ${configuredToken}`) && !authHeader.includes(`Bearer ${configuredToken}`))) {
        console.warn("SePay Webhook Authentication Failed");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const rawBody = await req.json();

    if (rawBody.transferType !== 'in') {
      return NextResponse.json({ success: true, message: "Ignored, not an incoming transaction" });
    }

    const { content, transferAmount, referenceCode } = rawBody;
    
    console.log(`SePay Webhook Received: Amount: ${transferAmount}, Content: ${content}, Ref: ${referenceCode}`);

    // Extract CIRA order code using regex (e.g., CIRA123456)
    const match = content.match(/CIRA\d+/i);
    if (!match) {
      return NextResponse.json({ success: true, message: "No matching CIRA order code found inside content" });
    }

    const orderCode = match[0].toUpperCase();

    // 1. Find the order in the database
    const { data: order, error: findError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("order_code", orderCode)
      .eq("status", "PENDING")
      .single();

    if (findError || !order) {
      console.warn(`Order ${orderCode} not found or already processed. Error:`, findError);
      return NextResponse.json({ success: true, message: "Order not found or already paid" });
    }

    // 2. Validate amount (optional tolerance, doing strict here)
    if (transferAmount < order.price) {
      console.warn(`Insufficient amount. Expected ${order.price}, got ${transferAmount}`);
      return NextResponse.json({ success: true, message: "Amount insufficient" });
    }

    // 3. Mark Order as PAID
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ status: "PAID" })
      .eq("id", order.id);

    if (updateError) throw updateError;

    // 4. Upsert the Subscription logic
    // Calculate new expiry date based on plan duration
    const now = new Date();
    let addMonths = 1;
    if (order.billing_cycle === 'yearly') addMonths = 12;
    if (order.plan_name === 'Premium' || order.plan_name === 'Family') {
       // Typically 'Forever' or 'Lifetime' based on iOS model
       addMonths = 1200; // 100 years
    }
    
    const expiresAt = new Date(now.setMonth(now.getMonth() + addMonths)).toISOString();

    const { error: subError } = await supabaseAdmin
      .from("subscriptions")
      .upsert({
        email: order.email,
        plan_name: order.plan_name,
        billing_cycle: order.billing_cycle,
        status: "ACTIVE",
        expires_at: expiresAt,
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' });

    if (subError) {
      console.error("Error creating subscription:", subError);
      // We don't fail the webhook, but maybe alert admin
    }

    console.log(`Successfully processed order ${orderCode} for email ${order.email}`);
    return NextResponse.json({ success: true, message: "Webhook processed and order granted" });
  } catch (error) {
    console.error("SePay Webhook Error:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}
