'use client';

import { useState, useEffect } from 'react';
import { addDoubt, addResonate } from '@/lib/actions';
import { useTranslations } from 'next-intl';
import { Tables } from '@/types/database';

export type Lie = Tables<'lies'>;

interface Props {
  initialLie: Lie;
  locale: string;
}

export default function StoryReader({ initialLie, locale }: Props) {
  const t = useTranslations('Common');
  
  const [resonateCount, setResonateCount] = useState(initialLie.resonate_count || 0);
  const [doubtCount, setDoubtCount] = useState(initialLie.doubt_count || 0);
  
  const [isClient, setIsClient] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const [hasResonated, setHasResonated] = useState(false);
  const [hasDoubted, setHasDoubted] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const resonatedLies = JSON.parse(localStorage.getItem('resonated_lies') || '[]');
      const doubtedLies = JSON.parse(localStorage.getItem('doubted_lies') || '[]');
      if (resonatedLies.includes(initialLie.id)) setHasResonated(true);
      if (doubtedLies.includes(initialLie.id)) setHasDoubted(true);
    } catch (e) {
      console.error('Error reading localStorage', e);
    }
  }, [initialLie.id]);

  const content = locale === 'en' ? initialLie.content_en : initialLie.content_id;

  const handleResonate = async () => {
    if (isPending || hasResonated) return;
    setIsPending(true);
    
    setResonateCount(prev => prev + 1);
    setHasResonated(true);
    
    try {
      const resonatedLies = JSON.parse(localStorage.getItem('resonated_lies') || '[]');
      if (!resonatedLies.includes(initialLie.id)) {
        resonatedLies.push(initialLie.id);
        localStorage.setItem('resonated_lies', JSON.stringify(resonatedLies));
      }
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
    
    addResonate(initialLie.id).finally(() => {
      // Small cooldown to prevent spam clicking
      setTimeout(() => setIsPending(false), 1000);
    });
  };

  const handleDoubt = async () => {
    if (isPending || hasDoubted) return;
    setIsPending(true);
    
    setDoubtCount(prev => prev + 1);
    setHasDoubted(true);
    
    try {
      const doubtedLies = JSON.parse(localStorage.getItem('doubted_lies') || '[]');
      if (!doubtedLies.includes(initialLie.id)) {
        doubtedLies.push(initialLie.id);
        localStorage.setItem('doubted_lies', JSON.stringify(doubtedLies));
      }
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
    
    addDoubt(initialLie.id).finally(() => {
      setTimeout(() => setIsPending(false), 1000);
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = `Hello Liar — Nᵒ ${initialLie.id.slice(0, 8)}`;
    const text = `"${content}"\n\n`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text}${url}`);
        alert(t('copyLinkBtn') + ' ✓');
      } catch (err) {
        console.error('Error copying:', err);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
        {/* Text Column */}
        <div className="flex flex-col min-h-[50vh] order-2 md:order-1">
          <div className="flex-grow">
            <p 
              className="text-[11px] font-sans uppercase tracking-[0.3em] mb-8 block"
              style={{ color: 'var(--gray-400)' }}
            >
              Nᵒ {initialLie.id.slice(0, 8)}
            </p>
            
            <p className="text-xl md:text-3xl lg:text-4xl leading-relaxed md:leading-[1.6] font-serif">
              &ldquo;{content}&rdquo;
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-16 md:mt-20 flex flex-col gap-4">
            <button
              onClick={handleResonate}
              disabled={isPending || hasResonated}
              className="w-full py-5 md:py-7 flex items-center justify-center gap-3 border-2 border-foreground text-foreground font-sans font-bold uppercase tracking-[0.2em] text-sm md:text-base transition-all duration-300 hover:bg-[var(--color-living-coral)] hover:text-white hover:border-[var(--color-living-coral)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'transparent' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
              {hasResonated ? t('resonateBtn') + ' (✓)' : t('resonateBtn')}
              <span className="ml-2 font-mono text-[11px] font-normal" style={{ color: 'inherit' }}>
                ({resonateCount})
              </span>
            </button>
            
            <div className="flex gap-4">
              <button
                onClick={handleDoubt}
                disabled={isPending || hasDoubted}
                className="flex-1 py-4 flex items-center justify-center gap-2 border border-[var(--gray-300)] text-[var(--gray-500)] font-sans uppercase tracking-[0.1em] text-xs transition-all duration-300 hover:border-foreground hover:text-foreground active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'transparent' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
                {t('doubtBtn')}
                <span className="font-mono text-[10px]">({doubtCount})</span>
              </button>

              <button
                onClick={handleShare}
                className="flex-1 py-4 flex items-center justify-center gap-2 border border-[var(--gray-300)] text-[var(--gray-500)] font-sans uppercase tracking-[0.1em] text-xs transition-all duration-300 hover:border-foreground hover:text-foreground active:scale-[0.98]"
                style={{ background: 'transparent' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
                </svg>
                {t('shareIGBtn')}
              </button>
            </div>
          </div>
        </div>

        {/* Image Column */}
        <div className="sticky top-24 order-1 md:order-2">
          {initialLie.illustrated && initialLie.illustration_url ? (
            <div className="w-full aspect-square border border-[var(--gray-200)] relative overflow-hidden">
              <img 
                src={initialLie.illustration_url} 
                alt="Story Illustration" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div 
              className="w-full aspect-square max-w-[600px] mx-auto flex flex-col items-center justify-center gap-4 border border-[var(--gray-200)]"
              style={{ background: 'var(--gray-100)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <span 
                className="text-[10px] font-sans tracking-wider text-center px-4 uppercase"
                style={{ color: 'var(--gray-400)' }}
              >
                {isClient ? t('illustrationPlaceholder') : '...'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
