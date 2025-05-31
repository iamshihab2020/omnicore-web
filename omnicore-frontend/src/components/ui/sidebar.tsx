"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  hideTitle?: boolean;
}

export function Sidebar({
  className,
  hideTitle = false,
  ...props
}: SidebarProps) {
  return (
    <div className={cn("pb-12", className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          {!hideTitle && (
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Navigation
            </h2>
          )}
          <div className="space-y-1">{props.children}</div>
        </div>
      </div>
    </div>
  );
}

interface SidebarItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  text: string;
  isActive?: boolean;
}

export function SidebarItem({
  className,
  href,
  icon: Icon,
  text,
  isActive = false,
  ...props
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          variant: isActive ? "secondary" : "ghost",
          size: "sm",
        }),
        isActive && "bg-accent text-accent-foreground",
        "w-full justify-start",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {text}
    </Link>
  );
}

export function SidebarSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-4 py-2", className)}>
      <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
        {title}
      </h2>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
