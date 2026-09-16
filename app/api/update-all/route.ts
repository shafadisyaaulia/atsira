import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  
  // Coba update dengan query yang berbeda
  const { data, error } = await supabase
    .from('raw_oil_listings')
    .update({ qr_batch_id: 'TEST-123' })
    .neq('id', 'non-existent-id') // Update semua baris
    .select();

  return NextResponse.json({ data, error });
}
