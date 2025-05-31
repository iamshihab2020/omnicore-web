"use client";

import { LoginForm } from "@/components/auth/login-form";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}
