import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  
  // 1. Tambah kolom qr_batch_id ke raw_oil_listings terlebih dahulu
  // (SQL ALTER TABLE harus dijalankan manual di dashboard, 
  // tapi saya akan mencoba menjalankan lewat supabase.rpc jika dimungkinkan, 
  // namun ini lebih aman di dashboard.)

  // Untuk sekarang, anggap sudah dijalankan ALTER TABLE... 
  // Jika script ini gagal, berarti kolom memang belum ada.

  const tables = ['finished_products', 'raw_oil_listings'];
  const results = [];

  for (const table of tables) {
    const { data: products, error } = await supabase.from(table).select('id');

    if (error) {
      results.push({ table, error: error.message });
      continue;
    }

    const tableUpdates = [];
    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        
        // Cek ID lama untuk menentukan suffix
        const suffix = table === 'finished_products' ? 'F' : 'R';
        const batchId = `ATSIRA-${suffix}${(i + 1).toString().padStart(3, '0')}`;
        
        const { error: updateError } = await supabase
            .from(table)
            .update({ qr_batch_id: batchId })
            .eq('id', p.id);
        
        if (updateError) {
          tableUpdates.push({ id: p.id, error: updateError.message });
        } else {
          tableUpdates.push({ id: p.id, batchId });
        }
    }
    results.push({ table, updatedCount: tableUpdates.filter(u => !u.error).length });
  }

  return NextResponse.json({ message: 'Migration completed', results });
}
