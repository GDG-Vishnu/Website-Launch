"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import RibbonCutting from "@/components/RibbonCutting";
import CinematicBackground from "@/components/CinematicBackground";

export default function LaunchPage() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance animation for title
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
      );
    }
  }, []);

  const handleRibbonCut = () => {
    setIsRevealed(true);

    // Dramatic reveal animation
    const timeline = gsap.timeline();

    // Flash effect
    timeline.to(overlayRef.current, {
      backgroundColor: "rgba(255, 215, 0, 0.3)",
      duration: 0.1,
    });

    timeline.to(overlayRef.current, {
      backgroundColor: "transparent",
      duration: 0.3,
    });

    // Fade out the launch page overlay
    timeline.to(overlayRef.current, {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        setShowContent(true);
      },
    });
  };

  useEffect(() => {
    if (showContent && mainContentRef.current) {
      gsap.fromTo(
        mainContentRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [showContent]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Main Website Content (revealed after cut) */}
      <div
        ref={mainContentRef}
        className={`min-h-screen ${showContent ? "block" : "hidden"}`}
      >
        <CinematicBackground />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Success checkmark */}
            <div className="mb-8">
              <svg
                className="w-24 h-24 mx-auto text-green-500"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="animate-[draw-circle_1s_ease-out_forwards]"
                  style={{
                    strokeDasharray: 283,
                    strokeDashoffset: 283,
                    animation: "draw-circle 1s ease-out forwards",
                  }}
                />
                <path
                  d="M30 50 L45 65 L70 35"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-[draw-check_0.5s_ease-out_0.5s_forwards]"
                  style={{
                    strokeDasharray: 60,
                    strokeDashoffset: 60,
                    animation: "draw-check 0.5s ease-out 0.5s forwards",
                  }}
                />
              </svg>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Welcome!
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed">
              🎉 The ribbon has been cut! Your experience begins now.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="group px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-white font-semibold text-lg shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
                onClick={() => window.location.reload()}
              >
                <span className="flex items-center gap-2">
                  🔄 Experience Again
                </span>
              </button>

              <a
                href="#explore"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center gap-2">🚀 Explore More</span>
              </a>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              {[
                {
                  icon: "✨",
                  title: "Interactive",
                  desc: "Engaging user experience",
                },
                {
                  icon: "🎨",
                  title: "Beautiful",
                  desc: "Stunning visual design",
                },
                { icon: "⚡", title: "Fast", desc: "Optimized performance" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${
                      0.8 + index * 0.1
                    }s forwards`,
                    opacity: 0,
                  }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/60">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Launch Page Overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-50 ${
          isRevealed && !showContent ? "pointer-events-none" : ""
        } ${showContent ? "hidden" : ""}`}
      >
        <CinematicBackground />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          {/* Title */}
          <div ref={titleRef} className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
              <span className="block text-sm md:text-base font-light text-white/60 uppercase tracking-[0.3em] mb-4">
                Grand Opening
              </span>
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                GDG Launch
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mt-4 font-light">
              Cut the ribbon to unveil something amazing
            </p>
          </div>

          {/* Ribbon Container */}
          <div className="w-full max-w-4xl h-64 md:h-80 relative">
            <RibbonCutting onCut={handleRibbonCut} />
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-4 left-4 text-white/30 text-sm">
            <p>© 2025 GDG Launch</p>
          </div>

          <div className="absolute bottom-4 right-4 text-white/30 text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Ready to launch</span>
          </div>
        </div>
      </div>
    </main>
  );
}
