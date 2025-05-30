"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/protected-route";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { currentUser } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Profile
                </h2>
                <Link href="/dashboard">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {currentUser?.email}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      User ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {currentUser?.uid}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email verified
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
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
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Account created
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {currentUser?.metadata.creationTime
                        ? new Date(
                            currentUser.metadata.creationTime
                          ).toLocaleDateString()
                        : "N/A"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Account Settings
                </h3>
                <div className="mt-4 space-y-4">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
