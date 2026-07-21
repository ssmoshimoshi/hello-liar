'use client';
import { useState, useRef, useEffect } from 'react';

interface HoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onHoldComplete: () => void;
  holdDuration?: number; 
}

export default function HoldButton({ 
  children, 
  className, 
  onHoldComplete, 
  holdDuration = 1000, 
  disabled, 
  ...props 
}: HoldButtonProps) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startHold = () => {
    if (disabled) return;
    setIsHolding(true);
    startTimeRef.current = performance.now();
    
    const animate = (time: number) => {
      if (!startTimeRef.current) return;
      const elapsed = time - startTimeRef.current;
      const newProgress = Math.min(100, (elapsed / holdDuration) * 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        setIsHolding(false);
        onHoldComplete();
        startTimeRef.current = null;
      } else {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const cancelHold = () => {
    setIsHolding(false);
    setProgress(0);
    startTimeRef.current = null;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <button
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onContextMenu={(e) => e.preventDefault()} // prevent context menu on mobile hold
      disabled={disabled}
      className={`relative overflow-hidden select-none touch-none ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98] transition-transform'}`}
      style={{ WebkitUserSelect: 'none' }}
      {...props}
    >
      {/* Progress Bar Background */}
      <div 
        className="absolute inset-0 bg-foreground/10"
        style={{ width: `${progress}%`, transition: isHolding ? 'none' : 'width 0.2s ease' }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2 pointer-events-none w-full h-full">
        {children}
      </span>
    </button>
  );
}
