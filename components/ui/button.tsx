import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-[var(--shadow-subtle)]": variant === "primary",
            "bg-[var(--surface-elevated)] text-[var(--foreground)] hover:bg-[var(--border-color)]": variant === "secondary",
            "border border-[var(--border-color)] bg-transparent hover:bg-[var(--surface-elevated)]": variant === "outline",
            "hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]": variant === "ghost",
            "text-[var(--accent)] underline-offset-4 hover:underline": variant === "link",
            "h-9 px-4 py-2": size === "sm",
            "h-11 px-6 py-2": size === "md",
            "h-14 px-8 py-3 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
