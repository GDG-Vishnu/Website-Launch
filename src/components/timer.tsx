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

  const progress = ((35 - timeLeft) / 35) * 100;

  return (
    <div className="h-[500px] bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8 border-4 border-black">
          <h1 className="text-4xl font-bold text-center text-black mb-8">
            Launching in ....
          </h1>

          <div className="relative mb-8">
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-black">
              <div
                className="h-full bg-black transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="text-8xl font-bold text-black font-mono">
              {timeLeft}
            </div>
            
            
          </div>
        </div>
      </div>
    </div>
  );
}
