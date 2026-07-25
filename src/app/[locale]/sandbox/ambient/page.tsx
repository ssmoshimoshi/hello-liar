'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function AmbientSandboxPage() {
  const [density, setDensity] = useState(15000);
  const [minSize, setMinSize] = useState(0.5);
  const [maxSize, setMaxSize] = useState(2.0);
  const [minAlpha, setMinAlpha] = useState(0.1);
  const [maxAlpha, setMaxAlpha] = useState(0.4);
  const [vxRange, setVxRange] = useState(0.4);
  const [vyBase, setVyBase] = useState(0.05);
  const [vyRange, setVyRange] = useState(0.15);

  const [trigger, setTrigger] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-mono text-xs">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-1/3 border-r border-[var(--gray-200)] p-8 bg-background flex flex-col gap-6 h-screen overflow-y-auto relative z-10">
        <h1 className="text-xl font-bold mb-4">Ambient Particles Simulator</h1>
        
        <Control label="Density (px² per particle)" value={density} min={2000} max={30000} step={1000} onChange={setDensity} />
        <Control label="Min Size (px)" value={minSize} min={0.1} max={3.0} step={0.1} onChange={setMinSize} />
        <Control label="Max Size (px)" value={maxSize} min={0.5} max={5.0} step={0.1} onChange={setMaxSize} />
        <Control label="Min Alpha" value={minAlpha} min={0.0} max={1.0} step={0.05} onChange={setMinAlpha} />
        <Control label="Max Alpha" value={maxAlpha} min={0.1} max={1.0} step={0.05} onChange={setMaxAlpha} />
        <Control label="Vx Range (Horizontal Swing)" value={vxRange} min={0.0} max={2.0} step={0.05} onChange={setVxRange} />
        <Control label="Vy Base (Base Upward Speed)" value={vyBase} min={0.0} max={1.0} step={0.05} onChange={setVyBase} />
        <Control label="Vy Range (Random Upward Variance)" value={vyRange} min={0.0} max={2.0} step={0.05} onChange={setVyRange} />

        <button 
          onClick={() => setTrigger(prev => prev + 1)}
          className="mt-4 border border-[var(--color-living-coral)] text-[var(--color-living-coral)] py-3 rounded-md hover:bg-[var(--color-living-coral)] hover:text-white transition-all font-bold tracking-widest uppercase"
        >
          TERAPKAN EFEK
        </button>

        <div className="mt-8 p-4 bg-black text-[var(--color-living-coral)] rounded-md overflow-x-auto whitespace-pre-wrap font-mono">
          <pre>
{`// Salin block ini untuk saya:
{
  density: ${density},
  minSize: ${minSize},
  maxSize: ${maxSize},
  minAlpha: ${minAlpha},
  maxAlpha: ${maxAlpha},
  vxRange: ${vxRange},
  vyBase: ${vyBase},
  vyRange: ${vyRange}
}`}
          </pre>
          <p className="mt-4 text-white/50 text-[10px]">Silakan salin parameter di atas jika visualnya sudah terasa seperti debu dari cahaya jendela.</p>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="w-full md:w-2/3 h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center">
        <p className="absolute top-8 left-8 text-[var(--gray-400)] tracking-widest uppercase z-10 pointer-events-none">Canvas Preview (Living Coral on White)</p>
        
        {/* Mock UI to test visibility against elements */}
        <h1 className="text-4xl text-foreground pointer-events-none mb-8 z-10" style={{ fontFamily: 'var(--font-baskerville)' }}>
          The Lies We Tell
        </h1>
        <p className="text-xs text-[var(--gray-500)] tracking-widest max-w-sm text-center pointer-events-none leading-relaxed z-10">
          The particles should drift gently over this text like dust caught in a beam of light. They must not obscure readability.
        </p>
        
        <CanvasRenderer 
          key={trigger}
          density={density}
          minSize={minSize}
          maxSize={maxSize}
          minAlpha={minAlpha}
          maxAlpha={maxAlpha}
          vxRange={vxRange}
          vyBase={vyBase}
          vyRange={vyRange}
        />
      </div>

    </div>
  );
}

function Control({ label, value, min, max, step, onChange }: any) {
  return (
    <div className="flex flex-col gap-2">
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

function CanvasRenderer({ 
  density, minSize, maxSize, minAlpha, maxAlpha, vxRange, vyBase, vyRange 
}: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let ambientParticles: StarParticle[] = [];
    let animationFrameId: number;
    let cw = 0;
    let ch = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const rect = parent.getBoundingClientRect();
      cw = rect.width;
      ch = rect.height;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      ctx.scale(dpr, dpr);
      initGalaxy();
    };

    class StarParticle {
      x!: number;
      y!: number;
      vx!: number;
      vy!: number;
      size!: number;
      alpha!: number;

      constructor() {
        this.reset();
        this.y = Math.random() * ch; // Mulai menyebar di seluruh layar
      }

      reset() {
        this.x = Math.random() * cw;
        this.y = ch + 10;
        
        this.vx = (Math.random() - 0.5) * vxRange;
        this.vy = -(Math.random() * vyRange + vyBase);
        this.size = Math.random() * (maxSize - minSize) + minSize;
        this.alpha = Math.random() * (maxAlpha - minAlpha) + minAlpha;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.y < -10 || this.x < -10 || this.x > cw + 10) {
          this.reset();
        }
      }

      draw() {
        ctx!.globalAlpha = this.alpha;
        ctx!.fillStyle = '#FC766A'; // Living Coral
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function initGalaxy() {
      ambientParticles = [];
      const numParticles = Math.floor((cw * ch) / density);
      for (let i = 0; i < numParticles; i++) {
        ambientParticles.push(new StarParticle());
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, cw, ch);

      ambientParticles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, minSize, maxSize, minAlpha, maxAlpha, vxRange, vyBase, vyRange]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 bg-transparent"
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
