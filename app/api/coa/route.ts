import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * POST /api/coa
 * Simpan hasil uji lab ke tabel coa_records dan kembalikan ID-nya
 */
export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await req.json();

    const {
      batch_id,
      product_name,
      farmer_name,
      region,
      pa_level,
      acid_number,
      density,
      color,
      viscosity,
      method,
      confidence_score,
      grade,
      notes,
      issued_by,
    } = body;

    if (!pa_level || !method) {
      return NextResponse.json(
        { error: "pa_level dan method wajib diisi." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("coa_records")
      .insert([
        {
          pa_level: parseFloat(pa_level),
          acid_number: acid_number ? parseFloat(acid_number) : null,
          density: density ? parseFloat(density) : null,
          color: color || null,
          viscosity: viscosity || null,
          method,
          confidence_score: confidence_score ? parseFloat(confidence_score) : null,
          // extra metadata (kolom tambahan — lihat SQL migration)
          batch_id: batch_id || null,
          product_name: product_name || null,
          farmer_name: farmer_name || null,
          region: region || null,
          grade: grade || null,
          notes: notes || null,
          issued_by: issued_by || "ARC-USK",
        },
      ])
      .select("id, analyzed_at")
      .single();

    if (error) {
      console.error("CoA insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id, analyzed_at: data.analyzed_at }, { status: 201 });
  } catch (err) {
    console.error("CoA route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * GET /api/coa?id=<uuid>
 * Ambil satu record CoA untuk preview / regenerasi PDF
 */
export async function GET(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Parameter id wajib." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("coa_records")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "CoA tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("CoA GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
