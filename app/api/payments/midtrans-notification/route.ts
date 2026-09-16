import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const notification = await request.json();
    
    // Pastikan payload memiliki field dasar
    if (!notification || !notification.order_id || !notification.status_code || !notification.gross_amount) {
      return NextResponse.json({ error: "Invalid notification payload" }, { status: 400 });
    }

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status
    } = notification;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

    // 1. Verifikasi Signature SHA-512
    const hashString = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const generatedSignature = crypto.createHash("sha512").update(hashString).digest("hex");

    if (generatedSignature !== signature_key) {
      console.error("Midtrans Signature verification failed!", { order_id });
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. Bersihkan Suffix Retry dari order_id (Format: ATR-12345678-retry-1690000000000)
    const baseOrderId = order_id.split("-retry-")[0];

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Supabase config missing" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // Ambil data order saat ini
    const { data: currentOrder, error: fetchError } = await supabase
      .from("orders")
      .select("id, status, payment_status")
      .eq("id", baseOrderId)
      .single();

    if (fetchError || !currentOrder) {
      console.error("Order not found:", baseOrderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 3. IDEMPOTENCY GUARD
    // Jika pesanan sudah berstatus terbayar, jangan downgrade statusnya
    // walaupun ada notifikasi 'expire' atau 'cancel' dari attempt retry yang lama.
    if (currentOrder.payment_status === "paid" && (transaction_status === "expire" || transaction_status === "cancel")) {
      console.info(`Idempotency hit: Order ${baseOrderId} is already paid. Ignoring ${transaction_status} notification for ${order_id}.`);
      return NextResponse.json({ ok: true, message: "Ignored, order already paid" });
    }

    // 4. Update Status Transaksi
    let updatePayload: any = {};

    if (transaction_status === "capture") {
      if (fraud_status === "challenge") {
        updatePayload = { status: "Menunggu Pembayaran", notes: "Pembayaran terindikasi fraud (challenge)" };
      } else if (fraud_status === "accept") {
        updatePayload = { 
          status: "Diproses", 
          payment_status: "paid", 
          escrow_status: "Ditahan" 
        };
      }
    } else if (transaction_status === "settlement") {
      updatePayload = { 
        status: "Diproses", 
        payment_status: "paid", 
        escrow_status: "Ditahan" 
      };
    } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
      // Hanya set status batal / kembali menunggu pembayaran jika kita belum dibayar (Idempotency sudah check di atas)
      updatePayload = { 
        status: "Menunggu Pembayaran",
        payment_status: "unpaid"
      };
    } else if (transaction_status === "pending") {
      updatePayload = { 
        payment_status: "unpaid" 
      };
    }

    if (Object.keys(updatePayload).length > 0) {
      const { error: updateError } = await supabase
        .from("orders")
        .update(updatePayload)
        .eq("id", baseOrderId);

      if (updateError) {
        console.error("Update order error:", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, baseOrderId, transaction_status });
  } catch (error: any) {
    console.error("Midtrans Notification Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
