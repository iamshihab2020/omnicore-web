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
import { AppLayout } from "@/components/app/app-layout";
import { PageHeader } from "@/components/ui/page-header";
import {
  ShoppingBag,
  Percent,
  UserPlus,
  Utensils,
  Table,
  Receipt,
} from "lucide-react";

export default function CreatePage() {
  const createOptions = [
    {
      title: "Create Menu Item",
      description: "Add new food or beverage items to your menu",
      icon: <ShoppingBag className="h-6 w-6" />,
      href: "/create/item",
      color: "text-blue-500",
    },
    {
      title: "Create Discount",
      description: "Set up new discount offers and promotions",
      icon: <Percent className="h-6 w-6" />,
      href: "/create/discount",
      color: "text-green-500",
    },
    {
      title: "Create Waiter Profile",
      description: "Add new staff members to your restaurant team",
      icon: <UserPlus className="h-6 w-6" />,
      href: "/create/waiter",
      color: "text-purple-500",
    },
    {
      title: "Create Category",
      description: "Organize your menu items into categories",
      icon: <Utensils className="h-6 w-6" />,
      href: "/create/category",
      color: "text-amber-500",
    },
    {
      title: "Create Table",
      description: "Add new tables to your restaurant layout",
      icon: <Table className="h-6 w-6" />,
      href: "/create/table",
      color: "text-indigo-500",
    },
    {
      title: "Create Tax Rule",
      description: "Configure tax settings for your transactions",
      icon: <Receipt className="h-6 w-6" />,
      href: "/create/tax",
      color: "text-rose-500",
    },
  ];
  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Create"
          description="Create and manage your restaurant resources"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {createOptions.map((option) => (
            <Link key={option.title} href={option.href} className="block">
              <Card className="h-full transition-all hover:shadow-md hover:shadow-primary  border-border border-2 hover:border-primary duration-200">
                <CardHeader>
                  <div
                    className={`rounded-full w-12 h-12 flex items-center justify-center bg-muted ${option.color}`}
                  >
                    {option.icon}
                  </div>
                  <CardTitle className="mt-4">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full">
                    Create {option.title.split(" ").pop()}
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
