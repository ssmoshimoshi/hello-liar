'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo, AnimatePresence } from 'framer-motion';

export default function SwipeSandboxPage() {
  // Swipe Physics Controls
  const [dragThreshold, setDragThreshold] = useState(100);
  const [velMultiplier, setVelMultiplier] = useState(0.8);
  const [rotateRange, setRotateRange] = useState(30);
  
  // Shadow System Controls
  const [shadowBlur, setShadowBlur] = useState(20);
  const [shadowSpread, setShadowSpread] = useState(0);
  const [shadowOpacity, setShadowOpacity] = useState(0.1);
  const [lightOffsetX, setLightOffsetX] = useState(0);
  const [lightOffsetY, setLightOffsetY] = useState(20);

  // Imperfect Stacking Controls
  const [stackMaxOffsetX, setStackMaxOffsetX] = useState(12);
  const [stackMaxOffsetY, setStackMaxOffsetY] = useState(12);
  const [stackMaxRotate, setStackMaxRotate] = useState(6);

  // 3D Flip Reveal Controls
  const [flipDuration, setFlipDuration] = useState(1.4);
  const [flipArcY, setFlipArcY] = useState(-60);
  const [flipArcX, setFlipArcX] = useState(-60);

  // To re-mount and run the flip animation again
  const [trigger, setTrigger] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-mono text-xs overflow-hidden">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-1/3 border-r border-[var(--gray-200)] p-8 bg-background flex flex-col gap-6 h-screen overflow-y-auto relative z-10">
        <h1 className="text-xl font-bold mb-4">Swipe & Stack Physics</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-sm border-b border-[var(--gray-200)] pb-2 mb-4 font-bold text-[var(--color-living-coral)] uppercase tracking-widest">Kinetika Tarikan (Swipe)</h2>
            <Control label="Drag Threshold (px)" value={dragThreshold} min={20} max={200} step={10} onChange={setDragThreshold} />
            <Control label="Velocity Multiplier" value={velMultiplier} min={0.1} max={2.0} step={0.1} onChange={setVelMultiplier} />
            <Control label="Max Rotation (deg)" value={rotateRange} min={10} max={90} step={5} onChange={setRotateRange} />
          </div>

          <div>
            <h2 className="text-sm border-b border-[var(--gray-200)] pb-2 mb-4 font-bold text-[var(--color-living-coral)] uppercase tracking-widest">Sistem Kedalaman Bayangan</h2>
            <Control label="Shadow Blur (px)" value={shadowBlur} min={0} max={100} step={1} onChange={setShadowBlur} />
            <Control label="Shadow Spread (px)" value={shadowSpread} min={-20} max={50} step={1} onChange={setShadowSpread} />
            <Control label="Shadow Opacity" value={shadowOpacity} min={0} max={1} step={0.05} onChange={setShadowOpacity} />
            <Control label="Light Offset X (px)" value={lightOffsetX} min={-50} max={50} step={1} onChange={setLightOffsetX} />
            <Control label="Light Offset Y (px)" value={lightOffsetY} min={-50} max={50} step={1} onChange={setLightOffsetY} />
          </div>

          <div>
            <h2 className="text-sm border-b border-[var(--gray-200)] pb-2 mb-4 font-bold text-[var(--color-living-coral)] uppercase tracking-widest">Kinetika Tumpukan (Stack)</h2>
            <Control label="Max Offset X (px)" value={stackMaxOffsetX} min={0} max={50} step={1} onChange={setStackMaxOffsetX} />
            <Control label="Max Offset Y (px)" value={stackMaxOffsetY} min={0} max={50} step={1} onChange={setStackMaxOffsetY} />
            <Control label="Max Rotation (deg)" value={stackMaxRotate} min={0} max={30} step={1} onChange={setStackMaxRotate} />
          </div>

          <div>
            <h2 className="text-sm border-b border-[var(--gray-200)] pb-2 mb-4 font-bold text-[var(--color-living-coral)] uppercase tracking-widest">Kinetika Bukaan (3D Flip)</h2>
            <Control label="Flip Duration (s)" value={flipDuration} min={0.2} max={3.0} step={0.1} onChange={setFlipDuration} />
            <Control label="Peak Arc Y (px - Loncatan Atas)" value={flipArcY} min={-200} max={0} step={5} onChange={setFlipArcY} />
            <Control label="Peak Arc X (px - Loncatan Samping)" value={flipArcX} min={-200} max={200} step={5} onChange={setFlipArcX} />
          </div>
        </div>

        <button 
          onClick={() => setTrigger(prev => prev + 1)}
          className="mt-4 border border-[var(--color-living-coral)] text-[var(--color-living-coral)] py-3 rounded-md hover:bg-[var(--color-living-coral)] hover:text-white transition-all font-bold tracking-widest uppercase flex-shrink-0"
        >
          RESET TUMPUKAN KARTU
        </button>

        <div className="mt-8 p-4 bg-black text-[var(--color-living-coral)] rounded-md overflow-x-auto whitespace-pre-wrap font-mono flex-shrink-0">
          <pre>
{`// Salin block ini untuk saya:
{
  dragThreshold: ${dragThreshold},
  velMultiplier: ${velMultiplier},
  rotateRange: ${rotateRange},
  shadowBlur: ${shadowBlur},
  shadowSpread: ${shadowSpread},
  shadowOpacity: ${shadowOpacity},
  lightOffsetX: ${lightOffsetX},
  lightOffsetY: ${lightOffsetY},
  stackMaxOffsetX: ${stackMaxOffsetX},
  stackMaxOffsetY: ${stackMaxOffsetY},
  stackMaxRotate: ${stackMaxRotate},
  flipDuration: ${flipDuration},
  flipArcY: ${flipArcY},
  flipArcX: ${flipArcX}
}`}
          </pre>
          <p className="mt-4 text-white/50 text-[10px]">Pilih parameter terbaik yang menciptakan kedalaman bayangan & momentum fisik.</p>
        </div>
      </div>

      {/* Simulator Area */}
      <div className="w-full md:w-2/3 h-screen bg-[var(--gray-100)] relative overflow-hidden flex items-center justify-center">
        <p className="absolute top-8 left-8 text-[var(--gray-400)] tracking-widest uppercase z-10 pointer-events-none">Interactive Simulator</p>
        
        <CardStack 
          key={trigger}
          dragThreshold={dragThreshold}
          velMultiplier={velMultiplier}
          rotateRange={rotateRange}
          shadowBlur={shadowBlur}
          shadowSpread={shadowSpread}
          shadowOpacity={shadowOpacity}
          lightOffsetX={lightOffsetX}
          lightOffsetY={lightOffsetY}
          stackMaxOffsetX={stackMaxOffsetX}
          stackMaxOffsetY={stackMaxOffsetY}
          stackMaxRotate={stackMaxRotate}
          flipDuration={flipDuration}
          flipArcY={flipArcY}
          flipArcX={flipArcX}
          onTriggerFlip={() => setTrigger(prev => prev + 1)}
        />
      </div>

    </div>
  );
}

