"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCard } from "./animated-card";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  homeHref?: string;
  showHomeIcon?: boolean;
  animate?: boolean;
}

export function Breadcrumb({
  items,
  className,
  homeHref = "/",
  showHomeIcon = true,
  animate = true,
}: BreadcrumbProps) {
  const breadcrumbContent = (
    <nav
      className={cn(
        "flex items-center space-x-1 text-sm text-muted-foreground",
        className
      )}
      aria-label="Breadcrumb"
    >
      {showHomeIcon && (
        <>
          <Link
            href={homeHref}
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4 mr-1" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
        </>
      )}

      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && <ChevronRight className="h-4 w-4 flex-shrink-0" />}

          {item.href ? (
            <Link
              href={item.href}
              className="flex items-center hover:text-foreground transition-colors"
            >
              {item.icon && <span className="mr-1">{item.icon}</span>}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className="font-medium text-foreground flex items-center">
              {item.icon && <span className="mr-1">{item.icon}</span>}
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );

  return animate ? (
    <AnimatedCard variant="fadeIn" duration={0.5} className="w-auto">
      {breadcrumbContent}
    </AnimatedCard>
  ) : (
    breadcrumbContent
  );
}
