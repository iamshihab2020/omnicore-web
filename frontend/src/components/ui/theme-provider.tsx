"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Define ThemeProviderProps directly based on the next-themes library
type Attribute = "class" | "data-theme" | "data-mode";

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: Attribute | Attribute[];
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
  forcedTheme?: string;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // Ensure theme component has mounted before rendering children to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder with the same structure but hidden to avoid layout shift
    return <div className="invisible">{children}</div>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