function Control({ label, value, min, max, step, onChange }: any) {
  return (
    <div className="flex flex-col gap-2 mb-3">
      <div className="flex justify-between text-[10px] uppercase tracking-widest">
        <span>{label}</span>
        <span className="text-[var(--color-living-coral)] font-bold">{parseFloat(value).toFixed(2)}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[var(--color-living-coral)] cursor-ew-resize"
      />
    </div>
  );
}

// Mock Stack of Cards
function CardStack({ 
  dragThreshold, velMultiplier, rotateRange, 
  shadowBlur, shadowSpread, shadowOpacity, lightOffsetX, lightOffsetY,
  stackMaxOffsetX, stackMaxOffsetY, stackMaxRotate,
  flipDuration, flipArcY, flipArcX, onTriggerFlip
}: any) {
  const [cards, setCards] = useState([3, 2, 1]); // ID of cards
  // Simulate the reveal state (global for the top card)
  const [isRevealing, setIsRevealing] = useState(true);

  // When stack is initialized, start reveal sequence
  useEffect(() => {
    setIsRevealing(true);
    const t = setTimeout(() => setIsRevealing(false), 100);
    return () => clearTimeout(t);
  }, []);

  if (cards.length === 0) {
    return <div className="text-center text-[var(--gray-400)] tracking-widest uppercase">Kosong.<br/><span className="text-[10px]">Klik tombol reset di panel kiri.</span></div>;
  }

  const handleRemove = (id: number) => {
    setCards(prev => prev.filter(c => c !== id));
    setIsRevealing(true);
    // After removing the top card, the next card starts revealing immediately
    setTimeout(() => setIsRevealing(false), 100);
  };

  return (
    <div className="relative w-full max-w-md mx-auto flex items-center justify-center perspective-1000 h-[60vh]">
      <AnimatePresence>
        {cards.map((id, index) => {
          const isTop = index === cards.length - 1;
          return (
            <SimulatorCard 
              key={id}
              id={id}
              isTop={isTop}
              isRevealing={isRevealing}
              index={index}
              onRemove={() => handleRemove(id)}
              config={{
                dragThreshold, velMultiplier, rotateRange, 
                shadowBlur, shadowSpread, shadowOpacity, lightOffsetX, lightOffsetY,
                stackMaxOffsetX, stackMaxOffsetY, stackMaxRotate,
                flipDuration, flipArcY, flipArcX
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function SimulatorCard({ id, isTop, isRevealing, index, onRemove, config }: any) {
  const grabOffset = useRef({ x: 0, y: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimation();

  // Imperfect Stacking (Random Offset based on configured limits)
  const [offset] = useState(() => ({
    x: (Math.random() - 0.5) * (config.stackMaxOffsetX * 2),
    y: (Math.random() - 0.5) * (config.stackMaxOffsetY * 2),
    r: (Math.random() - 0.5) * (config.stackMaxRotate * 2)
  }));

  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    // Normalized from -1 (top) to +1 (bottom)
    const normalizedY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    grabOffset.current.y = normalizedY;
  };

  // Dinamika Sudut (Corner Pulling Physics)
  // Memutar kartu ke arah yang tepat berdasarkan titik mana yang ditarik.
  const rotate = useTransform(x, [-500, 500], [
    -config.rotateRange * (grabOffset.current.y || 0.1), // if grab top (-1), pulling left (-500) -> positive rotation
    config.rotateRange * (grabOffset.current.y || 0.1)
  ]);

  const handleDragEnd = async (e: any, info: PanInfo) => {
    const velocityX = info.velocity.x;
    const velocityY = info.velocity.y;
    const offsetX = info.offset.x;

    if (Math.abs(offsetX) > config.dragThreshold || Math.abs(velocityX) > 400) {
      const throwX = (offsetX > 0 ? 500 : -500) + (velocityX * config.velMultiplier);
      const throwY = velocityY * config.velMultiplier;
      
      await controls.start({ 
        x: throwX, 
        y: throwY, 
        opacity: 0, 
        transition: { duration: 0.4, ease: 'easeOut' } 
      });
      onRemove();
    } else {
      controls.start({ 
        x: 0, 
        y: 0, 
        transition: { type: 'spring', stiffness: 400, damping: 25 } 
      });
    }
  };

  useEffect(() => {
    controls.start({ opacity: 1, scale: 1, transition: { duration: 0.3 } });
  }, [controls]);

  // The card is covered if it's NOT the top card, OR if it IS the top card but the reveal sequence is still running
  const showCover = !isTop || isRevealing;
  // Disable drag if it's currently revealing or not top
  const canDrag = isTop && !isRevealing;

  // Visual Bayangan
  const shadowString = `${config.lightOffsetX}px ${config.lightOffsetY}px ${config.shadowBlur}px ${config.shadowSpread}px rgba(0,0,0,${config.shadowOpacity})`;

  return (
    <motion.div
      className="absolute h-full aspect-[1/1.6] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
      style={{
        x,
        y,
        rotate,
        zIndex: index,
      }}
      drag={canDrag ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.6}
      onPointerDown={handlePointerDown}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ opacity: 0, scale: 0.95 }}
    >
      {/* 3D Flip Wrapper */}
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
                x: [0, config.flipArcX, config.flipArcX / 2, offset.x],
                y: [0, config.flipArcY, config.flipArcY / 3, offset.y],
                rotateY: [-180, -180, -90, 0],
                rotateX: [0, 10, 5, 0],
                rotateZ: [0, -15, 10, offset.r],
                scale: [1, 1.05, 1.08, 1],
                opacity: 1
              }
        }
        transition={{
          duration: showCover ? 0 : config.flipDuration,
          ease: showCover ? 'linear' : 'easeInOut',
          times: showCover ? undefined : [0, 0.4, 0.7, 1]
        }}
      >
        {/* FRONT FACE */}
        <motion.div 
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border-[0.5px] border-[var(--gray-200)] p-8 bg-background flex flex-col items-center justify-center text-foreground"
          style={{ 
            boxShadow: shadowString,
            backfaceVisibility: 'hidden',
          }}
        >
          <p className="text-lg md:text-xl text-center leading-loose tracking-wide" style={{ fontFamily: 'var(--font-special-elite)' }}>
            "Tarik kartu ini dari sudut yang berbeda. Rasakan bagaimana fisika merespons titik gravitasimu."
          </p>
          <span className="absolute bottom-6 font-mono text-[9px] tracking-widest uppercase opacity-30">
            KARTU UJI {id}
          </span>
        </motion.div>

        {/* BACK FACE (Living Coral Cover) */}
        <motion.div 
          className="absolute inset-0 w-full h-full rounded-2xl flex flex-col items-center justify-center"
          style={{ 
            backgroundColor: 'var(--color-living-coral)',
            backfaceVisibility: 'hidden',
            rotateY: 180,
            pointerEvents: 'none',
            boxShadow: shadowString,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
