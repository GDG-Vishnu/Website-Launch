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
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-4 z-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated circles */}
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 border border-yellow-500/20 rounded-full animate-ping"
          style={{ animationDuration: "3s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-yellow-500/10 rounded-full animate-ping"
          style={{ animationDuration: "4s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/5 rounded-full animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 relative">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse"
            style={{
              background:
                "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #B8860B 100%)",
              boxShadow:
                "0 0 40px rgba(255, 215, 0, 0.4), 0 0 80px rgba(255, 215, 0, 0.2)",
            }}
          >
            <div
              className="w-20 h-20 rounded-full bg-black flex items-center justify-center"
              style={{ border: "3px solid #B8860B" }}
            >
              <img
                src="https://res.cloudinary.com/dlupkibvq/image/upload/v1766897167/kshzwc2xey0wu6ce5aci.png"
                alt="GDG Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
          {/* Rotating ring */}
          <div
            className="absolute inset-0 w-24 h-24 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: "#FFD700",
              animationDuration: "1.5s",
            }}
          />
        </div>

        {/* Opening text */}
        <div className="text-center mb-8">
          <p className="text-white/60 text-lg mb-2">Opening</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #FFD700, #FFA500, #FFD700)",
                backgroundSize: "200% 100%",
                animation: "shimmer 2s linear infinite",
              }}
            >
              www.gdgvitb.in
            </span>
           
          </h1>
          <p className="text-white/40 text-sm tracking-widest uppercase">
            Please wait{dots}
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-72 md:w-96 mb-6">
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 215, 0, 0.2)",
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #FFD700, #FFA500, #B8860B)",
                boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
              }}
            />
          </div>
        </div>

        {/* Animated loading dots */}
        <div className="flex gap-2 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-yellow-500"
              style={{
                animation: "bounce 1s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
                opacity: 0.3 + i * 0.15,
              }}
            />
          ))}
        </div>

        {/* Status text */}
        <div className="flex items-center gap-3 text-white/50 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Connecting to GDG VITB servers</span>
        </div>
      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-8 text-center">
        <p className="text-white/20 text-xs tracking-wider">
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
