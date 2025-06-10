"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/api";

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
          </div>{" "}
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">
            User ID
          </div>
          <div className="mt-1 text-md">{user?.id || "N/A"}</div>
        </div>{" "}
        {(user?.first_name || user?.last_name) && (
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Name
            </div>
            <div className="mt-1 text-md">
              {`${user?.first_name || ""} ${user?.last_name || ""}`.trim()}
            </div>
          </div>
        )}
        {user?.username && (
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Username
            </div>
            <div className="mt-1 text-md">{user.username}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
