"use client";

import { useEffect, useState } from "react";

interface LoadingPageProps {
  onComplete?: () => void;
}

export default function LoadingPage({ onComplete }: LoadingPageProps) {
  const [dots, setDots] = useState("");
  const [progress, setProgress] = useState(0);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Progress bar animation and callback/redirect
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) {
            onComplete();
          } else {
            // Redirect to Vishnu Quantum Club website
            window.location.href = "https://vishnu-quantum-club.vercel.app/";
          }
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center p-4 z-[100]"
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: "linear-gradient(135deg, #E2E7F8 0%, #DDE2F5 50%, #F4F6FF 100%)",
      }}
    >
      {/* Background decorative elements - Quantum themed */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 border-2 rounded-full"
          style={{
            animation: "quantum-float 5s ease-in-out infinite",
            borderColor: "rgba(124, 36, 204, 0.12)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 border-2 rounded-full"
          style={{
            animation: "quantum-float 6s ease-in-out infinite 1s",
            borderColor: "rgba(43, 104, 232, 0.12)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 border-2 rounded-full animate-pulse"
          style={{ borderColor: "rgba(240, 130, 178, 0.1)" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Quantum Core Loader (Replaces logo with futuristic quantum orbital loader) */}
        <div className="mb-8 relative flex items-center justify-center">
          {/* Ambient Glow */}
          <div className="absolute w-28 h-28 rounded-full bg-purple-500/20 blur-xl animate-pulse" />

          {/* Quantum Orbit Animation */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            {/* Outer rotating ring */}
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
              style={{
                borderTopColor: "#7C24CC",
                borderRightColor: "#2B68E8",
                animationDuration: "2s",
              }}
            />

            {/* Middle counter-rotating ring */}
            <div
              className="absolute inset-2 rounded-full border-2 border-transparent animate-spin"
              style={{
                borderBottomColor: "#ED4998",
                borderLeftColor: "#9C32E2",
                animationDuration: "2.8s",
                animationDirection: "reverse",
              }}
            />

            {/* Inner quantum core circle */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-purple-300/40"
              style={{
                background: "linear-gradient(135deg, #7C24CC, #ED4998)",
              }}
            >
              <div className="w-4 h-4 rounded-full bg-white/90 shadow-[0_0_8px_#FFFFFF] animate-ping" />
            </div>
          </div>
        </div>

        {/* Opening text */}
        <div className="text-center mb-8">
          <p className="text-base sm:text-lg mb-2 font-semibold tracking-wide" style={{ color: "#7C24CC" }}>
            Entering
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight"
            style={{ color: "#2A1254" }}
          >
            Vishnu Quantum Club
          </h1>
          <p className="text-xs sm:text-sm tracking-widest uppercase font-semibold" style={{ color: "#9C32E2" }}>
            Please wait{dots}
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-64 sm:w-72 md:w-96 mb-6">
          <div
            className="h-2.5 rounded-full overflow-hidden border p-0.5"
            style={{
              background: "rgba(124, 36, 204, 0.08)",
              borderColor: "rgba(124, 36, 204, 0.25)",
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-100 shadow-sm"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #7C24CC, #ED4998, #2B68E8)",
              }}
            />
          </div>
        </div>

        {/* Animated loading dots */}
        <div className="flex gap-2 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? "#7C24CC" : "#2B68E8",
                animation: "quantum-float 1.6s ease-in-out infinite",
                animationDelay: `${i * 0.16}s`,
                opacity: 0.35 + i * 0.15,
              }}
            />
          ))}
        </div>

        {/* Status text */}
        <div
          className="flex items-center gap-2.5 text-xs sm:text-sm font-medium"
          style={{
            color: "rgba(124, 36, 204, 0.7)",
          }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#7C24CC" }} />
          <span>Connecting to Vishnu Quantum Club network</span>
        </div>
      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-6 text-center px-4">
        <p className="text-xs tracking-wider font-medium" style={{ color: "rgba(124, 36, 204, 0.45)" }}>
          © 2026 Vishnu Quantum Club • Quantum Computing Initiative
        </p>
      </div>
    </div>
  );
}
