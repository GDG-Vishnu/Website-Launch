"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CinematicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create floating particles
    if (particlesRef.current) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.className = "absolute rounded-full pointer-events-none";

        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = `rgba(255, 215, 0, ${
          Math.random() * 0.5 + 0.1
        })`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.boxShadow = `0 0 ${size * 2}px rgba(255, 215, 0, 0.3)`;

        particlesRef.current.appendChild(particle);

        // Animate particle
        gsap.to(particle, {
          y: `${(Math.random() - 0.5) * 200}`,
          x: `${(Math.random() - 0.5) * 100}`,
          opacity: Math.random() * 0.8,
          duration: Math.random() * 10 + 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 5,
        });
      }
    }

    // Spotlight animation
    const spotlight = containerRef.current?.querySelector(".spotlight");
    if (spotlight) {
      gsap.to(spotlight, {
        backgroundPosition: "200% 200%",
        duration: 15,
        repeat: -1,
        ease: "none",
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/30 via-transparent to-blue-950/30 animate-gradient" />

      {/* Radial spotlight effect */}
      <div
        className="spotlight absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(120, 0, 255, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255, 0, 120, 0.1) 0%, transparent 50%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Cinematic bars */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating particles container */}
      <div ref={particlesRef} className="absolute inset-0" />

      {/* Stage curtain edges */}
      <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-black/80 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-black/80 to-transparent pointer-events-none" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Animated light rays */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-full opacity-10"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgba(255,215,0,0.1) 30deg, transparent 60deg, transparent 120deg, rgba(255,215,0,0.1) 150deg, transparent 180deg)",
            animation: "rotate 30s linear infinite",
          }}
        />
      </div>
    </div>
  );
}
