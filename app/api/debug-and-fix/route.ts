import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const productId = '0be6d79e-b851-4fbe-a2c6-3c4e1c49e08a';

  // 1. Get exact record
  const { data: record, error: fetchError } = await supabase
    .from('finished_products')
    .select('*')
    .eq('id', productId)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: 'Fetch failed', details: fetchError });
  }

  // 2. Try update by using the exact record returned
  const { data, error } = await supabase
    .from('finished_products')
    .update({ qr_batch_id: 'ATSIRA-F001' })
    .match({ id: record.id })
    .select();

  return NextResponse.json({ record, data, error });
}
