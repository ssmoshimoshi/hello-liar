'use client';
import { useState, useRef } from 'react';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function RippleButton({ children, className, onClick, disabled, ...props }: RippleButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = { x, y, id: Date.now() };
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 800); 
    }
    
    if (onClick) onClick(e);
  };

  return (
    <>
      <style>{`
        @keyframes ripple {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={disabled}
        className={`relative overflow-hidden ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      >
        {ripples.map(r => (
          <span
            key={r.id}
            className="absolute bg-[var(--color-living-coral)] rounded-full animate-ripple pointer-events-none"
            style={{
              left: r.x,
              top: r.y,
              width: '100px',
              height: '100px',
            }}
          />
        ))}
        <span className="relative z-10 flex items-center justify-center gap-3 w-full h-full pointer-events-none">{children}</span>
      </button>
    </>
  );
}
