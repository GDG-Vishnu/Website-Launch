'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';

interface RibbonCuttingProps {
  onCut: () => void;
}

export default function RibbonCutting({ onCut }: RibbonCuttingProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const leftRibbonRef = useRef<SVGGElement>(null);
  const rightRibbonRef = useRef<SVGGElement>(null);
  const cutLineRef = useRef<SVGPathElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);
  
  const [isCut, setIsCut] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [cutProgress, setCutProgress] = useState(0);
  
  const ribbonCenterY = 50; // Center of ribbon in percentage
  const cutThreshold = 80; // Progress needed to cut (percentage)

  // Handle pointer movement
  const handlePointerMove = useCallback((e: PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    if (isDrawing && !isCut) {
      const relativeY = ((e.clientY - rect.top) / rect.height) * 100;
      const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
      
      // Check if cutting through the ribbon (center area)
      if (relativeX > 40 && relativeX < 60 && relativeY > 35 && relativeY < 65) {
        const newProgress = Math.min(cutProgress + 5, 100);
        setCutProgress(newProgress);
        
        // Add cutting particles
        createCutParticles(e.clientX, e.clientY);
        
        if (newProgress >= cutThreshold) {
          performCut();
        }
      }
    }
  }, [isDrawing, isCut, cutProgress]);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    setIsDrawing(true);
    (e.target as Element)?.setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    setIsDrawing(false);
    (e.target as Element)?.releasePointerCapture?.(e.pointerId);
    if (!isCut && cutProgress < cutThreshold) {
      // Reset progress if not fully cut
      gsap.to({ progress: cutProgress }, {
        progress: 0,
        duration: 0.3,
        onUpdate: function() {
          setCutProgress(this.targets()[0].progress);
        }
      });
    }
  }, [isCut, cutProgress]);

  const createCutParticles = (x: number, y: number) => {
    if (!sparklesRef.current) return;
    
    for (let i = 0; i < 3; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-2 h-2 rounded-full pointer-events-none';
      particle.style.background = `hsl(${Math.random() * 60 + 30}, 100%, 70%)`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.transform = 'translate(-50%, -50%)';
      sparklesRef.current.appendChild(particle);
      
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        opacity: 0,
        scale: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    }
  };

  const createCelebrationParticles = () => {
    if (!sparklesRef.current) return;
    
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < 100; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 12 + 4;
      const isConfetti = Math.random() > 0.5;
      
      particle.className = 'absolute pointer-events-none';
      particle.style.width = `${size}px`;
      particle.style.height = isConfetti ? `${size * 2}px` : `${size}px`;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = isConfetti ? '2px' : '50%';
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      particle.style.transform = 'translate(-50%, -50%)';
      sparklesRef.current.appendChild(particle);
      
      const angle = (Math.PI * 2 * i) / 100 + Math.random() * 0.5;
      const velocity = Math.random() * 400 + 200;
      const rotationSpeed = Math.random() * 720 - 360;
      
      gsap.to(particle, {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity + 200,
        rotation: rotationSpeed,
        opacity: 0,
        duration: Math.random() * 1.5 + 1,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    }
  };

  const performCut = () => {
    if (isCut) return;
    setIsCut(true);
    
    // Create celebration particles
    createCelebrationParticles();
    
    // Animate cut line flash
    if (cutLineRef.current) {
      gsap.fromTo(cutLineRef.current, 
        { strokeDashoffset: 100, opacity: 1 },
        { strokeDashoffset: 0, duration: 0.2, ease: 'power2.out' }
      );
    }
    
    // Animate ribbon split
    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(onCut, 500);
      }
    });
    
    // Left ribbon falls away
    if (leftRibbonRef.current) {
      timeline.to(leftRibbonRef.current, {
        x: -300,
        y: 200,
        rotation: -45,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      }, 0);
    }
    
    // Right ribbon falls away
    if (rightRibbonRef.current) {
      timeline.to(rightRibbonRef.current, {
        x: 300,
        y: 200,
        rotation: 45,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      }, 0);
    }
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.addEventListener('pointermove', handlePointerMove);
    svg.addEventListener('pointerdown', handlePointerDown);
    svg.addEventListener('pointerup', handlePointerUp);
    svg.addEventListener('pointerleave', handlePointerUp);

    return () => {
      svg.removeEventListener('pointermove', handlePointerMove);
      svg.removeEventListener('pointerdown', handlePointerDown);
      svg.removeEventListener('pointerup', handlePointerUp);
      svg.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerDown, handlePointerUp]);

  // Initial ribbon animation
  useEffect(() => {
    if (leftRibbonRef.current && rightRibbonRef.current) {
      gsap.fromTo([leftRibbonRef.current, rightRibbonRef.current],
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)', stagger: 0.1 }
      );
    }
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Sparkles container */}
      <div ref={sparklesRef} className="fixed inset-0 pointer-events-none z-40" />

      {/* Progress indicator */}
      {!isCut && cutProgress > 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="#FFD700"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 35}`}
                strokeDashoffset={`${2 * Math.PI * 35 * (1 - cutProgress / 100)}`}
                className="transition-all duration-100"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
              {Math.round(cutProgress)}%
            </span>
          </div>
        </div>
      )}

      {/* Main SVG Ribbon */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-crosshair touch-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Ribbon gradient */}
          <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="25%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#F87171" />
            <stop offset="75%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
          
          {/* Ribbon shine */}
          <linearGradient id="ribbonShine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
          </linearGradient>
          
          {/* Gold gradient for bow */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFF8DC" />
            <stop offset="100%" stopColor="#DAA520" />
          </linearGradient>
          
          {/* Shadow filter */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
          </filter>
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Left ribbon half */}
        <g ref={leftRibbonRef} style={{ transformOrigin: '50% 50%' }}>
          {/* Left ribbon body */}
          <path
            d="M0 45 Q 25 43, 50 45 L 50 55 Q 25 57, 0 55 Z"
            fill="url(#ribbonGradient)"
            filter="url(#shadow)"
          />
          <path
            d="M0 45 Q 25 43, 50 45 L 50 55 Q 25 57, 0 55 Z"
            fill="url(#ribbonShine)"
          />
          
          {/* Left ribbon tail */}
          <path
            d="M-5 42 L 5 50 L -5 58 L 2 50 Z"
            fill="url(#ribbonGradient)"
            filter="url(#shadow)"
          />
          
          {/* Left bow loop */}
          <ellipse
            cx="42"
            cy="42"
            rx="8"
            ry="12"
            fill="url(#ribbonGradient)"
            filter="url(#shadow)"
            transform="rotate(-30 42 42)"
          />
          <ellipse
            cx="42"
            cy="42"
            rx="8"
            ry="12"
            fill="url(#ribbonShine)"
            transform="rotate(-30 42 42)"
          />
        </g>

        {/* Right ribbon half */}
        <g ref={rightRibbonRef} style={{ transformOrigin: '50% 50%' }}>
          {/* Right ribbon body */}
          <path
            d="M50 45 Q 75 43, 100 45 L 100 55 Q 75 57, 50 55 Z"
            fill="url(#ribbonGradient)"
            filter="url(#shadow)"
          />
          <path
            d="M50 45 Q 75 43, 100 45 L 100 55 Q 75 57, 50 55 Z"
            fill="url(#ribbonShine)"
          />
          
          {/* Right ribbon tail */}
          <path
            d="M105 42 L 95 50 L 105 58 L 98 50 Z"
            fill="url(#ribbonGradient)"
            filter="url(#shadow)"
          />
          
          {/* Right bow loop */}
          <ellipse
            cx="58"
            cy="42"
            rx="8"
            ry="12"
            fill="url(#ribbonGradient)"
            filter="url(#shadow)"
            transform="rotate(30 58 42)"
          />
          <ellipse
            cx="58"
            cy="42"
            rx="8"
            ry="12"
            fill="url(#ribbonShine)"
            transform="rotate(30 58 42)"
          />
        </g>

        {/* Center bow knot */}
        <g className={isCut ? 'opacity-0' : 'opacity-100'} style={{ transition: 'opacity 0.3s' }}>
          <circle
            cx="50"
            cy="50"
            r="6"
            fill="url(#goldGradient)"
            filter="url(#glow)"
          />
          <circle
            cx="50"
            cy="50"
            r="4"
            fill="url(#goldGradient)"
          />
          {/* Decorative dots on knot */}
          <circle cx="48" cy="48" r="1" fill="rgba(255,255,255,0.6)" />
          <circle cx="52" cy="49" r="0.5" fill="rgba(255,255,255,0.4)" />
        </g>

        {/* Cut line indicator */}
        <path
          ref={cutLineRef}
          d="M50 35 L50 65"
          stroke="#FFD700"
          strokeWidth="0.5"
          strokeDasharray="100"
          strokeDashoffset="100"
          fill="none"
          filter="url(#glow)"
          className={isCut ? 'opacity-100' : 'opacity-0'}
        />

        {/* Interactive cut zone indicator */}
        {!isCut && (
          <rect
            x="45"
            y="40"
            width="10"
            height="20"
            fill="rgba(255, 215, 0, 0.1)"
            stroke="rgba(255, 215, 0, 0.3)"
            strokeWidth="0.3"
            strokeDasharray="2 2"
            rx="2"
            className="animate-pulse"
          />
        )}
      </svg>

      {/* Instructions */}
      {!isCut && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-white/80 text-lg font-light tracking-wide animate-pulse">
            ✂️ Click & drag through the ribbon to cut ✂️
          </p>
          <p className="text-white/50 text-sm mt-2">
            Use mouse, touch, or stylus
          </p>
        </div>
      )}
    </div>
  );
}
