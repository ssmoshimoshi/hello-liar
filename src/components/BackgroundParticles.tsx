'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function BackgroundParticles() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (pathname.includes('/write')) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let ambientParticles: StarParticle[] = [];
    let animationFrameId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
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
        this.y = Math.random() * canvas!.height;
      }

      reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight + 10;
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = -(Math.random() * 0.05 + 0.05);
        this.size = Math.random() * 1.2 + 0.5;
        this.alpha = Math.random() * 0.4 + 0.6;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.y < -10 || this.x < -10 || this.x > window.innerWidth + 10) {
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
      const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 8000);
      for (let i = 0; i < numParticles; i++) {
        ambientParticles.push(new StarParticle());
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

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
  }, [pathname]);

  if (pathname.includes('/write')) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 bg-transparent"
      style={{ display: 'block', width: '100vw', height: '100vh' }}
    />
  );
}
