import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
// @ts-ignore
import Midtrans from "midtrans-client";
import Stripe from "stripe";

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY tidak dikonfigurasi");
  }
  return new Stripe(secretKey, {
    apiVersion: "2023-10-16" as any,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      buyerId,
      buyerName,
      buyerPhone,
      shippingAddress,
      shippingProvince,
      shippingCountry,
      shippingPostal,
      items,
      subtotal,
      shippingFee,
      tax,
      total,
      paymentMethod,
      courier,
      orderType,
    } = body ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
    }

    const orderId = `ATR-${Date.now().toString().slice(-8)}`;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Supabase configuration missing" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1. Simpan Transaksi Utama ke Database Supabase
    const orderInsert: Record<string, any> = {
      id: orderId,
      buyer_id: buyerId || null,
      seller_id: items[0]?.seller || items[0]?.sellerId || null,
      buyer_name: buyerName || "Pembeli ATSIRA",
      order_type: orderType || "B2C",
      subtotal: Number(subtotal || 0),
      shipping_fee: Number(shippingFee || 0),
      tax: Number(tax || 0),
      total: Number(total || 0),
      status: paymentMethod === "cod" ? "pending" : "pending",
      payment_method: paymentMethod || "midtrans",
      courier: courier || "JNE Regular",
      tracking_number: null,
    };

    if (shippingAddress || shippingProvince || shippingCountry || shippingPostal || buyerPhone) {
      console.info("Checkout shipping details:", {
        buyerName,
        buyerPhone,
        shippingAddress,
        shippingProvince,
        shippingCountry,
        shippingPostal,
      });
    }

    const { error: orderError } = await supabase.from("orders").insert(orderInsert);
    if (orderError) {
      console.error("Insert orders error:", orderError);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // 2. Simpan Detail Item
    const orderItems = items.map((item: any) => ({
      order_id: orderId,
      product_id: item.productId || item.id || item.product_id || "00000000-0000-0000-0000-000000000000",
      title: item.title || item.name || item.product_title || "Produk Nilam ATSIRA",
      qty: Number(item.qty || item.quantity || 1),
      unit: item.unit || "pcs",
      price: Number(item.price || 0),
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      console.error("Insert order_items error:", itemsError);
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    // 3. JALUR STRIPE (INTERNASIONAL)
    if (paymentMethod === "stripe" || paymentMethod === "visa") {
      const lineItems = items.map((item: any) => ({
        price_data: {
          currency: "idr",
          product_data: { name: item.title || item.name || "Produk ATSIRA" },
          unit_amount: Math.round(Number(item.price || 0)),
        },
        quantity: Number(item.qty || item.quantity || 1),
      }));

      const session = await getStripe().checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${request.headers.get("origin")}/checkout/success?orderId=${orderId}`,
        cancel_url: `${request.headers.get("origin")}/checkout`,
        metadata: { orderId },
      });

      return NextResponse.json({ ok: true, url: session.url });
    }

    // 4. JALUR COD
    if (paymentMethod === "cod") {
      return NextResponse.json({
        ok: true,
        orderId,
      });
    }

    // 5. JALUR MIDTRANS (DOMESTIK)
    // Dipaksa FALSE agar Midtrans selalu menggunakan server Sandbox
    const snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(Number(total || 0)),
      },
      customer_details: {
        first_name: buyerName || "Pembeli ATSIRA",
      },
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
      ok: true,
      orderId,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    });
  } catch (error: any) {
    console.error("Checkout API error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}