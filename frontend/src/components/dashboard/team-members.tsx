import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";

const TeamMembers = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your workspace team</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {(() => {
              const members = [
                {
                  name: "Olivia Martin",
                  email: "olivia.martin@email.com",
                  type: "Owner",
                  avatar: "/avatars/01.png",
                  fallback: "OM",
                },
                {
                  name: "Jackson Lee",
                  email: "jackson.lee@email.com",
                  type: "Admin",
                  avatar: "/avatars/02.png",
                  fallback: "JL",
                },
                {
                  name: "Isabella Nguyen",
                  email: "isabella.nguyen@email.com",
                  type: "Member",
                  avatar: "/avatars/03.png",
                  fallback: "IN",
                },
                {
                  name: "William Kim",
                  email: "will@email.com",
                  type: "Member",
                  avatar: "/avatars/04.png",
                  fallback: "WK",
                },
                {
                  name: "Sofia Davis",
                  email: "sofia.davis@email.com",
                  type: "Guest",
                  avatar: "/avatars/05.png",
                  fallback: "SD",
                },
              ];
              return members.map((member) => (
                <li key={member.email} className="flex items-center gap-4 py-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.fallback}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{member.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {member.email}
                    </div>
                  </div>
                  {/* <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground border font-semibold capitalize">
                    {member.type}
                  </span> */}
                  <Badge variant={'default'} className="text-sm font-semibold">{member.type} </Badge>
                </li>
              ));
            })()}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamMembers;
