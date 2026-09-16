-- Tabel orders (diperbarui sesuai struktur API checkout)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    buyer_id UUID REFERENCES public.profiles(id),
    seller_id UUID REFERENCES public.profiles(id),
    buyer_name TEXT,
    order_type TEXT,
    subtotal NUMERIC,
    shipping_fee NUMERIC,
    tax NUMERIC,
    total NUMERIC,
    status TEXT DEFAULT 'Menunggu Pembayaran',
    payment_method TEXT,
    courier TEXT,
    tracking_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    title TEXT,
    qty INTEGER,
    unit TEXT,
    price NUMERIC
);

-- Buka akses RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can insert orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own orders" 
ON public.orders FOR UPDATE 
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can view their own order_items" 
ON public.order_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())));

CREATE POLICY "Users can insert order_items" 
ON public.order_items FOR INSERT 
WITH CHECK (true);
