import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  
  // Periksa tabel traceability_logs untuk batch_code tertentu
  const { data, error } = await supabase
    .from('traceability_logs')
    .select('batch_code, product_name')
    .ilike('batch_code', 'atSira-F005');

  return NextResponse.json({ data, error });
}
