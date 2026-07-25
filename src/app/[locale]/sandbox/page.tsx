'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SandboxPage() {
  const [count, setCount] = useState(50);
  const [minSize, setMinSize] = useState(1);
  const [maxSize, setMaxSize] = useState(3);
  const [spreadAngle, setSpreadAngle] = useState(360); // 360 means all directions
  const [minDistance, setMinDistance] = useState(20);
  const [maxDistance, setMaxDistance] = useState(150);
  const [duration, setDuration] = useState(2.0);
  const [blurAmount, setBlurAmount] = useState(2);

  const [trigger, setTrigger] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-mono text-xs">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-1/3 border-r border-[var(--gray-200)] p-8 bg-[var(--gray-100)] flex flex-col gap-6 h-screen overflow-y-auto">
        <h1 className="text-xl font-bold mb-4">Particle Sandbox</h1>
        
        <Control label="Particle Count" value={count} min={10} max={200} step={1} onChange={setCount} />
        <Control label="Min Size (px)" value={minSize} min={0.5} max={10} step={0.5} onChange={setMinSize} />
        <Control label="Max Size (px)" value={maxSize} min={1} max={20} step={0.5} onChange={setMaxSize} />
        <Control label="Spread Angle (deg)" value={spreadAngle} min={10} max={360} step={10} onChange={setSpreadAngle} />
        <Control label="Min Distance" value={minDistance} min={0} max={200} step={10} onChange={setMinDistance} />
        <Control label="Max Distance" value={maxDistance} min={50} max={500} step={10} onChange={setMaxDistance} />
        <Control label="Duration (s)" value={duration} min={0.5} max={5} step={0.1} onChange={setDuration} />
        <Control label="Glow/Blur (px)" value={blurAmount} min={0} max={10} step={1} onChange={setBlurAmount} />

        <button 
          onClick={() => setTrigger(prev => prev + 1)}
          className="mt-4 bg-foreground text-background py-3 rounded-md hover:opacity-80 transition-opacity"
        >
          RE-TRIGGER ANIMATION
        </button>

        <div className="mt-8 p-4 bg-black text-[var(--color-living-coral)] rounded-md overflow-x-auto whitespace-pre-wrap">
          <pre>
            {JSON.stringify({
              count,
              minSize,
              maxSize,
              spreadAngle,
              minDistance,
              maxDistance,
              duration,
              blurAmount
            }, null, 2)}
          </pre>
          <p className="mt-4 text-white/50 text-[10px]">Copy this block when you find the perfect setting!</p>
        </div>
      </div>

      {/* Canvas */}
      <div className="w-full md:w-2/3 h-screen bg-[var(--color-living-coral)] relative overflow-hidden flex items-center justify-center">
        <p className="absolute top-8 left-8 text-white/50 tracking-widest uppercase">Canvas (Living Coral)</p>
        
        <AnimatePresence mode="wait">
          <ParticleTest 
            key={trigger}
            count={count}
            minSize={minSize}
            maxSize={maxSize}
            spreadAngle={spreadAngle}
            minDistance={minDistance}
            maxDistance={maxDistance}
            duration={duration}
            blurAmount={blurAmount}
            onComplete={() => {}}
          />
        </AnimatePresence>
      </div>

    </div>
  );
}

function Control({ label, value, min, max, step, onChange }: any) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <span>{label}</span>
        <span className="text-[var(--gray-500)]">{value}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function ParticleTest({ 
  count, minSize, maxSize, spreadAngle, minDistance, maxDistance, duration, blurAmount, onComplete 
}: any) {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowParticles(true), 800);
    return () => clearTimeout(t);
  }, []);

  const particles = Array.from({ length: count }, (_, i) => {
    // Spread angle in radians (e.g. 360 deg = Math.PI * 2)
    const angleRange = (spreadAngle / 360) * Math.PI * 2;
    // Start angle so it centers pointing UP (-PI/2)
    const startAngle = -Math.PI / 2 - (angleRange / 2);
    const angle = startAngle + (Math.random() * angleRange);
    
    const distance = minDistance + Math.random() * (maxDistance - minDistance);
    const size = minSize + Math.random() * (maxSize - minSize);
    
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size,
      delay: Math.random() * (duration * 0.3), // Stagger start times
      duration: duration * 0.7 + Math.random() * (duration * 0.3)
    };
  });

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative flex items-center justify-center">
        {/* The Number */}
        <motion.span
          className="text-6xl font-mono text-white mix-blend-plus-lighter"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: showParticles ? 0 : 1, 
            y: showParticles ? -10 : 0,
            filter: showParticles ? 'blur(8px)' : 'blur(0px)',
            scale: showParticles ? 1.1 : 1
          }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          42
        </motion.span>
        
        {/* Particles */}
        {showParticles && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-white"
                style={{ 
                  width: p.size, 
                  height: p.size,
                  boxShadow: blurAmount > 0 ? `0 0 ${blurAmount}px rgba(255,255,255,0.8)` : 'none'
                }}
                initial={{ x: 0, y: 0, opacity: 0.8 }}
                animate={{ x: p.x, y: p.y, opacity: 0 }}
                transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
