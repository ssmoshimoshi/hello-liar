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
  const particles = Array.from({ length: 300 }, (_, i) => {
    // Spread angle in radians (e.g. 360 deg = Math.PI * 2)
    const angleRange = Math.PI * 2;
    // Start angle so it centers pointing UP (-PI/2)
    const startAngle = -Math.PI / 2 - (angleRange / 2);
    const angle = startAngle + (Math.random() * angleRange);
    
    const distance = Math.random() * 500;
    const size = 0.5 + Math.random() * 2.5;
    
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size,
      delay: Math.random() * (3 * 0.3), // Stagger start times
      duration: 3 * 0.7 + Math.random() * (3 * 0.3)
    };
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-visible">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ 
            backgroundColor: color,
            width: p.size, 
            height: p.size
          }}
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
    // Total sequence is 4.2s (1.2s wait + 3s particle duration)
    const timer2 = setTimeout(() => onComplete(), 4200); 
    
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
          className="text-4xl font-mono tracking-[0.3em] mix-blend-multiply"
          style={{ color: '#8c312f' }}
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
        
        {showParticles && <ParticleBurst color="#8c312f" />}
      </div>
      
      {/* The Label */}
      <motion.span
        className="text-xs font-mono uppercase tracking-[0.5em] mt-4 mix-blend-multiply"
        style={{ color: '#8c312f' }}
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

    setLies(prev => {
      const newLies = [...prev];
      data.forEach(item => {
        if (!newLies.some(l => l.id === item.id)) {
          newLies.push(item);
        }
      });
      return newLies;
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLies(0);
  }, [fetchLies]);

  // Initial reveal for the very first card loaded
  useEffect(() => {
    if (!loading && lies.length > 0 && showCounter === null) {
      const t = setTimeout(() => setIsRevealing(false), 1200);
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
      
      {/* Counter Overlay is now handled internally by SwipeCard's back face */}

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
            showCounter={isTop ? showCounter : null}
            count={showCounter === 'empty' ? emptyCount : echoesCount}
            onCounterComplete={onCounterComplete}
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
  showCounter: 'empty' | 'echoes' | null;
  count: number;
  onCounterComplete: () => void;
}

function SwipeCard({ lie, isTop, isRevealing, isFirstCard, onSwipe, index, total, showCounter, count, onCounterComplete }: CardProps) {
  // Perfect Stacking (No Offset)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimation();
  
  // Dynamic rotation: wider range so high velocity throws cause more spin
  const rotate = useTransform(x, [-500, 0, 500], [-30, 0, 30]);
  const scale = 1;

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
    const velocityX = info.velocity.x;
    const velocityY = info.velocity.y;
    const offsetX = info.offset.x;

    // Check both offset and velocity for flick actions
    if (offsetX > threshold || velocityX > 400) {
      // Throw right with momentum
      const throwX = Math.max(500, velocityX * 0.8);
      const throwY = velocityY * 0.5; // follow Y momentum
      
      await controls.start({ 
        x: throwX, 
        y: throwY, 
        opacity: 0, 
        transition: { duration: 0.4, ease: 'easeOut' } 
      });
      onSwipe('right');
    } else if (offsetX < -threshold || velocityX < -400) {
      // Throw left with momentum
      const throwX = Math.min(-500, velocityX * 0.8);
      const throwY = velocityY * 0.5;
      
      await controls.start({ 
        x: throwX, 
        y: throwY, 
        opacity: 0, 
        transition: { duration: 0.4, ease: 'easeOut' } 
      });
      onSwipe('left');
    } else {
      // Snap back with spring to perfectly centered resting place
      controls.start({ 
        x: 0, 
        y: 0, 
        transition: { type: 'spring', stiffness: 400, damping: 25 } 
      });
    }
  };

  const content = (lie as any).content_id || lie.content_en;

  useEffect(() => {
    controls.start({ opacity: 1, scale: 1, transition: { duration: 0.3 } });
  }, [controls]);

  const getTextClasses = () => {
    if (content.length < 150) return 'text-[10px] md:text-xs tracking-[0.2em]';
    if (content.length < 300) return 'text-[9px] md:text-[10px] tracking-widest';
    if (content.length < 500) return 'text-[8px] md:text-[9px] tracking-widest';
    return 'text-[7px] md:text-[8px] tracking-widest leading-normal';
  };

  // The card is covered if it's NOT the top card, OR if it IS the top card but the reveal sequence is still running
  const showCover = !isTop || isRevealing;
  // Disable drag if it's currently revealing or not top
  const canDrag = isTop && !isRevealing;

  return (
    <motion.div
      className="absolute h-full aspect-[1/1.6] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
      style={{
        x,
        y,
        rotate,
        scale,
        zIndex: index,
        perspective: 1000
      }}
      drag={canDrag ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ opacity: 0, scale: 0.95 }}
    >
      {/* The 3D Wrapper that performs the 4-Step Human Flip */}
      <motion.div
        className="relative w-full h-full flex flex-col items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'center'
        }}
        initial={false}
        animate={
          showCover 
            ? {
                x: 0,
                y: 0,
                rotateY: -180,
                rotateX: 0,
                rotateZ: 0,
                scale: 1,
                opacity: 1
              }
            : {
                x: [0, -60, 30, 0],
                y: [0, -60, -20, 0],
                rotateY: [-180, -180, -90, 0],
                rotateX: [0, 10, 5, 0],
                rotateZ: [0, -15, 10, 0],
                scale: [1, 1.05, 1.08, 1],
                opacity: 1
              }
        }
        transition={{
          duration: showCover ? 0 : 1.4,
          ease: showCover ? 'linear' : 'easeInOut',
          times: showCover ? undefined : [0, 0.4, 0.7, 1]
        }}
      >
        
        {/* FRONT FACE (The Story) */}
        <motion.div 
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border-[0.5px] p-6 md:p-8 flex flex-col items-center justify-center"
          style={{ 
            backfaceVisibility: 'hidden',
            backgroundColor,
            borderColor,
            color: textColor,
          }}
        >
          {/* Author/Entry Number */}
          <div className="absolute top-6 left-6 flex items-center justify-between w-[calc(100%-3rem)] pointer-events-none opacity-40 z-10">
            <span className="font-mono text-[8px] md:text-[9px] tracking-widest uppercase">
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
          <div className="relative w-full flex-1 flex items-center justify-center z-10 pointer-events-none overflow-hidden">
            <p 
              className={`text-center leading-loose relative w-full ${getTextClasses()}`}
              style={{ fontFamily: 'var(--font-special-elite)' }}
            >
              &ldquo;{content}&rdquo;
            </p>
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

        {/* BACK FACE (Living Coral Cover & Counter) */}
        <motion.div 
          className="absolute inset-0 w-full h-full rounded-2xl flex flex-col items-center justify-center"
          style={{ 
            backgroundColor: 'var(--color-living-coral)',
            backfaceVisibility: 'hidden',
            rotateY: 180,
            pointerEvents: 'none'
          }}
        >
          {isTop && showCounter && (
            <div className="absolute inset-0 w-full h-full" style={{ transform: 'scaleX(-1)' }}>
              <SwipeCounter count={count} type={showCounter} onComplete={onCounterComplete} />
            </div>
          )}
        </motion.div>
        
      </motion.div>
    </motion.div>
  );
}
