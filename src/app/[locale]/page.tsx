import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  const { data: lies } = await supabase
    .from('lies')
    .select('*')
    .order('created_at', { ascending: false });

  const displayLies = lies || [];

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12">
      {/* Hero / Editorial Header */}
      <header className="py-20 md:py-32 border-b" style={{ borderColor: 'var(--gray-200)' }}>
        <p 
          className="text-[11px] uppercase tracking-[0.3em] mb-6 font-sans"
          style={{ color: 'var(--gray-400)' }}
        >
          {locale === 'en' ? 'Anonymous Confessions' : 'Pengakuan Anonim'}
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black leading-[1.1] tracking-tight max-w-3xl">
          {locale === 'en' 
            ? 'Everyone lies. Some just write it down.' 
            : 'Semua orang berbohong. Beberapa menuliskannya.'
          }
        </h1>
        <div className="editorial-rule mt-10" />
      </header>

      {/* Stories Feed */}
      <section className="py-16 md:py-24">
        <div className="space-y-0">
          {displayLies.map((lie, index) => {
            const content = locale === 'en' ? lie.content_en : lie.content_id;
            const isDestroyed = lie.doubt_count > 50;

            return (
              <article 
                key={lie.id} 
                className="group border-b py-12 md:py-16 transition-colors"
                style={{ borderColor: 'var(--gray-100)' }}
              >
                <Link href={`/${locale}/read/${lie.id}`} className="block">
                  {/* Issue number */}
                  <span 
                    className="text-[11px] font-sans uppercase tracking-[0.3em] mb-4 block"
                    style={{ color: 'var(--gray-400)' }}
                  >
                    Nᵒ {String(index + 1).padStart(2, '0')}
                  </span>
                  
                  {/* Story text */}
                  <p 
                    className={`text-xl md:text-3xl lg:text-4xl leading-relaxed md:leading-[1.4] font-serif transition-all duration-700
                      ${isDestroyed 
                        ? 'line-through decoration-[var(--color-living-coral)] decoration-2' 
                        : 'group-hover:translate-x-2'
                      }
                    `}
                    style={isDestroyed ? { color: 'var(--gray-300)' } : {}}
                  >
                    &ldquo;{content}&rdquo;
                  </p>

                  {/* Meta row */}
                  <div 
                    className="mt-6 flex items-center gap-4 text-[10px] font-sans tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ color: 'var(--gray-400)' }}
                  >
                    <time>{new Date(lie.created_at).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}</time>
                    <span style={{ color: 'var(--gray-300)' }}>—</span>
                    <span>{lie.doubt_count} {locale === 'en' ? 'doubts' : 'keraguan'}</span>
                    {isDestroyed && (
                      <>
                        <span style={{ color: 'var(--gray-300)' }}>—</span>
                        <span className="text-[var(--color-living-coral)] font-bold">
                          {locale === 'en' ? 'DESTROYED' : 'HANCUR'}
                        </span>
                      </>
                    )}
                  </div>
                </Link>
              </article>
            );
          })}

          {displayLies.length === 0 && (
            <div className="py-32 text-center">
              <p className="font-sans tracking-[0.3em] uppercase text-[11px] mb-8" style={{ color: 'var(--gray-400)' }}>
                {locale === 'en' ? 'No lies yet. Be the first.' : 'Belum ada kebohongan. Jadilah yang pertama.'}
              </p>
              <Link 
                href={`/${locale}/write`}
                className="inline-block py-4 px-8 border-2 border-foreground font-sans font-bold uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-foreground hover:text-background"
              >
                {locale === 'en' ? 'Confess' : 'Buat Pengakuan'}
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
