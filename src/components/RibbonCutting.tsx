"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";

interface RibbonCuttingProps {
  onCut: () => void;
}

export default function RibbonCutting({ onCut }: RibbonCuttingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRibbonRef = useRef<HTMLImageElement>(null);
  const rightRibbonRef = useRef<HTMLImageElement>(null);
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
      particle.style.background = `rgba(0, 0, 0, ${Math.random() * 0.5 + 0.5})`;
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

    const colors = ["#000000", "#1a1a1a", "#333333", "#666666", "#999999"];
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
    <div className="relative w-full h-full overflow-hidden" >
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
        <img
          ref={leftRibbonRef}
          src="https://res.cloudinary.com/dlupkibvq/image/upload/v1766917079/Left_yo1vr3.png"
          alt="Left ribbon"
          style={{
            transformOrigin: "100% 50%",
            left: 0,
            width: "57%",
            zIndex: 1,
          }}
          className="absolute top-[60%] -translate-y-1/2 h-auto object-contain"
        />

        {/* Right ribbon half */}
        <img
          ref={rightRibbonRef}
          src="https://res.cloudinary.com/dlupkibvq/image/upload/v1766917077/Right_s5lukd.png"
          alt="Right ribbon"
          style={{
            transformOrigin: "0% 50%",
            right: 0,
            width: "57%",
            zIndex: 1,
          }}
          className="absolute top-[60%] -translate-y-1/2 h-auto object-contain"
        />

      </div>
    </div>
  );
}
