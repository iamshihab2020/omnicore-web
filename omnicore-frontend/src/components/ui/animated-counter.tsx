"use client";

import { HTMLAttributes } from "react";
import CountUp from "react-countup";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps extends HTMLAttributes<HTMLSpanElement> {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  separator?: string;
  decimals?: number;
  enableScrollSpy?: boolean;
  scrollSpyDelay?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.5,
  separator = ",",
  decimals = 0,
  enableScrollSpy = true,
  scrollSpyDelay = 200,
  className,
  ...props
}: AnimatedCounterProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-center text-4xl mt-4 font-semibold",
        className
      )}
      {...props}
    >
      {prefix && <span>{prefix}</span>}
      <CountUp
        end={value}
        duration={duration}
        separator={separator}
        decimals={decimals}
        enableScrollSpy={enableScrollSpy}
        scrollSpyDelay={scrollSpyDelay}
      />
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
