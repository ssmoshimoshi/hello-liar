'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function FloatingNav() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isHome = pathname === `/${locale}`;

  // Hide nav on scroll down, show on scroll up for better reading experience
  useEffect(() => {
    const handleScroll = () => {
      if (isHome) {
        setIsVisible(true);
        return;
      }
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true);  // Scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isHome]);

  const switchLocale = (newLocale: string) => {
    if (locale === newLocale) return;
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const isWrite = pathname === `/${locale}/write`;
  const isGallery = pathname === `/${locale}/illustrated`;

  return (
    <div 
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      <nav 
        className="flex items-center gap-1 p-1.5 md:p-2 rounded-full shadow-lg border backdrop-blur-md"
        style={{ 
          backgroundColor: 'color-mix(in srgb, var(--background) 85%, transparent)',
          borderColor: 'var(--gray-200)'
        }}
      >
        {/* Explore (Home) */}
        <Link 
          href={`/${locale}`}
          className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 ${isHome ? 'bg-[var(--gray-100)] text-foreground' : 'text-[var(--gray-400)] hover:text-foreground'}`}
          aria-label="Explore"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
          </svg>
        </Link>

        {/* Write (Confession Booth) - Prominent Button */}
        <Link 
          href={`/${locale}/write`}
          className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full mx-1 transition-all duration-300 shadow-md hover:scale-105 active:scale-95 ${isWrite ? 'bg-foreground text-background' : 'bg-[var(--color-living-coral)] text-white'}`}
          aria-label="Write Confession"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14"/><path d="M5 12h14"/>
          </svg>
        </Link>

        {/* Gallery */}
        <Link 
          href={`/${locale}/illustrated`}
          className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 ${isGallery ? 'bg-[var(--gray-100)] text-foreground' : 'text-[var(--gray-400)] hover:text-foreground'}`}
          aria-label="Gallery"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
        </Link>

          {/* The Vault */}
          <Link
            href={`/${locale}/vault`}
            className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 ${pathname.includes('/vault') ? 'bg-[var(--gray-100)] text-foreground' : 'text-[var(--gray-400)] hover:text-foreground'}`}
            aria-label="Vault"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
            </svg>
          </Link>

        {/* Divider */}
        <div className="w-[1px] h-6 md:h-8 bg-[var(--gray-200)] mx-1 md:mx-2" />

        {/* Language Switcher */}
        <button 
          onClick={() => switchLocale(locale === 'en' ? 'id' : 'en')}
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-wider text-[var(--gray-500)] hover:text-foreground transition-colors"
        >
          {locale}
        </button>
      </nav>
    </div>
  );
}
