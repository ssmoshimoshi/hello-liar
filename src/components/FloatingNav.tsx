'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useTransition } from './TransitionContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import { triggerHaptic } from '@/lib/haptics';

export default function FloatingNav() {
  const locale = useLocale();
  const pathname = usePathname();
  const { transitionPush } = useTransition();
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
    transitionPush(newPath);
  };

  const handleReset = () => {
    triggerHaptic('light');
    localStorage.removeItem('hl_categories');
    window.location.reload();
  };

  // Left wing items (displayed right-to-left from center)
  const leftItems = [
    {
      id: 'home',
      label: locale === 'en' ? 'read' : 'selami',
      action: () => { triggerHaptic('light'); transitionPush(`/${locale}`); },
      active: isHome,
    },
    {
      id: 'gallery',
      label: locale === 'en' ? 'gallery' : 'wujud',
      action: () => { triggerHaptic('light'); transitionPush(`/${locale}/illustrated`); },
      active: isGallery,
    },
    {
      id: 'write',
      label: locale === 'en' ? 'write' : 'akui',
      action: () => { triggerHaptic('light'); transitionPush(`/${locale}/write`); },
      active: isWrite,
    },
  ];

  // Right wing items (displayed left-to-right from center)
  const rightItems = [
    {
      id: 'vault',
      label: locale === 'en' ? 'vault' : 'pusara',
      action: () => { triggerHaptic('light'); transitionPush(`/${locale}/vault`); },
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

  // Dual-Mode Navigation Architecture:
  // 1. Write Page Mode (EXCLUSIVELY): Luminous flat pure white text (#FFFFFF) with high opacity and zero drop shadows for clean, raw minimalism across all transitions.
  // 2. Standard Mode (ALL OTHER PAGES): STRICTLY UNTOUCHED. Standard idle gray with Living Coral (#FC766A) hover and #8c312f active.
  const containerOpacity = isWrite
    ? 'opacity-95 hover:opacity-100 focus-within:opacity-100 text-white'
    : 'opacity-65 hover:opacity-100 focus-within:opacity-100 text-current backdrop-blur-md bg-background/80';

  const labelBase = 'text-[8px] font-mono uppercase tracking-[0.12em] transition-all duration-300';
  const labelActive = isWrite
    ? 'font-bold underline underline-offset-4 text-white'
    : 'font-bold underline underline-offset-4 text-[#FC766A]';
  const labelIdle = isWrite
    ? 'opacity-90 hover:opacity-100 hover:underline hover:underline-offset-4 hover:text-white text-white'
    : 'opacity-65 hover:opacity-100 hover:underline hover:underline-offset-4 hover:text-[#FC766A] active:text-[#8c312f]';

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 flex items-center h-14 px-6 md:px-2 transition-all duration-700 select-none ${containerOpacity}`}
    >
      {/* Left half — flex-1 ensures identical width to right half, pushing items toward center on PC, edge-flush on mobile */}
      <div className="flex-1 flex items-center justify-between md:justify-end gap-x-1 md:gap-x-1">
        <AnimatePresence>
          {isOpen && leftItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => { playSound('click'); item.action(); setIsOpen(false); }}
              className="px-1.5 min-h-[48px] flex items-center justify-center focus:outline-none"
              initial={{ opacity: 0, x: 16, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26, delay: index * 0.04 }}
              aria-label={item.id}
            >
              <span className={`${labelBase} ${item.active ? labelActive : labelIdle}`}>
                {item.label}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Center toggle — mathematically anchored at exact midpoint of full-width bar */}
      <button
        onClick={handleToggle}
        className="mx-2 min-w-[48px] min-h-[48px] flex items-center justify-center text-current cursor-pointer focus:outline-none transition-transform duration-200 active:scale-90 shrink-0"
        aria-label="Toggle Navigation Wing"
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex items-center justify-center pointer-events-none"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </motion.div>
      </button>

      {/* Right half — flex-1 mirrors left half exactly */}
      <div className="flex-1 flex items-center justify-between md:justify-start gap-x-1 md:gap-x-1">
        <AnimatePresence>
          {isOpen && rightItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => { playSound('click'); item.action(); setIsOpen(false); }}
              className="px-1.5 min-h-[48px] flex items-center justify-center focus:outline-none"
              initial={{ opacity: 0, x: -16, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26, delay: index * 0.04 }}
              aria-label={item.id}
            >
              <span className={`${labelBase} ${item.active ? labelActive : labelIdle}`}>
                {item.label}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
