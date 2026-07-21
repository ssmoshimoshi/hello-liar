'use client';

import { useState, useEffect, useMemo } from 'react';
import { addDoubt } from '@/lib/actions';
import { useTranslations } from 'next-intl';
import { Tables } from '@/types/database';

export type Lie = Tables<'lies'>;

interface Props {
  initialLie: Lie;
  locale: string;
}

export default function StoryReader({ initialLie, locale }: Props) {
  const t = useTranslations('Common');
  const [doubtCount, setDoubtCount] = useState(initialLie.doubt_count);
  const [isClient, setIsClient] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [hasDoubted, setHasDoubted] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if user already doubted this lie
    try {
      const doubtedLies = JSON.parse(localStorage.getItem('doubted_lies') || '[]');
      if (doubtedLies.includes(initialLie.id)) {
        setHasDoubted(true);
      }
    } catch (e) {
      console.error('Error reading localStorage', e);
    }
  }, [initialLie.id]);

  const content = locale === 'en' ? initialLie.content_en : initialLie.content_id;
  const words = useMemo(() => content.split(' '), [content]);
  
  // Seeded random values — consistent per word across re-renders
  const randomOffsets = useMemo(() => {
    return words.map((_, i) => ({
      x: Math.sin(i * 7.3) * 50,
      y: Math.cos(i * 11.1) * 50,
      rotate: Math.sin(i * 3.7) * 15,
      letterSpacing: Math.abs(Math.sin(i * 5.1)) * 8,
    }));
  }, [words]);

  const handleDoubt = async () => {
    if (isPending || isCooldown || hasDoubted) return;
    setIsPending(true);
    setIsCooldown(true);
    
    // Optimistic UI update
    setDoubtCount(prev => prev + 1);
    setHasDoubted(true);
    
    // Save to localStorage
    try {
      const doubtedLies = JSON.parse(localStorage.getItem('doubted_lies') || '[]');
      if (!doubtedLies.includes(initialLie.id)) {
        doubtedLies.push(initialLie.id);
        localStorage.setItem('doubted_lies', JSON.stringify(doubtedLies));
      }
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
    
    // API call doesn't block the cooldown timer
    addDoubt(initialLie.id).finally(() => {
      setIsPending(false);
    });

    // Enforce 1-second cooldown between clicks
    setTimeout(() => {
      setIsCooldown(false);
    }, 1000);
  };

  const getStage = (clicks: number) => {
    if (clicks <= 10) return 1;
    if (clicks <= 30) return 2;
    if (clicks <= 50) return 3;
    return 4;
  };

  const stage = getStage(doubtCount);

  // Placeholder label per stage
  const placeholderLabels: Record<number, string> = {
    1: 'topeng_normal.png',
    2: 'topeng_hidung_panjang.png',
    3: 'topeng_hidung_maksimal.png',
    4: 'topeng_retak.png',
  };

  // Progress percentage for visual indicator
  const stageThresholds = [10, 30, 50];
  const getProgress = () => {
    if (stage === 4) return 100;
    const min = stage === 1 ? 0 : stageThresholds[stage - 2];
    const max = stageThresholds[stage - 1];
    return ((doubtCount - min) / (max - min)) * 100;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-24">
      {/* Editorial header */}
      <div className="mb-12 md:mb-20 flex items-center justify-between">
        <div>
          <p 
            className="text-[11px] font-sans uppercase tracking-[0.3em] mb-1"
            style={{ color: 'var(--gray-400)' }}
          >
            {locale === 'en' ? 'Reading' : 'Membaca'}
          </p>
          <p 
            className="text-[11px] font-sans uppercase tracking-[0.2em]"
            style={{ color: 'var(--gray-400)' }}
          >
            {locale === 'en' ? 'Stage' : 'Tahap'} {stage}/4 — {doubtCount} {locale === 'en' ? 'doubts' : 'keraguan'}
          </p>
        </div>
        <div className="editorial-rule" />
      </div>

      {/* Stage progress bar */}
      <div className="mb-12 md:mb-16">
        <div className="w-full h-[2px] rounded-full" style={{ background: 'var(--gray-100)' }}>
          <div 
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ 
              width: `${getProgress()}%`,
              background: stage === 4 ? 'var(--color-living-coral)' : 'var(--foreground)'
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {['0', '10', '30', '50', '∞'].map((label, i) => (
            <span 
              key={i} 
              className="text-[9px] font-sans tracking-wider"
              style={{ color: 'var(--gray-400)' }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
        {/* Text Column */}
        <div className="flex flex-col min-h-[50vh] order-2 md:order-1">
          <div className="flex-grow relative">
            {/* Destroyed overlay */}
            {stage === 4 && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <h2 className="destroyed-notice text-3xl md:text-5xl font-sans font-black uppercase tracking-tighter text-[var(--color-living-coral)] opacity-90">
                  {t('destroyedNotice')}
                </h2>
              </div>
            )}

            {/* Story text */}
            <div className={`text-xl md:text-3xl leading-relaxed md:leading-[1.6] font-serif transition-all duration-1000 ${stage === 4 ? 'burn-fade' : ''}`}>
              {words.map((word, i) => {
                const rand = randomOffsets[i];
                
                let className = "inline-block mr-[0.25em] transition-all duration-700 ease-in-out ";
                
                if (stage === 1) {
                  // Perfect editorial layout
                } else if (stage === 2) {
                  // 15% of words get redacted based on their random x value
                  if (Math.abs(rand.x) > 40) {
                    className += "redacted-word ";
                  }
                } else if (stage === 3) {
                  // 40% words redacted, the rest blurred based on random values
                  if (Math.abs(rand.x) > 20) {
                    className += "redacted-word ";
                  } else {
                    className += "blurred-word ";
                  }
                } else if (stage === 4) {
                  // Text is burning away via parent's burn-fade class
                  // We still keep the heavy redaction
                  if (Math.abs(rand.x) > 10) {
                    className += "redacted-word ";
                  } else {
                    className += "blurred-word ";
                  }
                }

                return (
                  <span key={i} className={className}>
                    {word}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Doubt Button */}
          {stage < 4 && (
            <div className="mt-16 md:mt-20 sticky bottom-4 md:bottom-8 z-20">
              <button
                onClick={handleDoubt}
                disabled={isPending || isCooldown || hasDoubted}
                className="doubt-btn w-full py-5 md:py-7 border-2 border-foreground text-foreground font-sans font-bold uppercase tracking-[0.2em] text-sm md:text-base transition-all duration-300 hover:bg-[var(--color-living-coral)] hover:text-white hover:border-[var(--color-living-coral)] active:scale-[0.98] disabled:opacity-50"
                style={{ background: 'var(--background)' }}
              >
                {hasDoubted 
                  ? (locale === 'en' ? 'DOUBTED' : 'DIRAGUKAN')
                  : t('doubtBtn')
                }
                <span 
                  className="ml-3 text-[11px] font-normal"
                  style={{ color: 'var(--gray-400)' }}
                >
                  ({doubtCount})
                </span>
              </button>
            </div>
          )}

          {/* Return after destruction */}
          {stage === 4 && (
            <div className="mt-16 text-center">
              <p 
                className="text-[11px] font-sans uppercase tracking-[0.3em]"
                style={{ color: 'var(--gray-400)' }}
              >
                {locale === 'en' 
                  ? 'This lie has been shattered beyond repair.' 
                  : 'Kebohongan ini telah hancur tak tersisa.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Image Column */}
        <div className="sticky top-24 order-1 md:order-2">
          <div 
            className="w-full aspect-square max-w-[600px] mx-auto flex flex-col items-center justify-center gap-4 transition-all duration-1000 border"
            style={{ 
              borderColor: stage >= 3 ? 'var(--color-living-coral)' : 'var(--gray-200)',
              background: 'var(--gray-100)',
              opacity: stage === 4 ? 0.5 : 1
            }}
          >
            <span 
              className="text-[11px] font-sans uppercase tracking-[0.3em]"
              style={{ color: 'var(--gray-400)' }}
            >
              {locale === 'en' ? 'Illustration' : 'Ilustrasi'}
            </span>
            <span 
              className="text-[10px] font-sans tracking-wider font-mono"
              style={{ color: 'var(--gray-400)' }}
            >
              {isClient ? placeholderLabels[stage] : '...'}
            </span>
            <span 
              className="text-[9px] font-sans tracking-wider"
              style={{ color: 'var(--gray-300)' }}
            >
              800 × 800
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
