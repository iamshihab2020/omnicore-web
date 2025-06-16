"use client";

import { AppLayout } from "@/components/app/layout/app-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Store,
  ChevronLeft,
  User,
  UserCog,
  Calculator,
  ChevronRight,
  Receipt,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Interface for settings section
interface SettingSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

export default function SettingsPage() {
  const router = useRouter();

  // Define settings sections
  const settingsSections: SettingSection[] = [
    {
      title: "Counters",
      description: "Manage your point of sale counters and assign menu items",
      icon: <Store className="h-8 w-8" />,
      path: "/settings/counters",
    },
    {
      title: "Create Tax Rule",
      description: "Configure tax settings for your transactions",
      icon: <Receipt className="h-8 w-8" />,
      path: "/create/tax",
    },
    {
      title: "Finance",
      description: "Configure financial settings, taxes, and payment methods",
      icon: <Calculator className="h-8 w-8" />,
      path: "/settings/finance",
    },
    {
      title: "Profile",
      description: "Update your personal profile and preferences",
      icon: <User className="h-8 w-8" />,
      path: "/settings/profile",
    },
    {
      title: "User Settings",
      description:
        "Configure application settings and notification preferences",
      icon: <UserCog className="h-8 w-8" />,
      path: "/settings/user-settings",
    },
  ];

  // Navigate to section
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <AppLayout>
      <div className="px-2 sm:px-4">
        <PageHeader
          title="Settings"
          description="Configure application settings and preferences"
          className="mb-2 sm:mb-4"
          actions={
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              size="sm"
              className="sm:size-default"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              <span className="sm:block">Back to Dashboard</span>
            </Button>
          }
        />
      </div>

      <div className="p-2 sm:p-4 flex-1 flex flex-col">
        <Card className="w-full flex flex-col flex-1">
          <CardContent className="p-0 flex-1 flex flex-col">
            <ScrollArea className="h-screen max-h-[calc(100vh-180px)] flex-1 w-full">
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {settingsSections.map((section) => (
                  <div
                    key={section.path}
                    className="border rounded-lg p-4 sm:p-6 hover:bg-accent/5 hover:border-primary cursor-pointer transition-all duration-300 shadow-lg hover:shadow flex justify-between items-start"
                    onClick={() => handleNavigate(section.path)}
                  >
                    <div className="flex gap-4">
                      <div className="rounded-md bg-primary p-2 flex items-center justify-center">
                        {section.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-1.5">
                          {section.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground mt-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
