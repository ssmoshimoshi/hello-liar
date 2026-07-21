import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import ShareButton from '@/components/ShareButton';

export default async function Gallery({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('Common');
  
  // Fetch only illustrated stories
  const { data: lies } = await supabase
    .from('lies')
    .select('*')
    .eq('illustrated', true)
    .order('illustration_created_at', { ascending: false });

  const displayLies = lies || [];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
      <header className="mb-16 md:mb-24 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-black mb-6">
          {t('galleryTitle')}
        </h1>
        <p className="text-[11px] uppercase tracking-[0.3em] font-sans" style={{ color: 'var(--gray-400)' }}>
          {t('gallerySubtitle')}
        </p>
      </header>

      {displayLies.length === 0 ? (
        <div className="text-center py-32 border border-[var(--gray-200)] bg-[var(--gray-100)]">
          <p className="text-[11px] uppercase tracking-[0.3em] font-sans" style={{ color: 'var(--gray-400)' }}>
            {locale === 'en' ? 'No illustrations yet.' : 'Belum ada ilustrasi.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {displayLies.map((lie) => {
            const content = locale === 'en' ? lie.content_en : lie.content_id;
            
            return (
              <article key={lie.id} className="group flex flex-col border border-[var(--gray-200)] transition-colors hover:border-foreground">
                <Link href={`/${locale}/read/${lie.id}`} className="block flex-grow">
                  <div className="w-full aspect-square relative overflow-hidden bg-[var(--gray-100)]">
                    {lie.illustration_url ? (
                      <img 
                        src={lie.illustration_url} 
                        alt="Story Illustration" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--gray-400)' }}>Missing Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-8">
                    <p className="text-lg md:text-xl font-serif leading-relaxed line-clamp-4 mb-8">
                      &ldquo;{content}&rdquo;
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--gray-100)]">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-living-coral)' }}>
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                        </svg>
                        <span className="text-[11px] font-sans font-bold tracking-[0.1em] text-foreground">
                          {lie.resonate_count}
                        </span>
                      </div>
                      <time 
                        className="text-[10px] font-sans tracking-[0.1em] uppercase"
                        style={{ color: 'var(--gray-400)' }}
                      >
                        {lie.illustration_created_at ? new Date(lie.illustration_created_at).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      </time>
                    </div>
                  </div>
                </Link>
                
                {/* Direct share button for gallery item */}
                <div className="px-8 pb-8 pt-0 z-10 relative">
                  <ShareButton 
                    lieId={lie.id} 
                    content={content} 
                    urlPath={`/${locale}/read/${lie.id}`} 
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
