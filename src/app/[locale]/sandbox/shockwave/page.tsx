'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShockwaveSandbox() {
  // --- STATE FOR CONFIG ---
  const [config, setConfig] = useState({
    primaryColor: '#FC766A',
    primaryThicknessStart: 4,
    primaryThicknessEnd: 1,
    primaryBlurStart: 0,
    primaryBlurEnd: 2,
    primaryDuration: 1.2,
    primaryScaleEnd: 300,
    primaryEasing: 'cubic-bezier(0.05, 0.95, 0.2, 1)',

    secondaryColor: '#ffffff',
    secondaryOpacityStart: 0.5,
    secondaryThickness: 6,
    secondaryDuration: 1.5,
    secondaryDelayMs: 90,
    secondaryScaleEnd: 200,
    secondaryBlurStart: 2,
    secondaryBlurEnd: 20,
    secondaryEasing: 'cubic-bezier(0.25, 0.8, 0.2, 1)',

    voidColor: '#ffffff', // The color that replaces the dark background
    voidDuration: 1.3,
    voidEasing: 'cubic-bezier(0.1, 0.9, 0.2, 1)',

    scatterStrength: 3000,
    scatterDuration: 1.2,
    scatterRotationMax: 1000,

    bgColor: '#000000',
    textColor: '#ffffff'
  });

  const [trigger, setTrigger] = useState(0);
  const clickPosRef = useRef({ x: 0, y: 0 });

  const updateConfig = (key: keyof typeof config, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const jsonConfig = JSON.stringify(config, null, 2);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row font-mono text-xs overflow-hidden">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-[400px] border-r border-gray-700 bg-gray-950 flex flex-col gap-6 h-screen overflow-y-auto p-6 z-50 shadow-2xl relative">
        <h1 className="text-xl font-bold mb-2">Shockwave Physics Sandbox</h1>
        
        <button 
          onClick={() => {
            // Trigger animation, but default to center if no click recorded yet
            if (clickPosRef.current.x === 0) {
              const canvas = document.getElementById('canvas-area');
              if (canvas) {
                const rect = canvas.getBoundingClientRect();
                clickPosRef.current = { x: rect.width / 2, y: rect.height / 2 };
              }
            }
            setTrigger(prev => prev + 1);
          }}
          className="bg-[var(--color-living-coral)] text-white py-3 px-4 rounded-md font-bold uppercase tracking-widest hover:opacity-80 transition-opacity active:scale-95"
        >
          Re-Trigger (Center)
        </button>
        
        <p className="text-[10px] text-gray-400 -mt-4">Atau klik langsung pada area Canvas di sebelah kanan untuk melihat reaksi titik klik yang berbeda.</p>

        {/* CONTROLS */}
        <Section title="Environment">
          <Control label="Background Color" type="color" value={config.bgColor} onChange={(v: any) => updateConfig('bgColor', v)} />
          <Control label="Text Color" type="color" value={config.textColor} onChange={(v: any) => updateConfig('textColor', v)} />
        </Section>

        <Section title="Primary Wave (The Sharp Blast)">
          <Control label="Color" type="color" value={config.primaryColor} onChange={(v: any) => updateConfig('primaryColor', v)} />
          <Control label="Thickness Start (px)" type="range" value={config.primaryThicknessStart} min={1} max={20} step={1} onChange={(v: any) => updateConfig('primaryThicknessStart', parseFloat(v))} />
          <Control label="Thickness End (px)" type="range" value={config.primaryThicknessEnd} min={0} max={20} step={0.5} onChange={(v: any) => updateConfig('primaryThicknessEnd', parseFloat(v))} />
          <Control label="Blur Start (px)" type="range" value={config.primaryBlurStart} min={0} max={20} step={0.5} onChange={(v: any) => updateConfig('primaryBlurStart', parseFloat(v))} />
          <Control label="Blur End (px)" type="range" value={config.primaryBlurEnd} min={0} max={50} step={1} onChange={(v: any) => updateConfig('primaryBlurEnd', parseFloat(v))} />
          <Control label="Duration (s)" type="range" value={config.primaryDuration} min={0.1} max={3} step={0.1} onChange={(v: any) => updateConfig('primaryDuration', parseFloat(v))} />
          <Control label="Scale End" type="range" value={config.primaryScaleEnd} min={50} max={500} step={10} onChange={(v: any) => updateConfig('primaryScaleEnd', parseFloat(v))} />
          <Control label="Easing (CSS)" type="text" value={config.primaryEasing} onChange={(v: any) => updateConfig('primaryEasing', v)} />
        </Section>

        <Section title="Secondary Wave (The Dust/Blur)">
          <Control label="Color" type="color" value={config.secondaryColor} onChange={(v: any) => updateConfig('secondaryColor', v)} />
          <Control label="Thickness (px)" type="range" value={config.secondaryThickness} min={1} max={50} step={1} onChange={(v: any) => updateConfig('secondaryThickness', parseFloat(v))} />
          <Control label="Delay (ms)" type="range" value={config.secondaryDelayMs} min={0} max={500} step={10} onChange={(v: any) => updateConfig('secondaryDelayMs', parseFloat(v))} />
          <Control label="Duration (s)" type="range" value={config.secondaryDuration} min={0.1} max={3} step={0.1} onChange={(v: any) => updateConfig('secondaryDuration', parseFloat(v))} />
          <Control label="Scale End" type="range" value={config.secondaryScaleEnd} min={50} max={500} step={10} onChange={(v: any) => updateConfig('secondaryScaleEnd', parseFloat(v))} />
          <Control label="Blur End (px)" type="range" value={config.secondaryBlurEnd} min={0} max={50} step={1} onChange={(v: any) => updateConfig('secondaryBlurEnd', parseFloat(v))} />
        </Section>

        <Section title="Void Cleave (The Clean Slate)">
          <Control label="Void Color" type="color" value={config.voidColor} onChange={(v: any) => updateConfig('voidColor', v)} />
          <Control label="Duration (s)" type="range" value={config.voidDuration} min={0.1} max={3} step={0.1} onChange={(v: any) => updateConfig('voidDuration', parseFloat(v))} />
        </Section>

        <Section title="Shatter Physics">
          <Control label="Scatter Strength" type="range" value={config.scatterStrength} min={500} max={10000} step={100} onChange={(v: any) => updateConfig('scatterStrength', parseFloat(v))} />
          <Control label="Scatter Duration (s)" type="range" value={config.scatterDuration} min={0.5} max={3} step={0.1} onChange={(v: any) => updateConfig('scatterDuration', parseFloat(v))} />
          <Control label="Max Rotation (deg)" type="range" value={config.scatterRotationMax} min={0} max={2000} step={50} onChange={(v: any) => updateConfig('scatterRotationMax', parseFloat(v))} />
        </Section>

        <div className="mt-4 p-4 bg-black text-[#FC766A] rounded-md flex flex-col gap-2">
          <p className="text-white/50 text-[10px]">Copy this block for the agent to implement:</p>
          <textarea 
            readOnly 
            value={jsonConfig}
            className="w-full bg-transparent border border-gray-800 rounded p-2 text-[10px] h-32 focus:outline-none resize-none font-mono"
            onClick={(e) => e.currentTarget.select()}
          />
        </div>
      </div>

      {/* Canvas */}
      <div 
        id="canvas-area"
        className="flex-1 relative flex flex-col items-center justify-center overflow-hidden cursor-crosshair"
        style={{ backgroundColor: config.bgColor }}
        onPointerDown={(e) => {
          // Trigger blast relative to canvas
          if ((e.target as HTMLElement).closest('.sidebar')) return;
          const rect = e.currentTarget.getBoundingClientRect();
          clickPosRef.current = { 
            x: e.clientX - rect.left, 
            y: e.clientY - rect.top 
          };
          setTrigger(prev => prev + 1);
        }}
      >
        <p className="absolute top-8 left-8 text-white/30 tracking-widest uppercase pointer-events-none">Canvas Preview</p>
        
        {/* We use a key to completely remount the simulation on trigger */}
        <Simulation 
          key={trigger} 
          config={config} 
          triggerId={trigger} 
          clickPos={clickPosRef.current} 
        />
      </div>

    </div>
  );
}

