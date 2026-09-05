import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    
    const body = await request.json();
    const {
      orderId,
      buyerEmail,
      buyerName,
      items,
      subtotal,
      shippingFee,
      tax,
      total,
      currency = "IDR",
      isInternational = false,
    } = body;

    if (!orderId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const lineItems = items.map(
      (item: { title: string; price: number; qty: number; unit: string }) => ({
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.title,
            description: `Quantity: ${item.qty} ${item.unit}`,
          },
        },
        quantity: item.qty,
      })
    );

    lineItems.push({
      price_data: {
        currency: currency.toLowerCase(),
        unit_amount: Math.round(shippingFee * 100),
        product_data: {
          name: isInternational ? "International Shipping" : "Domestic Shipping",
        },
      },
      quantity: 1,
    });

    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: Math.round(tax * 100),
          product_data: {
            name: "Tax (PPN 11%)",
          },
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?orderId=${encodeURIComponent(orderId)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout?cancelled=true`,
      customer_email: buyerEmail || undefined,
      metadata: {
        orderId,
        buyerName,
        isInternational,
      },
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && serviceRoleKey) {
      const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });

      await supabase
        .from("orders")
        .update({
          payment_session_id: session.id,
          payment_method: "stripe",
        })
        .eq("id", orderId);
    }

    return NextResponse.json({
      ok: true,
      sessionId: session.id,
      checkoutUrl: session.url,
    });
  } catch (error: any) {
    console.error("Payment session error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create payment session" },
      { status: 500 }
    );
  }
}
