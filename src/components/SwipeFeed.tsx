'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { addResonatedLie } from '@/lib/deviceAuth';
import type { Database } from '@/types/database';

type Lie = Database['public']['Tables']['lies']['Row'];

interface Props {
  selectedCategories: string[];
}

// Particle component for the counter burst effect
function ParticleBurst({ color }: { color: string }) {
  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const distance = 40 + Math.random() * 60;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

// Counter overlay shown between card transitions
function SwipeCounter({ count, type }: { count: number; type: 'empty' | 'echoes' }) {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowParticles(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative">
        <motion.span
          className="text-5xl font-mono font-bold text-[var(--color-living-coral)]"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: showParticles ? 0 : 1, opacity: showParticles ? 0 : 1 }}
          transition={{ 
            scale: { type: 'spring', stiffness: 300, damping: 15 },
            opacity: { duration: 0.2, delay: showParticles ? 0 : 0 }
          }}
        >
          {count}
        </motion.span>
        
        {showParticles && <ParticleBurst color="var(--color-living-coral)" />}
      </div>
      
      <motion.span
        className="text-[10px] font-mono uppercase tracking-[0.4em] text-[var(--gray-400)] mt-4"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: showParticles ? 0 : 0.6, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {type}
      </motion.span>
    </motion.div>
  );
}

export default function SwipeFeed({ selectedCategories }: Props) {
  const [lies, setLies] = useState<Lie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // To show tutorial on first card
  const [isFirstCard, setIsFirstCard] = useState(true);

  // Swipe counters
  const [emptyCount, setEmptyCount] = useState(0);
  const [echoesCount, setEchoesCount] = useState(0);
  const [showCounter, setShowCounter] = useState<'empty' | 'echoes' | null>(null);

  const fetchLies = useCallback(async (pageNumber: number) => {
    // Note: In MVP, we fetch all. Later, filter by selectedCategories using .overlaps('categories', selectedCategories)
    const limit = 10;
    const from = pageNumber * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('lies')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching lies:', error);
      return;
    }

    if (data.length < limit) {
      setHasMore(false);
    }

    setLies(prev => [...prev, ...data]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLies(0);
  }, [fetchLies]);

  const handleSwipe = async (direction: 'left' | 'right', lieId: string) => {
    setIsFirstCard(false);
    
    // Show counter animation
    if (direction === 'left') {
      setEmptyCount(prev => prev + 1);
      setShowCounter('empty');
    } else {
      setEchoesCount(prev => prev + 1);
      setShowCounter('echoes');
    }

    // Remove the card from local state
    setLies(prev => prev.filter(l => l.id !== lieId));

    // Fetch more if running low
    if (lies.length <= 3 && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchLies(nextPage);
    }

    if (direction === 'right') {
      // Resonate
      addResonatedLie(lieId);
      await supabase.rpc('increment_resonate', { lie_id: lieId });
    } else {
      // Doubt
      await supabase.rpc('increment_doubt', { lie_id: lieId });
    }

    // Clear counter after animation completes
    setTimeout(() => setShowCounter(null), 800);
  };

  if (loading && lies.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh] opacity-50">
        <div className="animate-pulse font-mono text-sm tracking-widest uppercase">Mengingat...</div>
      </div>
    );
  }

  // Empty state: all stories exhausted
  if (lies.length === 0 && !loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-6">
        <h2 
          className="text-3xl md:text-4xl font-medium text-[var(--color-living-coral)] text-center"
          style={{ fontFamily: 'var(--font-baskerville)' }}
        >
          Keheningan.
        </h2>
        <p className="font-mono text-[var(--gray-400)] text-xs uppercase tracking-widest text-center px-6">
          Tidak ada lagi kebohongan untuk hari ini.
        </p>
        
        {/* Stats summary */}
        {(emptyCount > 0 || echoesCount > 0) && (
          <div className="flex gap-8 mt-4 font-mono text-xs uppercase tracking-widest">
            <span className="text-[var(--gray-400)]">empty: <span className="text-foreground">{emptyCount}</span></span>
            <span className="text-[var(--gray-400)]">echoes: <span className="text-foreground">{echoesCount}</span></span>
          </div>
        )}
        
        <button
          onClick={() => {
            localStorage.removeItem('hl_categories');
            window.location.reload();
          }}
          className="mt-4 font-mono text-[10px] uppercase tracking-widest text-[var(--color-living-coral)] hover:text-foreground transition-colors cursor-pointer"
        >
          ganti kategori
        </button>
      </div>
    );
  }

  // Reverse so the first item in array is on top of the stack visually
  const stack = [...lies].reverse();

  return (
    <div className="relative w-full max-w-md mx-auto flex items-center justify-center" style={{ height: 'clamp(50vh, 65vh, 80vh)' }}>
      
      {/* Counter Overlay */}
      <AnimatePresence>
        {showCounter && (
          <SwipeCounter 
            count={showCounter === 'empty' ? emptyCount : echoesCount} 
            type={showCounter} 
          />
        )}
      </AnimatePresence>

      {stack.map((lie, index) => {
        const isTop = index === stack.length - 1;
        return (
          <SwipeCard 
            key={lie.id}
            lie={lie}
            isTop={isTop}
            isFirstCard={isFirstCard && isTop}
            onSwipe={(dir) => handleSwipe(dir, lie.id)}
            index={index}
            total={stack.length}
          />
        );
      })}
    </div>
  );
}

