"use client";

import { AppLayout } from "@/components/app/app-layout";
import { Card } from "@/components/ui/card";
import { BadgePercent } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

export default function Dashboard() {
  return (
    <AppLayout>
      <div className=" grid items-start gap-6 pb-8  md:gap-8">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        <div
          about="account-info"
          className="grid grid-cols-1 gap-6 md:grid-cols-4"
        >
          <Card className="shadow-lg border-2">
            <div className="p-6">
              <div className="flex items-center justify-start gap-4 mb-2">
                <span>
                  <BadgePercent />
                </span>
                <h2 className="text-xl font-bold">Total Sales</h2>
              </div>
              <AnimatedCounter value={12345} prefix="$" />
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
