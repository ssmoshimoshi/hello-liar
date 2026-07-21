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
        {/* Sort Tabs */}
        <div className="mb-12 flex flex-wrap gap-4 border-b pb-4" style={{ borderColor: 'var(--gray-200)' }}>
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
              className={`text-[11px] font-sans uppercase tracking-[0.2em] transition-colors ${
                sort === tab.id 
                  ? 'text-foreground font-bold' 
                  : 'text-[var(--gray-400)] hover:text-[var(--gray-800)]'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="space-y-0">
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
                className="group border-b py-12 md:py-16 transition-colors"
                style={{ borderColor: 'var(--gray-100)' }}
              >
                <Link href={`/${locale}/read/${lie.id}`} className="block">
                  {/* Top Meta Row */}
                  <div className="flex items-center justify-between mb-6">
                    <span 
                      className="text-[11px] font-sans uppercase tracking-[0.3em]"
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
                  <p className="text-xl md:text-3xl lg:text-4xl leading-relaxed md:leading-[1.4] font-serif transition-transform duration-700 group-hover:translate-x-2">
                    &ldquo;{content}&rdquo;
                  </p>

                  {/* Bottom Metrics Row */}
                  <div className="mt-8 flex items-center gap-6 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-living-coral)' }}>
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                      </svg>
                      <span className="text-[11px] font-sans font-bold tracking-[0.1em] text-foreground">
                        {lie.resonate_count}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gray-400)' }}>
                        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                      </svg>
                      <span className="text-[11px] font-sans tracking-[0.1em]" style={{ color: 'var(--gray-400)' }}>
                        {lie.doubt_count}
                      </span>
                    </div>

                    <time 
                      className="text-[10px] font-sans tracking-[0.1em] uppercase ml-auto"
                      style={{ color: 'var(--gray-400)' }}
                    >
                      {new Date(lie.created_at).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
                    </time>
                  </div>
                </Link>
              </article>
            );
          })}

          {displayLies.length === 0 && (
            <div className="py-32 text-center">
              <p className="font-sans tracking-[0.3em] uppercase text-[11px] mb-8" style={{ color: 'var(--gray-400)' }}>
                {locale === 'en' ? 'No stories found.' : 'Tidak ada cerita ditemukan.'}
              </p>
              <Link 
                href={`/${locale}/write`}
                className="inline-block py-4 px-8 border-2 border-foreground font-sans font-bold uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-foreground hover:text-background"
              >
                {t('navWrite')}
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