interface CardProps {
  lie: Lie;
  isTop: boolean;
  isFirstCard: boolean;
  onSwipe: (dir: 'left' | 'right') => void;
  index: number;
  total: number;
}

function SwipeCard({ lie, isTop, isFirstCard, onSwipe, index, total }: CardProps) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  // Hide stack visually (Single Card Illusion)
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const scale = 1; // No scale down for cards underneath
  const yOffset = 0; // No y-offset for cards underneath

  // Background color blends (White -> Left: Black, Right: Living Coral with opacity)
  const backgroundColor = useTransform(
    x,
    [-150, 0, 150],
    ['rgba(0,0,0,0.9)', 'rgba(255,255,255,1)', 'rgba(252,118,106,0.9)']
  );
  
  // Text color blends
  const textColor = useTransform(
    x,
    [-150, 0, 150],
    ['rgba(255,255,255,1)', 'rgba(0,0,0,1)', 'rgba(255,255,255,1)']
  );

  const borderColor = useTransform(
    x,
    [-150, 0, 150],
    ['rgba(255,255,255,0.1)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.1)']
  );

  // Strikethrough for doubt (left)
  const strikeOpacity = useTransform(x, [0, -100], [0, 1]);
  
  // "echoes" for resonate (right)
  const resonateOpacity = useTransform(x, [0, 100], [0, 1]);

  const handleDragEnd = async (e: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe('left');
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  const content = (lie as any).content_id || lie.content_en;

  useEffect(() => {
    controls.start({ opacity: 1, scale: 1, transition: { duration: 0.3 } });
  }, [controls]);

  // Dynamic text sizing based on content length
  const getTextClasses = () => {
    if (content.length < 50) return 'text-2xl md:text-3xl';
    if (content.length < 150) return 'text-xl md:text-2xl';
    if (content.length < 400) return 'text-base md:text-lg';
    return 'text-sm md:text-base';
  };

  return (
    <motion.div
      className="absolute w-full flex flex-col items-center justify-center p-8 md:p-12 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing border backdrop-blur-md"
      style={{
        x,
        rotate,
        scale,
        y: yOffset,
        zIndex: index,
        backgroundColor,
        borderColor,
        color: textColor,
        minHeight: '50vh',
        maxHeight: '80vh',
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ opacity: 0, scale: 0.95 }}
    >
      {/* Author ID at the top */}
      <div className="absolute top-8 left-8 flex items-center justify-between w-[calc(100%-4rem)] pointer-events-none opacity-60">
        <span className="font-mono text-xs tracking-[0.3em]">
          Nᵒ {lie.id.slice(0, 8)}
        </span>
      </div>

      {/* Tutorial Hint */}
      {isFirstCard && (
        <motion.div 
          className="absolute bottom-8 left-0 w-full flex justify-between px-8 text-[10px] font-mono tracking-widest uppercase opacity-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span>&lt; Empty</span>
          <span>Echoes &gt;</span>
        </motion.div>
      )}

      {/* Core Content with X Strikethrough overlaid */}
      <div className="relative max-h-[60vh] overflow-y-auto">
        <p 
          className={`text-center leading-loose tracking-wide relative z-0 ${getTextClasses()}`}
          style={{ fontFamily: 'var(--font-special-elite)' }}
        >
          &ldquo;{content}&rdquo;
        </p>

        {/* X Strikethrough bounded exactly to the text dimensions */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{ opacity: strikeOpacity }}
        >
          <svg className="w-full h-full opacity-80" preserveAspectRatio="none" viewBox="0 0 100 100">
            <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </motion.div>
      </div>

      {/* Doubt Effect: "empty" */}
      <motion.div 
        className="absolute bottom-24 pointer-events-none text-[11px] font-mono uppercase tracking-[0.4em]"
        style={{ opacity: strikeOpacity }}
      >
        empty
      </motion.div>

      {/* Resonate Effect: "echoes" */}
      <motion.div 
        className="absolute bottom-24 pointer-events-none text-[11px] font-mono uppercase tracking-[0.4em]"
        style={{ opacity: resonateOpacity }}
      >
        echoes
      </motion.div>

    </motion.div>
  );
}
