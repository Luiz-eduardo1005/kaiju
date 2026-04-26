"use client";

import { useEffect } from "react";
import { useMode } from "@/context/mode-context";

export function ModeThemeController() {
  const { mode } = useMode();

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  return null;
}
