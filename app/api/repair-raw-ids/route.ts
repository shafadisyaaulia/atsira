import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const updates = [
    { id: 'a1111111-1111-4111-8111-111111111111', batchId: 'ATSIRA-R001' },
    { id: 'a1111111-1111-4111-8111-111111111112', batchId: 'ATSIRA-R002' },
    { id: 'a1111111-1111-4111-8111-111111111113', batchId: 'ATSIRA-R003' },
  ];

  const results = [];
  for (const update of updates) {
    const { error } = await supabase
      .from('raw_oil_listings')
      .update({ qr_batch_id: update.batchId })
      .eq('id', update.id);
    
    results.push({ id: update.id, error });
  }

  return NextResponse.json({ results });
}
