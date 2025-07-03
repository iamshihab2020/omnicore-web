"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize, Home } from "lucide-react";
import Link from "next/link";

// This file contains utility buttons for the application header/toolbar

// Add Safari fullscreen types
interface DocumentWithFullscreen extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
}

interface HTMLElementWithFullscreen extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
}

// Home button component
export function HomeButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-full"
      title="Go to Home"
      asChild
    >
      <Link href="/dashboard">
        <Home className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Home</span>
      </Link>
    </Button>
  );
}

export function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check initial fullscreen state
  useEffect(() => {
    const doc = document as DocumentWithFullscreen;

    const updateFullscreenState = () => {
      setIsFullscreen(
        doc.fullscreenElement !== null ||
          (doc.webkitFullscreenElement !== null &&
            doc.webkitFullscreenElement !== undefined)
      );
    };

    // Set initial state
    updateFullscreenState();

    // Add event listeners for fullscreen changes
    doc.addEventListener("fullscreenchange", updateFullscreenState);
    doc.addEventListener("webkitfullscreenchange", updateFullscreenState);

    return () => {
      // Cleanup event listeners
      doc.removeEventListener("fullscreenchange", updateFullscreenState);
      doc.removeEventListener("webkitfullscreenchange", updateFullscreenState);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      const doc = document as DocumentWithFullscreen;
      const docEl = document.documentElement as HTMLElementWithFullscreen;

      if (!isFullscreen) {
        // Enter fullscreen
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        }
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-full"
      onClick={toggleFullscreen}
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <Minimize className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Maximize className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">
        {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      </span>
    </Button>
  );
}
