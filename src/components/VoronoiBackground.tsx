'use client';

import { useEffect, useState } from 'react';
import { Delaunay } from 'd3-delaunay';

interface CellPath {
  d: string;
  strokeWidth: number;
}

interface LayerConfig {
  pointsDensity: number;
  baseStrokeWidth: number;
  strokeRandom: number;
  roundedPoint: number;
}

interface VoronoiBackgroundProps {
  charCount: number;
}

// User's Final Tuned Katarsis Config
const FINAL_CONFIGS: LayerConfig[] = [
  {"pointsDensity":131,"baseStrokeWidth":4,"strokeRandom":1,"roundedPoint":3},
  {"pointsDensity":56,"baseStrokeWidth":3,"strokeRandom":10,"roundedPoint":2},
  {"pointsDensity":101,"baseStrokeWidth":4,"strokeRandom":8,"roundedPoint":2},
  {"pointsDensity":51,"baseStrokeWidth":10,"strokeRandom":11,"roundedPoint":3},
  {"pointsDensity":109,"baseStrokeWidth":1,"strokeRandom":21,"roundedPoint":2},
  {"pointsDensity":150,"baseStrokeWidth":137,"strokeRandom":150,"roundedPoint":20}
];

export default function VoronoiBackground({ charCount }: VoronoiBackgroundProps) {
  const [isClient, setIsClient] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });
  const [preRenderedLayers, setPreRenderedLayers] = useState<CellPath[][]>([]);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pre-render ALL 6 layers ONLY when dimensions change.
  useEffect(() => {
    if (dimensions.width === 0) return;
    
    const newLayers: CellPath[][] = [];
    
    FINAL_CONFIGS.forEach((config) => {
      const points: [number, number][] = [];
      for(let i = 0; i < config.pointsDensity; i++) {
        points.push([Math.random() * dimensions.width, Math.random() * dimensions.height]);
      }
      
      try {
        const delaunay = Delaunay.from(points);
        const voronoi = delaunay.voronoi([-100, -100, dimensions.width + 100, dimensions.height + 100]);
        
        const cells: CellPath[] = [];
        for (let i = 0; i < points.length; i++) {
          const strokeWidth = config.baseStrokeWidth + Math.random() * config.strokeRandom; 
          cells.push({
            d: voronoi.renderCell(i),
            strokeWidth
          });
        }
        newLayers.push(cells);
      } catch(e) {
        newLayers.push([]);
      }
    });
    
    setPreRenderedLayers(newLayers);
  }, [dimensions]);

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <svg width="100%" height="100%" className="w-full h-full">
        <defs>
          {/* Generate SVG filters for each layer if roundedPoint > 0 */}
          {FINAL_CONFIGS.map((config, i) => config.roundedPoint > 0 && (
            <filter key={`goo-${i}`} id={`goo-${i}`}>
              <feGaussianBlur in="SourceGraphic" stdDeviation={config.roundedPoint} result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
            </filter>
          ))}
        </defs>

        {preRenderedLayers.map((layerCells, i) => {
          // Layer 0 starts at char 1, fully drawn at char 5
          const layerStartChar = i * 5;
          const layerEndChar = (i + 1) * 5;
          
          let progress = 0;
          if (charCount >= layerEndChar) progress = 1;
          else if (charCount > layerStartChar) progress = (charCount - layerStartChar) / 5;

          // Mask creeps from outside in
          const innerRadius = Math.max(-50, 100 - (progress * 150));
          const outerRadius = Math.max(0, 150 - (progress * 150));
          const maskImage = `radial-gradient(circle, transparent ${innerRadius}%, black ${outerRadius}%)`;

          // If completely hidden, don't even render the paths to save GPU
          if (progress === 0) return null;

          return (
            <g 
              key={i} 
              style={{ 
                WebkitMaskImage: maskImage, 
                maskImage: maskImage 
              }}
              filter={FINAL_CONFIGS[i].roundedPoint > 0 ? `url(#goo-${i})` : undefined}
              className="transition-all duration-500 ease-out"
            >
              {layerCells.map((cell, cellIdx) => (
                <path
                  key={cellIdx}
                  d={cell.d}
                  fill="none"
                  stroke="#050505"
                  strokeWidth={cell.strokeWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
