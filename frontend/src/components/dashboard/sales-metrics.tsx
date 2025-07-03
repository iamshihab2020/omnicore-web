"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { TrendBadge } from "./trend-badge";
import { Button } from "../ui/button";
import { ArrowRightIcon, HelpCircleIcon } from "lucide-react";

// Demo data for product categories
const productCategories = [
  { name: "Appetizers", percentage: 35, color: "bg-gradient-blue" },
  { name: "Main Course", percentage: 25, color: "bg-gradient-green" },
  { name: "Desserts", percentage: 15, color: "bg-gradient-pink" },
  { name: "Beverages", percentage: 20, color: "bg-gradient-purple" },
  { name: "Specials", percentage: 5, color: "bg-gradient-orange" },
];

export function SalesMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <Card className="col-span-1 lg:col-span-4 dashboard-card card-md">
        <CardHeader
          className="dashboard-card-header gradient"
          style={
            {
              "--card-gradient-from": "hsl(var(--primary))",
              "--card-gradient-to": "hsl(var(--primary)/0.8)",
            } as React.CSSProperties
          }
        >
          <CardTitle className="text-base drop-shadow-sm">
            Sales by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="dashboard-card-content">
          <div className="flex flex-col items-center justify-center h-52 relative">
            {/* Visual representation of product categories */}
            <div className="w-40 h-40 rounded-full border-8 border-background relative shadow-md animate-pulse-slow">
              {productCategories.map((category, index) => (
                <div
                  key={category.name}
                  className={`absolute ${category.color} rounded-full w-full h-full top-0 left-0 pie-segment-${index}`}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center flex-col bg-background rounded-full shadow-inner">
                <span className="metric-value">75%</span>
                <span className="metric-label">Food Items</span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs w-full max-w-[220px]">
              {productCategories.map((category) => (
                <div key={category.name} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-sm ${category.color}`}></div>
                  <span>{category.name}</span>
                  <span className="ml-auto font-medium">
                    {category.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t flex justify-between pt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-gradient-primary hover:opacity-90 text-white border-none"
          >
            View Details
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>

      <Card className="col-span-1 lg:col-span-8">
        <CardHeader>
          <CardTitle className="text-base">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <MetricCard
              title="Avg. Order Value"
              value="$42.50"
              trend={8.2}
              description="Per transaction"
            />
            <MetricCard
              title="Table Turnover"
              value="4.8x"
              trend={3.1}
              description="Per day"
            />
            <MetricCard
              title="Customer Retention"
              value="68%"
              trend={5.3}
              description="Return rate"
            />
            <MetricCard
              title="Time per Order"
              value="18m"
              trend={-12.5}
              description="Avg. preparation"
              trendDown={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  trend: number;
  description: string;
  trendDown?: boolean;
}

function MetricCard({
  title,
  value,
  trend,
  description,
  trendDown = false,
}: MetricCardProps) {
  return (
    <div className="dashboard-card card-sm rounded-lg border bg-card text-card-foreground shadow-sm p-5 relative overflow-hidden">
      <div className="ribbon-decoration"></div>
      <div className="card-row justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="card-icon gradient h-7 w-7 rounded-full"
        >
          <HelpCircleIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-3">
        <p className="metric-value">{value}</p>
        <div className="card-row items-center gap-2 mt-1">
          <TrendBadge value={trendDown ? -trend : trend} />
          <span className="metric-label">{description}</span>
        </div>
      </div>
    </div>
  );
}
