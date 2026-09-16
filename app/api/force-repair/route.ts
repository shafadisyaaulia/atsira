import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  
  // Try to update one specifically
  const { data, error } = await supabase
    .from('raw_oil_listings')
    .update({ qr_batch_id: 'ATSIRA-R001' })
    .eq('id', 'a1111111-1111-4111-8111-111111111111')
    .select(); // Add .select() to verify the update

  return NextResponse.json({ data, error });
}
