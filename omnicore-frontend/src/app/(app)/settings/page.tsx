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
  Shield,
  Globe,
  Bell,
  HardDrive,
  BookOpen,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Breadcrumb } from "@/components/ui/breadcrumb";

// Interface for settings section from JSON data
interface SettingSectionJson {
  title: string;
  description: string;
  icon: string;
  path: string;
  category: "business" | "user" | "system";
  badge?: string;
  badgeVariant?: "default" | "outline" | "secondary" | "destructive";
  isNew?: boolean;
}

// Interface for settings section with React node
interface SettingSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  category: "business" | "user" | "system";
  badge?: string;
  badgeVariant?: "default" | "outline" | "secondary" | "destructive";
  isNew?: boolean;
}

// Import settings sections data
import settingsSectionsData from "@/json/settings-sections.json";

// Map of icon names to icon components
const iconComponents: Record<string, React.ElementType> = {
  Store,
  User,
  UserCog,
  Calculator,
  Receipt,
  Shield,
  Globe,
  Bell,
  HardDrive,
  BookOpen,
};

export default function SettingsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  // Transform JSON data to include React components
  const settingsSections: SettingSection[] = (
    settingsSectionsData.settings as SettingSectionJson[]
  ).map((section) => {
    const IconComponent = iconComponents[section.icon];
    return {
      ...section,
      icon: <IconComponent className="h-6 w-6" />,
    } as SettingSection;
  });

  // Filter settings based on search query
  const filteredSettings = settingsSections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get settings by category
  const getSettingsByCategory = (category: "business" | "user" | "system") => {
    return filteredSettings.filter((section) => section.category === category);
  };

  // Navigate to section
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <AppLayout>
      {" "}
      <div className="w-full mx-auto">
        {/* Breadcrumb Navigation */}{" "}
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Settings" },
          ]}
          className="mb-4"
        />
        <PageHeader
          title="Settings"
          description="Configure system settings and preferences"
          className="mb-6"
          actions={
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              size="sm"
              className="h-9"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          }
        />
        <div className="flex flex-col space-y-6">
          {/* Settings Categories */}
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-3">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Settings</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
              {/* Search Bar */}
              <div className="relative max-w-sm w-full">
                <Input
                  type="search"
                  placeholder="Search settings..."
                  className="w-full "
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {/* Business Settings */}{" "}
            <TabsContent value="business" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {getSettingsByCategory("business").map((section, index) => (
                  <SettingCard
                    key={section.path}
                    section={section}
                    onClick={() => handleNavigate(section.path)}
                    index={index}
                  />
                ))}
              </div>
            </TabsContent>
            {/* User Settings */}{" "}
            <TabsContent value="user" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {getSettingsByCategory("user").map((section, index) => (
                  <SettingCard
                    key={section.path}
                    section={section}
                    onClick={() => handleNavigate(section.path)}
                    index={index}
                  />
                ))}
              </div>
            </TabsContent>
            {/* System Settings */}{" "}
            <TabsContent value="system" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {getSettingsByCategory("system").map((section, index) => (
                  <SettingCard
                    key={section.path}
                    section={section}
                    onClick={() => handleNavigate(section.path)}
                    index={index}
                  />
                ))}
              </div>
            </TabsContent>
            {/* All Settings */}{" "}
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredSettings.map((section, index) => (
                  <SettingCard
                    key={section.path}
                    section={section}
                    onClick={() => handleNavigate(section.path)}
                    index={index}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}

// Setting Card Component
function SettingCard({
  section,
  onClick,
  index = 0,
}: {
  section: SettingSection;
  onClick: () => void;
  index?: number;
}) {
  return (
    <AnimatedCard index={index} hoverEffect="grow">
      <Card
        className="overflow-hidden transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full"
        onClick={onClick}
      >
        <CardContent className="p-0">
          <div className="flex items-start p-5 gap-4">
            <div
              className={`rounded-full p-3 bg-primary/10 text-primary flex items-center justify-center ${
                section.isNew ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
            >
              {section.icon}
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-lg">{section.title}</h3>
                {section.badge && (
                  <Badge
                    variant={section.badgeVariant || "default"}
                    className="ml-2 text-xs"
                  >
                    {section.badge}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                {section.description}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground self-center flex-shrink-0" />{" "}
          </div>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}
