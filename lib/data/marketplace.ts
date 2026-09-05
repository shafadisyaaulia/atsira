import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getMarketplaceProducts() {
  const supabase = await createSupabaseServerClient();

  const { data: rawRows, error: rawError } = await supabase
    .from("raw_oil_listings")
    .select("*")
    .order("listed_at", { ascending: false });

  const { data: finishedRows, error: finishedError } = await supabase
    .from("finished_products")
    .select("*")
    .order("created_at", { ascending: false });

  if (rawError || finishedError) {
    throw new Error(rawError?.message || finishedError?.message || "Gagal mengambil produk dari Supabase");
  }

  const coaIds = [
    ...(rawRows ?? []).map((row) => row.coa_id).filter(Boolean),
    ...(finishedRows ?? []).map((row) => row.coa_id).filter(Boolean),
  ] as string[];

  const { data: coaRows } = await supabase
    .from("coa_records")
    .select("*")
    .in("id", coaIds.length ? coaIds : ["__none__"]);

  const coaMap = new Map((coaRows ?? []).map((row) => [row.id, row]));

  const rawProducts = (rawRows ?? []).map((row) => {
    const coa = coaMap.get(row.coa_id ?? "");
    return {
      id: row.id,
      type: "raw-oil",
      title: row.title,
      farmerId: row.farmer_id,
      distilleryId: row.distillery_id,
      region: row.region,
      pricePerKg: Number(row.price_per_kg ?? 0),
      minOrderKg: Number(row.min_order_kg ?? 1),
      stockKg: Number(row.stock_kg ?? 0),
      grade: row.grade,
      sellMode: row.sell_mode,
      auctionEndsAt: row.auction_ends_at,
      highestBid: row.highest_bid ? Number(row.highest_bid) : null,
      imageUrl: row.image_url || "/images/products/minyak nilam.png",
      description: row.description,
      badges: ["AI Verified"],
      coa: coa
        ? {
            paLevel: Number(coa.pa_level ?? 0),
            acidNumber: Number(coa.acid_number ?? 0),
            density: Number(coa.density ?? 0),
            color: coa.color || "Coklat Muda",
            viscosity: coa.viscosity || "Sedang",
            method: coa.method || "NIRS-PLS AI",
            confidenceScore: Number(coa.confidence_score ?? 0),
            analyzedAt: coa.analyzed_at,
          }
        : {
            paLevel: 32,
            acidNumber: 3.5,
            density: 0.95,
            color: "Coklat Muda",
            viscosity: "Sedang",
            method: "NIRS-PLS AI",
            confidenceScore: 90,
            analyzedAt: row.listed_at || new Date().toISOString(),
          },
      listedAt: row.listed_at,
    };
  });

  const finishedProducts = (finishedRows ?? []).map((row) => {
    const coa = coaMap.get(row.coa_id ?? "");
    return {
      id: row.id,
      type: "finished-product",
      title: row.title,
      category: row.category,
      umkmId: row.umkm_id,
      price: Number(row.price ?? 0),
      unit: row.unit || "pcs",
      stock: Number(row.stock ?? 0),
      rating: Number(row.rating ?? 0),
      reviewCount: Number(row.review_count ?? 0),
      imageUrl: row.image_url || "/images/products/parfume1.png",
      gallery: row.gallery || [row.image_url || "/images/products/parfume1.png"],
      description: row.description,
      notes: {
        top: row.notes_top || [],
        middle: row.notes_middle || [],
        base: row.notes_base || [],
      },
      badges: ["AI Verified"],
      coa: coa
        ? {
            paLevel: Number(coa.pa_level ?? 0),
            acidNumber: Number(coa.acid_number ?? 0),
            density: Number(coa.density ?? 0),
            color: coa.color || "Coklat Muda",
            viscosity: coa.viscosity || "Sedang",
            method: coa.method || "NIRS-PLS AI",
            confidenceScore: Number(coa.confidence_score ?? 0),
            analyzedAt: coa.analyzed_at,
          }
        : {
            paLevel: 32,
            acidNumber: 3.5,
            density: 0.95,
            color: "Coklat Muda",
            viscosity: "Sedang",
            method: "NIRS-PLS AI",
            confidenceScore: 90,
            analyzedAt: row.created_at || new Date().toISOString(),
          },
      qrBatchId: row.qr_batch_id,
      sourcedFromRawOilId: row.sourced_from_raw_oil_id,
      traceability: [],
      createdAt: row.created_at,
    };
  });

  return { raw: rawProducts, finished: finishedProducts };
}

export async function getMarketplaceProductById(productId: string) {
  const supabase = await createSupabaseServerClient();

  const { data: rawRow } = await supabase
    .from("raw_oil_listings")
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  if (rawRow) {
    const { data: coaRow } = await supabase
      .from("coa_records")
      .select("*")
      .eq("id", rawRow.coa_id)
      .maybeSingle();

    return {
      id: rawRow.id,
      type: "raw-oil",
      title: rawRow.title,
      region: rawRow.region,
      pricePerKg: Number(rawRow.price_per_kg ?? 0),
      minOrderKg: Number(rawRow.min_order_kg ?? 1),
      description: rawRow.description,
      imageUrl: rawRow.image_url || "/images/products/minyak nilam.png",
      grade: rawRow.grade,
      badges: ["AI Verified"],
      coa: coaRow
        ? {
            paLevel: Number(coaRow.pa_level ?? 0),
            acidNumber: Number(coaRow.acid_number ?? 0),
            density: Number(coaRow.density ?? 0),
            color: coaRow.color || "Coklat Muda",
            viscosity: coaRow.viscosity || "Sedang",
            method: coaRow.method || "NIRS-PLS AI",
            confidenceScore: Number(coaRow.confidence_score ?? 0),
            analyzedAt: coaRow.analyzed_at,
          }
        : null,
    };
  }

  const { data: finishedRow } = await supabase
    .from("finished_products")
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  if (!finishedRow) return null;

  const { data: coaRow } = await supabase
    .from("coa_records")
    .select("*")
    .eq("id", finishedRow.coa_id)
    .maybeSingle();

  return {
    id: finishedRow.id,
    type: "finished-product",
    title: finishedRow.title,
    category: finishedRow.category,
    price: Number(finishedRow.price ?? 0),
    unit: finishedRow.unit || "pcs",
    stock: Number(finishedRow.stock ?? 0),
    rating: Number(finishedRow.rating ?? 0),
    reviewCount: Number(finishedRow.review_count ?? 0),
    imageUrl: finishedRow.image_url || "/images/products/parfume1.png",
    gallery: finishedRow.gallery || [finishedRow.image_url || "/images/products/parfume1.png"],
    description: finishedRow.description,
    notes: {
      top: finishedRow.notes_top || [],
      middle: finishedRow.notes_middle || [],
      base: finishedRow.notes_base || [],
    },
    badges: ["AI Verified"],
    coa: coaRow
      ? {
          paLevel: Number(coaRow.pa_level ?? 0),
          acidNumber: Number(coaRow.acid_number ?? 0),
          density: Number(coaRow.density ?? 0),
          color: coaRow.color || "Coklat Muda",
          viscosity: coaRow.viscosity || "Sedang",
          method: coaRow.method || "NIRS-PLS AI",
          confidenceScore: Number(coaRow.confidence_score ?? 0),
          analyzedAt: coaRow.analyzed_at,
        }
      : null,
  };
}
