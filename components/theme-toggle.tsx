"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { BrutalistButton } from "./ui/brutalist-button";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted
    ? resolvedTheme === "dark" || theme === "dark"
    : false;

  const handleToggle = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", next);
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  return (
    <BrutalistButton
      variant="icon"
      className="w-10 h-10 p-0 text-[var(--on-accent)] focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2 transition-transform duration-150"
      containerClassName="w-10 h-10"
      onClick={handleToggle}
      aria-label="Switch theme"
      aria-pressed={isDark}
    >
      <div className="relative flex items-center justify-center w-full h-full">
        <Sun
          className={`h-5 w-5 transition-transform duration-150 ${
            mounted && isDark ? "hidden" : "block rotate-0 scale-100"
          }`}
        />
        <Moon
          className={`h-5 w-5 transition-transform duration-150 ${
            mounted && isDark ? "block rotate-0 scale-100" : "hidden"
          }`}
        />
      </div>
    </BrutalistButton>
  );
}
