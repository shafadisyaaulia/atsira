const fs = require('fs');
let content = fs.readFileSync('app/dashboard/seller/pengadaan/page.tsx', 'utf8');

// Replace mock imports with supabase and store
content = content.replace(
  `import { RAW_OIL_LISTINGS } from "@/lib/mock/products";`,
  `import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";`
);

// Replace state and add fetch logic
content = content.replace(
  /export default function B2BSourcingPage\(\) \{[\s\S]*?\/\/ 2\. FILTER DATA PENCARIAN/m,
  `export default function B2BSourcingPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const { addItem } = useCartStore();
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_raw", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProductsList(data.map(item => ({
        id: item.id,
        title: item.title,
        price_per_kg: item.price,
        stock_kg: item.stock,
        farmerId: item.seller_id,
        farmerName: "Mitra Petani",
        region: "Aceh",
        pa_level: 30, // Mock
        isVerified: item.is_verified,
        minOrderKg: 5,
        imageUrl: item.image_url || "/images/products/minyak nilam.png"
      })));
    }
    setLoading(false);
  };

  // 2. FILTER DATA PENCARIAN`
);

// Replace RAW_OIL_LISTINGS.filter with productsList.filter
content = content.replace(
  /const filteredListings = RAW_OIL_LISTINGS\.filter/g,
  `const filteredListings = productsList.filter`
);

// Replace handleSubmitOrder
content = content.replace(
  /const handleSubmitOrder = \(\) => \{[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?\}, 1500\);\s*\};/m,
  `const handleSubmitOrder = () => {
    setIsSubmitting(true);
    addItem({
      productId: selectedProduct.id,
      title: selectedProduct.title,
      imageUrl: selectedProduct.imageUrl,
      price: selectedProduct.price_per_kg,
      qty: quantity,
      seller: selectedProduct.farmerId,
      unit: "kg"
    });
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(true);
      setTimeout(() => {
        router.push("/checkout");
      }, 1000);
    }, 1000);
  };`
);

fs.writeFileSync('app/dashboard/seller/pengadaan/page.tsx', content, 'utf8');
