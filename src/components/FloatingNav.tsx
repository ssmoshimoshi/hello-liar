'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundEffect } from '@/hooks/useSoundEffect';

export default function FloatingNav() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { playSound } = useSoundEffect();

  const isHome = pathname === `/${locale}`;
  const isWrite = pathname === `/${locale}/write`;
  const isGallery = pathname === `/${locale}/illustrated`;
  const isVault = pathname.includes('/vault');

  const switchLocale = (newLocale: string) => {
    if (locale === newLocale) return;
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const handleReset = () => {
    localStorage.removeItem('hl_categories');
    window.location.reload();
  };

  const navItems = [
    {
      id: 'home',
      label: locale === 'en' ? 'read' : 'baca',
      action: () => router.push(`/${locale}`),
      active: isHome,
    },
    {
      id: 'gallery',
      label: locale === 'en' ? 'gallery' : 'galeri',
      action: () => router.push(`/${locale}/illustrated`),
      active: isGallery,
    },
    {
      id: 'write',
      label: locale === 'en' ? 'write' : 'tulis',
      action: () => router.push(`/${locale}/write`),
      active: isWrite,
    },
    {
      id: 'vault',
      label: locale === 'en' ? 'vault' : 'arsip',
      action: () => router.push(`/${locale}/vault`),
      active: isVault,
    },
    {
      id: 'reset',
      label: 'reset',
      action: handleReset,
      active: false,
    },
    {
      id: 'lang',
      label: locale === 'en' ? 'ID' : 'EN',
      action: () => switchLocale(locale === 'en' ? 'id' : 'en'),
      active: false,
    },
  ];

  const menuToggleLabel = isOpen 
    ? (locale === 'en' ? 'close' : 'tutup') 
    : 'menu';

  return (
    <>
      {/* Subtle Dark/Blur Backdrop when ghost menu open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 backdrop-blur-md"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        
        {/* Ghost Stacking Menu Items */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="flex flex-col-reverse items-center gap-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    playSound('click');
                    item.action();
                    setIsOpen(false);
                  }}
                  /* Generous invisible padding for layperson thumbs (py-2.5 px-8) on naked text */
                  className="py-2.5 px-8 transition-all duration-300 select-none group focus:outline-none"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ 
                    duration: 0.35,
                    delay: index * 0.05,
                    ease: 'easeOut'
                  }}
                  aria-label={item.id}
                >
                  <span 
                    className={`text-xs md:text-sm font-mono uppercase tracking-[0.4em] transition-all duration-300 ${
                      item.active 
                        ? 'text-[var(--color-living-coral)] font-bold scale-110 tracking-[0.5em] block drop-shadow-[0_0_8px_rgba(252,118,106,0.5)]' 
                        : 'text-foreground/60 group-hover:text-foreground group-hover:tracking-[0.5em] group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]'
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transparent Ghost Trigger Button (No borders, no icons, purely typography with hit expansion) */}
        <button
          onClick={() => {
            playSound('click');
            setIsOpen(!isOpen);
          }}
          /* Huge touch area padding (p-4) on a tiny text element */
          className={`p-4 font-mono text-[10px] md:text-xs uppercase tracking-[0.5em] transition-all duration-500 select-none cursor-pointer focus:outline-none ${
            isOpen
              ? 'text-[var(--color-living-coral)] font-bold drop-shadow-[0_0_12px_rgba(252,118,106,0.8)] opacity-100'
              : 'text-foreground/40 hover:text-[var(--color-living-coral)] hover:opacity-100 hover:tracking-[0.6em]'
          }`}
          aria-label="Navigation Menu"
        >
          {menuToggleLabel}
        </button>
      </div>
    </>
  );
}
