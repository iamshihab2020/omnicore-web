"use client";

import React from "react";
import { motion, MotionProps, TargetAndTransition } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimationVariant =
  | "fadeIn"
  | "slideUp"
  | "slideLeft"
  | "slideRight"
  | "scale"
  | "pop";
type HoverEffectType = "lift" | "grow" | "rotate" | "glow" | "none";

type AnimatedCardProps = {
  children: React.ReactNode;
  index?: number;
  className?: string;
  delay?: number;
  customAnimation?: MotionProps;
  variant?: AnimationVariant;
  staggerChildren?: boolean;
  duration?: number;
  hoverEffect?: HoverEffectType;
};

// Predefined animation variants
const variants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
  pop: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: [0.8, 1.03, 1] },
  },
};

// Hover effects - using proper TargetAndTransition type
const hoverEffects: Record<HoverEffectType, TargetAndTransition | undefined> = {
  lift: { y: -5, transition: { duration: 0.2 } },
  grow: { scale: 1.03, transition: { duration: 0.2 } },
  rotate: { rotate: 1, transition: { duration: 0.2 } },
  glow: {
    boxShadow: "0 0 8px rgba(var(--color-primary), 0.5)",
    transition: { duration: 0.2 },
  },
  none: undefined,
};

/**
 * AnimatedCard - A reusable component that wraps content in a motion div with standardized animations
 * @param children - The content to be wrapped
 * @param index - Optional index for staggered animations
 * @param className - Optional className for the wrapper
 * @param delay - Optional base delay before animation starts
 * @param customAnimation - Optional custom animation properties to override defaults
 * @param variant - Animation variant to use (fadeIn, slideUp, slideLeft, etc.)
 * @param staggerChildren - Whether to stagger children animations
 * @param duration - Animation duration in seconds
 * @param hoverEffect - Hover effect to apply (lift, grow, rotate, glow, none)
 */
export function AnimatedCard({
  children,
  index = 0,
  className,
  delay = 0,
  customAnimation,
  variant = "slideUp",
  staggerChildren = false,
  duration = 0.3,
  hoverEffect = "none",
}: AnimatedCardProps) {
  // Get the selected animation variant or default to slideUp
  const selectedVariant = variants[variant] || variants.slideUp;
  const hoverAnimation = hoverEffects[hoverEffect];

  // Build animation props
  const animationProps = customAnimation || {
    ...selectedVariant,
    transition: {
      duration,
      delay: delay + index * 0.1,
      staggerChildren: staggerChildren ? 0.1 : 0,
    },
    ...(hoverAnimation ? { whileHover: hoverAnimation } : {}),
  };

  return (
    <motion.div className={cn("w-full", className)} {...animationProps}>
      {children}
    </motion.div>
  );
}
