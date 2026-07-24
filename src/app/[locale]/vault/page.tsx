'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { getDeviceId, getResonatedLies } from '@/lib/deviceAuth';
import type { Database } from '@/types/database';

type Lie = Database['public']['Tables']['lies']['Row'];

export default function VaultPage() {
  const t = useTranslations('Common');
  const locale = useLocale();
  
  const [activeTab, setActiveTab] = useState<'written' | 'resonated'>('resonated');
  const [lies, setLies] = useState<Lie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVaultData();
  }, [activeTab]);

  const fetchVaultData = async () => {
    setLoading(true);
    try {
      const deviceId = getDeviceId();
      let query = supabase.from('lies').select('*').order('created_at', { ascending: false });

      if (activeTab === 'written') {
        if (!deviceId) {
          setLies([]);
          setLoading(false);
          return;
        }
        query = query.eq('author_id', deviceId);
      } else {
        const resonatedIds = getResonatedLies();
        if (resonatedIds.length === 0) {
          setLies([]);
          setLoading(false);
          return;
        }
        query = query.in('id', resonatedIds);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching vault data:', error);
        setLies([]);
      } else {
        setLies(data || []);
      }
    } catch (e) {
      console.error(e);
      setLies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 px-6 md:px-12 pb-24">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-16 text-center md:text-left">
          <h1 
            className="text-5xl md:text-7xl font-medium tracking-tight mb-6 text-[var(--color-living-coral)]"
            style={{ fontFamily: 'var(--font-baskerville)' }}
          >
            {t('vaultTitle')}
          </h1>
          <p className="text-[var(--gray-400)] font-mono text-xs uppercase tracking-widest leading-relaxed max-w-xl mx-auto md:mx-0">
            {t('vaultSubtitle')}
          </p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center md:justify-start gap-12 border-b border-[var(--gray-200)] mb-12">
          <button
            onClick={() => setActiveTab('resonated')}
            className={`pb-4 font-mono text-sm uppercase tracking-[0.2em] transition-colors border-b-2 ${
              activeTab === 'resonated' 
                ? 'border-foreground text-foreground font-bold' 
                : 'border-transparent text-[var(--gray-500)] hover:text-foreground'
            }`}
          >
            {t('vaultResonated')}
          </button>
          <button
            onClick={() => setActiveTab('written')}
            className={`pb-4 font-mono text-sm uppercase tracking-[0.2em] transition-colors border-b-2 ${
              activeTab === 'written' 
                ? 'border-foreground text-foreground font-bold' 
                : 'border-transparent text-[var(--gray-500)] hover:text-foreground'
            }`}
          >
            {t('vaultWritten')}
          </button>
        </div>

        {/* Content */}
        <main>
          {loading ? (
            <div className="flex justify-center py-20 opacity-50">
              <div className="animate-pulse font-mono text-sm tracking-widest uppercase">Mengingat...</div>
            </div>
          ) : lies.length === 0 ? (
            <div className="text-center py-32 border border-[var(--gray-300)] rounded-none">
              <p className="font-mono text-[var(--gray-500)] text-sm uppercase tracking-widest leading-loose">
                {activeTab === 'written' 
                  ? 'Lemari arsip ini belum menyimpan rahasia apapun.' 
                  : 'Belum ada gema yang menyentuh ruang ini.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {lies.map((lie) => {
                const content = locale === 'en' ? lie.content_en : (lie as any).content_id || lie.content_en;
                
                return (
                  <div 
                    key={lie.id} 
                    className="p-8 md:p-12 border-b border-[var(--gray-200)] hover:border-[var(--gray-500)] transition-colors bg-background flex flex-col justify-between"
                  >
                    <p 
                      className={`text-foreground leading-loose tracking-wide ${
                        content.length < 50 ? 'text-2xl md:text-3xl' : 
                        content.length < 150 ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'
                      }`}
                      style={{ fontFamily: 'var(--font-special-elite)' }}
                    >
                      &ldquo;{content}&rdquo;
                    </p>
                    
                    <div className="mt-12 pt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[var(--gray-400)] border-t border-[var(--gray-200)]">
                      <span>Nᵒ {lie.id.slice(0, 8)}</span>
                      <div className="flex gap-6">
                        <span className="flex items-center gap-2">
                          <span className="text-foreground">ECHOES</span> 
                          <span className="text-[var(--color-living-coral)] font-bold">{lie.resonate_count}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="text-foreground">EMPTY</span> 
                          <span className="font-bold">{lie.doubt_count}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
