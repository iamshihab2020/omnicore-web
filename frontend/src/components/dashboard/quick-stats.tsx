"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendBadge } from "./trend-badge";
import { AnimatedCounter } from "../ui/animated-counter";
import {
  BanknoteIcon,
  CalendarIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";

// Quick stats with demo data
const quickStats = [
  {
    title: "Total Revenue",
    value: 85430.89,
    prefix: "$",
    decimals: 2,
    icon: <BanknoteIcon className="text-primary h-5 w-5" />,
    trend: 14.5,
    description: "vs. prev. 30 days",
  },
  {
    title: "New Customers",
    value: 356,
    prefix: "",
    decimals: 0,
    icon: <UsersIcon className="text-primary h-5 w-5" />,
    trend: 7.2,
    description: "vs. prev. 30 days",
  },
  {
    title: "Total Orders",
    value: 3240,
    prefix: "",
    decimals: 0,
    icon: <ShoppingCartIcon className="text-primary h-5 w-5" />,
    trend: 12.3,
    description: "vs. prev. 30 days",
  },
  {
    title: "Avg. Daily Sales",
    value: 2847.7,
    prefix: "$",
    decimals: 2,
    icon: <CalendarIcon className="text-primary h-5 w-5" />,
    trend: 3.4,
    description: "vs. prev. 30 days",
  },
];

export function QuickStats() {
  // Array of gradient classes for variety
  const gradients = [
    "bg-gradient-primary",
    "bg-gradient-purple",
    "bg-gradient-blue",
    "bg-gradient-green",
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {quickStats.map((stat, index) => (
        <Card
          key={stat.title}
          className="dashboard-card card-sm overflow-hidden relative"
        >
          <div className="stat-card-decoration"></div>
          <CardHeader
            className={`flex flex-row items-center justify-between space-y-0 pb-2 ${gradients[index]} text-white dashboard-card-header`}
            style={
              {
                "--card-gradient-from":
                  index === 0 ? "hsl(var(--primary))" : undefined,
                "--card-gradient-to":
                  index === 0 ? "hsl(var(--primary)/0.8)" : undefined,
              } as React.CSSProperties
            }
          >
            <CardTitle className="text-sm font-medium drop-shadow-md">
              {stat.title}
            </CardTitle>
            <div className="card-icon rounded-full p-2 bg-white/20 backdrop-blur-sm shadow-lg">
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent className="pt-4 relative z-10 dashboard-card-content">
            <div className="metric-container">
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                decimals={stat.decimals}
                className="metric-value lg"
              />
              <div className="flex items-center justify-between">
                <TrendBadge value={stat.trend} className="animate-pulse-slow" />
                <p className="metric-label">{stat.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