function Simulation({ config, triggerId, clickPos }: { config: any, triggerId: number, clickPos: {x: number, y: number} }) {
  const [phase, setPhase] = useState<'idle' | 'detonated'>('idle');
  const text = "Tuliskan kebohongan Anda di sini...".split('');

  useEffect(() => {
    if (triggerId > 0) {
      setPhase('detonated');
      
      // Delay applying physics by 1 frame to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const chars = document.querySelectorAll('.sim-char');
          chars.forEach((el) => {
            const htmlEl = el as HTMLElement;
            // Get position relative to canvas
            const htmlRect = htmlEl.getBoundingClientRect();
            const canvasRect = document.getElementById('canvas-area')?.getBoundingClientRect() || { left: 0, top: 0 };
            const elCenterX = (htmlRect.left - canvasRect.left) + htmlRect.width / 2;
            const elCenterY = (htmlRect.top - canvasRect.top) + htmlRect.height / 2;
            
            const dx = elCenterX - clickPos.x;
            const dy = elCenterY - clickPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            
            const strength = Math.max(150, config.scatterStrength / (dist / 100));
            const pushX = (dx / dist) * strength + (Math.random() * 200 - 100);
            const pushY = (dy / dist) * strength + (Math.random() * 200 - 100);
            const rotZ = (Math.random() - 0.5) * config.scatterRotationMax;
            
            htmlEl.style.transition = `transform ${config.scatterDuration}s cubic-bezier(0.1, 0.9, 0.2, 1), opacity ${config.scatterDuration * 0.7}s ease-out`;
            htmlEl.style.transform = `translate(${pushX}px, ${pushY}px) rotateZ(${rotZ}deg) scale(${Math.random() * 0.5 + 0.5})`;
            htmlEl.style.opacity = '0';
          });
          
          const btn = document.querySelector('.sim-btn') as HTMLElement;
          if (btn) {
            btn.style.transition = `transform ${config.scatterDuration}s cubic-bezier(0.1, 0.9, 0.2, 1), opacity ${config.scatterDuration * 0.5}s`;
            btn.style.transform = 'translateY(100px) scale(0)';
            btn.style.opacity = '0';
          }
        });
      });

      // Auto-reset back to initial state after animation finishes
      const maxDur = Math.max(config.primaryDuration, config.secondaryDuration, config.voidDuration, config.scatterDuration) * 1000 + 800;
      const t = setTimeout(() => {
        setPhase('idle');
        const chars = document.querySelectorAll('.sim-char');
        chars.forEach((el) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.transition = 'none';
          htmlEl.style.transform = 'none';
          htmlEl.style.opacity = '1';
        });
        const btn = document.querySelector('.sim-btn') as HTMLElement;
        if (btn) {
          btn.style.transition = 'none';
          btn.style.transform = 'none';
          btn.style.opacity = '1';
        }
      }, maxDur);

      return () => clearTimeout(t);
    }
  }, [triggerId, clickPos, config]);

  return (
    <>
      {phase === 'detonated' && (
        <>
          <style>{`
            @keyframes sim-primary {
              0%   { transform: scale(0);   opacity: 1; border-width: ${config.primaryThicknessStart}px; filter: blur(${config.primaryBlurStart}px); }
              15%  { opacity: 1; }
              100% { transform: scale(${config.primaryScaleEnd}); opacity: 0; border-width: ${config.primaryThicknessEnd}px; filter: blur(${config.primaryBlurEnd}px); }
            }
            @keyframes sim-secondary {
              0%   { transform: scale(0);   opacity: 0; filter: blur(${config.secondaryBlurStart}px); }
              8%   { opacity: ${config.secondaryOpacityStart}; }
              100% { transform: scale(${config.secondaryScaleEnd}); opacity: 0; filter: blur(${config.secondaryBlurEnd}px); }
            }
            @keyframes sim-cleave {
              0%   { clip-path: circle(0px   at var(--ex) var(--ey)); }
              100% { clip-path: circle(200vmax at var(--ex) var(--ey)); }
            }
          `}</style>
          
          <div
            className="absolute inset-0 z-[198] pointer-events-none"
            style={{
              backgroundColor: config.voidColor,
              '--ex': `${clickPos.x}px`,
              '--ey': `${clickPos.y}px`,
              animation: `sim-cleave ${config.voidDuration}s ${config.voidEasing} both`,
            } as React.CSSProperties}
          />
          
          <div
            className="absolute pointer-events-none rounded-full z-[201]"
            style={{
              top: `${clickPos.y}px`,
              left: `${clickPos.x}px`,
              width: '4px',
              height: '4px',
              marginTop: '-2px',
              marginLeft: '-2px',
              borderStyle: 'solid',
              borderColor: config.primaryColor,
              animation: `sim-primary ${config.primaryDuration}s ${config.primaryEasing} both`,
            }}
          />
          
          <div
            className="absolute pointer-events-none rounded-full z-[200]"
            style={{
              top: `${clickPos.y}px`,
              left: `${clickPos.x}px`,
              width: '4px',
              height: '4px',
              marginTop: '-2px',
              marginLeft: '-2px',
              borderStyle: 'solid',
              borderColor: config.secondaryColor,
              borderWidth: `${config.secondaryThickness}px`,
              animation: `sim-secondary ${config.secondaryDuration}s ${config.secondaryEasing} both`,
              animationDelay: `${config.secondaryDelayMs}ms`,
            }}
          />
        </>
      )}

      {/* Text Area Simulation */}
      <div 
        className="w-full max-w-2xl text-3xl leading-loose tracking-wide text-center z-10 pointer-events-none flex flex-wrap justify-center items-center"
        style={{ fontFamily: 'var(--font-special-elite)', color: config.textColor, whiteSpace: 'pre-wrap' }}
      >
        {text.map((char, i) => (
          <span key={i} className="sim-char inline-block">{char === ' ' ? '\u00A0' : char}</span>
        ))}
      </div>

      <button className="sim-btn mt-12 text-xs font-mono uppercase tracking-[0.4em] font-bold text-white/60 pointer-events-none z-10">
        LEPASKAN
      </button>
    </>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-800 pb-4">
      <h2 className="text-[10px] text-gray-500 uppercase tracking-widest">{title}</h2>
      {children}
    </div>
  );
}

function Control({ label, type, value, min, max, step, onChange }: any) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-end">
        <span className="text-gray-300">{label}</span>
        {type !== 'color' && <span className="text-[10px] text-gray-500 font-mono bg-gray-900 px-1 rounded">{value}</span>}
      </div>
      {type === 'range' ? (
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full accent-[var(--color-living-coral)]"
        />
      ) : type === 'text' ? (
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white focus:outline-none focus:border-[var(--color-living-coral)]"
        />
      ) : type === 'color' ? (
        <div className="flex gap-2 items-center">
          <input 
            type="color" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
          />
          <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white focus:outline-none focus:border-[var(--color-living-coral)] uppercase"
          />
        </div>
      ) : null}
    </div>
  );
}
