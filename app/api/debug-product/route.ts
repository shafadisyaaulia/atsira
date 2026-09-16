import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  
  // Check the specific product
  const { data: product, error } = await supabase
    .from('finished_products')
    .select('id, qr_batch_id, title')
    .eq('id', '0be6d79e-b851-4fbe-a2c6-3c4e1c49e08a')
    .single();

  return NextResponse.json({ product, error });
}
