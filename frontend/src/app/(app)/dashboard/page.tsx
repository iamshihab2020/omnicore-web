"use client";

import React from "react";
import { AppLayout } from "@/components/app/layout/app-layout";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SalesMetrics } from "@/components/dashboard/sales-metrics";
import { SalesSummary } from "@/components/dashboard/sales-summary";
import { TeamDashboard } from "@/components/dashboard/team-dashboard";
import { CalendarClock, LayoutDashboard, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {  return (
    <AppLayout>
      <div className="">
        <div>
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 rounded-xl bg-gradient-primary pt-0 pb-6 pr-6 pl-6 text-white">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <LayoutDashboard className="h-6 w-6 text-primary animate-float" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              </div>
              <p className="text-white/90 max-w-lg">
                Welcome back! Here&apos;s an overview of your restaurant
                performance for today.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-9 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/10 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                size="sm"
                className="h-9 bg-white hover:bg-white/90 text-primary"
              >
                <CalendarClock className="h-4 w-4 mr-2" />
                Today: June 20, 2025
              </Button>
            </div>
          </div>
          {/* Quick Stats Cards */}
          <div className="mb-8">
            <QuickStats />
          </div>
          {/* Main Dashboard Content */}{" "}
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="w-full border-b-0 rounded-xl bg-gradient-purple/10 p-2 justify-start">
              <TabsTrigger
                value="overview"
                className="text-base rounded-xl data-[state=active]:bg-gradient-purple data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="sales"
                className="text-base rounded-xl data-[state=active]:bg-gradient-purple data-[state=active]:text-white"
              >
                Sales
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="text-base rounded-xl data-[state=active]:bg-gradient-purple data-[state=active]:text-white"
              >
                Products
              </TabsTrigger>
              <TabsTrigger
                value="customers"
                className="text-base rounded-xl data-[state=active]:bg-gradient-purple data-[state=active]:text-white"
              >
                Customers
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              {/* Revenue & Sales Charts */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <RevenueChart />
                <SalesSummary />
              </div>

              {/* Performance Metrics */}
              <SalesMetrics />

              {/* Team Management */}
              <div className="pt-3">
                <TeamDashboard />
              </div>
            </TabsContent>{" "}
            <TabsContent value="sales">
              <Card className="border-2 border-dashed bg-gradient-purple/5 border-purple-200">
                <CardContent className="flex flex-col items-center justify-center p-12 py-20">
                  <div className="w-20 h-20 rounded-full bg-gradient-purple mb-6 flex items-center justify-center shadow-lg animate-pulse-slow">
                    <p className="text-3xl text-white font-bold">$</p>
                  </div>
                  <p className="text-center text-lg font-medium text-purple-800 mb-2">
                    Sales dashboard coming soon!
                  </p>{" "}
                  <p className="text-center text-muted-foreground max-w-lg">
                    This area is under construction. We&apos;re working on
                    bringing you detailed sales analytics, performance metrics,
                    and customer insights.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="products">
              <Card className="border-2 border-dashed bg-gradient-blue/5 border-blue-200">
                <CardContent className="flex flex-col items-center justify-center p-12 py-20">
                  <div className="w-20 h-20 rounded-full bg-gradient-blue mb-6 flex items-center justify-center shadow-lg animate-pulse-slow">
                    <p className="text-3xl text-white font-bold">P</p>
                  </div>
                  <p className="text-center text-lg font-medium text-blue-800 mb-2">
                    Products dashboard coming soon!
                  </p>{" "}
                  <p className="text-center text-muted-foreground max-w-lg">
                    We&apos;re building a comprehensive product management
                    system with inventory tracking, popularity metrics, and menu
                    optimization features.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="customers">
              <Card className="border-2 border-dashed bg-gradient-green/5 border-green-200">
                <CardContent className="flex flex-col items-center justify-center p-12 py-20">
                  <div className="w-20 h-20 rounded-full bg-gradient-green mb-6 flex items-center justify-center shadow-lg animate-pulse-slow">
                    <p className="text-3xl text-white font-bold">C</p>
                  </div>
                  <p className="text-center text-lg font-medium text-green-800 mb-2">
                    Customers dashboard coming soon!
                  </p>
                  <p className="text-center text-muted-foreground max-w-lg">
                    {" "}
                    Our customer relationship management tools will help you
                    track loyalty, preferences, and engage with your most
                    valuable customers.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
