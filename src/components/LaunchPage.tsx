"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import CountdownTimer from "./timer";
import LoadingPage from "./loading_page";
import RibbonCuttingPage from "./RibbonCuttingPage";
import { LaunchProvider } from "@/context/LaunchContext";

// New flow: ribbon → countdown → loading → website
type FlowStage = "ribbon" | "ribbon-to-countdown" | "countdown" | "loading";

function LaunchPageContent() {
  const [stage, setStage] = useState<FlowStage>("ribbon");
  const transitionOverlayRef = useRef<HTMLDivElement>(null);

  // ── 1. Ribbon cut → flash → Countdown ──────────────────────────
  const handleRibbonCut = () => {
    setStage("ribbon-to-countdown");

    if (transitionOverlayRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(
        transitionOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: "power2.in" }
      )
        .add(() => setStage("countdown"))
        .to(transitionOverlayRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });
    } else {
      setStage("countdown");
    }
  };

  // ── 2. Countdown ends → Loading page ───────────────────────────
  const handleCountdownComplete = () => {
    if (transitionOverlayRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(
        transitionOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.in" }
      )
        .add(() => setStage("loading"))
        .to(transitionOverlayRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
        });
    } else {
      setStage("loading");
    }
  };

  // ── 3. Loading ends → Website ───────────────────────────────────
  const handleLoadingComplete = () => {
    window.location.href = "https://vishnu-quantum-club.vercel.app/";
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#05020B]">

      {/* ── Clean Fade Transition Overlay ─────────────────────── */}
      <div
        ref={transitionOverlayRef}
        className="fixed inset-0 pointer-events-none z-[60] opacity-0 bg-[#05020B]"
      />

      {/* ── Stage 1: Ribbon Cutting Ceremony ─────────────────────── */}
      {(stage === "ribbon" || stage === "ribbon-to-countdown") && (
        <div className="fixed inset-0 z-20">
          <RibbonCuttingPage onComplete={handleRibbonCut} />
        </div>
      )}

      {/* ── Stage 2: Countdown Timer ──────────────────────────────── */}
      {stage === "countdown" && (
        <div className="fixed inset-0 z-10">
          <CountdownTimer onComplete={handleCountdownComplete} />
        </div>
      )}

      {/* ── Stage 3: Loading Page ─────────────────────────────────── */}
      {stage === "loading" && (
        <LoadingPage onComplete={handleLoadingComplete} />
      )}
    </div>
  );
}

export default function LaunchPage() {
  return (
    <LaunchProvider>
      <LaunchPageContent />
    </LaunchProvider>
  );
}
