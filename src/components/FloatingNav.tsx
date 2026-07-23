'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingNav() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

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

  const navItems = [
    {
      id: 'home',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
        </svg>
      ),
      action: () => router.push(`/${locale}`),
      active: isHome,
    },
    {
      id: 'gallery',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      ),
      action: () => router.push(`/${locale}/illustrated`),
      active: isGallery,
    },
    {
      id: 'write',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/><path d="m15 5 3 3"/>
        </svg>
      ),
      action: () => router.push(`/${locale}/write`),
      active: isWrite,
    },
    {
      id: 'vault',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
        </svg>
      ),
      action: () => router.push(`/${locale}/vault`),
      active: isVault,
    },
    {
      id: 'lang',
      icon: <span className="text-[11px] font-sans font-bold uppercase">{locale}</span>,
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
            className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm"
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
                  item.action();
                  setIsOpen(false);
                }}
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center shadow-lg border backdrop-blur-md transition-colors ${
                  item.active 
                    ? 'bg-foreground text-background border-transparent' 
                    : 'bg-background/80 text-foreground border-border hover:bg-muted'
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
                {item.icon}
              </motion.button>
            );
          })}
        </div>

        {/* Main FAB */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
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
