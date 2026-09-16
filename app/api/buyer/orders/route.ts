import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/buyer/orders
 * Fetch orders for a buyer
 */
export async function GET(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const buyerId = searchParams.get("buyerId");

    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      // Map UI status to database status
      query = query.eq("status", status);
    }

    if (buyerId) {
      query = query.eq("buyer_id", buyerId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching buyer orders:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch order items for each order
    const ordersWithItems = await Promise.all(
      (data || []).map(async (order) => {
        const { data: items } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", order.id);

        return {
          ...order,
          items: items || [],
        };
      })
    );

    return NextResponse.json({ data: ordersWithItems }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
