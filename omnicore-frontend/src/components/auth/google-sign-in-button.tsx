"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface GoogleSignInButtonProps {
  className?: string;
  onError?: (errorMessage: string) => void;
}

export function GoogleSignInButton({
  className = "",
  onError,
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const router = useRouter();

  async function handleGoogleSignIn() {
    try {
      setLoading(true);
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to sign in with Google", error);

      let errorMessage = "Failed to sign in with Google. Please try again.";

      if (error instanceof Error) {
        // Handle specific Firebase auth error codes
        const errorCode =
          error.message && error.message.includes(":")
            ? error.message.split(":")[0].trim()
            : "";
        if (errorCode === "auth/account-exists-with-different-credential") {
          errorMessage =
            "An account already exists with the same email address but different sign-in credentials. Try signing in using a different method.";
        } else if (errorCode === "auth/popup-blocked") {
          errorMessage =
            "Sign-in popup was blocked by your browser. Please enable popups for this site.";
        } else if (errorCode === "auth/popup-closed-by-user") {
          errorMessage =
            "Sign-in was canceled because the popup was closed before authentication was completed.";
        } else if (errorCode === "auth/cancelled-popup-request") {
          errorMessage =
            "The sign-in operation was canceled because another sign-in attempt is in progress.";
        } else if (errorCode === "auth/network-request-failed") {
          errorMessage =
            "A network error occurred. Please check your internet connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className={`flex w-full items-center justify-center gap-3 rounded-md bg-background border px-4 py-2 text-sm font-medium shadow-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
    >
      {loading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
      )}
      {loading ? "Signing in..." : "Continue with Google"}
    </button>
  );
}
