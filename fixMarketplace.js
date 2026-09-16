const fs = require("fs");
let content = fs.readFileSync("app/marketplace/page.tsx", "utf8");

const oldFetch = `      const loadProducts = async () => {
        const supabase = createSupabaseBrowserClient();
        const [{ data: rawData }, { data: finishedData }] = await Promise.all([
          supabase.from("raw_oil_listings").select("*, coa_records(*)").order("listed_at", { ascending: false }),
          supabase.from("finished_products").select("*, coa_records(*)").order("created_at", { ascending: false }),
        ]);

        const mappedRaw = (rawData ?? []).map((p) => ({
          id: p.id,
          title: p.title,
          category: "raw-oil",
          price: p.price_per_kg,
          unit: "kg",
          imageUrl: p.image_url || "/images/products/minyak nilam.png",
          seller: p.farmer_id || "Mitra Petani",
          location: p.region || "Aceh",
          isVerified: p.is_verified,
          rating: 4.8,
          sales: p.volume_sold_kg || 0,
        }));

        const mappedFinished = (finishedData ?? []).map((p) => ({
          id: p.id,
          title: p.title,
          category: "finished-product",
          price: p.price,
          unit: "pcs",
          imageUrl: p.image_url || "/images/products/parfume1.png",
          seller: p.brand_name || "UMKM Binaan",
          location: "Banda Aceh",
          isVerified: true,
          rating: 4.9,
          sales: p.stock || 120,
        }));

        setAllProducts([...mappedRaw, ...mappedFinished]);
      };`;

const newFetch = `      const loadProducts = async () => {
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error || !data) return;

        const mappedProducts = data.map((p) => ({
          id: p.id,
          title: p.title,
          category: p.is_raw ? "raw-oil" : "finished-product",
          price: p.price,
          unit: p.unit || (p.is_raw ? "kg" : "pcs"),
          imageUrl: p.image_url || (p.is_raw ? "/images/products/minyak nilam.png" : "/images/products/parfume1.png"),
          seller: p.seller_id || (p.is_raw ? "Mitra Petani" : "UMKM Binaan"),
          location: p.is_raw ? "Aceh" : "Banda Aceh",
          isVerified: p.is_verified ?? true,
          rating: 4.8,
          sales: p.is_raw ? 15 : 120,
        }));

        setAllProducts(mappedProducts);
      };`;

content = content.replace(oldFetch, newFetch);
fs.writeFileSync("app/marketplace/page.tsx", content, "utf8");
console.log("Fixed marketplace fetch");
