'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundEffect } from '@/hooks/useSoundEffect';

export default function FloatingNav() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { playSound } = useSoundEffect();

  const isHome = pathname === `/${locale}`;

  // Hide nav on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      if (isHome) {
        setIsVisible(true);
        return;
      }
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down
        setIsOpen(false);
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
  const isVault = pathname.includes('/vault');

  const RADIUS = 90; // Distance of items from center

  const handleReset = () => {
    localStorage.removeItem('hl_categories');
    window.location.reload();
  };

  const navItems = [
    {
      id: 'home',
      label: 'read',
      action: () => router.push(`/${locale}`),
      active: isHome,
    },
    {
      id: 'gallery',
      label: 'gallery',
      action: () => router.push(`/${locale}/illustrated`),
      active: isGallery,
    },
    {
      id: 'write',
      label: 'write',
      action: () => router.push(`/${locale}/write`),
      active: isWrite,
    },
    {
      id: 'vault',
      label: 'vault',
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

  return (
    <>
      {/* Backdrop blur when menu is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(252, 118, 106, 0.15)' }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-transform duration-500 ease-in-out flex justify-center items-center ${
          isVisible ? 'translate-y-0' : 'translate-y-24 pointer-events-none'
        }`}
      >
        {/* Radial Items */}
        <div className="absolute inset-0 flex justify-center items-center">
          {navItems.map((item, index) => {
            // Calculate angle from 180 deg to 0 deg (Left to Right)
            const angle = Math.PI - (index * (Math.PI / (navItems.length - 1)));
            const x = Math.cos(angle) * RADIUS;
            const y = -Math.sin(angle) * RADIUS;

            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  playSound('click');
                  item.action();
                  setIsOpen(false);
                }}
                className={`absolute w-14 h-14 rounded-full flex items-center justify-center shadow-sm border backdrop-blur-md transition-colors ${
                  item.active 
                    ? 'bg-background text-foreground border-[var(--gray-300)]' 
                    : 'bg-background/90 text-[var(--gray-400)] border-[var(--gray-200)] hover:text-foreground hover:border-[var(--gray-300)]'
                }`}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{ 
                  x: isOpen ? x : 0, 
                  y: isOpen ? y : 0, 
                  opacity: isOpen ? 1 : 0,
                  scale: isOpen ? 1 : 0,
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 20, 
                  delay: isOpen ? index * 0.05 : 0 
                }}
                aria-label={item.id}
              >
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider">{item.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Main FAB */}
        <motion.button
          onClick={() => {
            playSound('click');
            setIsOpen(!isOpen);
          }}
          className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-colors duration-300 ${
            isOpen ? 'bg-[var(--color-living-coral)] text-white' : 'bg-foreground text-background'
          }`}
          whileTap={{ scale: 0.9 }}
          aria-label="Menu"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Morphing + to x icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14"/><path d="M5 12h14"/>
            </svg>
          </motion.div>
        </motion.button>
      </div>
    </>
  );
}
