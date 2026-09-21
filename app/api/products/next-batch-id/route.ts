import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const grade = searchParams.get('grade'); // Contoh: "Grade A"

  if (!grade) return NextResponse.json({ error: 'Grade required' }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  
  // Hitung jumlah produk dengan grade yang sama
  const { count, error } = await supabase
    .from('finished_products')
    .select('id', { count: 'exact', head: true })
    .eq('coaSnapshot->grade', grade); // Asumsi filter berdasarkan JSONB atau kolom grade

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const seq = (count! + 1).toString().padStart(2, '0');
  const gradeChar = grade === 'Grade A' ? 'A' : grade === 'Grade B' ? 'B' : 'C';

  return NextResponse.json({ batchId: `atSira-${gradeChar}${seq}` });
}
