'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'Uang', 'Keluarga', 'Pasangan', 'Pertemanan', 
  'Karier', 'Diri Sendiri', 'Agama', 'Politik', 
  'Healing', 'Ghosting', 'Overthinking'
];

interface Props {
  onComplete: (selected: string[]) => void;
}

export default function CategoryOnboarding({ onComplete }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(true); // Default to true to prevent flash

  useEffect(() => {
    setIsClient(true);
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
    setHasCompleted(false);
  }, [onComplete]);

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
        className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6"
      >
        <div className="max-w-2xl w-full">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-[var(--font-playfair)] font-black mb-8 text-center"
          >
            Kebohongan apa yang ingin kamu baca hari ini?
          </motion.h1>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-2 border rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 ${
                  selected.includes(cat) 
                    ? 'border-[var(--color-living-coral)] bg-[var(--color-living-coral)] text-white' 
                    : 'border-white/20 text-gray-400 hover:border-white/50 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Conditional rendering for the button */}
          <div className="flex justify-center h-16">
            {selected.length > 0 && (
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleProceed}
                className="px-8 py-3 bg-white text-black font-mono text-sm uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors"
              >
                Masuk
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
