import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const productId = '0be6d79e-b851-4fbe-a2c6-3c4e1c49e08a';
  const newBatchId = 'atSira-F999';

  // Attempting update directly on the physical table
  const { data, error } = await supabase
    .from('finished_products')
    .update({ qr_batch_id: newBatchId })
    .eq('id', productId)
    .select();

  return NextResponse.json({ data, error });
}
