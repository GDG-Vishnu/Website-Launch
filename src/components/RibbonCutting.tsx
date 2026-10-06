"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";

interface RibbonCuttingProps {
  onCut: () => void;
}

export default function RibbonCutting({ onCut }: RibbonCuttingProps) {
  const [isCut, setIsCut] = useState(false);
  const [isCuttingActive, setIsCuttingActive] = useState(false);
  const [lightOffset, setLightOffset] = useState(50); // Dynamic specular sheen position (%)

  // Element Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRibbonWrapperRef = useRef<HTMLDivElement>(null);
  const rightRibbonWrapperRef = useRef<HTMLDivElement>(null);
  const leftRibbonInnerRef = useRef<HTMLDivElement>(null);
  const rightRibbonInnerRef = useRef<HTMLDivElement>(null);
  const centerFlowerRef = useRef<HTMLDivElement>(null);
  const laserGuideRef = useRef<HTMLDivElement>(null);
  const snipFlashRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

  // Pointer tracking
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);

  // Entrance animation for ribbon and center bow
  useEffect(() => {
    if (leftRibbonWrapperRef.current && rightRibbonWrapperRef.current && centerFlowerRef.current) {
      gsap.fromTo(
        [leftRibbonWrapperRef.current, rightRibbonWrapperRef.current],
        { opacity: 0, scaleY: 0.6, y: -10 },
        { opacity: 1, scaleY: 1, y: 0, duration: 1.1, ease: "power3.out" }
      );
      gsap.fromTo(
        centerFlowerRef.current,
        { opacity: 0, scale: 0.3, rotation: -30 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.0, delay: 0.2, ease: "back.out(1.7)" }
      );
    }
  }, []);

  // Idle gentle bow breathing
  useEffect(() => {
    if (!centerFlowerRef.current || isCut || isCuttingActive) return;

    const pulseTween = gsap.to(centerFlowerRef.current, {
      scale: 1.07,
      rotation: 2,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      pulseTween.kill();
    };
  }, [isCut, isCuttingActive]);

  // Dynamic light sheen following cursor
  const handlePointerMove = (e: React.PointerEvent) => {
    if (isCut || isCuttingActive) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
    setLightOffset(Math.max(10, Math.min(90, relativeX)));

    // If dragging across center cut zone (42% to 58%) -> trigger cut!
    if (isPointerDownRef.current) {
      if (relativeX >= 42 && relativeX <= 58) {
        performCut();
      }
    }
  };

  // Quantum Particle Explosion & Atom Illustrations Burst
  const triggerCelebration = useCallback((originX: number, originY: number) => {
    if (!sparklesRef.current) return;
    const container = sparklesRef.current;

    const colors = [
      "#EF4444", // Crimson Red
      "#DC2626", // Satin Red
      "#8B5CF6", // Quantum Violet
      "#3B82F6", // Atomic Blue
      "#06B6D4", // Cyan Photon
      "#F59E0B", // Energy Gold
      "#FFFFFF", // Pure White Light
    ];

    // 1. Spawn 30 Quantum Atom Orbital Illustrations radiating outwards
    for (let a = 0; a < 30; a++) {
      const atomNode = document.createElement("div");
      atomNode.className = "absolute pointer-events-none z-50 flex items-center justify-center";
      atomNode.style.left = `${originX}px`;
      atomNode.style.top = `${originY}px`;
      atomNode.style.width = "46px";
      atomNode.style.height = "46px";
      atomNode.style.transform = "translate(-50%, -50%) scale(0.2)";

      // SVG Atom Illustration
      atomNode.innerHTML = `
        <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_10px_rgba(59,130,246,0.9)]">
          <ellipse cx="50" cy="50" rx="42" ry="15" fill="none" stroke="#60A5FA" stroke-width="2.5" transform="rotate(0 50 50)" opacity="0.85"/>
          <ellipse cx="50" cy="50" rx="42" ry="15" fill="none" stroke="#C084FC" stroke-width="2.5" transform="rotate(60 50 50)" opacity="0.85"/>
          <ellipse cx="50" cy="50" rx="42" ry="15" fill="none" stroke="#F472B6" stroke-width="2.5" transform="rotate(120 50 50)" opacity="0.85"/>
          <circle cx="50" cy="50" r="8" fill="#EF4444"/>
          <circle cx="92" cy="50" r="4" fill="#38BDF8"/>
          <circle cx="29" cy="86" r="4" fill="#E879F9"/>
          <circle cx="29" cy="14" r="4" fill="#FDE047"/>
        </svg>
      `;

      container.appendChild(atomNode);

      const angle = (Math.PI * 2 * a) / 30 + (Math.random() - 0.5) * 0.4;
      const distance = Math.random() * 480 + 220;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance - (Math.random() * 140);

      gsap.to(atomNode, {
        x: targetX,
        y: targetY,
        scale: Math.random() * 1.3 + 0.7,
        rotation: Math.random() * 720 - 360,
        opacity: 0,
        duration: Math.random() * 1.6 + 1.2,
        ease: "power3.out",
        onComplete: () => atomNode.remove(),
      });
    }

    // 2. 140 Quantum Particles & Photon Energy Beams
    for (let i = 0; i < 140; i++) {
      const particle = document.createElement("div");
      const isBeam = i % 4 === 0;
      const size = isBeam ? Math.random() * 5 + 3 : Math.random() * 8 + 4;
      const length = isBeam ? Math.random() * 30 + 16 : size;

      particle.className = "absolute pointer-events-none rounded-full";
      particle.style.width = `${size}px`;
      particle.style.height = `${length}px`;
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = `${originX}px`;
      particle.style.top = `${originY}px`;
      particle.style.transform = "translate(-50%, -50%)";
      particle.style.boxShadow = `0 0 ${Math.random() * 14 + 6}px ${particle.style.backgroundColor}`;

      container.appendChild(particle);

      const angle = (Math.PI * 2 * i) / 140 + (Math.random() - 0.5) * 0.35;
      const velocity = Math.random() * 560 + 220;
      const targetX = Math.cos(angle) * velocity;
      const targetY = Math.sin(angle) * velocity + (Math.random() * 160 - 80);

      gsap.to(particle, {
        x: targetX,
        y: targetY,
        rotation: Math.random() * 360,
        opacity: 0,
        scale: Math.random() * 0.4 + 0.1,
        duration: Math.random() * 1.5 + 1.1,
        ease: "power2.out",
        onComplete: () => particle.remove(),
      });
    }

    // 3. Expanding Energy Shockwave Rings
    for (let j = 0; j < 3; j++) {
      const ring = document.createElement("div");
      ring.className = "absolute pointer-events-none rounded-full border z-40";
      ring.style.width = "30px";
      ring.style.height = "30px";
      ring.style.borderColor = j === 0 ? "#EF4444" : j === 1 ? "#60A5FA" : "#C084FC";
      ring.style.borderWidth = `${3 - j * 0.8}px`;
      ring.style.left = `${originX}px`;
      ring.style.top = `${originY}px`;
      ring.style.transform = "translate(-50%, -50%)";
      ring.style.boxShadow = `0 0 35px ${ring.style.borderColor}`;
      container.appendChild(ring);

      gsap.to(ring, {
        width: 650 + j * 200,
        height: 650 + j * 200,
        opacity: 0,
        duration: 1.4 + j * 0.2,
        ease: "power2.out",
        onComplete: () => ring.remove(),
      });
    }
  }, []);

  // Main Ribbon Cutting Sequence
  const performCut = useCallback(() => {
    if (isCut || isCuttingActive) return;
    setIsCuttingActive(true);
    setIsCut(true);

    const rect = containerRef.current?.getBoundingClientRect();
    const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const originY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onCut, 500);
      },
    });

    // Step 1: Laser Seam Cut Slice
    if (laserGuideRef.current) {
      tl.to(laserGuideRef.current, {
        scaleY: 2.6,
        opacity: 1,
        duration: 0.12,
        ease: "power2.out",
      }, 0)
      .to(laserGuideRef.current, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
      }, 0.12);
    }

    // Step 2: Instant Snip Light Burst
    if (snipFlashRef.current) {
      tl.fromTo(
        snipFlashRef.current,
        { opacity: 0, scale: 0.3 },
        { opacity: 1, scale: 3.0, duration: 0.12, ease: "power1.out" },
        0.04
      ).to(snipFlashRef.current, {
        opacity: 0,
        scale: 4.5,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    // Step 3: Trigger Quantum Particles & Atom Explosions
    tl.add(() => {
      triggerCelebration(originX, originY);
    }, 0.08);

    // Step 4: Central Silk Bow opens & dissolves
    if (centerFlowerRef.current) {
      tl.to(
        centerFlowerRef.current,
        {
          opacity: 0,
          scale: 1.8,
          rotation: 60,
          duration: 0.38,
          ease: "power2.out",
        },
        0.04
      );
    }

    // Step 5: Realistic Silk Ribbon Recoil & Gravity Flutter
    if (leftRibbonInnerRef.current && rightRibbonInnerRef.current) {
      tl.to(
        leftRibbonInnerRef.current,
        {
          x: -520,
          y: 220,
          rotation: -28,
          scaleX: 0.92,
          opacity: 0,
          duration: 1.4,
          ease: "power2.inOut",
        },
        0.08
      );

      tl.to(
        rightRibbonInnerRef.current,
        {
          x: 520,
          y: 220,
          rotation: 28,
          scaleX: 0.92,
          opacity: 0,
          duration: 1.4,
          ease: "power2.inOut",
        },
        0.08
      );
    }
  }, [isCut, isCuttingActive, triggerCelebration, onCut]);

  // Pointer interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isCut || isCuttingActive) return;
    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    const dist = Math.hypot(e.clientX - startXRef.current, e.clientY - startYRef.current);
    if (dist < 20) {
      performCut();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none flex items-center justify-center cursor-pointer touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={performCut}
      onMouseLeave={() => {
        setLightOffset(50);
      }}
      role="button"
      tabIndex={0}
      aria-label="Inaugurate Ribbon"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") performCut();
      }}
    >
      {/* Particle layer */}
      <div ref={sparklesRef} className="fixed inset-0 pointer-events-none z-50" />

      {/* SVG Definitions for Red Satin Textures, Sheens & Stitching */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          {/* Static Smooth Specular Red Satin Left */}
          <linearGradient id="realSatinLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#450A0A" />
            <stop offset="25%" stopColor="#7F1D1D" />
            <stop offset="55%" stopColor="#DC2626" />
            <stop offset="85%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          {/* Static Smooth Specular Red Satin Right */}
          <linearGradient id="realSatinRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#991B1B" />
            <stop offset="15%" stopColor="#EF4444" />
            <stop offset="45%" stopColor="#DC2626" />
            <stop offset="75%" stopColor="#7F1D1D" />
            <stop offset="100%" stopColor="#450A0A" />
          </linearGradient>

          {/* Fabric Vertical Sheen */}
          <linearGradient id="fabricVerticalSheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="20%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(239,68,68,0.18)" />
            <stop offset="80%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Atmospheric Ribbon Red Glow */}
      <div
        className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-24 sm:h-28 md:h-32 rounded-full blur-2xl opacity-50 pointer-events-none transition-opacity duration-300"
        style={{
          background: "linear-gradient(90deg, rgba(220,38,38,0.5) 0%, rgba(239,68,68,0.7) 50%, rgba(185,28,28,0.5) 100%)",
        }}
      />

      {/* ================= LEFT RED SILK RIBBON HALF ================= */}
      <div
        ref={leftRibbonWrapperRef}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-[52%] h-20 sm:h-24 md:h-28 lg:h-30 pointer-events-none z-10"
      >
        <div ref={leftRibbonInnerRef} className="w-full h-full origin-right transition-transform duration-200">
          <svg
            viewBox="0 0 1000 130"
            preserveAspectRatio="none"
            className="w-full h-full filter drop-shadow-[0_14px_28px_rgba(0,0,0,0.75)]"
          >
            {/* Satin ribbon body */}
            <path
              d="M 0,22 C 320,38 680,18 1000,28 L 1000,104 C 680,94 320,114 0,98 Z"
              fill="url(#realSatinLeft)"
            />
            {/* Vertical sheen overlay */}
            <path
              d="M 0,22 C 320,38 680,18 1000,28 L 1000,104 C 680,94 320,114 0,98 Z"
              fill="url(#fabricVerticalSheen)"
            />
            {/* Fine top border trim */}
            <path
              d="M 0,22 C 320,38 680,18 1000,28"
              stroke="rgba(254, 202, 202, 0.6)"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Fine bottom border trim */}
            <path
              d="M 0,98 C 320,114 680,94 1000,104"
              stroke="rgba(153, 27, 27, 0.8)"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Text on Left Ribbon */}
            <text
              x="500"
              y="68"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255, 255, 255, 0.45)"
              fontSize="34"
              fontWeight="900"
              letterSpacing="7"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              VISHNU QUANTUM CLUB
            </text>
          </svg>
        </div>
      </div>

      {/* ================= RIGHT RED SILK RIBBON HALF ================= */}
      <div
        ref={rightRibbonWrapperRef}
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[52%] h-20 sm:h-24 md:h-28 lg:h-30 pointer-events-none z-10"
      >
        <div ref={rightRibbonInnerRef} className="w-full h-full origin-left transition-transform duration-200">
          <svg
            viewBox="0 0 1000 130"
            preserveAspectRatio="none"
            className="w-full h-full filter drop-shadow-[0_14px_28px_rgba(0,0,0,0.75)]"
          >
            {/* Satin ribbon body */}
            <path
              d="M 0,28 C 320,18 680,38 1000,22 L 1000,98 C 680,114 320,94 0,104 Z"
              fill="url(#realSatinRight)"
            />
            {/* Vertical sheen overlay */}
            <path
              d="M 0,28 C 320,18 680,38 1000,22 L 1000,98 C 680,114 320,94 0,104 Z"
              fill="url(#fabricVerticalSheen)"
            />
            {/* Fine top border trim */}
            <path
              d="M 0,28 C 320,18 680,38 1000,22"
              stroke="rgba(254, 202, 202, 0.6)"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Fine bottom border trim */}
            <path
              d="M 0,104 C 320,94 680,114 1000,98"
              stroke="rgba(153, 27, 27, 0.8)"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Text on Right Ribbon */}
            <text
              x="500"
              y="68"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(127, 29, 29, 0.95)"
              fontSize="32"
              fontWeight="900"
              letterSpacing="5"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              VISHNU INSTITUTE OF TECHNOLOGY
            </text>
          </svg>
        </div>
      </div>

      {/* Center Laser Cut Seam Line */}
      <div
        ref={laserGuideRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center justify-center transition-opacity"
      >
        <div className="w-[2.5px] h-36 sm:h-44 md:h-52 bg-gradient-to-b from-transparent via-red-300 to-transparent shadow-[0_0_18px_#EF4444] animate-pulse" />
      </div>

      {/* Snip Instant Light Flash */}
      <div
        ref={snipFlashRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white opacity-0 pointer-events-none z-50 shadow-[0_0_80px_#FFFFFF,0_0_150px_#EF4444]"
      />

      {/* ================= CENTRAL RED SATIN RIBBON BOW ILLUSTRATION ================= */}
      <div
        ref={centerFlowerRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[41.6%] z-30 transition-transform duration-300 hover:scale-110 cursor-pointer"
      >
        {/* Ambient Red Glow */}
        <div className="absolute inset-0 rounded-full bg-red-600/40 blur-2xl animate-pulse pointer-events-none" />

        {/* Real Glossy Red Ribbon Bow Vector */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 flex items-center justify-center filter drop-shadow-[0_14px_32px_rgba(153,27,27,0.85)]">
          <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible">
            <defs>
              {/* Rich Glossy Red Bow Gradients */}
              <linearGradient id="bowGlossyRed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F87171" />
                <stop offset="25%" stopColor="#EF4444" />
                <stop offset="65%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#991B1B" />
              </linearGradient>

              <linearGradient id="bowGlossyInnerShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#450A0A" />
                <stop offset="100%" stopColor="#1C0303" />
              </linearGradient>

              <linearGradient id="bowKnotStripes" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="20%" stopColor="#EF4444" />
                <stop offset="40%" stopColor="#FCA5A5" />
                <stop offset="60%" stopColor="#EF4444" />
                <stop offset="80%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#991B1B" />
              </linearGradient>
            </defs>

            {/* Ambient Shadow under Bow */}
            <ellipse cx="120" cy="98" rx="85" ry="32" fill="rgba(0,0,0,0.5)" />

            {/* --- TAILS --- */}
            {/* Left Tail */}
            <g>
              <path
                d="M 110,105 C 100,138 78,180 58,212 L 86,220 L 108,180 L 122,108 Z"
                fill="url(#bowGlossyRed)"
                stroke="#7F1D1D"
                strokeWidth="2"
              />
              {/* Left Tail Glossy White Highlight */}
              <path
                d="M 110,108 C 102,136 82,176 65,206"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.85"
                fill="none"
              />
            </g>

            {/* Right Tail */}
            <g>
              <path
                d="M 130,105 C 140,138 162,180 182,212 L 154,220 L 132,180 L 118,108 Z"
                fill="url(#bowGlossyRed)"
                stroke="#7F1D1D"
                strokeWidth="2"
              />
              {/* Right Tail Glossy White Highlight */}
              <path
                d="M 130,108 C 138,136 158,176 175,206"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.85"
                fill="none"
              />
            </g>

            {/* --- LEFT LOOP --- */}
            <g>
              {/* Outer Loop */}
              <path
                d="M 112,100 C 80,70 25,60 20,92 C 15,120 70,125 112,108 Z"
                fill="url(#bowGlossyRed)"
                stroke="#7F1D1D"
                strokeWidth="2"
              />
              {/* Dark Cavity Interior */}
              <path
                d="M 106,98 C 82,82 46,78 36,92 C 30,102 62,112 106,104 Z"
                fill="url(#bowGlossyInnerShadow)"
              />
              {/* Glossy White Edge Highlight along upper curve */}
              <path
                d="M 110,90 C 76,68 32,62 24,82"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                opacity="0.9"
              />
            </g>

            {/* --- RIGHT LOOP --- */}
            <g>
              {/* Outer Loop */}
              <path
                d="M 128,100 C 160,70 215,60 220,92 C 225,120 170,125 128,108 Z"
                fill="url(#bowGlossyRed)"
                stroke="#7F1D1D"
                strokeWidth="2"
              />
              {/* Dark Cavity Interior */}
              <path
                d="M 134,98 C 158,82 194,78 204,92 C 210,102 178,112 134,104 Z"
                fill="url(#bowGlossyInnerShadow)"
              />
              {/* Glossy White Edge Highlight along upper curve */}
              <path
                d="M 130,90 C 164,68 208,62 216,82"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                opacity="0.9"
              />
            </g>

            {/* --- CENTER KNOT BAND (CENTERED AT Y=100) --- */}
            <g>
              <rect x="104" y="80" width="32" height="40" rx="10" fill="url(#bowKnotStripes)" stroke="#7F1D1D" strokeWidth="2" />
              {/* Vertical Stripe Lines */}
              <line x1="112" y1="81" x2="112" y2="119" stroke="#7F1D1D" strokeWidth="1.5" />
              <line x1="120" y1="80" x2="120" y2="120" stroke="#FFFFFF" strokeWidth="2" opacity="0.8" />
              <line x1="128" y1="81" x2="128" y2="119" stroke="#7F1D1D" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}


