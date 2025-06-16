"use client";

import { AppLayout } from "@/components/app/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageHeader } from "@/components/ui/page-header";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Eye, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the interface for a working router wrapper compatible with apiRequest
interface RouterWrapper {
  push: (url: string) => Promise<boolean | void>;
}

// Interface for the Menu Item model
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  is_active: boolean;
  preparation_time: number;
  category: string;
  category_name: string;
}

// Interface for Counter model
interface Counter {
  id: string;
  name: string;
  description: string;
  location: string;
  status: string;
  item_details: MenuItem[];
  created_at: string;
  updated_at: string;
}

// Interface for Counter model with detailed metadata

export default function CountersPage() {
  const router = useRouter();

  // Create a router wrapper compatible with apiRequest
  const routerWrapper = useMemo<RouterWrapper>(
    () => ({
      push: async (url: string) => router.push(url),
    }),
    [router]
  );

  const [counters, setCounters] = useState<Counter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch counters from the API
  const fetchCounters = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiRequest<null, Counter[]>(
        "settings/counters/",
        routerWrapper,
        { method: "GET" },
        true
      );
      setCounters(data);
    } catch (error) {
      console.error("Error fetching counters:", error);
      setError(
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unknown error occurred while fetching counters."
      );
    } finally {
      setIsLoading(false);
    }
  }, [routerWrapper]);

  // Load counters on component mount
  useEffect(() => {
    fetchCounters();
  }, [fetchCounters]);

  // Handle counter click - navigate to detail page
  const handleCounterClick = (counter: Counter) => {
    router.push(`/settings/counters/${counter.id}`);
  };

  // Handle create button click - navigate to creation page
  const handleCreateCounter = () => {
    router.push("/settings/counters/create");
  };

  return (
    <AppLayout>
      <div className="px-2 sm:px-4">
        <PageHeader
          title="Counters"
          description="Manage your point of sale counters"
          className="mb-2 sm:mb-4"
          actions={
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/settings")}
                size="sm"
                className="sm:size-default"
              >
                <ChevronLeft className=" h-4 w-4" />
                <span className="sm:block">Back</span>
              </Button>
              <Button
                onClick={handleCreateCounter}
                size="sm"
                className="sm:size-default"
              >
                <Plus className=" h-4 w-4" />
                <span className="sm:block">Create</span>
              </Button>
            </div>
          }
        />
      </div>      <div className="p-2 sm:p-4 flex-1 flex flex-col">
        <Card className="w-full flex flex-col flex-1">
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-4 flex-shrink-0">
            <CardTitle className="text-lg sm:text-xl">All Counters</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="mx-4 my-3 sm:mx-6 sm:my-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : counters.length === 0 ? (
              <div className="text-center py-8 px-4 sm:px-6">
                <p className="text-muted-foreground mb-4">No counters found</p>
                <Button onClick={handleCreateCounter}>
                  <Plus className=" h-4 w-4" />
                  Create Counter                </Button>
              </div>
            ) : (
              <ScrollArea className="h-screen max-h-[calc(100vh-180px)] flex-1 w-full">
                <div className="px-4 py-3 sm:px-6 sm:py-4">
                  <Table className="border w-full">
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className=" font-semibold">
                          Name
                        </TableHead>
                        <TableHead className=" font-semibold">
                          Location
                        </TableHead>
                        <TableHead className=" font-semibold">
                          Status
                        </TableHead>
                        <TableHead className=" font-semibold">
                          Items
                        </TableHead>
                        <TableHead className=" font-semibold">
                          Created
                        </TableHead>
                        <TableHead className=" text-right font-semibold">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {counters.map((counter) => (
                        <TableRow
                          key={counter.id}
                          className="cursor-pointer hover:bg-accent/10 transition-colors duration-200"
                          onClick={() => handleCounterClick(counter)}
                        >
                          <TableCell className="font-medium ">
                            {counter.name}
                          </TableCell>
                          <TableCell className="">
                            {counter.location || "—"}
                          </TableCell>
                          <TableCell className="">
                            <Badge
                              variant={
                                counter.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {counter.status === "active"
                                ? "Active"
                                : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="">
                            {counter.item_details.length}
                          </TableCell>
                          <TableCell className="">
                            {new Date(counter.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className=" text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCounterClick(counter);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
