import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "dummy_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, track, tier, coupon, workshop_id } = body;

    if (!name || !email || !phone || !track || !tier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Calculate price securely on the backend based on tier and coupon
    let amount = 0;
    if (tier === "Early Bird") amount = 399;
    else if (tier === "Standard") amount = 799;
    else if (tier === "Bundle") amount = 1499;

    // Optional: Discount logic for coupon
    if (coupon && coupon.toUpperCase() === "EARLYBIRD") {
      amount = Math.floor(amount * 0.5); // 50% discount
    }

    // 2. Insert robust pending registration record into Supabase
    // Make sure we have a workshop_id, if not, find the next one
    let targetWorkshopId = workshop_id;
    if (!targetWorkshopId) {
       const { data: workshop } = await supabaseAdmin
         .from("workshops")
         .select("id")
         .gt("scheduled_at", new Date().toISOString())
         .order("scheduled_at", { ascending: true })
         .limit(1)
         .single();
       if (workshop) targetWorkshopId = workshop.id;
    }

    const { data: registration, error: dbError } = await supabaseAdmin
      .from("registrations")
      .insert({
        name,
        email,
        phone,
        tier,
        amount_paid: amount,
        status: "pending",
        coupon_code: coupon || null,
        workshop_id: targetWorkshopId || null, // null if no workshop available
      })
      .select()
      .single();

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ error: "Failed to create registration record" }, { status: 500 });
    }

    // 3. Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: `receipt_reg_${registration.id}`,
    };

    const order = await razorpay.orders.create(options);

    // Update registration with razorpay order ID
    await supabaseAdmin
      .from("registrations")
      .update({ razorpay_order_id: order.id })
      .eq("id", registration.id);

    // 4. Return to client to open Checkout
    return NextResponse.json({
      order_id: order.id,
      amount: options.amount,
      currency: options.currency,
      registration_id: registration.id,
    });

  } catch (error: any) {
    console.error("Checkout API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
