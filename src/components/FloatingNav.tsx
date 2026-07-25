'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import { triggerHaptic } from '@/lib/haptics';

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
    triggerHaptic('light');
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const handleReset = () => {
    triggerHaptic('light');
    localStorage.removeItem('hl_categories');
    window.location.reload();
  };

  const leftItems = [
    {
      id: 'home',
      label: locale === 'en' ? 'read' : 'baca',
      action: () => { triggerHaptic('light'); router.push(`/${locale}`); },
      active: isHome,
    },
    {
      id: 'gallery',
      label: locale === 'en' ? 'gallery' : 'galeri',
      action: () => { triggerHaptic('light'); router.push(`/${locale}/illustrated`); },
      active: isGallery,
    },
    {
      id: 'write',
      label: locale === 'en' ? 'write' : 'tulis',
      action: () => { triggerHaptic('light'); router.push(`/${locale}/write`); },
      active: isWrite,
    },
  ];

  const rightItems = [
    {
      id: 'vault',
      label: locale === 'en' ? 'vault' : 'arsip',
      action: () => { triggerHaptic('light'); router.push(`/${locale}/vault`); },
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

  const handleToggle = () => {
    playSound('click');
    triggerHaptic(isOpen ? 'light' : 'pulse');
    setIsOpen(!isOpen);
  };

  // Pure optical adaptive contrast engine without blur or fog halos
  const containerOpacity = isOpen ? 'opacity-100' : isWrite ? 'opacity-20 hover:opacity-100' : 'opacity-45 hover:opacity-100';

  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center transition-opacity duration-700 select-none ${containerOpacity}`}
      style={{ mixBlendMode: 'difference' }}
    >
      {/* Pivot container ensures central toggle is immovably anchored at exactly 50% axis */}
      <div className="relative flex items-center justify-center text-white">
        
        {/* Left Horizontal Wing (Absolutely Anchored to the Left of Toggle) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="absolute right-full mr-1 sm:mr-2 flex items-center gap-1 sm:gap-3 overflow-hidden pr-1 whitespace-nowrap"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            >
              {leftItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    playSound('click');
                    item.action();
                    setIsOpen(false);
                  }}
                  className="px-2 py-3.5 min-w-[44px] min-h-[48px] flex items-center justify-center transition-all duration-300 group focus:outline-none"
                  initial={{ opacity: 0, x: 25, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 15, scale: 0.8 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    delay: index * 0.04,
                  }}
                  aria-label={item.id}
                >
                  <span 
                    className={`text-[9px] sm:text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.35em] transition-all duration-300 ${
                      item.active 
                        ? 'font-bold underline underline-offset-4 scale-105' 
                        : 'opacity-75 hover:opacity-100 hover:tracking-[0.4em]'
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimalist Bare (+) / (x) Trigger with 48x48px Invisible Touch Padding & Zero Center Shift */}
        <button
          onClick={handleToggle}
          className="relative z-10 min-w-[48px] min-h-[48px] p-2 flex items-center justify-center text-white cursor-pointer select-none focus:outline-none transition-transform duration-300 active:scale-95"
          aria-label="Toggle Navigation Wing"
        >
          <motion.div
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center justify-center pointer-events-none"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="square" 
              strokeLinejoin="miter"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </motion.div>
        </button>

        {/* Right Horizontal Wing (Absolutely Anchored to the Right of Toggle) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="absolute left-full ml-1 sm:ml-2 flex items-center gap-1 sm:gap-3 overflow-hidden pl-1 whitespace-nowrap"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            >
              {rightItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    playSound('click');
                    item.action();
                    setIsOpen(false);
                  }}
                  className="px-2 py-3.5 min-w-[44px] min-h-[48px] flex items-center justify-center transition-all duration-300 group focus:outline-none"
                  initial={{ opacity: 0, x: -25, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -15, scale: 0.8 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    delay: index * 0.04,
                  }}
                  aria-label={item.id}
                >
                  <span 
                    className={`text-[9px] sm:text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.35em] transition-all duration-300 ${
                      item.active 
                        ? 'font-bold underline underline-offset-4 scale-105' 
                        : 'opacity-75 hover:opacity-100 hover:tracking-[0.4em]'
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
