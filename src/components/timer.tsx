import { useState, useEffect } from "react";
import { useLaunch } from "@/context/LaunchContext";

interface CountdownTimerProps {
  onComplete?: () => void;
}

export default function CountdownTimer({ onComplete }: CountdownTimerProps) {
  const { isCut } = useLaunch();
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
      <h1 className="text-3xl md:text-5xl font-bold text-stone-900 mb-8 tracking-wide">
        Launching in...
      </h1>

      <div
        className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold text-stone-900 font-mono leading-none"
        style={{
          textShadow:
            "0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(255,215,0,0.3)",
        }}
      >
        {timeLeft}
      </div>

  
    </div>
  );
}
