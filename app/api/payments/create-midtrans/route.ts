import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
// @ts-ignore
import Midtrans from "midtrans-client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, total, buyerName, bank } = body ?? {};

    if (!orderId || !total) {
      return NextResponse.json({ error: "Missing orderId or total" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Supabase config missing" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // Validasi Order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .single();

    if (orderError || !orderData) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan di database" }, { status: 404 });
    }

    if (orderData.status !== "Menunggu Pembayaran" && orderData.status !== "Dibatalkan") {
      return NextResponse.json({ error: `Pesanan sudah dalam status ${orderData.status}` }, { status: 400 });
    }

    // Bangun order_id khusus dengan suffix retry agar Midtrans tidak menolak (idempotency override di Snap)
    // Format: ATR-12345678-retry-1690000000000
    const midtransOrderId = `${orderId}-retry-${Date.now()}`;

    // Jalur Midtrans
    const snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });

    const parameter: any = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: Math.round(Number(total)),
      },
      customer_details: {
        first_name: buyerName || "Pembeli atSira",
      },
    };

    // Mapping bank dropdown ke parameter enabled_payments Midtrans
    if (bank) {
      const b = bank.toLowerCase();
      if (b === "bca") parameter.enabled_payments = ["bca_va"];
      else if (b === "bni") parameter.enabled_payments = ["bni_va"];
      else if (b === "mandiri") parameter.enabled_payments = ["echannel"]; // Mandiri Bill
      else if (b === "bri") parameter.enabled_payments = ["bri_va"];
    }

    const transaction = await snap.createTransaction(parameter);

    // Tandai bahwa pembeli mulai mencoba bayar pakai midtrans
    await supabase
      .from("orders")
      .update({ payment_method: "midtrans" })
      .eq("id", orderId);

    return NextResponse.json({
      ok: true,
      orderId: midtransOrderId,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    });

  } catch (error: any) {
    console.error("Create Midtrans error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
