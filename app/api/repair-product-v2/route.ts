import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const productId = '0be6d79e-b851-4fbe-a2c6-3c4e1c49e08a';
  const newBatchId = 'ATSIRA-F999';

  // Try updating on 'products' instead, matching the app's pattern
  const { data, error } = await supabase
    .from('products')
    .update({ qr_batch_id: newBatchId })
    .eq('id', productId)
    .select();

  return NextResponse.json({ data, error });
}
