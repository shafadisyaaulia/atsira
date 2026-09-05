import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/seller/orders
 * Fetch orders with items for seller
 */
export async function GET(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const sellerId = searchParams.get("sellerId");

    // 1. Dapatkan Sesi User saat ini untuk Keamanan (Optional tapi disarankan)
    const { data: { user } } = await supabase.auth.getUser();

    // 2. Query Utama dengan Single Join ke order_items (Mencegah N+1 Query)
    let query = supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    // Filter berdasarkan seller jika ID tersedia
    const activeSellerId = sellerId || user?.id;
    if (activeSellerId) {
      query = query.eq("seller_id", activeSellerId);
    }

    // Filter berdasarkan status
    if (status && status !== "all") {
      const statusMap: Record<string, string> = {
        pending: "Menunggu Pembayaran",
        processing: "Diproses",
        shipped: "Dikirim",
        delivered: "Diterima",
        completed: "Selesai",
        cancelled: "Dibatalkan",
      };
      query = query.eq("status", statusMap[status] || status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching seller orders:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Normalisasi struktur output agar frontend tinggal panggil .items
    const formattedData = (data || []).map((order) => ({
      ...order,
      items: order.order_items || [],
    }));

    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/seller/orders
 * Update order status or tracking number by seller
 */
export async function PATCH(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await req.json();
    const { orderId, status, trackingNumber } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID wajib diisi" }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {};
    if (status) updatePayload.status = status;
    if (trackingNumber !== undefined) updatePayload.tracking_number = trackingNumber;

    const { data, error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", orderId)
      .select("*, order_items(*)");

    if (error) {
      console.error("Error updating order:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data: data[0] }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}