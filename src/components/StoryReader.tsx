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
        <p className={`font-serif text-foreground break-words break-all transition-all duration-700 ease-out ${
          content?.length < 50 ? 'text-4xl md:text-6xl lg:text-7xl leading-tight' : 
          content?.length < 150 ? 'text-3xl md:text-4xl lg:text-5xl leading-tight' : 
          'text-2xl md:text-3xl lg:text-4xl leading-tight'
        }`}>
          &ldquo;{content}&rdquo;
        </p>

        {/* Action Buttons */}
        <div className="mt-32 md:mt-40 flex flex-col items-center gap-10 w-full max-w-sm">
          
          <RippleButton
            onClick={handleResonate}
            disabled={isPending || hasResonated}
            className="w-full py-2 flex items-center justify-center gap-3 text-foreground font-sans font-bold uppercase tracking-[0.3em] text-sm transition-all duration-300 hover:text-[var(--color-living-coral)] hover:tracking-[0.4em]"
          >
            {hasResonated ? t('resonateBtn') + ' (✓)' : t('resonateBtn')}
            <span className="ml-1 font-mono text-[10px] font-normal opacity-50">
              {resonateCount}
            </span>
          </RippleButton>
          
          <div className="flex gap-8 w-full justify-center">
            <HoldButton
              onHoldComplete={handleDoubt}
              disabled={isPending || hasDoubted}
              holdDuration={1000} // 1 second hold
              className="py-2 text-[var(--gray-500)] font-sans uppercase tracking-[0.2em] text-xs transition-transform"
            >
              {t('doubtBtn')}
              <span className="font-mono text-[10px] opacity-50 ml-1">{doubtCount}</span>
            </HoldButton>

            <button
              onClick={handleShare}
              className="py-2 flex items-center justify-center text-[var(--gray-500)] font-sans uppercase tracking-[0.2em] text-xs transition-all duration-300 hover:text-foreground active:scale-[0.98]"
            >
              IG STORY
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
