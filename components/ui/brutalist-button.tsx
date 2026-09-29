import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrutalistButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  variant?: "primary" | "secondary" | "icon" | "white";
}

export const BrutalistButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  BrutalistButtonProps
>(
  (
    {
      href,
      children,
      className,
      containerClassName,
      variant = "primary",
      ...props
    },
    ref,
  ) => {
    const isIcon = variant === "icon";

    // Outer Wrapper: Added 'active:' states for a physical "crunch" when clicked
    const wrapperClasses = cn(
      "group relative inline-block rounded-none shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-all duration-150 overflow-hidden focus:outline-none border-2 border-[var(--border)]",
      "active:translate-x-[6px] active:translate-y-[6px] active:shadow-none",
      containerClassName,
    );

    // Inner flex container (Controls the slide speed)
    const innerClasses = cn(
      "flex items-center justify-center font-black tracking-widest uppercase rounded-none transition-transform duration-300 ease-in-out",
      isIcon ? "w-14 h-14 p-0" : "px-6 py-3 gap-2 w-full h-full",
      className,
    );

    const primaryBg = variant === "white" ? "bg-[var(--surface)]" : "bg-[#e8b430]";
    const primaryText = variant === "white" ? "text-[var(--text-primary)]" : "text-black";
    const hoverBg = "bg-[var(--text-primary)]";
    const hoverText = "text-[var(--background)]";

    const content = (
      <>
        {/* Base Layer (Yellow) - Shrinks slightly on hover */}
        <div
          className={cn(
            innerClasses,
            primaryBg,
            primaryText,
            "relative z-10 transition-transform duration-300 ease-out group-hover:scale-[0.96]",
          )}
        >
          {children}
        </div>

        {/* Sliding Layer (Black) - Slides up smoothly */}
        <div
          className={cn(
            "absolute inset-0 translate-y-[100%] group-hover:translate-y-0 z-20",
            innerClasses,
            hoverBg,
            hoverText,
          )}
        >
          {children}
        </div>
      </>
    );

    if (href) {
      return (
        <Link href={href} className={wrapperClasses} ref={ref as any}>
          {content}
        </Link>
      );
    }

    return (
      <button className={wrapperClasses} ref={ref as any} {...props}>
        {content}
      </button>
    );
  },
);

BrutalistButton.displayName = "BrutalistButton";
