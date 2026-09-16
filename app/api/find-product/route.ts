import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const productId = '0be6d79e-b851-4fbe-a2c6-3c4e1c49e08a';

  const { data: foundInFinished, error: errorFinished } = await supabase
    .from('finished_products')
    .select('id')
    .eq('id', productId)
    .single();

  const { data: foundInRaw, error: errorRaw } = await supabase
    .from('raw_oil_listings')
    .select('id')
    .eq('id', productId)
    .single();

  return NextResponse.json({
    foundInFinished: !!foundInFinished,
    foundInRaw: !!foundInRaw,
    errorFinished,
    errorRaw
  });
}
