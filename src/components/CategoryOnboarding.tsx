'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';

const CATEGORIES = [
  { id: 'greed', idLabel: 'Keserakahan', enLabel: 'Greed' },
  { id: 'blood', idLabel: 'Darah', enLabel: 'Blood' },
  { id: 'lust', idLabel: 'Nafsu', enLabel: 'Lust' },
  { id: 'deceit', idLabel: 'Kepalsuan', enLabel: 'Deceit' },
  { id: 'ambition', idLabel: 'Ambisi', enLabel: 'Ambition' },
  { id: 'ego', idLabel: 'Ego', enLabel: 'Ego' },
  { id: 'sin', idLabel: 'Dosa', enLabel: 'Sin' },
  { id: 'power', idLabel: 'Kuasa', enLabel: 'Power' },
  { id: 'escape', idLabel: 'Pelarian', enLabel: 'Escape' },
  { id: 'coward', idLabel: 'Pengecut', enLabel: 'Cowardice' },
  { id: 'anxiety', idLabel: 'Gelisah', enLabel: 'Anxiety' }
];

interface Props {
  onComplete: (selected: string[]) => void;
}

export default function CategoryOnboarding({ onComplete }: Props) {
  const locale = useLocale();
  const [selected, setSelected] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(true); // Default to true to prevent flash

  useEffect(() => {
    setIsClient(true);
    /* TEMPORARY: Disabled for testing so it always shows on refresh
    const saved = localStorage.getItem('hl_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          onComplete(parsed);
          return; // Skip rendering onboarding
        }
      } catch (e) {}
    }
    */
    setHasCompleted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCategory = (cat: string) => {
    setSelected(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleProceed = () => {
    if (selected.length === 0) return;
    localStorage.setItem('hl_categories', JSON.stringify(selected));
    setHasCompleted(true);
    onComplete(selected);
  };

  if (!isClient || hasCompleted) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
      >
        <div className="max-w-2xl w-full">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-medium mb-8 text-center text-[var(--color-living-coral)]"
            style={{ fontFamily: 'var(--font-baskerville)' }}
          >
            {locale === 'en' ? 'What lie do you wish to dive into today?' : 'Dusta apa yang ingin kau selami hari ini?'}
          </motion.h1>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-between md:justify-center gap-y-4 md:gap-3 mb-12 w-full"
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors duration-300 ${
                  selected.includes(cat.id) 
                    ? 'text-[var(--color-living-coral)] font-bold' 
                    : 'text-[var(--gray-400)] hover:text-foreground'
                }`}
              >
                {locale === 'en' ? cat.enLabel : cat.idLabel}
              </button>
            ))}
          </motion.div>

          {/* Conditional rendering for the button */}
          <div className="flex justify-center h-16 mt-8">
            {selected.length > 0 && (
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleProceed}
                className="px-8 py-3 text-foreground font-mono text-sm uppercase tracking-widest font-bold hover:text-[var(--color-living-coral)] transition-colors"
              >
                {locale === 'en' ? 'Open the Gates' : 'Buka Gerbang'}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
