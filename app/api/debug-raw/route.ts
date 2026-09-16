import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  
  // check raw items
  const { data, error } = await supabase
    .from('raw_oil_listings')
    .select('id, qr_batch_id, title');

  return NextResponse.json({ data, error });
}
