import { useState, useEffect } from 'react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    }
    //@ts-ignore
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(10);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTimeLeft(10);
    setIsActive(false);
  };

  const progress = ((10 - timeLeft) / 10) * 100;

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
            {timeLeft === 0 && (
              <div className="mt-4 text-2xl font-bold text-black">
                Time's Up!
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={toggleTimer}
              className="px-8 py-3 font-bold text-lg rounded-lg bg-black text-white hover:bg-gray-800"
            >
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetTimer}
              className="px-8 py-3 font-bold text-lg rounded-lg bg-white text-black border-4 border-black hover:bg-gray-100"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}