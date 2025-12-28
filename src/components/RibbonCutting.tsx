"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";

interface RibbonCuttingProps {
  onCut: () => void;
}

export default function RibbonCutting({ onCut }: RibbonCuttingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRibbonRef = useRef<HTMLDivElement>(null);
  const rightRibbonRef = useRef<HTMLDivElement>(null);
  const cutLineRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

  const [isCut, setIsCut] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [cutProgress, setCutProgress] = useState(0);

  const ribbonCenterY = 50; // Center of ribbon in percentage
  const cutThreshold = 80; // Progress needed to cut (percentage)

  // Handle pointer movement
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      if (isDrawing && !isCut) {
        const relativeY = ((e.clientY - rect.top) / rect.height) * 100;
        const relativeX = ((e.clientX - rect.left) / rect.width) * 100;

        // If pointer crosses the center cut zone, perform a single immediate cut
        if (
          relativeX > 40 &&
          relativeX < 60 &&
          relativeY > 35 &&
          relativeY < 65
        ) {
          // show a few particles at the pointer
          createCutParticles(e.clientX, e.clientY);
          // perform the cut immediately on a single crossing
          performCut();
        }
      }
    },
    [isDrawing, isCut]
  );

  const handlePointerDown = useCallback((e: PointerEvent) => {
    setIsDrawing(true);
    (e.target as Element)?.setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      setIsDrawing(false);
      (e.target as Element)?.releasePointerCapture?.(e.pointerId);
      if (!isCut && cutProgress < cutThreshold) {
        // Reset progress if not fully cut
        gsap.to(
          { progress: cutProgress },
          {
            progress: 0,
            duration: 0.3,
            onUpdate: function () {
              setCutProgress(this.targets()[0].progress);
            },
          }
        );
      }
    },
    [isCut, cutProgress]
  );

  const createCutParticles = (x: number, y: number) => {
    if (!sparklesRef.current) return;

    for (let i = 0; i < 3; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute w-2 h-2 rounded-full pointer-events-none";
      particle.style.background = `hsl(${Math.random() * 60 + 30}, 100%, 70%)`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.transform = "translate(-50%, -50%)";
      sparklesRef.current.appendChild(particle);

      gsap.to(particle, {
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        opacity: 0,
        scale: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => particle.remove(),
      });
    }
  };

  const createCelebrationParticles = () => {
    if (!sparklesRef.current) return;

    const colors = [
      "#FFD700",
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
    ];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 100; i++) {
      const particle = document.createElement("div");
      const size = Math.random() * 12 + 4;
      const isConfetti = Math.random() > 0.5;

      particle.className = "absolute pointer-events-none";
      particle.style.width = `${size}px`;
      particle.style.height = isConfetti ? `${size * 2}px` : `${size}px`;
      particle.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = isConfetti ? "2px" : "50%";
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      particle.style.transform = "translate(-50%, -50%)";
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
        ease: "power2.out",
        onComplete: () => particle.remove(),
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
      gsap.fromTo(
        cutLineRef.current,
        { strokeDashoffset: 100, opacity: 1 },
        { strokeDashoffset: 0, duration: 0.2, ease: "power2.out" }
      );
    }

    // Animate ribbon split
    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(onCut, 500);
      },
    });

    // Left ribbon falls away
    if (leftRibbonRef.current) {
      timeline.to(
        leftRibbonRef.current,
        {
          x: -300,
          y: 200,
          rotation: -45,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        0
      );
    }

    // Right ribbon falls away
    if (rightRibbonRef.current) {
      timeline.to(
        rightRibbonRef.current,
        {
          x: 300,
          y: 200,
          rotation: 45,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        0
      );
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointerleave", handlePointerUp);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointerleave", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerDown, handlePointerUp]);

  // Initial ribbon animation
  useEffect(() => {
    if (leftRibbonRef.current && rightRibbonRef.current) {
      gsap.fromTo(
        [leftRibbonRef.current, rightRibbonRef.current],
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
          stagger: 0.1,
        }
      );
    }
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Sparkles container */}
      <div
        ref={sparklesRef}
        className="fixed inset-0 pointer-events-none z-40"
      />

      {/* Progress indicator */}

      {/* Main ribbon container (div-based) */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-crosshair touch-none relative overflow-visible"
      >
        {/* Left ribbon half */}
        <div
          ref={leftRibbonRef}
          style={{ transformOrigin: "100% 50%", left: "-10%", width: "60%" }}
          className="absolute top-1/2 -translate-y-1/2 h-28 overflow-visible"
        >
          {/* Ribbon body with satin effect */}
          <div
            className="w-full h-full relative"
            style={{
              background: `linear-gradient(180deg, 
                #8B0000 0%, 
                #DC143C 15%, 
                #FF2D2D 30%, 
                #DC143C 50%, 
                #B22222 70%, 
                #8B0000 85%, 
                #5C0000 100%)`,
              boxShadow: `
                inset 0 2px 4px rgba(255,255,255,0.3),
                inset 0 -2px 4px rgba(0,0,0,0.3),
                0 4px 12px rgba(0,0,0,0.4),
                0 2px 4px rgba(0,0,0,0.2)
              `,
              borderTop: "1px solid rgba(255,150,150,0.4)",
              borderBottom: "1px solid rgba(80,0,0,0.6)",
            }}
          >
            {/* Satin shine overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(90deg, 
                  transparent 0%, 
                  rgba(255,255,255,0.1) 20%, 
                  rgba(255,255,255,0.2) 40%, 
                  rgba(255,255,255,0.1) 60%, 
                  transparent 100%)`,
              }}
            />
            {/* Fabric texture overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(255,255,255,0.1) 2px,
                  rgba(255,255,255,0.1) 4px
                )`,
              }}
            />
            {/* Gold trim - top */}
            <div
              className="absolute top-0 left-0 right-0 h-2"
              style={{
                background: `linear-gradient(180deg, 
                  #FFD700 0%, 
                  #FFA500 50%, 
                  #B8860B 100%)`,
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            />
            {/* Gold trim - bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-2"
              style={{
                background: `linear-gradient(180deg, 
                  #B8860B 0%, 
                  #FFA500 50%, 
                  #FFD700 100%)`,
                boxShadow: "0 -1px 2px rgba(0,0,0,0.3)",
              }}
            />
          </div>
          {/* Ribbon fold/wave at edge */}
          <div
            className="absolute -right-3 top-0 h-full w-6"
            style={{
              background: `linear-gradient(90deg, 
                #8B0000 0%, 
                #5C0000 50%, 
                #3C0000 100%)`,
              clipPath: "polygon(0 0, 100% 20%, 100% 80%, 0 100%)",
              boxShadow: "inset -2px 0 4px rgba(0,0,0,0.5)",
            }}
          />
        </div>

        {/* Right ribbon half */}
        <div
          ref={rightRibbonRef}
          style={{ transformOrigin: "0% 50%", right: "-10%", width: "60%" }}
          className="absolute top-1/2 -translate-y-1/2 h-28 overflow-visible"
        >
          {/* Ribbon body with satin effect */}
          <div
            className="w-full h-full relative"
            style={{
              background: `linear-gradient(180deg, 
                #8B0000 0%, 
                #DC143C 15%, 
                #FF2D2D 30%, 
                #DC143C 50%, 
                #B22222 70%, 
                #8B0000 85%, 
                #5C0000 100%)`,
              boxShadow: `
                inset 0 2px 4px rgba(255,255,255,0.3),
                inset 0 -2px 4px rgba(0,0,0,0.3),
                0 4px 12px rgba(0,0,0,0.4),
                0 2px 4px rgba(0,0,0,0.2)
              `,
              borderTop: "1px solid rgba(255,150,150,0.4)",
              borderBottom: "1px solid rgba(80,0,0,0.6)",
            }}
          >
            {/* Satin shine overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(90deg, 
                  transparent 0%, 
                  rgba(255,255,255,0.1) 40%, 
                  rgba(255,255,255,0.2) 60%, 
                  rgba(255,255,255,0.1) 80%, 
                  transparent 100%)`,
              }}
            />
            {/* Fabric texture overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(255,255,255,0.1) 2px,
                  rgba(255,255,255,0.1) 4px
                )`,
              }}
            />
            {/* Gold trim - top */}
            <div
              className="absolute top-0 left-0 right-0 h-2"
              style={{
                background: `linear-gradient(180deg, 
                  #FFD700 0%, 
                  #FFA500 50%, 
                  #B8860B 100%)`,
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            />
            {/* Gold trim - bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-2"
              style={{
                background: `linear-gradient(180deg, 
                  #B8860B 0%, 
                  #FFA500 50%, 
                  #FFD700 100%)`,
                boxShadow: "0 -1px 2px rgba(0,0,0,0.3)",
              }}
            />
          </div>
          {/* Ribbon fold/wave at edge */}
          <div
            className="absolute -left-3 top-0 h-full w-6"
            style={{
              background: `linear-gradient(270deg, 
                #8B0000 0%, 
                #5C0000 50%, 
                #3C0000 100%)`,
              clipPath: "polygon(0 20%, 100% 0, 100% 100%, 0 80%)",
              boxShadow: "inset 2px 0 4px rgba(0,0,0,0.5)",
            }}
          />
        </div>

        {/* Center knot (enhanced with gold ring and logo) */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 ${
            isCut ? "opacity-0" : "opacity-100"
          }`}
          style={{ transition: "opacity 0.3s" }}
        >
          {/* Ribbon rosette/bow SVG behind the logo */}
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            width="180"
            height="180"
            viewBox="0 0 180 180"
            style={{ zIndex: -1 }}
          >
            {/* Outer ribbon loops */}
            <defs>
              <linearGradient
                id="ribbonGradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#DC143C" />
                <stop offset="50%" stopColor="#8B0000" />
                <stop offset="100%" stopColor="#5C0000" />
              </linearGradient>
              <linearGradient
                id="ribbonGradient2"
                x1="100%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FF2D2D" />
                <stop offset="50%" stopColor="#DC143C" />
                <stop offset="100%" stopColor="#8B0000" />
              </linearGradient>
              <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FFA500" />
                <stop offset="100%" stopColor="#B8860B" />
              </linearGradient>
              <filter
                id="ribbonShadow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feDropShadow
                  dx="2"
                  dy="4"
                  stdDeviation="3"
                  floodOpacity="0.4"
                />
              </filter>
            </defs>

            {/* Top loop */}
            <ellipse
              cx="90"
              cy="35"
              rx="28"
              ry="35"
              fill="url(#ribbonGradient1)"
              filter="url(#ribbonShadow)"
            />
            <ellipse
              cx="90"
              cy="35"
              rx="24"
              ry="30"
              fill="url(#ribbonGradient2)"
            />

            {/* Bottom loop */}
            <ellipse
              cx="90"
              cy="145"
              rx="28"
              ry="35"
              fill="url(#ribbonGradient1)"
              filter="url(#ribbonShadow)"
            />
            <ellipse
              cx="90"
              cy="145"
              rx="24"
              ry="30"
              fill="url(#ribbonGradient2)"
            />

            {/* Left loop */}
            <ellipse
              cx="35"
              cy="90"
              rx="35"
              ry="28"
              fill="url(#ribbonGradient1)"
              filter="url(#ribbonShadow)"
            />
            <ellipse
              cx="35"
              cy="90"
              rx="30"
              ry="24"
              fill="url(#ribbonGradient2)"
            />

            {/* Right loop */}
            <ellipse
              cx="145"
              cy="90"
              rx="35"
              ry="28"
              fill="url(#ribbonGradient1)"
              filter="url(#ribbonShadow)"
            />
            <ellipse
              cx="145"
              cy="90"
              rx="30"
              ry="24"
              fill="url(#ribbonGradient2)"
            />

            {/* Diagonal loops - top left */}
            <ellipse
              cx="50"
              cy="50"
              rx="25"
              ry="20"
              fill="url(#ribbonGradient1)"
              filter="url(#ribbonShadow)"
              transform="rotate(-45 50 50)"
            />
            <ellipse
              cx="50"
              cy="50"
              rx="21"
              ry="16"
              fill="url(#ribbonGradient2)"
              transform="rotate(-45 50 50)"
            />

            {/* Diagonal loops - top right */}
            <ellipse
              cx="130"
              cy="50"
              rx="25"
              ry="20"
              fill="url(#ribbonGradient1)"
              filter="url(#ribbonShadow)"
              transform="rotate(45 130 50)"
            />
            <ellipse
              cx="130"
              cy="50"
              rx="21"
              ry="16"
              fill="url(#ribbonGradient2)"
              transform="rotate(45 130 50)"
            />

            {/* Diagonal loops - bottom left */}
            <ellipse
              cx="50"
              cy="130"
              rx="25"
              ry="20"
              fill="url(#ribbonGradient1)"
              filter="url(#ribbonShadow)"
              transform="rotate(45 50 130)"
            />
            <ellipse
              cx="50"
              cy="130"
              rx="21"
              ry="16"
              fill="url(#ribbonGradient2)"
              transform="rotate(45 50 130)"
            />

            {/* Diagonal loops - bottom right */}
            <ellipse
              cx="130"
              cy="130"
              rx="25"
              ry="20"
              fill="url(#ribbonGradient1)"
              filter="url(#ribbonShadow)"
              transform="rotate(-45 130 130)"
            />
            <ellipse
              cx="130"
              cy="130"
              rx="21"
              ry="16"
              fill="url(#ribbonGradient2)"
              transform="rotate(-45 130 130)"
            />

            {/* Ribbon tails */}
            <path
              d="M 20 90 Q 0 110, 5 150 L 15 145 Q 15 115, 30 95 Z"
              fill="url(#ribbonGradient1)"
              filter="url(#ribbonShadow)"
            />
            <path
              d="M 160 90 Q 180 110, 175 150 L 165 145 Q 165 115, 150 95 Z"
              fill="url(#ribbonGradient1)"
              filter="url(#ribbonShadow)"
            />

            {/* Gold trim accents */}
            <circle cx="90" cy="35" r="8" fill="url(#goldTrim)" />
            <circle cx="90" cy="145" r="8" fill="url(#goldTrim)" />
            <circle cx="35" cy="90" r="8" fill="url(#goldTrim)" />
            <circle cx="145" cy="90" r="8" fill="url(#goldTrim)" />
          </svg>

          {/* Outer gold ring */}
          <div
            className="rounded-full flex items-center justify-center relative z-10"
            style={{
              width: 88,
              height: 88,
              background: `linear-gradient(135deg, 
                #FFD700 0%, 
                #FFA500 25%, 
                #B8860B 50%, 
                #FFA500 75%, 
                #FFD700 100%)`,
              boxShadow: `
                0 4px 16px rgba(0,0,0,0.4),
                0 2px 8px rgba(0,0,0,0.3),
                inset 0 2px 4px rgba(255,255,255,0.4),
                inset 0 -2px 4px rgba(0,0,0,0.3)
              `,
            }}
          >
            {/* Inner dark circle with logo */}
            <div
              className="rounded-full overflow-hidden flex items-center justify-center"
              style={{
                width: 72,
                height: 72,
                background: `radial-gradient(circle at 30% 30%, #333 0%, #111 50%, #000 100%)`,
                border: "3px solid #B8860B",
                boxShadow: `
                  inset 0 4px 8px rgba(255,255,255,0.1),
                  inset 0 -4px 8px rgba(0,0,0,0.5)
                `,
              }}
            >
              <img
                src="https://res.cloudinary.com/dlupkibvq/image/upload/v1766897167/kshzwc2xey0wu6ce5aci.png"
                alt="logo"
                style={{
                  width: "65%",
                  height: "65%",
                  objectFit: "contain",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                }}
              />
            </div>
          </div>
        </div>

        {/* Cut line indicator */}
        <div
          ref={cutLineRef}
          className={isCut ? "opacity-100" : "opacity-0"}
          style={{
            position: "absolute",
            left: "50%",
            top: "38%",
            transform: "translateX(-50%)",
            width: 4,
            height: "24%",
            background:
              "linear-gradient(180deg, #FFD700 0%, #FFF 50%, #FFD700 100%)",
            opacity: isCut ? 1 : 0,
            transition: "opacity 0.2s",
            boxShadow: "0 0 20px #FFD700, 0 0 40px #FFA500",
            borderRadius: 2,
          }}
        />

        {/* Interactive cut zone indicator - scissors hint */}
        {!isCut && (
          <div
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center"
            style={{
              top: "32%",
              width: 60,
              height: "36%",
              background: "rgba(255,215,0,0.05)",
              border: "2px dashed rgba(255,215,0,0.3)",
              borderRadius: 12,
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            <span style={{ fontSize: 28, opacity: 0.7 }}>✂️</span>
            <span className="text-xs text-yellow-500/60 mt-1 font-medium">
              Swipe to cut
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
