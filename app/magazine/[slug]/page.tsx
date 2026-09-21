"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, Badge } from "@/components/ui/Card";

import { MAGAZINE_ARTICLES } from "@/lib/mock/ecosystem";

const formatDateID = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
};

export default function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>("");
  const [article, setArticle] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unwrapParams = async () => {
      const { slug: resolvedSlug } = await params;
      setSlug(resolvedSlug);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    // Direct match from mock first
    const mockFound = MAGAZINE_ARTICLES.find((a) => a.slug === slug);
    if (mockFound) {
      setArticle({
        ...mockFound,
        imageUrl: mockFound.imageUrl,
        publishedAt: mockFound.publishedAt,
        readMinutes: mockFound.readMinutes,
      });
      setRelated(
        MAGAZINE_ARTICLES.filter((a) => a.slug !== slug).slice(0, 2)
      );
      setLoading(false);
    }

    const fetchArticle = async () => {
      try {
        const res = await fetch("/api/pemasta/field-stories");
        const json = await res.json();
        const articles = (json.data || []).map((a: any) => ({
          ...a,
          imageUrl: a.image_url ?? a.imageUrl ?? "/images/nilamstory-card.jpg",
          publishedAt: a.published_at ?? a.publishedAt ?? "",
          readMinutes: a.read_minutes ?? a.readMinutes ?? 3,
          authorRole: a.author_role ?? a.authorRole ?? "",
        }));

        const found = articles.find((a: any) => a.slug === slug);
        if (found) {
          setArticle(found);
          const relatedArticles = articles
            .filter((a: any) => a.slug !== slug)
            .slice(0, 2);
          setRelated(relatedArticles);
        } else if (!mockFound) {
          notFound();
        }
      } catch (err) {
        console.error("Failed to fetch article:", err);
        if (!mockFound) notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <PageShell>
        <article className="container-app py-8 max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-surface-container-high rounded w-24"></div>
            <div className="h-8 bg-surface-container-high rounded w-3/4"></div>
            <div className="h-96 bg-surface-container-high rounded"></div>
          </div>
        </article>
      </PageShell>
    );
  }

  if (!article) {
    return notFound();
  }

  return (
    <PageShell>
      <article className="container-app py-8 max-w-3xl">
        <Link href="/magazine" className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary mb-6">
          <ChevronLeft className="w-4 h-4" /> Kembali ke Majalah
        </Link>

        <Badge variant="neutral" className="mb-4">
          {article.category}
        </Badge>
        <h1 className="font-display text-headline-lg-mobile lg:text-headline-lg text-primary mb-4 text-balance">{article.title}</h1>
        <div className="flex items-center gap-3 text-sm text-on-surface-variant mb-8">
          <span className="font-medium text-on-surface">{article.author}</span>
          <span>·</span>
          <span>{article.author_role || article.authorRole}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.read_minutes || article.readMinutes} menit
          </span>
        </div>

        <div className="aspect-[16/9] rounded-md overflow-hidden mb-10">
          <img src={article.image_url || article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose-content space-y-5 mb-12">
          {(article.content || []).map((para: string, i: number) => (
            <p key={i} className="text-body-lg text-on-surface-variant leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        <p className="text-xs text-outline mb-12">Dipublikasikan {formatDateID(article.published_at || article.publishedAt)}</p>

        {related.length > 0 && (
          <div className="border-t border-surface-container-high pt-10">
            <p className="font-display text-headline-md text-primary mb-6">Artikel Terkait</p>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map((a: any) => (
                <Link key={a.slug} href={`/magazine/${a.slug}`}>
                  <Card className="overflow-hidden h-full hover:shadow-elevation-2 transition-shadow">
                    <div className="aspect-[16/10]">
                      <img src={a.image_url || a.imageUrl} alt={a.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-sm text-on-surface line-clamp-2">{a.title}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </PageShell>
  );
}
