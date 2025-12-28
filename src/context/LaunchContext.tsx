"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LaunchContextType {
  isCut: boolean;
  setIsCut: (value: boolean) => void;
  isTimerComplete: boolean;
  setIsTimerComplete: (value: boolean) => void;
}

const LaunchContext = createContext<LaunchContextType | undefined>(undefined);

export function LaunchProvider({ children }: { children: ReactNode }) {
  const [isCut, setIsCut] = useState(false);
  const [isTimerComplete, setIsTimerComplete] = useState(false);

  return (
    <LaunchContext.Provider
      value={{
        isCut,
        setIsCut,
        isTimerComplete,
        setIsTimerComplete,
      }}
    >
      {children}
    </LaunchContext.Provider>
  );
}

export function useLaunch() {
  const context = useContext(LaunchContext);
  if (context === undefined) {
    throw new Error("useLaunch must be used within a LaunchProvider");
  }
  return context;
}
