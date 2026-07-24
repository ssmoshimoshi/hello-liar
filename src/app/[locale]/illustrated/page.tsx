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
        <h1 
          className="text-5xl md:text-7xl font-medium tracking-tight mb-6 text-[var(--color-living-coral)]"
          style={{ fontFamily: 'var(--font-baskerville)' }}
        >
          {t('galleryTitle')}
        </h1>
        <p className="text-[11px] uppercase tracking-[0.3em] font-mono" style={{ color: 'var(--gray-400)' }}>
          {t('gallerySubtitle')}
        </p>
      </header>

      {displayLies.length === 0 ? (
        <div className="text-center py-32 border border-[var(--gray-300)] rounded-none">
          <p className="text-[11px] uppercase tracking-[0.3em] font-mono" style={{ color: 'var(--gray-500)' }}>
            {locale === 'en' ? 'No illustrations yet.' : 'Belum ada pameran.'}
          </p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {displayLies.map((lie) => {
            const content = locale === 'en' ? lie.content_en : lie.content_id;
            
            return (
              <article key={lie.id} className="group relative flex flex-col break-inside-avoid overflow-hidden cursor-pointer border border-transparent hover:border-[var(--color-living-coral)] transition-colors">
                <Link href={`/${locale}/read/${lie.id}`} className="block relative w-full h-full">
                  
                  {/* Image with Stark Grayscale to Color Effect */}
                  {lie.illustration_url ? (
                    <img 
                      src={lie.illustration_url} 
                      alt="Story Illustration" 
                      className="w-full h-auto object-cover grayscale contrast-125 transition-none group-hover:grayscale-0 group-hover:contrast-100"
                    />
                  ) : (
                    <div className="w-full aspect-square flex items-center justify-center bg-[var(--gray-100)]">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-mono" style={{ color: 'var(--gray-400)' }}>Missing Image</span>
                    </div>
                  )}
                  
                  {/* Hidden Text Overlay (Reveals on Hover instantly) */}
                  <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-none flex flex-col justify-between p-8 text-white">
                    <p 
                      className="text-lg md:text-xl leading-loose tracking-wide line-clamp-6 text-white"
                      style={{ fontFamily: 'var(--font-special-elite)' }}
                    >
                      &ldquo;{content}&rdquo;
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--gray-500)]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[var(--color-living-coral)]">
                          ECHOES
                        </span>
                        <span className="text-[11px] font-mono font-bold tracking-[0.1em] text-white">
                          {lie.resonate_count}
                        </span>
                      </div>
                      <time 
                        className="text-[10px] font-mono tracking-[0.1em] uppercase text-[var(--gray-400)]"
                      >
                        {lie.illustration_created_at ? new Date(lie.illustration_created_at).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      </time>
                    </div>
                  </div>
                </Link>
                
                {/* Direct share button for gallery item (Only visible on hover) */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 z-10">
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
