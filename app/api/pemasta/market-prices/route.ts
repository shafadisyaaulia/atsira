import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/pemasta/market-prices
 * Fetch market price updates dari PEMASTA role
 */
export async function GET(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region");

    let query = supabase
      .from("market_price_updates")
      .select("*")
      .order("report_date", { ascending: false });

    if (region) {
      query = query.eq("region", region);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching market prices:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/pemasta/market-prices
 * Submit market price update dari PEMASTA
 */
export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await req.json();

    const {
      batchId,
      region,
      reportDate,
      quantityKg,
      paLevel,
      pricePerKg,
      method,
      leafAge,
    } = body;

    if (!batchId || !region || !reportDate || !quantityKg || !paLevel || !pricePerKg) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("market_price_updates")
      .insert([
        {
          batch_id: batchId,
          region,
          report_date: reportDate,
          quantity_kg: quantityKg,
          pa_level: paLevel,
          price_per_kg: pricePerKg,
          method,
          leaf_age: leafAge,
          status: "Unverified",
        },
      ])
      .select();

    if (error) {
      console.error("Error submitting market price:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
