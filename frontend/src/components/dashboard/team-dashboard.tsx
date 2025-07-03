"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  CalendarRange,
  Clock,
  MailIcon,
  MessageSquare,
  Phone,
} from "lucide-react";

// Demo team data
const teamMembers = [
  {
    id: 1,
    name: "Olivia Martin",
    role: "Restaurant Manager",
    email: "olivia.martin@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "/avatars/01.png",
    fallback: "OM",
    status: "active",
    availability: "On Duty",
    schedule: "9:00 AM - 5:00 PM",
  },
  {
    id: 2,
    name: "Jackson Lee",
    role: "Head Chef",
    email: "jackson.lee@email.com",
    phone: "+1 (555) 234-5678",
    avatar: "/avatars/02.png",
    fallback: "JL",
    status: "active",
    availability: "On Duty",
    schedule: "8:00 AM - 4:00 PM",
  },
  {
    id: 3,
    name: "Isabella Nguyen",
    role: "Sous Chef",
    email: "isabella.nguyen@email.com",
    phone: "+1 (555) 345-6789",
    avatar: "/avatars/03.png",
    fallback: "IN",
    status: "away",
    availability: "On Break",
    schedule: "10:00 AM - 6:00 PM",
  },
  {
    id: 4,
    name: "William Kim",
    role: "Server",
    email: "will@email.com",
    phone: "+1 (555) 456-7890",
    avatar: "/avatars/04.png",
    fallback: "WK",
    status: "active",
    availability: "On Duty",
    schedule: "11:00 AM - 7:00 PM",
  },
];

export function TeamDashboard() {
  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-3 bg-gradient-green text-white">
        <CardTitle className="text-base">Team Management</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TeamMemberCard({ member }: { member: (typeof teamMembers)[0] }) {
  return (
    <div className="dashboard-card rounded-lg border bg-card p-6 shadow-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-24 bg-gradient-green opacity-10 -rotate-45 transform origin-top-right"></div>
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-14 w-14 ring-2 ring-offset-2 ring-green-400">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback className="bg-gradient-green text-white">
            {member.fallback}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-base">{member.name}</h3>
          <p className="text-xs text-muted-foreground">{member.role}</p>
        </div>
      </div>

      <div className="space-y-3 text-sm relative z-10">
        <div className="flex items-center gap-2 text-xs">
          <Badge
            className={`h-5 px-2 py-0 ${
              member.status === "active"
                ? "bg-gradient-green text-white"
                : "bg-gradient-orange/30 text-orange-700 hover:bg-gradient-orange/40"
            }`}
          >
            {member.availability}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{member.schedule}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MailIcon className="h-3.5 w-3.5" />
          <span>{member.email}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Phone className="h-3.5 w-3.5" />
          <span>{member.phone}</span>
        </div>

        <div className="flex justify-between mt-3 pt-2 border-t">
          <button className="text-xs text-primary flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            Message
          </button>
          <button className="text-xs text-primary flex items-center gap-1">
            <CalendarRange className="h-3.5 w-3.5" />
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
