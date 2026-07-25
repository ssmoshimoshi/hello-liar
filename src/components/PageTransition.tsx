'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useTransition } from './TransitionContext';
import { useEffect } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isExiting, setIsExiting } = useTransition();

  useEffect(() => {
    setIsExiting(false);
  }, [pathname, setIsExiting]);

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
      animate={isExiting 
        ? { opacity: 0, filter: 'blur(12px)', scale: 1.05 } 
        : { opacity: 1, filter: 'blur(0px)', scale: 1 }}
      transition={{ duration: isExiting ? 0.35 : 0.45, ease: 'easeOut' }}
      className="flex-grow flex flex-col w-full h-full relative"
    >
      {children}
    </motion.div>
  );
}
