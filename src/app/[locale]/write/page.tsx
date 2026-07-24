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
  // 'writing' -> 'detonation' -> 'detonation-simple' -> 'void' -> 'forgiven'
  const [phase, setPhase] = useState<'writing' | 'detonation' | 'detonation-simple' | 'void' | 'forgiven'>('writing');

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

  // === PHASE 1: Implosion (anticipation - characters pulled toward button) ===
  const applyImplosion = useCallback((epicenterX: number, epicenterY: number) => {
    const chars = document.querySelectorAll('.shatter-char, .header-char');
    chars.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const rect = htmlEl.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;
      
      const dx = epicenterX - elCenterX; // reversed: toward epicenter
      const dy = epicenterY - elCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      
      // Gentle pull toward button (max 15px)
      const pullStrength = Math.min(15, 600 / dist);
      const pullX = (dx / dist) * pullStrength;
      const pullY = (dy / dist) * pullStrength;
      
      htmlEl.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      htmlEl.style.transform = `translate(${pullX}px, ${pullY}px) scale(0.97)`;
    });
  }, []);

  // === PHASE 2: Distance-delayed scatter (characters break when wave reaches them) ===
  const WAVE_SPEED = 800; // pixels per second - matches the visual ring expansion
  
  const applyShatterPhysics = useCallback((epicenterX: number, epicenterY: number) => {
    const chars = document.querySelectorAll('.shatter-char, .header-char');
    
    // Find max distance for timing calculations
    let maxDist = 0;
    const charData: { el: HTMLElement; dist: number; dx: number; dy: number }[] = [];
    
    chars.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const rect = htmlEl.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;
      const dx = elCenterX - epicenterX;
      const dy = elCenterY - epicenterY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      if (dist > maxDist) maxDist = dist;
      charData.push({ el: htmlEl, dist, dx, dy });
    });
    
    charData.forEach(({ el, dist, dx, dy }) => {
      // Delay = time for wave to reach this character
      const delay = (dist / WAVE_SPEED) * 1000; // ms
      
      const strength = Math.max(150, 4200 / (dist / 100));
      const pushX = (dx / dist) * strength + (Math.random() * 200 - 100);
      const pushY = (dy / dist) * strength + (Math.random() * 200 - 100);
      const rotZ = (Math.random() - 0.5) * 2000;
      
      // Each character waits for the wave to arrive, then shatters
      setTimeout(() => {
        el.style.transition = 'transform 1.4s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.8s ease-out';
        el.style.transform = `translate(${pushX}px, ${pushY}px) rotateZ(${rotZ}deg) scale(${Math.random() * 0.5 + 0.5})`;
        el.style.opacity = '0';
      }, delay);
    });

    // Button shatters immediately (it's at the epicenter)
    const btn = formRef.current?.querySelector('button');
    if (btn) {
      btn.style.transition = 'transform 1.0s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.5s';
      btn.style.transform = 'translateY(100px) scale(0)';
      btn.style.opacity = '0';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    if (content.length < 10) {
      setErrorMsg(locale === 'en' ? 'Confession is too short.' : 'Cerita terlalu pendek.');
      return;
    }

    setIsSubmitting(true);
    
    // Accessibility: Reduced Motion Check
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isReduced) {
      setPhase('detonation-simple');
      
      // Gentle fade out for header and button instead of physics
      if (headerRef.current) {
        headerRef.current.style.transition = 'opacity 1.5s ease';
        headerRef.current.style.opacity = '0';
      }
      const btn = formRef.current?.querySelector('button');
      if (btn) {
        btn.style.transition = 'opacity 1s ease';
        btn.style.opacity = '0';
      }

      const res = await submitLie(content, content);
      
      if (res.success && res.id) {
        setTimeout(() => setPhase('void'), 1500); 
        setTimeout(() => setPhase('forgiven'), 3000);
        setTimeout(() => router.push(`/${locale}/read/${res.id}`), 6000);
      } else {
        setErrorMsg(res.error || (locale === 'en' ? 'An error occurred' : 'Terjadi kesalahan'));
        setIsSubmitting(false);
        setPhase('writing');
        if (headerRef.current) headerRef.current.style.opacity = '1';
        if (btn) btn.style.opacity = '1';
      }
      return;
    }

    // Normal Cinematic Flow
    
    // Lock epicenter strictly to the button's geometric center
    const btnRect = formRef.current?.querySelector('button')?.getBoundingClientRect();
    const ex = btnRect ? btnRect.left + btnRect.width / 2 : clickPosRef.current.x;
    const ey = btnRect ? btnRect.top + btnRect.height / 2 : clickPosRef.current.y;
    clickPosRef.current = { x: ex, y: ey };

    // === PHASE 1: Implosion (300ms anticipation) ===
    setPhase('detonation');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        applyImplosion(ex, ey);
      });
    });

    // === PHASE 2: After 300ms, trigger the actual shockwave ===
    setTimeout(() => {
      applyShatterPhysics(ex, ey);
    }, 350);
    
    const res = await submitLie(content, content);
    
    if (res.success && res.id) {
      // Catharsis sequence timings (synced with wave propagation)
      // Wave takes ~2s to cross the full screen at 800px/s
      setTimeout(() => setPhase('void'), 2500); // After wave has swept everything
      setTimeout(() => setPhase('forgiven'), 4000); // Voice appears from the void
      
      setTimeout(() => {
        router.push(`/${locale}/read/${res.id}`);
      }, 8000); // Extended wait for reading
    } else {
      setErrorMsg(res.error || (locale === 'en' ? 'An error occurred' : 'Terjadi kesalahan'));
      setIsSubmitting(false);
      setPhase('writing');
      
      // Reset button if error
      const btn = formRef.current?.querySelector('button');
      if (btn) { btn.style.transform = ''; btn.style.opacity = ''; }
    }
  };

  const isDark = charCount >= 30;

  return (
    <div className={`fixed top-0 left-0 w-full h-[100dvh] text-white z-40 flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden transition-colors duration-1000 ${isDark ? 'bg-black' : 'bg-[var(--color-living-coral)]'}`}>
      
      {/* Shockwave Effect — originates from exact click coordinates */}
      {(phase === 'detonation' || phase === 'void') && (
        <>
          <style>{`
            @keyframes sw-primary {
              0%   { transform: scale(0);   opacity: 1; border-width: 2px; filter: blur(7px); }
              15%  { opacity: 1; }
              100% { transform: scale(500); opacity: 0; border-width: 0px; filter: blur(0px); }
            }
            @keyframes sw-secondary {
              0%   { transform: scale(0);   opacity: 0; filter: blur(2px); }
              8%   { opacity: 0.5; }
              100% { transform: scale(90); opacity: 0; filter: blur(20px); }
            }
            @keyframes dark-cleave {
              0%   { clip-path: circle(0px   at var(--ex) var(--ey)); }
              100% { clip-path: circle(200vmax at var(--ex) var(--ey)); }
            }
          `}</style>

          {/* Void layer that follows behind the wave (synced to wave speed) */}
          <div
            className="fixed inset-0 z-[198] pointer-events-none"
            style={{
              backgroundColor: '#ffffff',
              '--ex': `${clickPosRef.current.x}px`,
              '--ey': `${clickPosRef.current.y}px`,
              animation: 'dark-cleave 2.0s cubic-bezier(0.05, 0.95, 0.2, 1) both',
              animationDelay: '350ms',
            } as React.CSSProperties}
          />

          {/* Primary ring - starts after implosion phase (350ms delay) */}
          <div
            className="fixed pointer-events-none rounded-full z-[201]"
            style={{
              top: `${clickPosRef.current.y}px`,
              left: `${clickPosRef.current.x}px`,
              width: '4px',
              height: '4px',
              marginTop: '-2px',
              marginLeft: '-2px',
              borderStyle: 'solid',
              borderColor: '#000000',
              animation: 'sw-primary 2.0s cubic-bezier(0.05, 0.95, 0.2, 1) both',
              animationDelay: '350ms',
            }}
          />

          {/* Secondary ring - the heavy dust wave */}
          <div
            className="fixed pointer-events-none rounded-full z-[200]"
            style={{
              top: `${clickPosRef.current.y}px`,
              left: `${clickPosRef.current.x}px`,
              width: '4px',
              height: '4px',
              marginTop: '-2px',
              marginLeft: '-2px',
              borderStyle: 'solid',
              borderColor: '#4f4f4f',
              borderWidth: '17px',
              animation: 'sw-secondary 1.5s cubic-bezier(0.25, 0.8, 0.2, 1) both',
              animationDelay: '1100ms',
            }}
          />
        </>
      )}

      {/* Reduced Motion Simple Void Transition */}
      {(phase === 'detonation-simple' || (phase === 'void' && typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) && (
        <div
          className="fixed inset-0 z-[198] bg-white pointer-events-none transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: phase === 'detonation-simple' ? 0 : 1 }}
        />
      )}

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
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            placeholder={t('writePlaceholder')}
            className={`absolute inset-0 w-full h-full bg-transparent border-none outline-none resize-none text-2xl md:text-3xl lg:text-4xl leading-loose tracking-wide text-center focus:ring-0 placeholder:text-white/30 transition-opacity duration-300 z-10 ${
              phase !== 'writing' ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            style={{ 
              fontFamily: 'var(--font-special-elite)',
              color: '#ffffff',
              textShadow: content.length > 0 ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
              transition: phase === 'detonation-simple' ? 'opacity 1.5s ease' : 'opacity 0.3s'
            }}
            minLength={10}
            maxLength={500}
            required
          />
          
          {/* The Bait and Switch: renders individual spans for shattering */}
          {(phase === 'detonation' || phase === 'void' || phase === 'forgiven') && (
            <div 
              className="absolute inset-0 w-full text-2xl md:text-3xl lg:text-4xl leading-loose tracking-wide text-center pointer-events-none z-20"
              style={{ 
                fontFamily: 'var(--font-special-elite)', 
                color: '#ffffff', 
                whiteSpace: 'pre-wrap',
                textShadow: content.length > 0 ? '0 2px 10px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {content.split('').map((char, i) => (
                <span 
                  key={i} 
                  className={char === ' ' || char === '\n' ? "inline-block" : "shatter-char inline-block"}
                  style={{
                    willChange: char === ' ' || char === '\n' ? 'auto' : 'transform, opacity'
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Bottom Actions */}
        <div className={`mt-6 md:mt-12 shrink-0 transition-all duration-700 z-10 ${content.length > 9 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <button
            type="submit"
            onPointerDown={(e) => {
              // Capture exact finger/cursor position BEFORE form submit fires
              clickPosRef.current = { x: e.clientX, y: e.clientY };
            }}
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
