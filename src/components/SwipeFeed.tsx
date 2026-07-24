'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { addResonatedLie } from '@/lib/deviceAuth';
import type { Database } from '@/types/database';
import { useSoundEffect } from '@/hooks/useSoundEffect';

type Lie = Database['public']['Tables']['lies']['Row'];

interface Props {
  selectedCategories: string[];
}

// Particle component for the slow, magical dust effect
function ParticleBurst({ color }: { color: string }) {
  // Generate particles once on mount
  const particles = Array.from({ length: 40 }, (_, i) => {
    // Spread generally upwards (-PI/2 is straight up)
    const angle = (Math.random() * Math.PI) - Math.PI; 
    const distance = 30 + Math.random() * 100;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 50, // Bias upwards
      delay: Math.random() * 0.8,
      duration: 1.5 + Math.random() * 2 // Slow motion
    };
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-[2px] h-[2px] rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}` }}
          initial={{ x: 0, y: 0, opacity: 0.8 }}
          animate={{ x: p.x, y: p.y, opacity: 0 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

// Counter overlay shown between card transitions
function SwipeCounter({ count, type, onComplete }: { count: number; type: 'empty' | 'echoes'; onComplete: () => void }) {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    // Number stays solid for 1.2s, then turns into dust
    const timer1 = setTimeout(() => setShowParticles(true), 1200);
    // Total sequence is 3s before triggering the card reveal
    const timer2 = setTimeout(() => onComplete(), 3000); 
    
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [onComplete]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-40 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <div className="relative flex items-center justify-center">
        {/* The Number */}
        <motion.span
          className="text-6xl font-mono text-white mix-blend-plus-lighter"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: showParticles ? 0 : 0.9, 
            y: showParticles ? -15 : 0,
            filter: showParticles ? 'blur(8px)' : 'blur(0px)',
            scale: showParticles ? 1.1 : 1
          }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          {count}
        </motion.span>
        
        {showParticles && <ParticleBurst color="#ffffff" />}
      </div>
      
      {/* The Label */}
      <motion.span
        className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/60 mt-6 mix-blend-plus-lighter"
        initial={{ opacity: 0 }}
        animate={{ opacity: showParticles ? 0 : 0.6 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
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
  const { playSound } = useSoundEffect();
  
  // To show tutorial on first card
  const [isFirstCard, setIsFirstCard] = useState(true);

  // Global state for choreographing the "Reveal" transition
  const [isRevealing, setIsRevealing] = useState(true);

  // Swipe counters
  const [emptyCount, setEmptyCount] = useState(0);
  const [echoesCount, setEchoesCount] = useState(0);
  const [showCounter, setShowCounter] = useState<'empty' | 'echoes' | null>(null);

  const fetchLies = useCallback(async (pageNumber: number) => {
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

  // Initial reveal for the very first card loaded
  useEffect(() => {
    if (!loading && lies.length > 0 && showCounter === null) {
      const t = setTimeout(() => setIsRevealing(false), 800);
      return () => clearTimeout(t);
    }
  }, [loading, lies.length, showCounter]);

  const handleSwipe = async (direction: 'left' | 'right', lieId: string) => {
    setIsFirstCard(false);
    setIsRevealing(true); // Lock the next card immediately under a solid cover
    
    if (direction === 'left') {
      playSound('tear');
      setEmptyCount(prev => prev + 1);
      setShowCounter('empty');
    } else {
      playSound('heartbeat');
      setEchoesCount(prev => prev + 1);
      setShowCounter('echoes');
    }

    // Remove the swiped card. The next card visually becomes top but is covered.
    setLies(prev => prev.filter(l => l.id !== lieId));

    if (lies.length <= 3 && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchLies(nextPage);
    }

    if (direction === 'right') {
      addResonatedLie(lieId);
      await supabase.rpc('increment_resonate', { lie_id: lieId });
    } else {
      await supabase.rpc('increment_doubt', { lie_id: lieId });
    }
  };

  const onCounterComplete = useCallback(() => {
    setShowCounter(null);
    setIsRevealing(false); // Triggers the slow fade/blur out of the cover
  }, []);

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
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
        className="flex flex-col justify-center items-center h-[60vh] gap-6"
      >
        <h2 
          className="text-3xl md:text-4xl font-medium text-[var(--color-living-coral)] text-center"
          style={{ fontFamily: 'var(--font-baskerville)' }}
        >
          Keheningan.
        </h2>
        <p className="font-mono text-[var(--gray-400)] text-xs uppercase tracking-widest text-center px-6">
          Tidak ada lagi kebohongan untuk hari ini.
        </p>
        
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
          className="mt-8 font-mono text-[10px] uppercase tracking-widest text-[var(--color-living-coral)] border border-[var(--color-living-coral)] px-6 py-3 rounded-full hover:bg-[var(--color-living-coral)] hover:text-white transition-all duration-500 cursor-pointer"
        >
          Ganti Kategori
        </button>
      </motion.div>
    );
  }

  const stack = [...lies].reverse();

  return (
    <div className="relative w-full max-w-md mx-auto flex items-center justify-center perspective-1000" style={{ height: 'clamp(50vh, 65vh, 80vh)' }}>
      
      {/* Counter Overlay choreographed sequence */}
      <AnimatePresence>
        {showCounter && (
          <SwipeCounter 
            count={showCounter === 'empty' ? emptyCount : echoesCount} 
            type={showCounter} 
            onComplete={onCounterComplete}
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
            isRevealing={isRevealing}
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
  isRevealing: boolean;
  isFirstCard: boolean;
  onSwipe: (dir: 'left' | 'right') => void;
  index: number;
  total: number;
}

function SwipeCard({ lie, isTop, isRevealing, isFirstCard, onSwipe, index, total }: CardProps) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const scale = 1;
  const yOffset = 0;

  // Background and text color transitions for swipe directions
  const backgroundColor = useTransform(
    x,
    [-150, 0, 150],
    ['rgba(0,0,0,0.9)', 'rgba(255,255,255,1)', 'rgba(252,118,106,0.9)']
  );
  
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

  const strikeOpacity = useTransform(x, [0, -100], [0, 1]);
  const resonateOpacity = useTransform(x, [0, 100], [0, 1]);

  const handleDragEnd = async (e: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } });
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } });
      onSwipe('left');
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  const content = (lie as any).content_id || lie.content_en;

  useEffect(() => {
    controls.start({ opacity: 1, scale: 1, transition: { duration: 0.3 } });
  }, [controls]);

  const getTextClasses = () => {
    if (content.length < 50) return 'text-2xl md:text-3xl';
    if (content.length < 150) return 'text-xl md:text-2xl';
    if (content.length < 400) return 'text-base md:text-lg';
    return 'text-sm md:text-base';
  };

  // The card is covered if it's NOT the top card, OR if it IS the top card but the reveal sequence is still running
  const showCover = !isTop || isRevealing;
  // Disable drag if it's currently revealing or not top
  const canDrag = isTop && !isRevealing;

  return (
    <motion.div
      className="absolute w-full flex flex-col items-center justify-center p-8 md:p-12 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing border shadow-xl"
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
      drag={canDrag ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ opacity: 0, scale: 0.95 }}
    >
      {/* The Cover Layer (Solid Living Coral that slowly fades out to reveal the story) */}
      <motion.div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ backgroundColor: 'var(--color-living-coral)' }}
        initial={false}
        animate={{
          opacity: showCover ? 1 : 0,
          backdropFilter: showCover ? 'blur(20px)' : 'blur(0px)',
        }}
        transition={{
          duration: showCover ? 0.3 : 1.8, // Quick to cover, very slow and poetic to reveal
          ease: 'easeInOut'
        }}
      />

      <div className="absolute top-8 left-8 flex items-center justify-between w-[calc(100%-4rem)] pointer-events-none opacity-60 z-10">
        <span className="font-mono text-xs tracking-[0.3em]">
          Nᵒ {lie.id.slice(0, 8)}
        </span>
      </div>

      {isFirstCard && (
        <motion.div 
          className="absolute bottom-8 left-0 w-full flex justify-between px-8 text-[10px] font-mono tracking-widest uppercase opacity-40 pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span>&lt; Empty</span>
          <span>Echoes &gt;</span>
        </motion.div>
      )}

      {/* Core Content */}
      <div className="relative max-h-[60vh] overflow-y-auto z-10 scrollbar-hide">
        <p 
          className={`text-center leading-loose tracking-wide relative ${getTextClasses()}`}
          style={{ fontFamily: 'var(--font-special-elite)' }}
        >
          &ldquo;{content}&rdquo;
        </p>

        {/* X Strikethrough for Doubt */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: strikeOpacity }}
        >
          <svg className="w-full h-full opacity-80" preserveAspectRatio="none" viewBox="0 0 100 100">
            <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </motion.div>
      </div>

      {/* Direction Hints during drag */}
      <motion.div 
        className="absolute bottom-24 pointer-events-none text-[11px] font-mono uppercase tracking-[0.4em] z-10"
        style={{ opacity: strikeOpacity }}
      >
        empty
      </motion.div>

      <motion.div 
        className="absolute bottom-24 pointer-events-none text-[11px] font-mono uppercase tracking-[0.4em] z-10"
        style={{ opacity: resonateOpacity }}
      >
        echoes
      </motion.div>

    </motion.div>
  );
}
