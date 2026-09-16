import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const productId = 'a1111111-1111-4111-8111-111111111111';
  
  const { data, error } = await supabase
    .from('raw_oil_listings')
    .select('id, qr_batch_id, title')
    .eq('id', productId)
    .single();

  return NextResponse.json({ data, error });
}
