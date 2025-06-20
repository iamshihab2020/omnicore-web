"use client";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <ResetPasswordForm />
    </div>
  );
}
