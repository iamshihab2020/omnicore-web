"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check for expired session on component mount
  useEffect(() => {
    // Check if we have a URL parameter indicating session expiration
    const sessionExpired = searchParams.get("sessionExpired");
    if (sessionExpired === "true") {
      setError("Your session has expired. Please log in again.");
    }
  }, [searchParams]);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      router.push("/dashboard"); // Redirect to dashboard after login
    } catch (error: unknown) {
      // Provide more specific error messages based on the error
      const errorObj = error as { message?: string };
      const errorMessage = errorObj?.message || "Unknown error";
      
      if (errorMessage.includes("token") || errorMessage.includes("authentication")) {
        setError("Authentication error. Please log in again.");
      } else {
        setError("Failed to log in. Please check your credentials.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Log In</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {" "}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>{" "}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-center text-sm">
        <div>
          <Link href="/reset-password" className="text-primary hover:underline">
            Forgot Password?
          </Link>
        </div>
        <div>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign Up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
