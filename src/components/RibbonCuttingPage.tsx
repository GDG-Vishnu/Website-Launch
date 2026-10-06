"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import RibbonCutting from "./RibbonCutting";

interface RibbonCuttingPageProps {
  onComplete?: () => void;
}

export default function RibbonCuttingPage({ onComplete }: RibbonCuttingPageProps) {
  const [isCut, setIsCut] = useState(false);

  const pageContainerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const ribbonWrapperRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    if (heroTextRef.current && ribbonWrapperRef.current) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        heroTextRef.current,
        { opacity: 0, y: -25 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.15 }
      ).fromTo(
        ribbonWrapperRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 1.0 },
        "-=0.5"
      );
    }
  }, []);

  // Ribbon cut → brief celebration → trigger onComplete
  const handleRibbonCut = useCallback(() => {
    if (isCut) return;
    setIsCut(true);

    const tl = gsap.timeline();

    if (heroTextRef.current) {
      tl.to(heroTextRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.inOut",
      }, 0);
    }

    tl.add(() => {
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 900);
    }, 0.1);
  }, [isCut, onComplete]);

  return (
    <div
      ref={pageContainerRef}
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-between select-none py-6"
      style={{
        background: "radial-gradient(ellipse at 50% 50%, #170A2A 0%, #0A0416 65%, #05020B 100%)",
        color: "#F4F6FF",
      }}
    >
      {/* ── TOP-LEFT RED RECTANGLE BANNER (45 DEGREE CORNER CUTOUT) ──────── */}
      <div className="absolute top-0 left-0 z-30 pointer-events-none overflow-hidden w-64 h-64">
        <div
          className="w-80 h-16 bg-gradient-to-r from-red-800 via-red-600 to-red-700 shadow-[0_10px_25px_rgba(185,28,28,0.6)] border-b-2 border-red-300/40"
          style={{
            transform: "rotate(-45deg) translate(-28%, -50%)",
            transformOrigin: "top left",
          }}
        />
      </div>

      {/* ── TOP-RIGHT RED RECTANGLE BANNER (135 DEGREE / 45 DEGREE MIRRORED) ── */}
      <div className="absolute top-0 right-0 z-30 pointer-events-none overflow-hidden w-64 h-64">
        <div
          className="w-80 h-16 bg-gradient-to-r from-red-700 via-red-600 to-red-800 shadow-[0_10px_25px_rgba(185,28,28,0.6)] border-b-2 border-red-300/40"
          style={{
            transform: "rotate(45deg) translate(28%, -50%)",
            transformOrigin: "top right",
          }}
        />
      </div>

      {/* ── Visual Environment ──────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Quantum Coordinate Grid */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(124, 36, 204, 0.22) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124, 36, 204, 0.22) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />

        {/* Central Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[400px] rounded-full blur-[140px] opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(239, 68, 68, 0.45) 0%, rgba(124, 36, 204, 0.35) 45%, transparent 70%)",
          }}
        />

        {/* Orbital SVG Rings */}
        <svg
          viewBox="0 0 1000 600"
          className="absolute inset-0 w-full h-full opacity-20"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="orbitRCP1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0" />
              <stop offset="50%" stopColor="#EF4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7C24CC" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="orbitRCP2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </linearGradient>
          </defs>
          <ellipse cx="500" cy="300" rx="460" ry="160" fill="none" stroke="url(#orbitRCP1)" strokeWidth="1.2" transform="rotate(-12 500 300)" />
          <ellipse cx="500" cy="300" rx="420" ry="140" fill="none" stroke="url(#orbitRCP2)" strokeWidth="1.0" transform="rotate(22 500 300)" />
        </svg>

        {/* Center Screen Cut Seam Line */}
        <div
          className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 opacity-30"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #EF4444 20%, #FDE68A 50%, #EF4444 80%, transparent 100%)",
            boxShadow: "0 0 16px rgba(239, 68, 68, 0.5)",
          }}
        />
      </div>


      {/* ── MAIN HERO & RIBBON CLUSTER ────────────────────────────────── */}
      <main className="relative z-20 w-full max-w-6xl mx-auto flex flex-col items-center justify-center px-4 my-auto">
        {/* Hero Title Container */}
        <div
          ref={heroTextRef}
          className="text-center mb-6 sm:mb-8 md:mb-10 max-w-4xl"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-100 to-indigo-200 drop-shadow-[0_6px_24px_rgba(0,0,0,0.85)] uppercase">
            VISHNU QUANTUM CLUB
          </h1>
          <p className="text-sm sm:text-lg md:text-xl font-bold tracking-[0.25em] text-purple-200/90 uppercase drop-shadow">
            THE FUTURE IS READY TO BEGIN
          </p>
        </div>

        {/* Red Satin Ribbon Cutting Component */}
        <div
          ref={ribbonWrapperRef}
          className="relative w-full h-56 sm:h-64 md:h-72 flex items-center justify-center"
        >
          <RibbonCutting onCut={handleRibbonCut} />
        </div>
      </main>
    </div>
  );
}

