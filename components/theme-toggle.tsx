"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { BrutalistButton } from "./ui/brutalist-button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <BrutalistButton
      variant="icon"
      className="w-10 h-10 p-0 text-[var(--text-primary)] hover:text-[#e8b430]"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <div className="relative flex items-center justify-center w-full h-full">
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
    </BrutalistButton>
  );
}
