const fs = require("fs");
let content = fs.readFileSync("lib/data/marketplace.ts", "utf8");

const oldFetch = `export async function getMarketplaceProducts() {
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

  const mappedRaw = (rawRows ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price_per_kg,
    category: "raw-oil",
    imageUrl: row.image_url || "/images/products/minyak nilam.png",
    seller: row.farmer_id || "Mitra Petani",
    location: row.region || "Aceh",
    rating: 4.8,
    sales: row.volume_sold_kg || 0,
    stock: row.volume_available_kg || 0,
    unit: "kg",
    isVerified: row.is_verified,
    badges: row.is_verified ? ["USK Verified", "100% Murni"] : [],
    coa: coaMap.get(row.coa_id) ? {
      paLevel: coaMap.get(row.coa_id).patchouli_alcohol,
      acidNumber: coaMap.get(row.coa_id).acid_number,
      color: coaMap.get(row.coa_id).color,
      method: "NIRS-PLS (Atsira QualitySense)"
    } : null,
  }));

  const mappedFinished = (finishedRows ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    category: "finished-product",
    imageUrl: row.image_url || "/images/products/parfume1.png",
    seller: row.brand_name || "UMKM Binaan",
    location: "Banda Aceh",
    rating: 4.9,
    sales: row.stock ? Math.floor(row.stock / 2) : 0,
    stock: row.stock || 0,
    unit: "pcs",
    isVerified: true,
    badges: ["Premium Quality"],
    coa: null,
  }));

  return [...mappedRaw, ...mappedFinished];
}

export async function getMarketplaceProductById(id: string) {
  const allProducts = await getMarketplaceProducts();
  return allProducts.find((p) => p.id === id) || null;
}`;

const newFetch = `export async function getMarketplaceProducts() {
  const supabase = await createSupabaseServerClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Gagal mengambil produk dari Supabase");
  }

  const mappedProducts = (products ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    category: row.is_raw ? "raw-oil" : "finished-product",
    imageUrl: row.image_url || (row.is_raw ? "/images/products/minyak nilam.png" : "/images/products/parfume1.png"),
    seller: row.seller_id || (row.is_raw ? "Mitra Petani" : "UMKM Binaan"),
    location: row.is_raw ? "Aceh" : "Banda Aceh",
    rating: 4.8,
    sales: row.is_raw ? 15 : 120,
    stock: row.stock || 0,
    unit: row.unit || (row.is_raw ? "kg" : "pcs"),
    isVerified: row.is_verified ?? true,
    badges: row.is_raw ? (row.is_verified ? ["USK Verified", "100% Murni"] : []) : ["Premium Quality"],
    coa: row.is_raw ? {
      paLevel: 32.5, // Mock COA for now
      acidNumber: 3.4,
      color: "Coklat Terang",
      method: "NIRS-PLS (Atsira QualitySense)"
    } : null,
  }));

  return mappedProducts;
}

export async function getMarketplaceProductById(id: string) {
  const allProducts = await getMarketplaceProducts();
  return allProducts.find((p) => p.id === id) || null;
}`;

content = content.replace(oldFetch, newFetch);
fs.writeFileSync("lib/data/marketplace.ts", content, "utf8");
console.log("Fixed marketplace data fetching");
