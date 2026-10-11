import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Eye } from 'lucide-react';

export const AestheticBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bgStyle, setBgStyle] = useState<'geometric' | 'hybrid'>('geometric');
  const [showParticles, setShowParticles] = useState<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D/2D Floating Travel & Geometry Particles
    interface Particle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      type: 'dot' | 'plane' | 'star';
      angle: number;
      spinSpeed: number;
    }

    const colors = [
      'rgba(192, 132, 252, ', // light violet
      'rgba(168, 85, 247, ',  // electric purple
      'rgba(232, 121, 249, ', // fuchsia / magenta highlight
      'rgba(126, 34, 206, ',  // royal deep violet
    ];

    const particles: Particle[] = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.15, // gently drift upward
        size: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.2,
        type: i % 7 === 0 ? 'plane' : i % 5 === 0 ? 'star' : 'dot',
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.015,
      });
    }

    // Function to draw origami paper plane
    const drawPaperPlane = (c: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number, alpha: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.strokeStyle = `rgba(216, 180, 254, ${alpha})`;
      c.fillStyle = `rgba(147, 51, 234, ${alpha * 0.25})`;
      c.lineWidth = 1.2;

      c.beginPath();
      c.moveTo(0, -size * 2);
      c.lineTo(size * 1.5, size * 1.8);
      c.lineTo(0, size * 0.8);
      c.lineTo(-size * 1.5, size * 1.8);
      c.closePath();
      c.fill();
      c.stroke();

      // Fold center spine
      c.beginPath();
      c.moveTo(0, -size * 2);
      c.lineTo(0, size * 0.8);
      c.stroke();
      c.restore();
    };

    // Main render loop
    let time = 0;
    const render = () => {
      time += 0.008;
      ctx.clearRect(0, 0, width, height);

      // Connect near dots with luminous geometric lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const lineAlpha = (1 - dist / 110) * 0.15;
            ctx.strokeStyle = `rgba(168, 85, 247, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Draw each particle
      for (const p of particles) {
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;
        p.angle += p.spinSpeed;

        // Wrap around boundaries
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;
        if (p.y < -30) p.y = height + 30;
        if (p.y > height + 30) p.y = -30;

        const pulse = Math.sin(time + p.x) * 0.2 + 0.8;
        const currentAlpha = p.alpha * pulse;

        if (p.type === 'plane') {
          drawPaperPlane(ctx, p.x, p.y, p.size * 2.2, p.angle, currentAlpha);
        } else if (p.type === 'star') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.strokeStyle = `${p.color}${currentAlpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-p.size * 1.5, 0);
          ctx.lineTo(p.size * 1.5, 0);
          ctx.moveTo(0, -p.size * 1.5);
          ctx.lineTo(0, p.size * 1.5);
          ctx.stroke();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${currentAlpha})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    if (showParticles) {
      render();
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showParticles]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* 1. Uploaded Deep Purple Velvet Geometry Image with Cinematic Lighting */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{
          backgroundImage: 'url(/aesthetic-bg.jpg)',
          filter: bgStyle === 'geometric' ? 'brightness(0.95) contrast(1.1)' : 'brightness(0.7) contrast(1.2)',
          opacity: 0.92,
        }}
      />

      {/* 2. Deep Velvet Radial Vignette Overlays matching image palette */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 15%, rgba(147, 51, 234, 0.22) 0%, transparent 60%),
            radial-gradient(circle at 10% 20%, rgba(192, 132, 252, 0.14) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(88, 28, 135, 0.3) 0%, transparent 60%),
            linear-gradient(180deg, rgba(11, 5, 20, 0.45) 0%, rgba(11, 5, 20, 0.85) 100%)
          `,
        }}
      />

      {/* 3. Interactive Floating Canvas with 3D Travel Wireframes & Airplanes */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* 4. Controls pill at bottom right for user customization */}
      <div className="pointer-events-auto absolute bottom-4 right-4 z-50 flex items-center gap-1.5 p-1.5 rounded-full bg-purple-950/70 backdrop-blur-xl border border-purple-500/30 text-xs text-purple-200 shadow-xl shadow-black/60">
        <button
          type="button"
          onClick={() => setShowParticles(!showParticles)}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
            showParticles ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-300 hover:text-white'
          }`}
          title="Toggle 3D Floating Geometry & Travel Particles"
        >
          <Sparkles className="w-3 h-3" />
          <span>{showParticles ? '3D Visuals On' : '3D Visuals Off'}</span>
        </button>

        <button
          type="button"
          onClick={() => setBgStyle(bgStyle === 'geometric' ? 'hybrid' : 'geometric')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-purple-300 hover:text-white transition-colors"
          title="Toggle Ambient Contrast"
        >
          <Eye className="w-3 h-3" />
          <span>{bgStyle === 'geometric' ? 'Deep Mood' : 'Soft Mood'}</span>
        </button>
      </div>
    </div>
  );
};
