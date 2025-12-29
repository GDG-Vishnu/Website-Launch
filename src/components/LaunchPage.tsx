"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import RibbonCutting from "@/components/RibbonCutting";
import CountdownTimer from "./timer";
import LoadingPage from "./loading_page";
import { LaunchProvider, useLaunch } from "@/context/LaunchContext";

function LaunchPageContent() {
  const { setIsCut, isCut } = useLaunch();
  const [isRevealed, setIsRevealed] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
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
    setIsCut(true); // Update global context

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

  const handleTimerComplete = () => {
    setShowLoading(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Enhanced animated background - only show before cut */}
      {!isCut && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Moving grid pattern with bigger boxes */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(99,102,241,0.08) 2px, transparent 2px),
              linear-gradient(90deg, rgba(99,102,241,0.08) 2px, transparent 2px)
            `,
              backgroundSize: "120px 120px",
              animation:
                "gridSlide 25s linear infinite, gridFade 4s ease-in-out infinite",
            }}
          />

          {/* Secondary grid pattern for more detail */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)
            `,
              backgroundSize: "60px 60px",
              animation:
                "gridSlide 20s linear infinite reverse, gridFade 3s ease-in-out infinite",
            }}
          />

          {/* Floating geometric shapes and doodles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute opacity-[0.06] animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${60 + Math.random() * 80}px`,
                  height: `${60 + Math.random() * 80}px`,
                  borderRadius:
                    i % 4 === 0
                      ? "50%"
                      : i % 4 === 1
                      ? "20%"
                      : i % 4 === 2
                      ? "0%"
                      : "8px",
                  background:
                    i % 2 === 0 ? "linear-gradient(45deg, #000, #444)" : "#222",
                  border: i % 3 === 0 ? "2px solid #333" : "none",
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>

          {/* Animated doodle elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Stars */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute text-black/10 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${20 + Math.random() * 30}px`,
                  animationDelay: `${i * 1.2}s`,
                  animationDuration: `${6 + Math.random() * 4}s`,
                }}
              >
                ★
              </div>
            ))}

            {/* Arrows */}
            {[...Array(4)].map((_, i) => (
              <div
                key={`arrow-${i}`}
                className="absolute text-black/8 animate-drift"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${24 + Math.random() * 20}px`,
                  animationDelay: `${i * 2}s`,
                  animationDuration: `${8 + Math.random() * 4}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              >
                →
              </div>
            ))}

            {/* Plus signs */}
            {[...Array(5)].map((_, i) => (
              <div
                key={`plus-${i}`}
                className="absolute text-black/12 animate-spin-slow"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${18 + Math.random() * 25}px`,
                  animationDelay: `${i * 1.8}s`,
                  animationDuration: `${10 + Math.random() * 5}s`,
                }}
              >
                +
              </div>
            ))}

            {/* Dots pattern */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`dots-${i}`}
                className="absolute opacity-[0.08] animate-bounce-slow"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#333",
                  borderRadius: "50%",
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: `${4 + Math.random() * 3}s`,
                }}
              />
            ))}

            {/* Red Popup Bubbles */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`bubble-${i}`}
                className="absolute animate-popup-scale"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${40 + Math.random() * 60}px`,
                  height: `${40 + Math.random() * 60}px`,
                  border: "2px solid rgba(220,38,38,0.3)",
                  borderRadius: "50%",
                  backgroundColor: "rgba(239,68,68,0.15)",
                  animationDelay: `${i * 2}s`,
                  animationDuration: `${6 + Math.random() * 4}s`,
                }}
              />
            ))}

            {/* Red Popping Geometric Shapes */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`pop-shape-${i}`}
                className="absolute animate-popup-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${30 + Math.random() * 40}px`,
                  height: `${30 + Math.random() * 40}px`,
                  backgroundColor:
                    i % 2 === 0
                      ? "rgba(220,38,38,0.12)"
                      : "rgba(185,28,28,0.15)",
                  borderRadius:
                    i % 3 === 0 ? "50%" : i % 3 === 1 ? "20%" : "0%",
                  border:
                    i % 2 === 0 ? "1px solid rgba(239,68,68,0.25)" : "none",
                  animationDelay: `${i * 1.5}s`,
                  animationDuration: `${4 + Math.random() * 3}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}

            {/* Red Expanding Rings */}
            {[...Array(4)].map((_, i) => (
              <div
                key={`ring-${i}`}
                className="absolute animate-popup-expand"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${80 + Math.random() * 120}px`,
                  height: `${80 + Math.random() * 120}px`,
                  border: "3px solid rgba(239,68,68,0.15)",
                  borderRadius: "50%",
                  animationDelay: `${i * 3}s`,
                  animationDuration: `${8 + Math.random() * 4}s`,
                }}
              />
            ))}

            {/* Red Pulsing Symbols */}
            {[...Array(5)].map((_, i) => (
              <div
                key={`text-${i}`}
                className="absolute animate-popup-pulse font-bold"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${16 + Math.random() * 20}px`,
                  color: "rgba(220,38,38,0.2)",
                  animationDelay: `${i * 2.5}s`,
                  animationDuration: `${5 + Math.random() * 3}s`,
                  transform: `rotate(${(Math.random() - 0.5) * 30}deg)`,
                }}
              >
                {["●", "◆", "▲", "■", "◇"][i % 5]}
              </div>
            ))}

            {/* Red Sparkle Bursts */}
            {[...Array(10)].map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute animate-popup-sparkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${12 + Math.random() * 16}px`,
                  color: "rgba(239,68,68,0.25)",
                  animationDelay: `${i * 1.8}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              >
                ✦
              </div>
            ))}
          </div>

          {/* Subtle radial gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.03) 0%, transparent 80%)",
              animation: "breathe 5s ease-in-out infinite",
            }}
          />
        </div>
      )}

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes gridSlide {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        @keyframes breathe {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.2;
          }
        }
        @keyframes gridFade {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.2;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(5deg);
          }
          66% {
            transform: translateY(-10px) rotate(-3deg);
          }
        }
        @keyframes drift {
          0% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          25% {
            transform: translate(15px, -15px) rotate(90deg);
          }
          50% {
            transform: translate(30px, 0px) rotate(180deg);
          }
          75% {
            transform: translate(15px, 15px) rotate(270deg);
          }
          100% {
            transform: translate(0px, 0px) rotate(360deg);
          }
        }
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0px);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-15px);
            opacity: 0.05;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-drift {
          animation: drift 8s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        @keyframes popup-scale {
          0%,
          100% {
            transform: scale(0.8);
            opacity: 0.1;
          }
          25% {
            transform: scale(1.2);
            opacity: 0.3;
          }
          50% {
            transform: scale(1);
            opacity: 0.8;
          }
          75% {
            transform: scale(1.1);
            opacity: 0.6;
          }
        }
        @keyframes popup-bounce {
          0%,
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.08;
          }
          50% {
            transform: translateY(-30px) scale(1.3);
            opacity: 0.2;
          }
        }
        @keyframes popup-expand {
          0% {
            transform: scale(0.2);
            opacity: 0.8;
          }
          50% {
            transform: scale(1);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        @keyframes popup-pulse {
          0%,
          100% {
            transform: scale(1) rotate(var(--rotation, 0deg));
            opacity: 0.05;
          }
          33% {
            transform: scale(1.5) rotate(calc(var(--rotation, 0deg) + 120deg));
            opacity: 0.15;
          }
          66% {
            transform: scale(0.8) rotate(calc(var(--rotation, 0deg) + 240deg));
            opacity: 0.1;
          }
        }
        @keyframes popup-sparkle {
          0%,
          100% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          25% {
            transform: scale(1.5) rotate(90deg);
            opacity: 0.6;
          }
          50% {
            transform: scale(1) rotate(180deg);
            opacity: 0.3;
          }
          75% {
            transform: scale(1.2) rotate(270deg);
            opacity: 0.4;
          }
        }
        .animate-popup-scale {
          animation: popup-scale 6s ease-in-out infinite;
        }
        .animate-popup-bounce {
          animation: popup-bounce 4s ease-in-out infinite;
        }
        .animate-popup-expand {
          animation: popup-expand 8s ease-out infinite;
        }
        .animate-popup-pulse {
          animation: popup-pulse 5s ease-in-out infinite;
        }
        .animate-popup-sparkle {
          animation: popup-sparkle 3s ease-in-out infinite;
        }
      `}</style>

      {/* Loading Page (shown after timer completes) */}
      {showLoading && <LoadingPage />}

      {/* Main Website Content (revealed after cut) */}
      <div
        ref={mainContentRef}
        className={`min-h-screen bg-white ${
          showContent && !showLoading ? "block" : "hidden"
        }`}
      >
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Success checkmark */}

            <CountdownTimer onComplete={handleTimerComplete} />
          </div>
        </div>
      </div>

      {/* Launch Page Overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-50 bg-white ${
          isRevealed && !showContent ? "pointer-events-none" : ""
        } ${showContent ? "hidden" : ""}`}
      >
        {/* Top left image */}
        {!isCut && (
          <img
            src="https://res.cloudinary.com/dlupkibvq/image/upload/v1766981050/amvovtdfzftydqa5skhf.png"
            alt="Decoration Left"
            className="absolute top-4 left-4 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain z-20"
          />
        )}

        {/* Top right image */}
        {!isCut && (
          <img
            src="https://res.cloudinary.com/dlupkibvq/image/upload/v1766921668/Gemini_Generated_Image_1uwadk1uwadk1uwa_1_uv7hrs.png"
            alt="Decoration"
            className="absolute top-4 right-4 w-16 h-16 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain z-20"
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          {/* Logo */}
          <div ref={titleRef} className="mb-8">
            <img
              src="https://res.cloudinary.com/dlupkibvq/image/upload/v1766903285/vqbqthkdildhpgbtocgp.png"
              alt="GDG Logo"
              className="w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain mx-auto"
            />
          </div>

          {/* Ribbon Container */}
          <div
            className="w-full  h-64 md:h-80 relative"
            style={{ animation: "scaleIn 0.6s ease-out 0.4s backwards" }}
          >
            <RibbonCutting onCut={handleRibbonCut} />
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-4 left-4 text-black/30 text-sm">
            <p>© 2025 GDG Launch</p>
          </div>

          <div className="absolute bottom-4 right-4 text-black/30 text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
            <span>Ready to launch</span>
          </div>
        </div>
      </div>
    </main>
  );
}

// Wrap with LaunchProvider
export default function LaunchPage() {
  return (
    <LaunchProvider>
      <LaunchPageContent />
    </LaunchProvider>
  );
}
