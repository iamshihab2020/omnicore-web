"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

interface TrendBadgeProps {
  value: number;
  suffix?: string;
  className?: string;
}

export function TrendBadge({
  value,
  suffix = "%",
  className,
}: TrendBadgeProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const isNegative = value < 0;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium shadow-sm",
        isPositive && "bg-gradient-green text-white",
        isNegative && "bg-gradient-red text-white",
        isNeutral && "bg-gradient-blue text-white",
        className
      )}
    >
      {isPositive ? (
        <ArrowUpIcon className="h-3 w-3 animate-pulse" />
      ) : isNeutral ? (
        <MinusIcon className="h-3 w-3" />
      ) : (
        <ArrowDownIcon className="h-3 w-3 animate-pulse" />
      )}
      {Math.abs(value)}
      {suffix}
    </div>
  );
}
