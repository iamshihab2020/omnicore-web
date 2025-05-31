"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AccountLinking } from "@/components/auth/account-linking";
import { AppLayout } from "@/components/app/app-layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UserSettings() {
  const { currentUser, resetPassword } = useAuth();
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;

    try {
      setLoading(true);
      await resetPassword(currentUser.email);
      setPasswordResetSent(true);
    } catch (error) {
      console.error("Error sending password reset email", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="container py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card shadow-sm rounded-lg overflow-hidden border">
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">
                  Account Settings
                </h1>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="flex flex-col items-center">
                    <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-border">
                      {currentUser?.photoURL ? (
                        <Image
                          src={currentUser.photoURL}
                          alt="Profile picture"
                          width={128}
                          height={128}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted text-4xl font-bold text-muted-foreground">
                          {currentUser?.email?.[0].toUpperCase() || "U"}
                        </div>
                      )}
                    </div>{" "}
                    <div className="mt-4 text-center">
                      <h2 className="text-lg font-medium">
                        {currentUser?.displayName ||
                          currentUser?.email?.split("@")[0] ||
                          "User"}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {currentUser?.email}
                      </p>
                      {currentUser?.providerData?.[0]?.providerId ===
                        "google.com" && (
                        <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24">
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
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
                            <path d="M1 1h22v22H1z" fill="none" />
                          </svg>
                          Google Account
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">
                        Account Information
                      </h3>
                      <div className="mt-4 border-t border-border pt-4">
                        <dl className="space-y-4 divide-y divide-border">
                          <div className="flex flex-col sm:flex-row sm:justify-between py-2">
                            <dt className="text-sm font-medium text-muted-foreground">
                              Email
                            </dt>
                            <dd className="mt-1 sm:mt-0 text-sm">
                              {currentUser?.email}
                            </dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between py-2">
                            <dt className="text-sm font-medium text-muted-foreground">
                              Email verified
                            </dt>
                            <dd className="mt-1 sm:mt-0 text-sm">
                              {currentUser?.emailVerified ? (
                                <span className="text-green-600 dark:text-green-400">
                                  Verified
                                </span>
                              ) : (
                                <span className="text-red-600 dark:text-red-400">
                                  Not verified
                                </span>
                              )}
                            </dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between py-2">
                            <dt className="text-sm font-medium text-muted-foreground">
                              Provider
                            </dt>
                            <dd className="mt-1 sm:mt-0 text-sm">
                              {currentUser?.providerData?.[0]?.providerId ===
                              "google.com"
                                ? "Google"
                                : "Email/Password"}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">
                        Security
                      </h3>
                      <div className="mt-4">
                        {passwordResetSent ? (
                          <div className="bg-green-100 text-green-700 p-3 rounded">
                            Password reset email sent. Please check your inbox.
                          </div>
                        ) : (
                          <Button
                            onClick={handlePasswordReset}
                            disabled={
                              loading ||
                              currentUser?.providerData?.[0]?.providerId ===
                                "google.com"
                            }
                            variant="outline"
                          >
                            {loading ? "Sending..." : "Reset Password"}
                          </Button>
                        )}
                        {currentUser?.providerData?.[0]?.providerId ===
                          "google.com" && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            Password management is handled by Google for Google
                            accounts.
                          </p>
                        )}
                      </div>

                      <div className="mt-8 border-t border-border pt-6">
                        <h3 className="text-lg font-medium">
                          Linked Accounts
                        </h3>
                        <AccountLinking currentUser={currentUser} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
