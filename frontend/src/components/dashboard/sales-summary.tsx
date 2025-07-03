"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";

// Demo sales data
const recentSales = [
  {
    id: "S-1001",
    customer: {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      avatar: "/avatars/01.png",
      fallback: "OM",
    },
    amount: 1999.0,
    status: "completed",
    date: "Today, 2:30 PM",
  },
  {
    id: "S-1002",
    customer: {
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      avatar: "/avatars/02.png",
      fallback: "JL",
    },
    amount: 39.0,
    status: "completed",
    date: "Today, 11:15 AM",
  },
  {
    id: "S-1003",
    customer: {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      avatar: "/avatars/03.png",
      fallback: "IN",
    },
    amount: 299.0,
    status: "processing",
    date: "Today, 9:30 AM",
  },
  {
    id: "S-1004",
    customer: {
      name: "William Kim",
      email: "will@email.com",
      avatar: "/avatars/04.png",
      fallback: "WK",
    },
    amount: 99.0,
    status: "completed",
    date: "Yesterday, 4:45 PM",
  },
  {
    id: "S-1005",
    customer: {
      name: "Sofia Davis",
      email: "sofia.davis@email.com",
      avatar: "/avatars/05.png",
      fallback: "SD",
    },
    amount: 39.0,
    status: "completed",
    date: "Yesterday, 2:20 PM",
  },
  {
    id: "S-1006",
    customer: {
      name: "James Rodriguez",
      email: "james.r@email.com",
      avatar: "/avatars/06.png",
      fallback: "JR",
    },
    amount: 149.0,
    status: "refunded",
    date: "Yesterday, 10:05 AM",
  },
  {
    id: "S-1007",
    customer: {
      name: "Emma Thompson",
      email: "emma.t@email.com",
      avatar: "/avatars/07.png",
      fallback: "ET",
    },
    amount: 399.0,
    status: "completed",
    date: "Jun 18, 3:15 PM",
  },
];

export function SalesSummary() {
  return (
    <Card className="col-span-1 lg:col-span-4 dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-purple text-white">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription className="text-white/80">
            You processed 18 orders today
          </CardDescription>
        </div>
        <Button
          size="icon"
          className="bg-white/20 hover:bg-white/30 text-white border-white/10"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </CardHeader>
      <ScrollArea className="h-[420px]">
        <CardContent>
          <div className="space-y-6">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center gap-4">
                <Avatar className="h-9 w-9 border">
                  <AvatarImage
                    src={sale.customer.avatar}
                    alt={sale.customer.name}
                  />
                  <AvatarFallback>{sale.customer.fallback}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">
                      {sale.customer.name}
                    </p>
                    <span className="inline-block text-xs text-muted-foreground truncate">
                      ({sale.id})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground truncate">
                      {sale.customer.email}
                    </p>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {sale.date}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="font-medium">+${sale.amount.toFixed(2)}</div>{" "}
                  <Badge
                    className={`text-[10px] px-1 py-0 h-5 ${
                      sale.status === "completed"
                        ? "bg-gradient-green text-white"
                        : sale.status === "processing"
                        ? "bg-gradient-blue text-white"
                        : "bg-gradient-red text-white"
                    }`}
                  >
                    {sale.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </ScrollArea>{" "}
      <CardFooter className="border-t flex justify-between pt-4">
        <Button
          variant="outline"
          size="sm"
          className="bg-gradient-purple/10 hover:bg-gradient-purple/20 border-purple-200 text-purple-700"
        >
          View All Transactions
        </Button>
        <Button
          size="sm"
          className="bg-gradient-purple hover:opacity-90 text-white"
        >
          Export Report
        </Button>
      </CardFooter>
    </Card>
  );
}
