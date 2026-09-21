import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  
  // Try to update using a service role if available, or just standard update
  // The fact that it returns [] and no error suggests RLS is blocking the UPDATE.
  // We need to verify if the user has permission to update these rows.
  // Or, the RLS policy for UPDATE might just not exist or be restrictive.

  const { data, error } = await supabase
    .from('raw_oil_listings')
    .update({ qr_batch_id: 'atSira-R001' })
    .eq('id', 'a1111111-1111-4111-8111-111111111111');
    
  return NextResponse.json({ data, error });
}
