import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  
  // Coba filter berdasarkan id yang benar (coba tanpa .eq dulu untuk lihat semua)
  const { data, error } = await supabase
    .from('raw_oil_listings')
    .select('id, title, qr_batch_id');

  return NextResponse.json({ data, error, count: data?.length });
}
