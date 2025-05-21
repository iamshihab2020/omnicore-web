"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

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

  return (
    <NextThemesProvider {...props}>{children}</NextThemesProvider>
  );
}
