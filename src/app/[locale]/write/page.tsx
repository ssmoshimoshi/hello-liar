'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
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
    setIsReleasing(true); // Trigger catharsis animation
    
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
    }
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-living-coral)] text-white z-40 flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden transition-colors duration-1000">
      
      {/* Dynamic Voronoi Void */}
      <VoronoiBackground charCount={charCount} />

      {/* Editorial header (Subtle) */}
      <div className={`absolute top-12 left-1/2 -translate-x-1/2 text-center transition-all duration-1000 z-10 ${isReleasing ? 'opacity-0' : 'opacity-60'}`}>
        <p className="text-[10px] font-sans uppercase tracking-[0.4em] font-bold">
          {locale === 'en' ? 'The Void is Listening' : 'Kehampaan Mendengarkan'}
        </p>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className={`w-full max-w-4xl flex flex-col items-center justify-center transition-all duration-1500 ease-in-out z-10 ${
          isReleasing ? '-translate-y-24 opacity-0 blur-sm scale-95' : 'translate-y-0 opacity-100 blur-0 scale-100'
        }`}
      >
        {errorMsg && (
          <div className="absolute top-24 px-4 py-2 border border-white text-white text-xs font-sans tracking-widest bg-white/10 backdrop-blur-sm rounded-full">
            {errorMsg}
          </div>
        )}
        
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          placeholder={t('writePlaceholder')}
          className="w-full bg-transparent border-none outline-none resize-none text-2xl md:text-4xl lg:text-5xl font-serif leading-relaxed md:leading-[1.6] text-center focus:ring-0 placeholder:text-white/40 transition-all duration-700 relative z-10"
          style={{ 
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
            className="group relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full border border-white/20 hover:border-white/50 transition-all duration-500 disabled:opacity-0 disabled:scale-75"
          >
            {/* Breathing pulse ring */}
            <div className="absolute inset-0 rounded-full border border-white/10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
            
            <span className="text-[10px] md:text-xs font-sans uppercase tracking-[0.3em] font-bold z-10 group-hover:scale-110 transition-transform duration-300">
              {isSubmitting ? '...' : t('releaseBtn')}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
