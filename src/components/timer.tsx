import { useState, useEffect, useRef } from "react";
import { useLaunch } from "@/context/LaunchContext";

interface CountdownTimerProps {
  onComplete?: () => void;
}

export default function CountdownTimer({ onComplete }: CountdownTimerProps) {
  const { isCut } = useLaunch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);

  // Start video when ribbon is cut
  useEffect(() => {
    if (isCut && videoRef.current) {
      const startDelay = setTimeout(() => {
        videoRef.current?.play();
      }, 500);
      return () => clearTimeout(startDelay);
    }
  }, [isCut]);

  // Handle video end
  const handleVideoEnd = () => {
    setVideoEnded(true);
    if (onComplete) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-transparent flex flex-col items-center justify-center">
      {/* Video Timer */}
      <video
        ref={videoRef}
        src="/timer.mp4"
        className="w-full h-auto"
        muted
        playsInline
        onEnded={handleVideoEnd}
      />
    </div>
  );

  /* COMMENTED OUT - Original Timer Implementation
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);

  // Start timer only when ribbon is cut (isCut becomes true)
  useEffect(() => {
    if (isCut) {
      // Small delay for page transition
      const startDelay = setTimeout(() => {
        setIsActive(true);
      }, 500);

      return () => clearTimeout(startDelay);
    }
  }, [isCut]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    }

    // Trigger callback when timer reaches 0
    if (timeLeft === 0 && onComplete) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 1000); // Small delay to show "Launched!" message
      return () => clearTimeout(timeout);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onComplete]);

  const progress = ((10 - timeLeft) / 10) * 100;

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4">
      {/* Animated background elements *}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-10 left-10 w-32 h-32 border-2 border-black/10 rounded-full"
          style={{ animation: "float 4s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-20 right-20 w-24 h-24 border-2 border-black/10 rounded-full"
          style={{ animation: "float 5s ease-in-out infinite 1s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-16 h-16 border-2 border-black/10 rounded-full"
          style={{ animation: "float 3s ease-in-out infinite 0.5s" }}
        />
      </div>

      <h1
        className="text-3xl md:text-5xl font-bold text-black mb-8 tracking-wide relative z-10"
        style={{ animation: "fadeInUp 0.8s ease-out" }}
      >
        Launching in...
      </h1>

      <div
        className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold text-black font-mono leading-none relative z-10"
        style={{
          animation: "scaleIn 0.6s ease-out",
          textShadow: "4px 4px 0px rgba(0,0,0,0.1)",
        }}
      >
        {timeLeft}
      </div>

      {/* Progress bar *}
      <div
        className="w-64 md:w-96 h-2 bg-black/10 rounded-full mt-8 overflow-hidden relative z-10"
        style={{ animation: "fadeInUp 0.8s ease-out 0.3s backwards" }}
      >
        <div
          className="h-full bg-black transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Pulse effect around timer *}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-black/5 rounded-full pointer-events-none"
        style={{ animation: "pulse 2s ease-in-out infinite" }}
      />
    </div>
  );
  END COMMENTED OUT */
}
