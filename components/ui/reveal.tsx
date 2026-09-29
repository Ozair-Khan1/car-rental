"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children?: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
  distance?: number;
}

export function Reveal({ children, delay = 0, className, direction = "up", distance = 16 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (!isMounted) return "translate(0, 0)"; // Fallback for SSR/no-js
    if (isVisible) return "translate(0, 0)";
    if (direction === "up") return `translateY(${distance}px)`;
    if (direction === "left") return `translateX(-${distance}px)`;
    if (direction === "right") return `translateX(${distance}px)`;
    return "translate(0, 0)";
  };

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: !isMounted || isVisible ? 1 : 0,
        transform: getTransform(),
        transition: "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
