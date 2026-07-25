'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface TransitionContextType {
  isExiting: boolean;
  setIsExiting: (value: boolean) => void;
  transitionPush: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  const transitionPush = (href: string) => {
    setIsExiting(true);
    
    setTimeout(() => {
      router.push(href);
    }, 350);
  };

  return (
    <TransitionContext.Provider value={{ isExiting, setIsExiting, transitionPush }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
}
