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
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-[var(--font-playfair)] font-black tracking-tight mb-4">
            {t('vaultTitle')}
          </h1>
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest leading-relaxed max-w-xl mx-auto md:mx-0">
            {t('vaultSubtitle')}
          </p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center md:justify-start gap-8 border-b border-white/10 mb-12">
          <button
            onClick={() => setActiveTab('resonated')}
            className={`pb-4 font-mono text-sm uppercase tracking-widest transition-colors ${
              activeTab === 'resonated' 
                ? 'border-b-2 border-primary text-foreground' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t('vaultResonated')}
          </button>
          <button
            onClick={() => setActiveTab('written')}
            className={`pb-4 font-mono text-sm uppercase tracking-widest transition-colors ${
              activeTab === 'written' 
                ? 'border-b-2 border-primary text-foreground' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t('vaultWritten')}
          </button>
        </div>

        {/* Content */}
        <main>
          {loading ? (
            <div className="flex justify-center py-20 opacity-50">
              <div className="animate-pulse font-mono text-sm tracking-widest uppercase">Loading...</div>
            </div>
          ) : lies.length === 0 ? (
            <div className="text-center py-32 border border-white/10 border-dashed rounded-lg">
              <p className="font-mono text-gray-500 text-sm uppercase tracking-widest">
                {activeTab === 'written' ? t('vaultEmptyWritten') : t('vaultEmptyResonated')}
              </p>
            </div>
          ) : (
            <div className="grid gap-8">
              {lies.map((lie) => {
                const content = locale === 'en' ? lie.content_en : (lie as any).content_id || lie.content_en;
                
                return (
                  <div 
                    key={lie.id} 
                    className="p-8 border border-white/10 rounded-lg hover:border-white/20 transition-colors bg-white/5"
                  >
                    <p className={`font-discipline text-[var(--foreground)] ${
                      content.length < 50 ? 'text-4xl' : 
                      content.length < 150 ? 'text-3xl' : 'text-2xl'
                    }`}>
                      &ldquo;{content}&rdquo;
                    </p>
                    
                    <div className="mt-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-gray-500">
                      <span>{new Date(lie.created_at).toLocaleDateString()}</span>
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                          <span className="text-primary">♥</span> {lie.resonate_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-white">×</span> {lie.doubt_count}
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
