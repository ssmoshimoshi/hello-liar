import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function AdminDashboard({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('Common');
  
  // Fetch all stories for metrics and categorization
  const { data: lies } = await supabase
    .from('lies')
    .select('*')
    .order('resonate_count', { ascending: false });

  const allLies = lies || [];
  
  // Categorize
  const pendingLies = allLies.filter(l => !l.illustrated && l.resonate_count >= 20 && l.resonate_count < 25);
  const readyLies = allLies.filter(l => !l.illustrated && l.resonate_count >= 25);
  const publishedLies = allLies.filter(l => l.illustrated);
  
  // Metrics
  const totalSubmissions = allLies.length;
  const totalIllustrated = publishedLies.length;
  const avgResonance = totalSubmissions > 0 
    ? Math.round(allLies.reduce((acc, l) => acc + l.resonate_count, 0) / totalSubmissions) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      <header className="mb-16 border-b border-[var(--gray-200)] pb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-black mb-4">
          {t('adminTitle')}
        </h1>
        <p className="text-[11px] uppercase tracking-[0.2em] font-sans" style={{ color: 'var(--gray-400)' }}>
          Private Access
        </p>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="p-8 border border-[var(--gray-200)] bg-[var(--gray-100)]">
          <p className="text-[10px] font-sans uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--gray-500)' }}>Total Submissions</p>
          <p className="text-4xl font-serif">{totalSubmissions}</p>
        </div>
        <div className="p-8 border border-[var(--color-living-coral)] bg-transparent">
          <p className="text-[10px] font-sans uppercase tracking-[0.2em] mb-4 text-[var(--color-living-coral)]">Stories Illustrated</p>
          <p className="text-4xl font-serif text-[var(--color-living-coral)]">{totalIllustrated}</p>
        </div>
        <div className="p-8 border border-[var(--gray-200)] bg-transparent">
          <p className="text-[10px] font-sans uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--gray-500)' }}>Avg Resonance</p>
          <p className="text-4xl font-serif">{avgResonance}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Column: Ready & Pending */}
        <div className="space-y-16">
          
          {/* READY SECTION */}
          <section>
            <h2 className="text-[11px] font-sans uppercase tracking-[0.2em] mb-8 font-bold flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-[var(--color-living-coral)]"></span>
              {t('adminReady')}
            </h2>
            
            <div className="space-y-4">
              {readyLies.length === 0 ? (
                <p className="text-[11px] font-sans" style={{ color: 'var(--gray-400)' }}>No stories ready for illustration yet.</p>
              ) : (
                readyLies.map(lie => (
                  <div key={lie.id} className="p-6 border border-[var(--color-living-coral)] bg-[rgba(252,118,106,0.05)] transition-colors hover:bg-[rgba(252,118,106,0.1)] flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                    <div className="flex-grow">
                      <p className="text-[10px] font-sans font-mono mb-2" style={{ color: 'var(--gray-500)' }}>{lie.id}</p>
                      <p className="font-serif line-clamp-2 leading-relaxed">&ldquo;{locale === 'en' ? lie.content_en : lie.content_id}&rdquo;</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-[10px] font-sans font-bold text-[var(--color-living-coral)]">❤️ {lie.resonate_count}</span>
                        <span className="text-[10px] font-sans" style={{ color: 'var(--gray-400)' }}>✗ {lie.doubt_count}</span>
                      </div>
                    </div>
                    <Link 
                      href={`/${locale}/admin/upload?id=${lie.id}`}
                      className="whitespace-nowrap px-6 py-3 bg-[var(--color-living-coral)] text-white text-[10px] font-sans uppercase tracking-[0.1em] font-bold hover:bg-foreground transition-colors"
                    >
                      {t('btnIllustrate')}
                    </Link>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* PENDING SECTION */}
          <section>
            <h2 className="text-[11px] font-sans uppercase tracking-[0.2em] mb-8 font-bold flex items-center gap-4" style={{ color: 'var(--gray-500)' }}>
              <span className="w-2 h-2 rounded-full bg-[var(--gray-300)]"></span>
              {t('adminPending')}
            </h2>
            
            <div className="space-y-4">
              {pendingLies.length === 0 ? (
                <p className="text-[11px] font-sans" style={{ color: 'var(--gray-400)' }}>No pending stories.</p>
              ) : (
                pendingLies.map(lie => (
                  <div key={lie.id} className="p-6 border border-[var(--gray-200)] bg-transparent">
                    <p className="text-[10px] font-sans font-mono mb-2" style={{ color: 'var(--gray-500)' }}>{lie.id}</p>
                    <p className="font-serif line-clamp-1 leading-relaxed opacity-80">&ldquo;{locale === 'en' ? lie.content_en : lie.content_id}&rdquo;</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-[10px] font-sans font-bold text-foreground">❤️ {lie.resonate_count}/25</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>

        {/* Right Column: Published */}
        <div className="space-y-16">
          <section>
            <h2 className="text-[11px] font-sans uppercase tracking-[0.2em] mb-8 font-bold flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-foreground"></span>
              {t('adminPublished')}
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {publishedLies.length === 0 ? (
                <p className="text-[11px] font-sans col-span-2" style={{ color: 'var(--gray-400)' }}>No illustrations published yet.</p>
              ) : (
                publishedLies.map(lie => (
                  <Link key={lie.id} href={`/${locale}/read/${lie.id}`} className="group block border border-[var(--gray-200)] transition-colors hover:border-foreground">
                    <div className="aspect-square bg-[var(--gray-100)] overflow-hidden">
                      {lie.illustration_url && (
                        <img 
                          src={lie.illustration_url} 
                          alt="Thumbnail" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                    </div>
                    <div className="p-4 border-t border-[var(--gray-200)]">
                      <p className="text-[9px] font-sans font-bold mb-1 text-foreground">❤️ {lie.resonate_count}</p>
                      <time className="text-[8px] font-sans uppercase tracking-[0.1em]" style={{ color: 'var(--gray-400)' }}>
                        {lie.illustration_created_at ? new Date(lie.illustration_created_at).toLocaleDateString(locale) : ''}
                      </time>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
