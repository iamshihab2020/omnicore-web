"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "firebase/auth";

interface AccountInfoCardProps {
  user: User | null;
}

export function AccountInfoCard({ user }: AccountInfoCardProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Your Account Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground">Email</div>
          <div className="mt-1 text-md">
            {user?.email || "No email available"}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">
            User ID
          </div>
          <div className="mt-1 text-md">{user?.uid}</div>
        </div>
        {user?.emailVerified !== undefined && (
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Email Verification
            </div>
            <div className="mt-1 text-md">
              {user.emailVerified ? (
                <span className="text-green-500 dark:text-green-400">
                  Verified
                </span>
              ) : (
                <span className="text-red-500 dark:text-red-400">
                  Not verified
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
