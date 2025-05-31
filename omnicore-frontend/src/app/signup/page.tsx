"use client";

import { SignupForm } from "@/components/auth/signup-form";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <SignupForm />
    </div>
  );
}
