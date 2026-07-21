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

import RippleButton from './buttons/RippleButton';
import HoldButton from './buttons/HoldButton';

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

  // Dynamic Typography Logic
  const getFontSize = () => {
    if (!content) return 'text-2xl md:text-4xl';
    const len = content.length;
    if (len < 50) return 'text-4xl md:text-6xl lg:text-7xl leading-tight';
    if (len < 150) return 'text-2xl md:text-4xl lg:text-5xl leading-snug';
    return 'text-xl md:text-2xl lg:text-3xl leading-relaxed';
  };

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
    <div className="relative w-full flex-grow flex flex-col items-center justify-center min-h-[80vh] px-6 md:px-12 py-24">
      {/* Ambient Blurred Background (Cathartic Minimalism) */}
      {initialLie.illustrated && initialLie.illustration_url && (
        <div className="fixed inset-0 pointer-events-none -z-10 opacity-10">
          <img 
            src={initialLie.illustration_url} 
            alt="Ambient Illustration" 
            className="w-full h-full object-cover blur-3xl scale-110"
          />
        </div>
      )}

      {/* Main Content (Centered) */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Story ID */}
        <p 
          className="text-[10px] font-sans uppercase tracking-[0.4em] mb-12 opacity-50"
        >
          Nᵒ {initialLie.id.slice(0, 8)}
        </p>
        
        {/* The Confession (Dynamic Typography) */}
        <p className={`font-[var(--font-discipline)] text-foreground transition-all duration-700 ease-out ${
          content?.length < 50 ? 'text-5xl md:text-7xl lg:text-8xl leading-tight' : 
          content?.length < 150 ? 'text-4xl md:text-5xl lg:text-6xl leading-tight' : 
          'text-3xl md:text-4xl lg:text-5xl leading-tight'
        }`}>
          &ldquo;{content}&rdquo;
        </p>

        {/* Action Buttons */}
        <div className="mt-20 md:mt-24 flex flex-col items-center gap-6 w-full max-w-sm">
          
          <RippleButton
            onClick={handleResonate}
            disabled={isPending || hasResonated}
            className="w-full py-5 flex items-center justify-center gap-3 border border-foreground text-foreground font-sans font-bold uppercase tracking-[0.2em] text-sm transition-colors duration-300 hover:border-[var(--color-living-coral)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={hasResonated ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={hasResonated ? "text-[var(--color-living-coral)]" : ""}>
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
            {hasResonated ? t('resonateBtn') + ' (✓)' : t('resonateBtn')}
            <span className="ml-1 font-mono text-[10px] font-normal opacity-50">
              {resonateCount}
            </span>
          </RippleButton>
          
          <div className="flex gap-4 w-full">
            <HoldButton
              onHoldComplete={handleDoubt}
              disabled={isPending || hasDoubted}
              holdDuration={1000} // 1 second hold
              className="flex-1 py-5 border border-[var(--gray-300)] text-[var(--gray-500)] font-sans uppercase tracking-[0.1em] text-xs hover:border-foreground hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
              {t('doubtBtn')}
              <span className="font-mono text-[10px] opacity-50">{doubtCount}</span>
            </HoldButton>

            <button
              onClick={handleShare}
              className="flex-1 py-5 flex items-center justify-center gap-2 border border-[var(--gray-300)] text-[var(--gray-500)] font-sans uppercase tracking-[0.1em] text-xs transition-all duration-300 hover:border-foreground hover:text-foreground active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
              </svg>
              {t('shareIGBtn')}
            </button>
          </div>
          
          <p className="text-[9px] font-sans text-[var(--gray-400)] text-center uppercase tracking-widest mt-2 opacity-50">
            {isClient && (hasDoubted ? 'Doubt registered.' : 'Hold "Doubt" to question.')}
          </p>

        </div>
      </div>
    </div>
  );
}
