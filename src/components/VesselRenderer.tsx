import React, { useEffect, useRef } from 'react';
import type { ReactionOutcome } from '../services/reactionEngine';

interface VesselRendererProps {
  type: 'test_tube' | 'beaker' | 'burette';
  outcome: ReactionOutcome;
  temperature: number;
  isHeating: boolean;
  isStirring: boolean;
  fillLevel: number; // 0 to 100
  isPouring: boolean;
  pouringColor?: string;
}

export const VesselRenderer: React.FC<VesselRendererProps> = ({
  type,
  outcome,
  temperature,
  isHeating,
  isStirring,
  fillLevel,
  isPouring,
  pouringColor
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Particle systems
  const bubbles = useRef<{ x: number; y: number; speed: number; radius: number; opacity: number }[]>([]);
  const precipitateParticles = useRef<{ x: number; y: number; targetY: number; size: number; color: string; speed: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution matching element size
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;

    // Reset particles on empty
    if (fillLevel === 0) {
      bubbles.current = [];
      precipitateParticles.current = [];
    }

    // Initialize precipitate particles if present and not already created
    if (outcome.precipitate.present && precipitateParticles.current.length === 0 && fillLevel > 0) {
      const particleCount = outcome.precipitate.type === 'gelatinous' ? 120 : 60;
      const liquidBottom = height - 20;
      const liquidHeight = (fillLevel / 100) * (height - 50);
      const liquidTop = liquidBottom - liquidHeight;

      for (let i = 0; i < particleCount; i++) {
        // Distribute randomly in liquid
        const px = 15 + Math.random() * (width - 30);
        // Slowly settle to the bottom 15px
        const py = liquidTop + Math.random() * liquidHeight;
        const targetY = liquidBottom - Math.random() * 15;
        
        precipitateParticles.current.push({
          x: px,
          y: py,
          targetY,
          size: Math.random() * (outcome.precipitate.type === 'gelatinous' ? 4 : 2) + 1,
          color: outcome.precipitate.color || '#ffffff',
          speed: 0.5 + Math.random() * 1
        });
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Bunsen Burner flame if heating
      if (isHeating) {
        ctx.save();
        const fx = width / 2;
        const fy = height;
        
        // Draw flame layers
        const grad = ctx.createRadialGradient(fx, fy - 15, 2, fx, fy - 10, 20);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.2, '#06b6d4'); // Cyan inner core
        grad.addColorStop(0.5, '#6366f1'); // Indigo middle
        grad.addColorStop(1, 'rgba(239, 68, 68, 0)'); // Fading outer
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        // Dynamic wiggle
        const wiggle = Math.sin(Date.now() * 0.05) * 2;
        ctx.moveTo(fx - 15, fy);
        ctx.quadraticCurveTo(fx - 10, fy - 25, fx + wiggle, fy - 40);
        ctx.quadraticCurveTo(fx + 10, fy - 25, fx + 15, fy);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // 2. Draw Glassware Container Outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2.5;

      if (type === 'test_tube') {
        // Draw test tube shape
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(10, height - 25);
        ctx.arc(width / 2, height - 25, width / 2 - 10, Math.PI, 0, true);
        ctx.lineTo(width - 10, 10);
        ctx.stroke();
      } else if (type === 'beaker') {
        // Draw beaker shape
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(10, height - 10);
        ctx.lineTo(width - 10, height - 10);
        ctx.lineTo(width - 10, 10);
        ctx.stroke();
      } else if (type === 'burette') {
        // Draw thin burette
        ctx.beginPath();
        ctx.moveTo(width / 2 - 8, 5);
        ctx.lineTo(width / 2 - 8, height - 30);
        ctx.lineTo(width / 2 - 2, height - 10);
        ctx.lineTo(width / 2 + 2, height - 10);
        ctx.lineTo(width / 2 + 8, height - 30);
        ctx.lineTo(width / 2 + 8, 5);
        ctx.stroke();
      }

      // 3. Draw Liquid
      if (fillLevel > 0) {
        ctx.save();
        
        // Clip to container shape so liquid doesn't bleed out
        ctx.beginPath();
        if (type === 'test_tube') {
          ctx.moveTo(10, 0);
          ctx.lineTo(10, height - 25);
          ctx.arc(width / 2, height - 25, width / 2 - 10, Math.PI, 0, true);
          ctx.lineTo(width - 10, 0);
        } else if (type === 'beaker') {
          ctx.rect(10.5, 0, width - 21, height - 10.5);
        } else if (type === 'burette') {
          ctx.rect(width / 2 - 7.5, 0, 15, height - 30);
        }
        ctx.clip();

        // Calculate liquid coordinates
        const bottomY = type === 'test_tube' ? height - 10 : height - 11;
        const totalHeight = bottomY - 20;
        const currentLiquidHeight = (fillLevel / 100) * totalHeight;
        const topY = bottomY - currentLiquidHeight;

        // Draw stirring wave if active
        ctx.fillStyle = outcome.color;
        ctx.beginPath();
        ctx.moveTo(0, bottomY);
        ctx.lineTo(0, topY);
        
        if (isStirring) {
          // Stirring wave animation
          const waveFreq = 0.05;
          const waveAmp = 4;
          for (let x = 10; x <= width - 10; x += 5) {
            const y = topY + Math.sin(Date.now() * 0.02 + x * waveFreq) * waveAmp;
            ctx.lineTo(x, y);
          }
        } else {
          // Normal meniscus curvature
          ctx.bezierCurveTo(width / 4, topY + 2, (3 * width) / 4, topY + 2, width, topY);
        }
        
        ctx.lineTo(width, bottomY);
        ctx.closePath();
        ctx.fill();

        // 4. Gas Bubbles Animation
        if (outcome.gas.present) {
          // Generate new bubbles occasionally
          if (Math.random() < 0.15 && bubbles.current.length < 30) {
            bubbles.current.push({
              x: 15 + Math.random() * (width - 30),
              y: bottomY,
              speed: 0.8 + Math.random() * 1.5,
              radius: Math.random() * 2.5 + 0.8,
              opacity: 0.5 + Math.random() * 0.5
            });
          }

          // Render & update bubbles
          ctx.fillStyle = outcome.gas.color || 'rgba(255, 255, 255, 0.4)';
          bubbles.current.forEach((b, index) => {
            ctx.globalAlpha = b.opacity;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();

            // Animate upwards
            b.y -= b.speed;
            // Slight horizontal wiggle
            b.x += Math.sin(Date.now() * 0.01 + index) * 0.2;

            // Fade out near surface
            if (b.y < topY + 5) {
              b.opacity -= 0.1;
            }
          });

          // Filter out popped bubbles
          bubbles.current = bubbles.current.filter(b => b.y > topY && b.opacity > 0);
          ctx.globalAlpha = 1.0;
        }

        // 5. Precipitate rendering
        if (outcome.precipitate.present) {
          precipitateParticles.current.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            
            if (outcome.precipitate.type === 'gelatinous') {
              // Gelatinous: larger, fuzzy dots
              ctx.globalAlpha = 0.55;
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
            } else if (outcome.precipitate.type === 'curdy') {
              // Curdy: clumpy shapes
              ctx.globalAlpha = 0.85;
              ctx.rect(p.x - p.size/2, p.y - p.size/2, p.size * 1.4, p.size * 1.2);
              ctx.fill();
            } else {
              // Crystalline / Powdery: small dots
              ctx.globalAlpha = 0.9;
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
            }

            // Settle particles towards their target y coordinate at the bottom
            if (p.y < p.targetY) {
              p.y += p.speed;
              // Swirl if stirring
              if (isStirring) {
                p.x += Math.sin(Date.now() * 0.01 + p.y) * 1.2;
                // Lift particles slightly on stirring
                p.y -= 0.3;
              }
            } else if (isStirring) {
              // Stirring keeps some particles suspended
              p.y -= (0.5 + Math.random() * 2);
            }
          });
          ctx.globalAlpha = 1.0;
        }

        ctx.restore();
      }

      // 6. Draw pouring animation stream if active
      if (isPouring && pouringColor) {
        ctx.save();
        ctx.strokeStyle = pouringColor;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        // Straight streaming line from top edge down to liquid level
        ctx.moveTo(width / 2, 0);
        const liquidTopY = fillLevel > 0 
          ? (height - 10) - (fillLevel / 100) * (height - 30) 
          : height - 10;
        ctx.lineTo(width / 2, liquidTopY);
        ctx.stroke();

        // Ripple/splash effect at the impact point
        ctx.fillStyle = pouringColor;
        ctx.beginPath();
        ctx.arc(width / 2, liquidTopY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [type, outcome, fillLevel, isHeating, isStirring, isPouring, pouringColor]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
      {/* digital thermometer gauge on the side */}
      {fillLevel > 0 && (
        <div
          style={{
            position: 'absolute',
            right: '15px',
            top: '30%',
            transform: 'translateY(-50%)',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '8px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              width: '4px',
              height: '60px',
              background: '#334155',
              borderRadius: '2px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                // Map 20C-100C to 0%-100% height
                height: `${Math.min(100, Math.max(10, ((temperature - 20) / 80) * 100))}%`,
                background: temperature > 50 ? '#ef4444' : '#06b6d4',
                transition: 'height 0.5s ease, background-color 0.5s ease'
              }}
            />
          </div>
          <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#f8fafc' }}>
            {Math.round(temperature)}°C
          </span>
        </div>
      )}
    </div>
  );
};

// Extending bubble animation loop on July 1

// Extending precipitate settling particles
