"use client";

import React from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { TrendBadge } from "./trend-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { DownloadIcon } from "lucide-react";

// Demo data
const weeklyData = [
  { name: "Mon", revenue: 2200, expenses: 1400 },
  { name: "Tue", revenue: 2800, expenses: 1600 },
  { name: "Wed", revenue: 4000, expenses: 2100 },
  { name: "Thu", revenue: 3800, expenses: 1900 },
  { name: "Fri", revenue: 4800, expenses: 2400 },
  { name: "Sat", revenue: 5200, expenses: 2800 },
  { name: "Sun", revenue: 4500, expenses: 2300 },
];

const monthlyData = [
  { name: "Jan", revenue: 45000, expenses: 28000 },
  { name: "Feb", revenue: 52000, expenses: 31000 },
  { name: "Mar", revenue: 61000, expenses: 36000 },
  { name: "Apr", revenue: 58000, expenses: 34000 },
  { name: "May", revenue: 76000, expenses: 42000 },
  { name: "Jun", revenue: 84000, expenses: 46000 },
  { name: "Jul", revenue: 91000, expenses: 49000 },
  { name: "Aug", revenue: 88000, expenses: 47000 },
  { name: "Sep", revenue: 76000, expenses: 42000 },
  { name: "Oct", revenue: 82000, expenses: 45000 },
  { name: "Nov", revenue: 91000, expenses: 48000 },
  { name: "Dec", revenue: 99000, expenses: 52000 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Define appropriate tooltip types
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    name?: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-sm p-3">
        <p className="text-sm font-medium mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-xs flex justify-between gap-4">
            <span className="text-primary">Revenue:</span>
            <span className="font-medium">
              {formatCurrency(payload[0].value)}
            </span>
          </p>
          <p className="text-xs flex justify-between gap-4">
            <span className="text-muted-foreground">Expenses:</span>
            <span className="font-medium">
              {formatCurrency(payload[1].value)}
            </span>
          </p>
          <p className="text-xs flex justify-between gap-4 pt-1 border-t border-border mt-1">
            <span>Profit:</span>
            <span className="font-medium text-primary">
              {formatCurrency(payload[0].value - payload[1].value)}
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  return (
    <Card className="col-span-1 lg:col-span-8 dashboard-card card-lg">
      <CardHeader
        className="flex flex-row items-center justify-between pb-3 dashboard-card-header gradient"
        style={
          {
            "--card-gradient-from": "#3b82f6",
            "--card-gradient-to": "#0ea5e9",
          } as React.CSSProperties
        }
      >
        <div>
          <CardTitle>Revenue Analytics</CardTitle>
          <CardDescription className="text-white/80">
            Detailed overview of revenue and expenses
          </CardDescription>
        </div>
        <Button
          size="sm"
          className="bg-white/20 hover:bg-white/30 text-white border-white/10 backdrop-blur-sm"
        >
          <DownloadIcon className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </CardHeader>

      <CardContent className="pt-6 px-6">
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="bg-gradient-blue/10 p-1 rounded-lg mb-4">
            <TabsTrigger
              value="weekly"
              className="data-[state=active]:bg-gradient-blue data-[state=active]:text-white"
            >
              Weekly
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="data-[state=active]:bg-gradient-blue data-[state=active]:text-white"
            >
              Monthly
            </TabsTrigger>
            <TabsTrigger
              value="yearly"
              className="data-[state=active]:bg-gradient-blue data-[state=active]:text-white"
            >
              Yearly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-5">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-2">
              <div className="card-col">
                <p className="metric-label">Total Revenue</p>
                <p className="metric-value">$23,300</p>
                <TrendBadge value={12.5} />
              </div>
              <div className="card-col">
                <p className="metric-label">Total Expenses</p>
                <p className="metric-value">$12,600</p>
                <TrendBadge value={-2.3} />
              </div>
              <div className="card-col">
                <p className="metric-label">Net Profit</p>
                <p className="metric-value">$10,700</p>
                <TrendBadge value={8.1} />
              </div>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weeklyData}
                  margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">$903,000</p>
                <TrendBadge value={18.2} />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">$500,000</p>
                <TrendBadge value={5.7} />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold">$403,000</p>
                <TrendBadge value={22.4} />
              </div>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="yearly">
            <div className="pt-8 pb-10 text-center text-muted-foreground">
              Yearly data not available in demo mode
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="border-t pt-4 pb-0">
        <p className="text-xs text-muted-foreground">
          Last updated on June 20, 2025 at 08:30 AM
        </p>
      </CardFooter>
    </Card>
  );
}
