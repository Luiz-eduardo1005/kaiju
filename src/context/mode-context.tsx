"use client";

import { createContext, useContext, useMemo, useState } from "react";

type Mode = "player" | "master";

type ModeContextValue = {
  mode: Mode;
  isMaster: boolean;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("player");

  const value = useMemo(
    () => ({
      mode,
      isMaster: mode === "master",
      setMode,
      toggleMode: () => setMode((current) => (current === "player" ? "master" : "player")),
    }),
    [mode],
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode must be used inside ModeProvider");
  }
  return context;
}
