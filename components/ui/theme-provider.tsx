"use client";

import type React from "react";
import { ThemeProvider as AppThemeProvider } from "@/lib/theme-context";

type ThemeProviderProps = {
  children: React.ReactNode;
} & Record<string, unknown>;

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <AppThemeProvider>{children}</AppThemeProvider>;
}
