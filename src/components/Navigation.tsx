'use client';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    if (locale === newLocale) return;
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <nav className="relative border-b" style={{ borderColor: 'var(--gray-200)' }}>
      <div className="flex justify-between items-center px-6 md:px-12 py-6 md:py-8 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <Link 
          href={`/${locale}`} 
          className="text-xl md:text-2xl font-serif font-black tracking-[-0.05em] uppercase"
        >
          Hello Liar
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          <Link 
            href={`/${locale}`} 
            className="text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--color-living-coral)]"
            style={{ color: 'var(--gray-500)' }}
          >
            {t('navHome')}
          </Link>
          <Link 
            href={`/${locale}/write`} 
            className="text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--color-living-coral)]"
            style={{ color: 'var(--gray-500)' }}
          >
            {t('navWrite')}
          </Link>
          <div className="flex gap-3 ml-4 pl-6 border-l" style={{ borderColor: 'var(--gray-200)' }}>
            <button 
              onClick={() => switchLocale('id')} 
              className={`text-[11px] uppercase tracking-[0.2em] transition-colors ${locale === 'id' ? 'font-bold text-foreground' : 'hover:text-foreground'}`}
              style={locale !== 'id' ? { color: 'var(--gray-400)' } : {}}
            >
              ID
            </button>
            <span style={{ color: 'var(--gray-300)' }}>/</span>
            <button 
              onClick={() => switchLocale('en')} 
              className={`text-[11px] uppercase tracking-[0.2em] transition-colors ${locale === 'en' ? 'font-bold text-foreground' : 'hover:text-foreground'}`}
              style={locale !== 'en' ? { color: 'var(--gray-400)' } : {}}
            >
              EN
            </button>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="md:hidden flex flex-col gap-[5px] p-2"
          aria-label="Menu"
        >
          <span 
            className="block w-5 h-[1.5px] transition-all duration-300 origin-center"
            style={{ 
              background: 'var(--foreground)',
              transform: menuOpen ? 'rotate(45deg) translateY(6.5px)' : 'none' 
            }}
          />
          <span 
            className="block w-5 h-[1.5px] transition-all duration-300"
            style={{ 
              background: 'var(--foreground)',
              opacity: menuOpen ? 0 : 1 
            }}
          />
          <span 
            className="block w-5 h-[1.5px] transition-all duration-300 origin-center"
            style={{ 
              background: 'var(--foreground)',
              transform: menuOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none' 
            }}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div 
          className="md:hidden absolute top-full left-0 right-0 z-50 border-b flex flex-col items-center gap-8 py-12"
          style={{ 
            background: 'var(--background)', 
            borderColor: 'var(--gray-200)' 
          }}
        >
          <Link 
            href={`/${locale}`} 
            onClick={() => setMenuOpen(false)}
            className="text-xs uppercase tracking-[0.3em] transition-colors hover:text-[var(--color-living-coral)]"
            style={{ color: 'var(--gray-500)' }}
          >
            {t('navHome')}
          </Link>
          <Link 
            href={`/${locale}/write`} 
            onClick={() => setMenuOpen(false)}
            className="text-xs uppercase tracking-[0.3em] transition-colors hover:text-[var(--color-living-coral)]"
            style={{ color: 'var(--gray-500)' }}
          >
            {t('navWrite')}
          </Link>
          <div className="flex gap-4">
            <button 
              onClick={() => { switchLocale('id'); setMenuOpen(false); }} 
              className={`text-xs uppercase tracking-[0.2em] ${locale === 'id' ? 'font-bold text-foreground' : ''}`}
              style={locale !== 'id' ? { color: 'var(--gray-400)' } : {}}
            >
              ID
            </button>
            <span style={{ color: 'var(--gray-300)' }}>/</span>
            <button 
              onClick={() => { switchLocale('en'); setMenuOpen(false); }} 
              className={`text-xs uppercase tracking-[0.2em] ${locale === 'en' ? 'font-bold text-foreground' : ''}`}
              style={locale !== 'en' ? { color: 'var(--gray-400)' } : {}}
            >
              EN
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
