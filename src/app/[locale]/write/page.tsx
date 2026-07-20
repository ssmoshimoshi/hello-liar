'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { submitLie } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export default function WritePage() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    const res = await submitLie(content, content);
    
    if (res.success) {
      router.push(`/${locale}`);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col max-w-3xl mx-auto w-full px-6 md:px-12 py-16 md:py-32">
      {/* Editorial header */}
      <div className="mb-12 md:mb-20">
        <p 
          className="text-[11px] font-sans uppercase tracking-[0.3em] mb-4"
          style={{ color: 'var(--gray-400)' }}
        >
          {locale === 'en' ? 'Confession Booth' : 'Bilik Suara'}
        </p>
        <div className="editorial-rule" />
      </div>

      <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          placeholder={t('writePlaceholder')}
          className="flex-grow w-full bg-transparent border-none outline-none resize-none text-2xl md:text-4xl lg:text-5xl font-serif leading-relaxed md:leading-[1.5] focus:ring-0"
          style={{ 
            /* Placeholder via CSS variable doesn't work inline, handled by Tailwind */
          }}
          maxLength={1000}
          required
        />
        
        {/* Bottom bar */}
        <div 
          className="mt-12 pt-8 flex justify-between items-center border-t"
          style={{ borderColor: 'var(--gray-200)' }}
        >
          <span 
            className="text-[11px] font-sans tracking-[0.2em] tabular-nums"
            style={{ color: 'var(--gray-400)' }}
          >
            {charCount} / 1000
          </span>
          <button 
            type="submit" 
            disabled={isSubmitting || !content.trim()}
            className="text-[11px] font-sans uppercase tracking-[0.3em] font-bold transition-all duration-300 disabled:opacity-20 hover:text-[var(--color-living-coral)] hover:tracking-[0.4em]"
          >
            {isSubmitting ? '...' : t('releaseBtn')} →
          </button>
        </div>
      </form>
    </div>
  );
}
