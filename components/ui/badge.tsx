import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "error";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2",
        {
          "bg-[var(--accent)] text-white": variant === "default",
          "bg-[var(--surface-elevated)] text-[var(--foreground)]": variant === "secondary",
          "text-[var(--foreground)] border border-[var(--border-color)]": variant === "outline",
          "bg-[var(--success)]/10 text-[var(--success)]": variant === "success",
          "bg-[var(--warning)]/10 text-[var(--warning)]": variant === "warning",
          "bg-[var(--error)]/10 text-[var(--error)]": variant === "error",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
