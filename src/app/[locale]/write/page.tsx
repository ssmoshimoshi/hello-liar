'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useRef, useEffect, useMemo } from 'react';
import { submitLie } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import VoronoiBackground from '@/components/VoronoiBackground';

export default function WritePage() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [content, setContent] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showShockwave, setShowShockwave] = useState(false);

  // Header reveal logic: letters appear randomly starting at charCount 31
  const headerText = locale === 'en' ? 'The Void is Listening' : 'Kehampaan Mendengarkan';
  
  const revealOrder = useMemo(() => {
    const indices = headerText.split('').map((ch, i) => ch !== ' ' ? i : -1).filter(i => i !== -1);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, [headerText]);

  const revealCount = Math.max(0, Math.min(charCount - 30, revealOrder.length));
  const revealedSet = new Set(revealOrder.slice(0, revealCount));

  useEffect(() => {
    // Slight delay to let the fade-in happen before focusing
    setTimeout(() => textareaRef.current?.focus(), 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setCharCount(e.target.value.length);
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    if (content.length < 10) {
      setErrorMsg(locale === 'en' ? 'Confession is too short.' : 'Cerita terlalu pendek.');
      return;
    }

    setIsSubmitting(true);
    setIsReleasing(true);
    setShowShockwave(true); // Trigger shockwave catharsis
    
    const res = await submitLie(content, content);
    
    if (res.success) {
      // Wait for animation to finish before redirecting
      setTimeout(() => {
        router.push(`/${locale}`);
      }, 1500);
    } else {
      setErrorMsg(res.error || (locale === 'en' ? 'An error occurred' : 'Terjadi kesalahan'));
      setIsSubmitting(false);
      setIsReleasing(false);
      setShowShockwave(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-living-coral)] text-white z-40 flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden transition-colors duration-1000">
      
      {/* Shockwave Effect */}
      {showShockwave && (
        <>
          <style>{`
            @keyframes shockwave-ring {
              0% { transform: scale(0); opacity: 1; border-width: 6px; }
              100% { transform: scale(3); opacity: 0; border-width: 1px; }
            }
            @keyframes shockwave-fill {
              0% { transform: scale(0); }
              100% { transform: scale(1); }
            }
          `}</style>
          <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
            <div style={{
              width: '200vmax', height: '200vmax', borderRadius: '50%',
              border: '4px solid white',
              animation: 'shockwave-ring 0.8s ease-out forwards',
            }} />
          </div>
          <div className="fixed inset-0 z-[199] flex items-center justify-center pointer-events-none">
            <div style={{
              width: '200vmax', height: '200vmax', borderRadius: '50%',
              background: 'white',
              animation: 'shockwave-fill 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            }} />
          </div>
        </>
      )}

      {/* Dynamic Voronoi Void */}
      <VoronoiBackground charCount={charCount} />

      {/* Editorial header with random letter reveal */}
      <div className={`absolute top-12 left-1/2 -translate-x-1/2 text-center transition-all duration-1000 z-10 w-full px-4 ${isReleasing ? 'opacity-0' : 'opacity-100'}`}>
        <p 
          className="text-lg md:text-xl font-medium tracking-widest"
          style={{ fontFamily: 'var(--font-baskerville)', color: 'var(--color-living-coral)' }}
        >
          {headerText.split('').map((ch, i) => (
            <span 
              key={i} 
              className="transition-opacity duration-500"
              style={{ opacity: ch === ' ' ? 1 : (revealedSet.has(i) ? 0.8 : 0) }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </p>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className={`w-full max-w-4xl flex flex-col items-center justify-center transition-all duration-1500 ease-in-out z-10 ${
          isReleasing ? '-translate-y-24 opacity-0 blur-sm scale-95' : 'translate-y-0 opacity-100 blur-0 scale-100'
        }`}
      >
        {errorMsg && (
          <div className="absolute top-24 px-4 py-2 border border-white text-white text-xs font-mono tracking-widest bg-white/10 backdrop-blur-sm rounded-full">
            {errorMsg}
          </div>
        )}
        
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          placeholder={t('writePlaceholder')}
          className="w-full bg-transparent border-none outline-none resize-none text-2xl md:text-3xl lg:text-4xl leading-loose tracking-wide text-center focus:ring-0 placeholder:text-white/30 transition-all duration-700 relative z-10"
          style={{ 
            fontFamily: 'var(--font-special-elite)',
            minHeight: '40vh',
            color: '#ffffff',
            textShadow: content.length > 0 ? '0 2px 10px rgba(0,0,0,0.1)' : 'none'
          }}
          minLength={10}
          maxLength={500}
          required
        />
        
        {/* Bottom Actions */}
        <div className={`mt-12 transition-all duration-700 z-10 ${content.length > 9 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <button 
            type="submit" 
            disabled={isSubmitting || content.length < 10}
            className="text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] font-bold text-white/60 hover:text-[var(--color-living-coral)] active:text-[var(--color-living-coral)] transition-all duration-300 disabled:opacity-0 cursor-pointer"
          >
            {isSubmitting ? '...' : t('releaseBtn')}
          </button>
        </div>
      </form>
    </div>
  );
}
