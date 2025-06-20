"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { cn } from "@/lib/utils";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserAvatar } from "@/components/auth/user-avatar";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Product",
    href: "/product",
    description: "Explore our SaaS platform features and capabilities.",
  },
  {
    title: "Pricing",
    href: "/pricing",
    description: "Flexible pricing plans for businesses of all sizes.",
  },
  {
    title: "Resources",
    href: "/resources",
    description:
      "Guides, tutorials, and documentation to help you get started.",
  },
];

export function Navbar() {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-xl shadow-sm">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center space-x-2 relative group"
            >
              <div className="flex items-center">
                <Image
                  src="/omnicore-icon.svg"
                  alt="OmniCore Icon"
                  width={32}
                  height={32}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <div className="ml-2 flex flex-col">
                  <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    OmniCore
                  </span>
                  <span className="text-[10px] text-muted-foreground -mt-1">
                    Restaurant Management
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="space-x-1">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    Solutions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/about"
                      className={
                        navigationMenuTriggerStyle() + " text-sm font-medium"
                      }
                    >
                      About Us
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/contact"
                      className={
                        navigationMenuTriggerStyle() + " text-sm font-medium"
                      }
                    >
                      Contact
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>{" "}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Settings
                  </Link>
                </div>
              ) : (
                <Link
                  href="/pricing"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              )}
              <div className="h-4 w-px bg-border mx-1"></div>
              <ThemeToggle />
            </div>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="default"
                  size="sm"
                  className="hidden sm:inline-flex bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90"
                  asChild
                >
                  <Link href="/dashboard">
                    <span className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M9 9h.01" />
                        <path d="M9 15h.01" />
                        <path d="M15 9h.01" />
                        <path d="M15 15h.01" />
                      </svg>
                      Dashboard
                    </span>
                  </Link>
                </Button>
                <UserAvatar />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex border-primary/20 text-primary hover:text-primary hover:bg-primary/10"
                  asChild
                >
                  <Link href="/login">
                    <span className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                      Login
                    </span>
                  </Link>
                </Button>
                <Button
                  className="hidden sm:inline-flex bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                  size="sm"
                  asChild
                >
                  <Link href="/signup">
                    <span className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" y1="8" x2="19" y2="14" />
                        <line x1="22" y1="11" x2="16" y2="11" />
                      </svg>
                      Sign up
                    </span>
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 px-4 border-t">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-base font-medium py-2 px-3 rounded-md hover:bg-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/product"
                className="text-base font-medium py-2 px-3 rounded-md hover:bg-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Product
              </Link>
              <Link
                href="/pricing"
                className="text-base font-medium py-2 px-3 rounded-md hover:bg-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="text-base font-medium py-2 px-3 rounded-md hover:bg-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-base font-medium py-2 px-3 rounded-md hover:bg-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-2 flex items-center">
                <ThemeToggle />
                <span className="ml-3 text-sm text-muted-foreground">
                  Toggle theme
                </span>
              </div>
            </nav>
            <div className="mt-4 pt-4 border-t flex flex-col space-y-3">
              {currentUser ? (
                <Button
                  variant="default"
                  className="w-full bg-gradient-to-r from-primary/90 to-primary"
                  asChild
                >
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full border-primary/20 text-primary hover:text-primary hover:bg-primary/10"
                    asChild
                  >
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-primary/90 to-primary"
                    asChild
                  >
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & {
    title: string;
  }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground border border-transparent hover:border-border/50",
            className
          )}
          {...props}
        >
          <div className="flex items-center">
            <span className="text-sm font-medium leading-none text-primary">
              {title}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 ml-1 text-primary/70"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
