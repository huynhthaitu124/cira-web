import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // Verify webhook (SePay API Token can be used to authenticate requests if setup)
    // Or check authorization headers

    if (rawBody.transferType !== 'in') {
      return NextResponse.json({ success: true, message: "Ignored, not an incoming transaction" });
    }

    const { content, transferAmount, referenceCode } = rawBody;
    
    // In a real app, you would search your database orders where "CIRAxxxx" is inside `content`
    // e.g., const order = await db.orders.find(where content MATCHES orderCode)
    
    console.log(`SePay Webhook Received: Amount: ${transferAmount}, Content: ${content}, Ref: ${referenceCode}`);

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("SePay Webhook Error:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}
