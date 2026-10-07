import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className = "h-11 w-auto", ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 330 92"
      className={cn("h-11 w-auto overflow-visible select-none", className)}
      aria-label="DriveNow"
      role="img"
      {...props}
    >
      <g transform="translate(2, 0)">
        {/* "DRIVE" text: follows --ink (black in light mode, cream in dark mode) */}
        <text
          x="2"
          y="72"
          fill="var(--ink)"
          fontFamily="var(--font-display), Impact, 'Arial Black', sans-serif"
          fontSize="70"
          fontWeight="400"
          letterSpacing="0.5"
          style={{ textTransform: "uppercase" }}
        >
          DRIVE
        </text>

        {/* Hard brutalist box shadow behind NOW: follows --shadow */}
        <rect
          x="176"
          y="9"
          width="147"
          height="79"
          fill="var(--shadow)"
          stroke="var(--shadow)"
          strokeWidth="4"
          strokeLinejoin="miter"
        />

        {/* Yellow NOW box: fill is --accent (#E8B42A), border follows --border */}
        <rect
          x="172"
          y="5"
          width="147"
          height="79"
          fill="var(--accent)"
          stroke="var(--border)"
          strokeWidth="4"
          strokeLinejoin="miter"
        />

        {/* "NOW" text: text on yellow surface must be --on-accent (#0A0A0A) in BOTH themes */}
        <text
          x="245.5"
          y="72"
          fill="var(--on-accent)"
          textAnchor="middle"
          fontFamily="var(--font-display), Impact, 'Arial Black', sans-serif"
          fontSize="70"
          fontWeight="400"
          letterSpacing="0.5"
          style={{ textTransform: "uppercase" }}
        >
          NOW
        </text>
      </g>
    </svg>
  );
}
