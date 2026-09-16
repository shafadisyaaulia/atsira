import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const productId = '0be6d79e-b851-4fbe-a2c6-3c4e1c49e08a';
  
  // Try update with match instead of eq just in case
  const { data, error } = await supabase
    .from('finished_products')
    .update({ qr_batch_id: 'ATSIRA-F001' })
    .match({ id: productId })
    .select();

  return NextResponse.json({ data, error });
}
