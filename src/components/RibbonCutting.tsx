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

    for (let i = 0; i < 5; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute w-2 h-2 rounded-full pointer-events-none";
      particle.style.background = `linear-gradient(135deg, rgba(239, 68, 68, ${
        Math.random() * 0.5 + 0.5
      }), rgba(220, 38, 38, ${Math.random() * 0.5 + 0.5}))`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.transform = "translate(-50%, -50%)";
      particle.style.willChange = "transform, opacity";
      sparklesRef.current.appendChild(particle);

      gsap.to(particle, {
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 80,
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: "power3.out",
        onComplete: () => particle.remove(),
      });
    }
  };

  const createCelebrationParticles = () => {
    if (!sparklesRef.current || !containerRef.current) return;

    // Get the actual ribbon cut position (center of the ribbon)
    const containerRect = containerRef.current.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.top + containerRect.height * 0.6; // Ribbon is at 60% from top

    // Red gradient colors
    const colors = [
      "linear-gradient(135deg, #ff0000, #ff4444)",
      "linear-gradient(135deg, #dc2626, #ef4444)",
      "linear-gradient(135deg, #b91c1c, #f87171)",
      "linear-gradient(135deg, #991b1b, #fca5a5)",
      "linear-gradient(135deg, #7f1d1d, #ff6b6b)",
      "#ff0000",
      "#dc2626",
      "#ef4444",
      "#f87171",
      "#ff4444",
    ];

    // Stagger particle creation for smoother effect
    for (let i = 0; i < 120; i++) {
      const delay = i * 0.008; // Staggered spawn

      setTimeout(() => {
        if (!sparklesRef.current) return;

        const particle = document.createElement("div");
        const size = Math.random() * 16 + 6;
        const shapeType = Math.floor(Math.random() * 5);

        particle.className = "absolute pointer-events-none";
        particle.style.width = `${size}px`;
        particle.style.height =
          shapeType === 4 ? `${size * 2.5}px` : `${size}px`;
        particle.style.willChange = "transform, opacity";
        particle.style.backfaceVisibility = "hidden";

        const colorChoice = colors[Math.floor(Math.random() * colors.length)];
        if (colorChoice.includes("gradient")) {
          particle.style.background = colorChoice;
        } else {
          particle.style.backgroundColor = colorChoice;
        }

        // Shape styling
        switch (shapeType) {
          case 0: // Circle
            particle.style.borderRadius = "50%";
            break;
          case 1: // Square
            particle.style.borderRadius = "3px";
            break;
          case 2: // Triangle/Cone
            particle.style.width = "0";
            particle.style.height = "0";
            particle.style.background = "transparent";
            particle.style.borderLeft = `${size / 2}px solid transparent`;
            particle.style.borderRight = `${size / 2}px solid transparent`;
            particle.style.borderBottom = `${size}px solid ${
              colors[Math.floor(Math.random() * 5) + 5]
            }`;
            break;
          case 3: // Diamond
            particle.style.borderRadius = "3px";
            particle.style.transform = "rotate(45deg)";
            break;
          case 4: // Confetti strip
            particle.style.borderRadius = "2px";
            break;
        }

        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.boxShadow =
          shapeType !== 2 ? `0 0 ${size / 2}px rgba(255, 0, 0, 0.4)` : "none";
        particle.style.opacity = "0";

        sparklesRef.current.appendChild(particle);

        const angle = (Math.PI * 2 * i) / 120 + (Math.random() - 0.5) * 0.3;
        const velocity = Math.random() * 450 + 200;
        const rotationSpeed = Math.random() * 720 - 360;

        // Smooth entrance + exit animation
        gsap
          .timeline()
          .to(particle, {
            opacity: 1,
            scale: 1.2,
            duration: 0.15,
            ease: "power2.out",
          })
          .to(
            particle,
            {
              x: Math.cos(angle) * velocity,
              y: Math.sin(angle) * velocity + 200,
              rotation: rotationSpeed,
              scale: Math.random() * 0.4 + 0.2,
              duration: Math.random() * 1.5 + 1.5,
              ease: "power2.out",
            },
            "-=0.1"
          )
          .to(
            particle,
            {
              opacity: 0,
              duration: 0.6,
              ease: "power2.inOut",
              onComplete: () => particle.remove(),
            },
            "-=0.8"
          );
      }, delay * 1000);
    }

    // Smooth burst rings with better easing
    for (let i = 0; i < 4; i++) {
      const ring = document.createElement("div");
      ring.className = "absolute pointer-events-none rounded-full";
      ring.style.width = "10px";
      ring.style.height = "10px";
      ring.style.border = `${3 - i * 0.5}px solid rgba(239, 68, 68, ${
        0.9 - i * 0.15
      })`;
      ring.style.left = `${centerX}px`;
      ring.style.top = `${centerY}px`;
      ring.style.transform = "translate(-50%, -50%)";
      ring.style.willChange = "width, height, opacity";
      sparklesRef.current.appendChild(ring);

      gsap.to(ring, {
        width: 350 + i * 120,
        height: 350 + i * 120,
        opacity: 0,
        duration: 1.2 + i * 0.25,
        delay: i * 0.12,
        ease: "power3.out",
        onComplete: () => ring.remove(),
      });
    }

    // Add smooth flash effect
    const flash = document.createElement("div");
    flash.className = "absolute pointer-events-none rounded-full";
    flash.style.width = "50px";
    flash.style.height = "50px";
    flash.style.background =
      "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(239,68,68,0.6) 40%, transparent 70%)";
    flash.style.left = `${centerX}px`;
    flash.style.top = `${centerY}px`;
    flash.style.transform = "translate(-50%, -50%)";
    flash.style.willChange = "width, height, opacity";
    sparklesRef.current.appendChild(flash);

    gsap.to(flash, {
      width: 600,
      height: 600,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => flash.remove(),
    });
  };

  const createScreenWideDoodles = () => {
    if (!sparklesRef.current) return;

    // Doodle shapes and symbols
    const doodles = [
      "🎉",
      "✨",
  
      "⚡",

    ];

    const geometricShapes = ["●", "◆", "▲", "■", "★", "♦",];

    // Create 80 doodles spread across the entire screen
    for (let i = 0; i < 50; i++) {
      const delay = i * 0.02 + Math.random() * 0.5; // More varied timing

      setTimeout(() => {
        if (!sparklesRef.current) return;

        const isDoodle = Math.random() > 0.4; // 60% chance for emoji doodles
        const element = document.createElement("div");

        if (isDoodle) {
          const doodle = doodles[Math.floor(Math.random() * doodles.length)];
          element.textContent = doodle;
          element.style.fontSize = `${Math.random() * 30 + 15}px`;
        } else {
          const shape =
            geometricShapes[Math.floor(Math.random() * geometricShapes.length)];
          element.textContent = shape;
          element.style.fontSize = `${Math.random() * 40 + 20}px`;
          element.style.color = `hsl(${Math.random() * 60}, 70%, 50%)`; // Warm colors
        }

        element.className = "absolute pointer-events-none select-none";
        element.style.willChange = "transform, opacity";
        element.style.backfaceVisibility = "hidden";
        element.style.opacity = "0";
        element.style.fontWeight = "bold";
        element.style.textShadow = "2px 2px 4px rgba(0,0,0,0.2)";

        // Random starting position anywhere on screen
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        element.style.left = `${startX}px`;
        element.style.top = `${startY}px`;
        element.style.transform = "translate(-50%, -50%)";

        sparklesRef.current.appendChild(element);

        // Random movement direction
        const moveX = (Math.random() - 0.5) * 600;
        const moveY = (Math.random() - 0.5) * 400 - 100; // Slight upward bias
        const rotation = Math.random() * 720 - 360;
        const scale = Math.random() * 1.5 + 0.5;

        gsap
          .timeline()
          .to(element, {
            opacity: 1,
            scale: scale,
            duration: 0.2,
            ease: "back.out(2)",
          })
          .to(
            element,
            {
              x: moveX,
              y: moveY,
              rotation: rotation,
              duration: Math.random() * 2 + 2,
              ease: "power2.out",
            },
            "-=0.1"
          )
          .to(
            element,
            {
              opacity: 0,
              scale: 0.2,
              duration: 0.8,
              ease: "power2.inOut",
              onComplete: () => element.remove(),
            },
            "-=1"
          );
      }, delay * 1000);
    }

    // Add some geometric patterns floating across screen
    for (let i = 0; i < 6; i++) {
      const pattern = document.createElement("div");
      pattern.className = "absolute pointer-events-none";

      // Create different pattern types
      const patternType = i % 3;
      if (patternType === 0) {
        // Dotted line
        pattern.style.width = "200px";
        pattern.style.height = "4px";
        pattern.style.background =
          "radial-gradient(circle, #ff6b6b 2px, transparent 2px)";
        pattern.style.backgroundSize = "20px 20px";
      } else if (patternType === 1) {
        // Wavy line
        pattern.style.width = "300px";
        pattern.style.height = "6px";
        pattern.style.background =
          "linear-gradient(45deg, transparent 45%, #4ecdc4 45%, #4ecdc4 55%, transparent 55%)";
        pattern.style.backgroundSize = "20px 20px";
      } else {
        // Zigzag
        pattern.style.width = "250px";
        pattern.style.height = "8px";
        pattern.style.background =
          "linear-gradient(135deg, #45b7d1 25%, transparent 25%, transparent 50%, #45b7d1 50%, #45b7d1 75%, transparent 75%)";
        pattern.style.backgroundSize = "30px 30px";
      }

      pattern.style.left = `${Math.random() * window.innerWidth}px`;
      pattern.style.top = `${Math.random() * window.innerHeight}px`;
      pattern.style.opacity = "0";
      pattern.style.willChange = "transform, opacity";
      sparklesRef.current.appendChild(pattern);

      gsap
        .timeline()
        .to(pattern, {
          opacity: 0.6,
          duration: 0.3,
          delay: i * 0.2,
        })
        .to(
          pattern,
          {
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 300,
            rotation: Math.random() * 180,
            duration: 3,
            ease: "power2.inOut",
          },
          "-=0.2"
        )
        .to(
          pattern,
          {
            opacity: 0,
            duration: 1,
            ease: "power2.in",
            onComplete: () => pattern.remove(),
          },
          "-=1"
        );
    }
  };

  const performCut = () => {
    if (isCut) return;
    setIsCut(true);

    // Create celebration particles at ribbon center
    createCelebrationParticles();

    // Create screen-wide doodles and shapes
    setTimeout(() => createScreenWideDoodles(), 300);

    // Animate cut line flash
    if (cutLineRef.current) {
      gsap.fromTo(
        cutLineRef.current,
        { strokeDashoffset: 100, opacity: 1 },
        { strokeDashoffset: 0, duration: 0.3, ease: "power3.out" }
      );
    }

    // Animate ribbon split with smoother easing
    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(onCut, 400);
      },
    });

    // Left ribbon falls away smoothly
    if (leftRibbonRef.current) {
      timeline.to(
        leftRibbonRef.current,
        {
          x: -280,
          y: 180,
          rotation: -35,
          opacity: 0,
          duration: 1.4,
          ease: "power2.inOut",
        },
        0
      );
    }

    // Right ribbon falls away smoothly
    if (rightRibbonRef.current) {
      timeline.to(
        rightRibbonRef.current,
        {
          x: 280,
          y: 180,
          rotation: 35,
          opacity: 0,
          duration: 1.4,
          ease: "power2.inOut",
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
