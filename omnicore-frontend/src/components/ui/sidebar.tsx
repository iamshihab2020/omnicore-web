"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <div className="space-y-4 py-2">
        <div className="px-2 py-1">
          {!hideTitle && (
            <h2 className="mb-3 px-2 text-sm font-semibold tracking-tight text-muted-foreground uppercase">
              Navigation
            </h2>
          )}
          <div className="space-y-1.5">{props.children}</div>
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
  collapsed?: boolean;
}

export function SidebarItem({
  className,
  href,
  icon: Icon,
  text,
  isActive = false,
  collapsed = false,
  ...props
}: SidebarItemProps) {
  const linkContent = (
    <>
      {Icon && (
        <Icon className={cn("h-4 w-4", text && !collapsed ? "mr-3" : "")} />
      )}
      {text && !collapsed && text}
    </>
  );

  const linkElement = (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          variant: isActive ? "secondary" : "ghost",
          size: "sm",
        }),
        isActive
          ? "bg-primary/10 text-primary font-medium shadow-sm border-l-2 border-primary rounded-none rounded-r-lg"
          : "text-muted-foreground hover:text-foreground rounded-lg",
        "w-full justify-start transition-all duration-200",
        collapsed ? "justify-center px-2" : "",
        className
      )}
      {...props}
    >
      {linkContent}
    </Link>
  );

  if (collapsed && text) {
    return (
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
        <TooltipContent
          side="right"
          className="font-medium bg-background border border-border shadow-md animate-in slide-in-from-left-3 duration-200"
        >
          {text}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkElement;
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
      <h2 className="mb-2 px-2 text-sm font-semibold tracking-tight text-muted-foreground uppercase">
        {title}
      </h2>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}
