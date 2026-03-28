import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature || !process.env.RAZORPAY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(bodyText)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(bodyText);

    if (payload.event === "payment.captured") {
      const orderId = payload.payload.payment.entity.order_id;
      const paymentId = payload.payload.payment.entity.id;

      // Update the user's registration status to confirmed
      const { data: registration } = await supabaseAdmin
        .from("registrations")
        .update({
          status: "confirmed",
          razorpay_payment_id: paymentId,
          confirmed_at: new Date().toISOString(),
        })
        .eq("razorpay_order_id", orderId)
        .select()
        .single();
        
      // Trigger the n8n Workflow 1 (Registration Confirmed)
      if (process.env.N8N_WEBHOOK_BASE_URL && registration) {
         fetch(`${process.env.N8N_WEBHOOK_BASE_URL}/webhook/registration-confirmed`, {
           method: "POST",
           headers: { 
             "Content-Type": "application/json", 
             "X-Webhook-Secret": process.env.N8N_WEBHOOK_SECRET || "" 
           },
           body: JSON.stringify({ registration_id: registration.id })
         }).catch(console.error);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: any) {
    console.error("Razorpay webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
