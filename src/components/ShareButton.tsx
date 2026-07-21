'use client';

import { useTranslations } from 'next-intl';

interface Props {
  lieId: string;
  content: string;
  urlPath: string;
}

export default function ShareButton({ lieId, content, urlPath }: Props) {
  const t = useTranslations('Common');

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the link if it's inside one
    
    // Construct full URL using window.location.origin
    const url = `${window.location.origin}${urlPath}`;
    const title = `Hello Liar — Nᵒ ${lieId.slice(0, 8)}`;
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
    <button
      onClick={handleShare}
      className="w-full py-3 flex items-center justify-center gap-2 border border-[var(--gray-200)] text-[var(--gray-500)] font-sans uppercase tracking-[0.1em] text-[10px] transition-all hover:border-foreground hover:text-foreground active:scale-[0.98]"
      style={{ background: 'transparent' }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
      </svg>
      {t('shareIGBtn')}
    </button>
  );
}
