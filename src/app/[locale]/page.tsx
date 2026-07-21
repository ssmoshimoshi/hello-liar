import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function Home({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { locale } = await params;
  const { sort = 'recent' } = await searchParams;
  const t = await getTranslations('Common');
  
  let query = supabase.from('lies').select('*');

  // Sorting logic based on PRD
  switch (sort) {
    case 'resonance':
      query = query.order('resonate_count', { ascending: false });
      break;
    case 'doubt':
      query = query.order('doubt_count', { ascending: false });
      break;
    case 'illustrated':
      query = query.eq('illustrated', true).order('illustration_created_at', { ascending: false });
      break;
    case 'pending':
      query = query.eq('illustrated', false).gte('resonate_count', 20).order('resonate_count', { ascending: false });
      break;
    case 'recent':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const { data: lies } = await query;
  const displayLies = lies || [];

  return (
    <div className="w-full h-[100dvh] overflow-y-scroll snap-y snap-mandatory hide-scrollbar relative">
      
      {/* Fixed Filter Dropdown (Moved to Top Right) */}
      <div className="fixed top-6 right-6 z-50">
        <details className="relative group">
          <summary 
            className="list-none cursor-pointer p-2 flex items-center justify-center rounded-full bg-background/50 backdrop-blur-md border border-[var(--gray-200)] text-[var(--gray-500)] transition-colors hover:text-foreground hover:border-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>
            </svg>
          </summary>
          <div 
            className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-md shadow-xl z-50 py-2 flex flex-col"
            style={{ borderColor: 'var(--gray-200)' }}
          >
            {[
              { id: 'recent', label: t('sortRecent') },
              { id: 'resonance', label: t('sortResonance') },
              { id: 'doubt', label: t('sortDoubt') },
              { id: 'illustrated', label: t('sortIllustrated') },
              { id: 'pending', label: t('sortPending') }
            ].map(tab => (
              <Link 
                key={tab.id}
                href={`/${locale}?sort=${tab.id}`}
                className={`px-4 py-2 text-[10px] font-sans uppercase tracking-[0.2em] transition-colors ${
                  sort === tab.id 
                    ? 'text-foreground font-bold bg-[var(--gray-100)]' 
                    : 'text-[var(--gray-500)] hover:text-foreground hover:bg-[var(--gray-100)]'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </details>
      </div>

      {/* Stories Feed */}
      <div className="w-full flex flex-col">
          {displayLies.map((lie) => {
            const content = locale === 'en' ? lie.content_en : lie.content_id;
            
            // Status Badges Logic
            let badgeText = '';
            let badgeStyle = {};
            
            if (lie.illustrated) {
              badgeText = t('badgeIllustrated');
              badgeStyle = { background: 'var(--foreground)', color: 'var(--background)' };
            } else if (lie.resonate_count >= 20) {
              badgeText = `${t('badgePending')} (${lie.resonate_count}/25)`;
              badgeStyle = { border: '1px solid var(--color-living-coral)', color: 'var(--color-living-coral)' };
            } else if (lie.doubt_count > lie.resonate_count && lie.doubt_count > 5) {
              badgeText = t('badgeHighDoubt');
              badgeStyle = { background: 'var(--gray-200)', color: 'var(--gray-500)' };
            } else if (lie.resonate_count > 10 && lie.resonate_count > lie.doubt_count * 2) {
              badgeText = t('badgeTrending');
              badgeStyle = { background: 'var(--color-living-coral)', color: 'white' };
            }

            return (
              <article 
                key={lie.id} 
                className="snap-center w-full h-[100dvh] flex flex-col items-center justify-center px-6 md:px-12 relative group"
              >
                <Link href={`/${locale}/read/${lie.id}`} className="w-full max-w-4xl flex flex-col items-center text-center">
                  {/* Top Meta Row */}
                  <div className="flex items-center justify-center gap-4 mb-8 opacity-60">
                    <span 
                      className="text-[10px] font-mono uppercase tracking-[0.4em]"
                      style={{ color: 'var(--gray-400)' }}
                    >
                      Nᵒ {lie.id.slice(0, 8)}
                    </span>
                    
                    {badgeText && (
                      <span 
                        className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] px-2 py-1"
                        style={badgeStyle}
                      >
                        {badgeText}
                      </span>
                    )}
                  </div>
                  
                  {/* Story text */}
                  <p className="text-3xl md:text-4xl lg:text-5xl leading-tight md:leading-tight font-discipline transition-transform duration-700 group-hover:scale-105 break-words break-all text-[var(--foreground)]">
                    &ldquo;{content}&rdquo;
                  </p>

                  {/* Bottom Metrics Row */}
                  <div className="mt-12 flex items-center justify-center gap-6 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-living-coral)' }}>
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                      </svg>
                      <span className="text-[10px] font-mono tracking-widest text-foreground">
                        {lie.resonate_count}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gray-400)' }}>
                        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                      </svg>
                      <span className="text-[10px] font-mono tracking-widest" style={{ color: 'var(--gray-400)' }}>
                        {lie.doubt_count}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}

          {displayLies.length === 0 && (
            <div className="snap-center w-full h-[100dvh] flex flex-col items-center justify-center px-6">
              <p className="font-mono tracking-[0.3em] uppercase text-[11px] mb-8" style={{ color: 'var(--gray-400)' }}>
                {locale === 'en' ? 'No stories found.' : 'Tidak ada cerita ditemukan.'}
              </p>
              <Link 
                href={`/${locale}/write`}
                className="inline-block py-4 px-8 border-2 border-[var(--gray-200)] text-[var(--gray-500)] font-sans font-bold uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-foreground hover:text-background hover:border-foreground"
              >
                {t('navWrite')}
              </Link>
            </div>
          )}
      </div>
    </div>
  );
}
