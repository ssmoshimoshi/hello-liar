'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { submitLie } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import VoronoiBackground from '@/components/VoronoiBackground';

export default function WritePage() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const clickPosRef = useRef({ x: 0, y: 0 });
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [content, setContent] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // 'writing' -> 'detonating' -> 'void' -> 'forgiven'
  const [phase, setPhase] = useState<'writing' | 'detonating' | 'void' | 'forgiven'>('writing');

  // Hold-to-Release Interaction Logic
  const holdStartTimeRef = useRef<number>(0);
  const holdRafRef = useRef<number | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const HOLD_DURATION = 1500; // ms

  // Dynamic Placeholder Logic
  const promptsId = [
    "Saya tidak berani bilang ke dia...",
    "Sebenarnya, hari itu saya...",
    "Hal yang paling saya sesali...",
    "Mereka mengira saya...",
    "Tuliskan kebohongan Anda di sini..."
  ];
  const promptsEn = [
    "I never had the courage to tell them...",
    "The truth about that day is...",
    "My biggest regret is...",
    "They all think I...",
    "Write your lie here..."
  ];
  
  const [promptIndex, setPromptIndex] = useState(0);
  const [promptOpacity, setPromptOpacity] = useState(1);
  const prompts = locale === 'en' ? promptsEn : promptsId;

  useEffect(() => {
    if (content.length > 0) return;
    
    const interval = setInterval(() => {
      setPromptOpacity(0);
      setTimeout(() => {
        setPromptIndex((prev) => (prev + 1) % prompts.length);
        setPromptOpacity(1);
      }, 1000); // Wait for fade out
    }, 5000); // 4s visible + 1s fade

    return () => clearInterval(interval);
  }, [content.length, prompts.length]);

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

  // === BREATHE & DISSOLVE LOGIC ===
  const executeRelease = async () => {
    setIsSubmitting(true);
    setPhase('detonating');

    // Fade out header and button smoothly
    if (headerRef.current) {
      headerRef.current.style.transition = 'opacity 2s ease';
      headerRef.current.style.opacity = '0';
    }
    const btn = formRef.current?.querySelector('button');
    if (btn) {
      btn.style.transition = 'opacity 1s ease';
      btn.style.opacity = '0';
    }

    const res = await submitLie(content, content);
    
    if (res.success && res.id) {
      setTimeout(() => setPhase('void'), 2500); // 2.5s to let the blur fade finish
      setTimeout(() => setPhase('forgiven'), 4000); 
      
      setTimeout(() => {
        router.push(`/${locale}/read/${res.id}`);
      }, 8000); 
    } else {
      setErrorMsg(res.error || (locale === 'en' ? 'An error occurred' : 'Terjadi kesalahan'));
      setIsSubmitting(false);
      setPhase('writing');
      setHoldProgress(0);
      if (headerRef.current) headerRef.current.style.opacity = '1';
      if (btn) btn.style.opacity = '1';
    }
  };

  const startHold = useCallback((e: React.PointerEvent) => {
    if (isSubmitting || content.length < 10) return;
    
    // Capture exact position for the expanding void
    clickPosRef.current = { x: e.clientX, y: e.clientY };
    holdStartTimeRef.current = performance.now();
    
    const animateHold = (time: number) => {
      const elapsed = time - holdStartTimeRef.current;
      const progress = Math.min(elapsed / HOLD_DURATION, 1);
      setHoldProgress(progress);
      
      if (progress < 1) {
        holdRafRef.current = requestAnimationFrame(animateHold);
      } else {
        // Hold complete -> Trigger release!
        executeRelease();
      }
    };
    holdRafRef.current = requestAnimationFrame(animateHold);
  }, [isSubmitting, content.length]);

  const cancelHold = useCallback(() => {
    if (holdProgress >= 1 || isSubmitting) return; // Already triggered
    if (holdRafRef.current) cancelAnimationFrame(holdRafRef.current);
    
    setHoldProgress(0);
  }, [holdProgress, isSubmitting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent accidental submits, rely on pointer hold
  };

  const isDark = charCount >= 30;

  return (
    <div className={`fixed top-0 left-0 w-full h-[100dvh] text-white z-40 flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden transition-colors duration-1000 ${isDark ? 'bg-black' : 'bg-[var(--color-living-coral)]'}`}>
      
      {/* Void Expansion (Breathe & Dissolve) */}
      <div
        className="fixed pointer-events-none rounded-full z-[198]"
        style={{
          backgroundColor: '#ffffff',
          top: `${clickPosRef.current.y}px`,
          left: `${clickPosRef.current.x}px`,
          width: '2px',
          height: '2px',
          marginTop: '-1px',
          marginLeft: '-1px',
          transform: `scale(${phase !== 'writing' ? 4000 : 0})`, // Scale massive enough to cover any screen
          transition: 'transform 2.5s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: 1,
        }}
      />

      {/* Dynamic Voronoi Void */}
      <VoronoiBackground charCount={charCount} />

      {/* Catharsis Sequence: The Voice */}
      <div 
        className={`fixed inset-0 z-[300] flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${
          phase === 'forgiven' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p 
          className="text-black text-xl md:text-2xl tracking-widest text-center px-6"
          style={{ fontFamily: 'var(--font-baskerville)' }}
        >
          {locale === 'en' ? 'I am listening. And I have forgiven.' : 'Saya mendengarkan. Dan saya sudah memaafkan.'}
        </p>
      </div>

      {/* Editorial header with random letter reveal */}
      <div ref={headerRef} className="absolute top-6 md:top-12 left-1/2 -translate-x-1/2 text-center z-10 w-full px-4 pointer-events-none">
        <p 
          className="text-lg md:text-xl font-medium tracking-widest"
          style={{ fontFamily: 'var(--font-baskerville)', color: 'var(--color-living-coral)' }}
        >
          {headerText.split('').map((ch, i) => (
            <span 
              key={i} 
              className={ch === ' ' ? "inline-block" : "header-char inline-block transition-opacity duration-500"}
              style={{ 
                opacity: ch === ' ' ? 1 : (revealedSet.has(i) ? 0.8 : 0),
                willChange: ch === ' ' ? 'auto' : 'transform, opacity'
              }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-full h-full max-w-4xl flex flex-col items-center justify-center z-10 pt-16 pb-4 md:pb-8"
      >
        {errorMsg && (
          <div className="absolute top-24 px-4 py-2 border border-white text-white text-xs font-mono tracking-widest bg-white/10 backdrop-blur-sm rounded-full">
            {errorMsg}
          </div>
        )}
        
        <div className="relative w-full flex-1 flex flex-col justify-center min-h-[30dvh]">
          {/* Dynamic Fading Placeholder */}
          {content.length === 0 && phase === 'writing' && (
            <div 
              className="absolute inset-0 w-full h-full text-2xl md:text-3xl lg:text-4xl leading-loose tracking-wide text-center pointer-events-none"
              style={{
                fontFamily: 'var(--font-special-elite)',
                color: 'rgba(255, 255, 255, 0.3)',
                transition: 'opacity 1s ease',
                opacity: promptOpacity
              }}
            >
              {prompts[promptIndex]}
            </div>
          )}

          {/* Blur Fade TextArea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            className={`absolute inset-0 w-full h-full bg-transparent border-none outline-none resize-none text-2xl md:text-3xl lg:text-4xl leading-loose tracking-wide text-center focus:ring-0 z-10 ${
              phase !== 'writing' ? 'opacity-0 blur-xl scale-95 pointer-events-none' : 'opacity-100 blur-0 scale-100'
            }`}
            style={{ 
              fontFamily: 'var(--font-special-elite)',
              color: '#ffffff',
              textShadow: content.length > 0 ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
              transition: phase !== 'writing' 
                ? 'opacity 2.5s cubic-bezier(0.4, 0, 0.2, 1), filter 2.5s cubic-bezier(0.4, 0, 0.2, 1), transform 2.5s cubic-bezier(0.4, 0, 0.2, 1)' 
                : 'opacity 0.3s'
            }}
            minLength={10}
            maxLength={500}
            required
          />
        </div>
        
        {/* Bottom Actions */}
        <div className={`mt-6 md:mt-12 shrink-0 transition-all duration-700 z-10 flex justify-center ${content.length > 9 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <button
            type="button"
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
            disabled={isSubmitting || content.length < 10}
            className="relative px-12 py-8 text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] font-bold text-white/50 transition-all duration-300 disabled:opacity-0 cursor-pointer select-none hover:text-white"
            style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
          >
            {/* Blurry Aura Progress (Misty Glow) */}
            <div 
              className="absolute inset-0 bg-white origin-center rounded-full pointer-events-none"
              style={{
                transform: `scale(${holdProgress * 1.5})`, // Grows to envelop the text
                opacity: holdProgress > 0 ? holdProgress * 0.5 : 0,
                filter: 'blur(30px)',
                transition: holdProgress === 0 ? 'transform 0.5s ease-out, opacity 0.5s' : 'none',
              }}
            />
            {/* Inner text */}
            <span 
              className="relative z-10 transition-all duration-300" 
              style={{ 
                color: holdProgress > 0.1 ? 'white' : 'inherit',
                letterSpacing: holdProgress > 0 ? '0.6em' : '0.4em', // Slight expansion of text while holding
                textShadow: holdProgress > 0 ? `0 0 ${holdProgress * 15}px rgba(255,255,255,0.8)` : 'none'
              }}
            >
              {isSubmitting ? '...' : (holdProgress > 0 ? t('releaseBtn') + '...' : t('releaseBtn'))}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
