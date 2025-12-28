"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import RibbonCutting from "@/components/RibbonCutting";
import CountdownTimer from "./timer";
import LoadingPage from "./loading_page";
import { LaunchProvider, useLaunch } from "@/context/LaunchContext";

function LaunchPageContent() {
  const { setIsCut } = useLaunch();
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
    <main className="relative min-h-screen overflow-hidden">
      {/* Loading Page (shown after timer completes) */}
      {showLoading && <LoadingPage />}

      {/* Main Website Content (revealed after cut) */}
      <div
        ref={mainContentRef}
        className={`min-h-screen ${showContent && !showLoading ? "block" : "hidden"}`}
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
        className={`fixed inset-0 z-50 ${
          isRevealed && !showContent ? "pointer-events-none" : ""
        } ${showContent ? "hidden" : ""}`}
      >
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          {/* Title */}
          <div ref={titleRef} className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
              <span className="bg-stone-900 bg-clip-text text-transparent">
                <span className="text-stone-900 bg-white p-2 border-2 border-stone-900">
                  {" "}
                  GDG{" "}
                </span>{" "}
                <span className="text-white bg-stone-900 p-2">Launch</span>
              </span>
            </h1>
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

// Wrap with LaunchProvider
export default function LaunchPage() {
  return (
    <LaunchProvider>
      <LaunchPageContent />
    </LaunchProvider>
  );
}
