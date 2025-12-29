"use client";

import { useEffect, useState } from "react";

export default function LoadingPage() {
  const [dots, setDots] = useState("");
  const [progress, setProgress] = useState(0);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Progress bar animation and redirect
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Redirect to gdgvitb.in when progress reaches 100%
          window.location.href = "https://gdgvitb.in";
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-white flex flex-col items-center justify-center p-4 z-[100]"
      style={{ minHeight: "100vh", minWidth: "100vw" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
      
      />

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated circles */}
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 border border-black/10 rounded-full"
          style={{ animation: "float 4s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-black/5 rounded-full"
          style={{ animation: "float 5s ease-in-out infinite 1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-black/5 rounded-full animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div
          className="mb-8 relative"
          style={{ animation: "scaleIn 0.6s ease-out" }}
        >
          <div className="w-24 h-24 rounded-full flex items-center justify-center bg-black   shadow-lg">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-2 border-black/20">
              <img
                src="https://res.cloudinary.com/dlupkibvq/image/upload/v1766898618/kqcrwx56wwwgcr1djtil.jpg"
                alt="GDG Logo"
                className="w-20 h-20 object-contain rounded-full"
              />
            </div>
          </div>
          {/* Rotating ring */}
          <div
            className="absolute inset-0 w-24 h-24 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: "#000000",
              borderRightColor: "#000000",
              animationDuration: "1.5s",
            }}
          />
        </div>

        {/* Opening text */}
        <div
          className="text-center mb-8"
          style={{ animation: "fadeInUp 0.8s ease-out 0.2s backwards" }}
        >
          <p className="text-black/60 text-lg mb-2 font-medium">Opening</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-black">
            www.gdgvitb.in
          </h1>
          <p className="text-black/40 text-sm tracking-widest uppercase font-medium">
            Please wait{dots}
          </p>
        </div>

        {/* Loading bar */}
        <div
          className="w-72 md:w-96 mb-6"
          style={{ animation: "fadeInUp 0.8s ease-out 0.4s backwards" }}
        >
          <div className="h-2 rounded-full overflow-hidden bg-black/10 border border-black/20">
            <div
              className="h-full rounded-full transition-all duration-100 bg-black shadow-sm"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Animated loading dots */}
        <div
          className="flex gap-2 mb-8"
          style={{ animation: "fadeInUp 0.8s ease-out 0.6s backwards" }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-black"
              style={{
                animation: "float 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
                opacity: 0.3 + i * 0.15,
              }}
            />
          ))}
        </div>

        {/* Status text */}
        <div
          className="flex items-center gap-3 text-black/50 text-sm"
          style={{ animation: "fadeInUp 0.8s ease-out 0.8s backwards" }}
        >
          <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
          <span>Connecting to GDG VITB servers</span>
        </div>
      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-8 text-center">
        <p className="text-black/20 text-xs tracking-wider">
          © 2025 GDG VITB • Google Developer Groups
        </p>
      </div>

      {/* Inline keyframes for shimmer and bounce */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
