import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Clock } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, Badge } from "@/components/ui/Card";
import { MAGAZINE_ARTICLES, formatDateID } from "@/lib/mock";

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = MAGAZINE_ARTICLES.find((a) => a.slug === slug);
  if (!article) return notFound();

  const related = MAGAZINE_ARTICLES.filter((a) => a.slug !== slug && a.category === article.category).slice(0, 2);

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
          <span>{article.authorRole}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.readMinutes} menit
          </span>
        </div>

        <div className="aspect-[16/9] rounded-md overflow-hidden mb-10">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose-content space-y-5 mb-12">
          {article.content.map((para, i) => (
            <p key={i} className="text-body-lg text-on-surface-variant leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        <p className="text-xs text-outline mb-12">Dipublikasikan {formatDateID(article.publishedAt)}</p>

        {related.length > 0 && (
          <div className="border-t border-surface-container-high pt-10">
            <p className="font-display text-headline-md text-primary mb-6">Artikel Terkait</p>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map((a) => (
                <Link key={a.slug} href={`/magazine/${a.slug}`}>
                  <Card className="overflow-hidden h-full hover:shadow-elevation-2 transition-shadow">
                    <div className="aspect-[16/10]">
                      <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover" />
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
