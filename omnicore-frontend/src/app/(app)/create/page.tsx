"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppLayout } from "@/components/app/layout/app-layout";
import { PageHeader } from "@/components/ui/page-header";
import {
  ShoppingBag,
  // Percent,
  // UserPlus,
  Utensils,
  Table,
  // Receipt,
  AppWindow,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function CreatePage() {
  const createOptions = [
    {
      title: "Create Menu Item",
      description: "Add new food items to your menu",
      icon: <ShoppingBag className="h-6 w-6" />,
      href: "/create/item",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      gradientFrom: "from-blue-500/20",
      gradientTo: "to-blue-500/5",
      iconBg: "bg-blue-500",
    },
    {
      title: "Create Category",
      description: "Organize your menu items into categories",
      icon: <Utensils className="h-6 w-6" />,
      href: "/create/category",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      gradientFrom: "from-amber-500/20",
      gradientTo: "to-amber-500/5",
      iconBg: "bg-amber-500",
    },
    {
      title: "Create Table",
      description: "Add new tables to your restaurant layout",
      icon: <Table className="h-6 w-6" />,
      href: "/create/table",
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      gradientFrom: "from-indigo-500/20",
      gradientTo: "to-indigo-500/5",
      iconBg: "bg-indigo-500",
    },
    {
      title: "Create Counter",
      description: "Set up new sales counters or cash registers",
      icon: <AppWindow className="h-6 w-6" />,
      href: "/settings/counters",
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      gradientFrom: "from-cyan-500/20",
      gradientTo: "to-cyan-500/5",
      iconBg: "bg-cyan-500",
    },
    // {
    //   title: "Create Discount",
    //   description: "Set up new discount offers and promotions",
    //   icon: <Percent className="h-6 w-6" />,
    //   href: "/create/discount",
    //   color: "bg-green-500/10 text-green-600 dark:text-green-400",
    //   gradientFrom: "from-green-500/20",
    //   gradientTo: "to-green-500/5",
    //   iconBg: "bg-green-500",
    // },
    // {
    //   title: "Create Waiter Profile",
    //   description: "Add new staff members to your restaurant team",
    //   icon: <UserPlus className="h-6 w-6" />,
    //   href: "/create/waiter",
    //   color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    //   gradientFrom: "from-purple-500/20",
    //   gradientTo: "to-purple-500/5",
    //   iconBg: "bg-purple-500",
    // },
  ];

  return (
    <AppLayout>
      {" "}
      <div className="space-y-8 px-1">
        {/* Breadcrumb Navigation */}{" "}
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Create" },
          ]}
        />
        <PageHeader
          title="Create New Items"
          description="Create and manage your restaurant resources"
        />{" "}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {createOptions.map((option, index) => (
            <AnimatedCard key={option.title} index={index} hoverEffect="lift">
              <Link href={option.href} className="block group">
                <Card
                  className={cn(
                    "h-full overflow-hidden border border-border relative",
                    "transition-all duration-300 hover:shadow-lg hover:border-primary/30",
                    "bg-gradient-to-br from-transparent to-transparent hover:from-muted/50"
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                      "bg-gradient-to-br",
                      option.gradientFrom,
                      option.gradientTo
                    )}
                  />

                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "rounded-lg w-14 h-14 flex items-center justify-center",
                          option.color
                        )}
                      >
                        {React.cloneElement(option.icon, {
                          className: cn(
                            "h-7 w-7",
                            "transition-transform duration-300 group-hover:scale-110"
                          ),
                        })}
                      </div>
                      <PlusCircle className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground transition-all duration-300 transform group-hover:translate-x-0 translate-x-5" />
                    </div>

                    <CardTitle className="mt-5 group-hover:text-primary transition-colors duration-300">
                      {option.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {option.description}
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className="relative z-10 pt-0 pb-5">
                    <Button
                      className="w-full transition-all duration-300 group-hover:bg-primary group-hover:text-white font-medium"
                      size="lg"
                    >
                      Create {option.title.split(" ").pop()}{" "}
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
