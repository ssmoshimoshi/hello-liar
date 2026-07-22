'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { addResonatedLie } from '@/lib/deviceAuth';
import type { Database } from '@/types/database';

type Lie = Database['public']['Tables']['lies']['Row'];

interface Props {
  selectedCategories: string[];
}

export default function SwipeFeed({ selectedCategories }: Props) {
  const [lies, setLies] = useState<Lie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // To show tutorial on first card
  const [isFirstCard, setIsFirstCard] = useState(true);

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
  };

  if (loading && lies.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh] opacity-50">
        <div className="animate-pulse font-mono text-sm tracking-widest uppercase">Mengingat...</div>
      </div>
    );
  }

  if (lies.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="font-mono text-gray-500 text-sm uppercase tracking-widest text-center px-6">
          Tidak ada lagi kebohongan hari ini.
        </p>
      </div>
    );
  }

  // Reverse so the first item in array is on top of the stack visually
  const stack = [...lies].reverse();

  return (
    <div className="relative w-full max-w-md mx-auto h-[60vh] md:h-[70vh] flex items-center justify-center perspective-1000">
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

  // Background color blends (Solid colors only)
  const backgroundColor = useTransform(
    x,
    [-150, 0, 150],
    ['var(--background)', 'var(--foreground)', 'var(--color-living-coral)']
  );
  
  // Text color blends to maintain contrast
  const textColor = useTransform(
    x,
    [-150, 0, 150],
    ['var(--gray-500)', 'var(--background)', 'white']
  );

  const borderColor = useTransform(
    x,
    [-150, 0, 150],
    ['var(--gray-200)', 'transparent', 'transparent']
  );

  // Strikethrough for doubt (left)
  const strikeOpacity = useTransform(x, [0, -100], [0, 1]);
  
  // Stamp for resonate (right)
  const stampOpacity = useTransform(x, [0, 100], [0, 1]);
  const stampScale = useTransform(x, [0, 150], [2, 1]);

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

  return (
    <motion.div
      className="absolute w-full h-full flex flex-col items-center justify-center p-8 md:p-12 rounded-none overflow-hidden cursor-grab active:cursor-grabbing border"
      style={{
        x,
        rotate,
        scale,
        y: yOffset,
        zIndex: index,
        backgroundColor,
        borderColor,
        color: textColor
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ opacity: 0, scale: 0.95 }}
    >
      {/* Author ID at the top */}
      <div className="absolute top-8 left-8 flex items-center justify-between w-[calc(100%-4rem)] pointer-events-none opacity-50">
        <span className="text-[10px] font-mono uppercase tracking-[0.4em]">
          Nᵒ {lie.id.slice(0, 8)}
        </span>
      </div>

      {/* Doubt Effect: Strikethrough */}
      <motion.div 
        className="absolute w-[120%] h-2 bg-current rotate-[-5deg] z-10"
        style={{ opacity: strikeOpacity }}
      />

      {/* Resonate Effect: Stamp */}
      <motion.div 
        className="absolute z-10 pointer-events-none"
        style={{ opacity: stampOpacity, scale: stampScale }}
      >
        <div className="border-4 border-current px-6 py-2 text-3xl font-black font-mono tracking-widest uppercase rotate-[15deg]">
          RESONATED
        </div>
      </motion.div>

      {/* Tutorial Hint */}
      {isFirstCard && (
        <motion.div 
          className="absolute bottom-8 left-0 w-full flex justify-between px-8 text-[10px] font-mono tracking-widest uppercase opacity-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span>&lt; Doubt</span>
          <span>Resonate &gt;</span>
        </motion.div>
      )}

      {/* Core Content */}
      <p className={`font-[var(--font-playfair)] text-center leading-relaxed relative z-0 ${
        content.length < 50 ? 'text-4xl md:text-5xl' : 
        content.length < 150 ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
      }`}>
        &ldquo;{content}&rdquo;
      </p>

    </motion.div>
  );
}
