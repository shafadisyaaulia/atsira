import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { MAGAZINE_ARTICLES } from "@/lib/mock/ecosystem";

/**
 * GET /api/pemasta/field-stories
 * Fetch field stories dokumentasi kegiatan kebun dari PEMASTA role
 */
export async function GET() {
  try {
    // Gunakan mock data langsung agar gambar & artikel selalu tampil dengan benar.
    // Supabase field_stories belum di-seed dengan data lengkap.
    const fallbackData = MAGAZINE_ARTICLES.map((m) => ({
      id: m.slug,
      slug: m.slug,
      title: m.title,
      category: m.category,
      excerpt: m.excerpt,
      content: m.content,
      author: m.author,
      author_role: m.authorRole,
      published_at: m.publishedAt,
      read_minutes: m.readMinutes,
      image_url: m.imageUrl,
      featured: m.featured,
    }));
    return NextResponse.json({ data: fallbackData }, { status: 200 });

    // ── Aktifkan kembali jika Supabase sudah di-seed ──────────────────────────
    // const supabase = await createSupabaseServerClient();
    // const { data, error } = await supabase
    //   .from("field_stories")
    //   .select("*")
    //   .order("published_at", { ascending: false });
    // if (error || !data || data.length === 0) {
    //   return NextResponse.json({ data: fallbackData }, { status: 200 });
    // }
    // return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/pemasta/field-stories
 * Submit field story baru dari Pemasta.
 *
 * Body (JSON):
 *   title        string   — judul kegiatan / rembug
 *   category     string   — kategori cerita
 *   description  string   — narasi/excerpt cerita
 *   author       string   — nama penulis / kelompok
 *   authorRole   string   — peran penulis (misal "Pemasta Node")
 *   region       string?  — wilayah farm (farm_region enum), opsional
 *   imageBase64  string?  — konten file gambar dalam format base64 data URI
 *   imageFileName string? — nama file asli (untuk menentukan MIME type & ekstensi)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      category,
      description,
      author,
      authorRole,
      region,
      imageBase64,
      imageFileName,
    }: {
      title: string;
      category: string;
      description: string;
      author?: string;
      authorRole?: string;
      region?: string;
      imageBase64?: string;
      imageFileName?: string;
    } = body;

    if (!title || !category || !description) {
      return NextResponse.json(
        { error: "Field wajib: title, category, description" },
        { status: 400 }
      );
    }

    // Gunakan service role key untuk Storage upload (anon key tidak bisa upload)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // ── 1. Upload gambar ke Supabase Storage (opsional) ──────────────────────
    let imageUrl: string | null = null;

    if (imageBase64 && imageFileName) {
      // imageBase64 dikirim sebagai data URI: "data:<mime>;base64,<data>"
      const matches = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json(
          { error: "Format imageBase64 tidak valid. Harus berupa data URI." },
          { status: 400 }
        );
      }

      const mimeType = matches[1]; // misal "image/jpeg"
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      // Buat path unik agar tidak collision antar upload
      const ext = imageFileName.split(".").pop() ?? "jpg";
      const timestamp = Date.now();
      const safeName = imageFileName
        .replace(/[^a-zA-Z0-9.\-_]/g, "_")
        .replace(/\.[^.]+$/, ""); // strip extension
      const storagePath = `stories/${timestamp}-${safeName}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("field-story-images")
        .upload(storagePath, buffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        // Tidak fatal — lanjutkan tanpa gambar daripada gagal total
        imageUrl = null;
      } else {
        // Ambil URL publik dari bucket
        const { data: publicUrlData } = supabase.storage
          .from("field-story-images")
          .getPublicUrl(storagePath);
        imageUrl = publicUrlData.publicUrl;
      }
    }

    // ── 2. Generate slug unik dari title ─────────────────────────────────────
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60);
    const slug = `${baseSlug}-${Date.now()}`;

    // ── 3. Insert ke tabel field_stories ─────────────────────────────────────
    const { data, error } = await supabase
      .from("field_stories")
      .insert([
        {
          slug,
          title,
          category,
          excerpt: description,
          content: [description],
          author: author || "Pemasta atSira",
          author_role: authorRole || "Pemasta Node",
          author_user_id: null, // TODO: sambungkan ke auth session saat login diimplementasikan
          region: region || null,
          published_at: new Date().toISOString().split("T")[0],
          read_minutes: Math.max(1, Math.ceil(description.split(" ").length / 200)),
          image_url: imageUrl,
          featured: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting field story:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error in POST /api/pemasta/field-stories:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

