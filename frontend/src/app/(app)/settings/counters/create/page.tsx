"use client";

import { AppLayout } from "@/components/app/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/ui/page-header";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

// Define UI state types as constants
const STATUS_TYPES = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

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

export default function CreateCounterPage() {
  const router = useRouter();

  // Create a router wrapper compatible with apiRequest
  const routerWrapper = useMemo<RouterWrapper>(
    () => ({
      push: async (url: string) => router.push(url),
    }),
    [router]
  );

  // Form state in a single consolidated object
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    location: string;
    status: string;
    items: string[];
  }>({
    name: "",
    description: "",
    location: "",
    status: "active",
    items: [],
  });

  // UI state
  const [uiState, setUiState] = useState<{
    status: (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];
    message: string | null;
    isSubmitting: boolean;
  }>({
    status: STATUS_TYPES.SUCCESS,
    message: null,
    isSubmitting: false,
  });

  // State for menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  // Generic form field change handler for text fields
  const handleFieldChange = (
    field: string,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle text input changes
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    handleFieldChange(name, value);
  };
  // Handle item selection
  const handleItemToggle = (itemId: string) => {
    setFormData((prev) => {
      const newItems = prev.items.includes(itemId)
        ? prev.items.filter((id) => id !== itemId)
        : [...prev.items, itemId];

      return {
        ...prev,
        items: newItems,
      };
    });
  };

  // Handle select all items
  const handleSelectAll = () => {
    // Extract all item IDs from menuItems
    const allItemIds = menuItems.map((item) => item.id);

    // Check if all items are already selected
    const allSelected = allItemIds.every((id) => formData.items.includes(id));

    if (allSelected) {
      // If all are selected, deselect all
      setFormData((prev) => ({ ...prev, items: [] }));
    } else {
      // Otherwise, select all items
      setFormData((prev) => ({ ...prev, items: [...allItemIds] }));
    }
  };

  // Show message with auto-close for success messages
  const showMessage = (type: "success" | "error", message: string) => {
    setUiState((prev) => ({
      ...prev,
      status: type === "success" ? STATUS_TYPES.SUCCESS : STATUS_TYPES.ERROR,
      message,
    }));

    // Auto-clear success messages after 3 seconds
    if (type === "success") {
      setTimeout(() => {
        setUiState((prev) => ({ ...prev, message: null }));
      }, 3000);
    }
  };

  // Fetch all menu items
  const fetchMenuItems = useCallback(async () => {
    try {
      setIsLoadingItems(true);
      const data = await apiRequest<null, MenuItem[]>(
        "menu/items/",
        routerWrapper,
        { method: "GET" },
        true
      );
      setMenuItems(data);
    } catch (error) {
      console.error("Error loading menu items:", error);
      showMessage(
        "error",
        error instanceof Error
          ? `Error loading menu items: ${error.message}`
          : "An unknown error occurred while loading menu items."
      );
    } finally {
      setIsLoadingItems(false);
    }
  }, [routerWrapper]);

  // Load data when component mounts
  useEffect(() => {
    // Reset UI state to initial state
    setUiState((prev) => ({
      ...prev,
      status: STATUS_TYPES.SUCCESS,
      message: null,
    }));

    // Load menu items
    fetchMenuItems();
  }, [fetchMenuItems]);

  // Handle form submission to create counter
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset any previous messages
    setUiState((prev) => ({ ...prev, message: null }));

    // Form validation
    if (!formData.name.trim()) {
      showMessage("error", "Counter name is required");
      return;
    }

    setUiState((prev) => ({
      ...prev,
      isSubmitting: true,
      message: null,
    }));

    try {
      // Prepare data for submission
      const submitData = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        status: formData.status,
        items: formData.items,
      };

      // Submit the create request
      await apiRequest(
        "settings/counters/",
        routerWrapper,
        {
          method: "POST",
          data: submitData,
        },
        true
      );

      showMessage("success", "Counter created successfully!");

      // Reset form after successful creation
      setFormData({
        name: "",
        description: "",
        location: "",
        status: "active",
        items: [],
      });

      // Navigate back to counters list after a short delay
      setTimeout(() => {
        router.push("/settings/counters");
      }, 1500);
    } catch (error) {
      console.error("Error creating counter:", error);
      showMessage(
        "error",
        error instanceof Error
          ? `Error creating counter: ${error.message}`
          : "An unknown error occurred while creating counter."
      );
    } finally {
      setUiState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  // Group menu items by category for better organization
  const itemsByCategory = useMemo(() => {
    const grouped: { [key: string]: MenuItem[] } = {};

    menuItems.forEach((item) => {
      if (!grouped[item.category_name]) {
        grouped[item.category_name] = [];
      }
      grouped[item.category_name].push(item);
    });

    return grouped;
  }, [menuItems]);

  return (
    <AppLayout>
      <div className="px-2 sm:px-4">
        <PageHeader
          title="Create Counter"
          description="Create a new point of sale counter"
          className="mb-2 sm:mb-4"
          actions={
            <Button
              variant="outline"
              onClick={() => router.push("/settings/counters")}
              size="sm"
              className="sm:size-default"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              <span>Back</span>
            </Button>
          }
        />
      </div>
      <div className="flex flex-col lg:flex-row flex-1 p-2 sm:p-4 gap-4 sm:gap-6">
        {/* Counter Form */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <Card className="flex flex-col h-auto">
            <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
              <CardTitle className="text-lg sm:text-xl">
                Counter Details
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {/* Display message alert */}
              {uiState.message && (
                <Alert
                  variant={
                    uiState.status === STATUS_TYPES.ERROR
                      ? "destructive"
                      : "default"
                  }
                  className="mb-4"
                >
                  <AlertTitle>
                    {uiState.status === STATUS_TYPES.ERROR
                      ? "Error"
                      : "Success"}
                  </AlertTitle>
                  <AlertDescription>{uiState.message}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="name">Counter Name*</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleTextChange}
                    className="mt-1.5"
                    placeholder="Main Counter"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleTextChange}
                    className="mt-1.5"
                    placeholder="Front Entrance"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleTextChange}
                    className="mt-1.5 min-h-[100px]"
                    placeholder="Main selling point at the entrance"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleFieldChange("status", value)
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      className="w-full mt-2 sm:mt-4"
                      disabled={uiState.isSubmitting}
                    >
                      {uiState.isSubmitting ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Create Counter
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Create Counter</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to create this counter?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          document.forms[0].dispatchEvent(
                            new Event("submit", {
                              bubbles: true,
                              cancelable: true,
                            })
                          );
                        }}
                      >
                        Create
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </form>
            </CardContent>
          </Card>
        </div>
        {/* Menu Items Selection */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <Card className="flex flex-col h-auto">
            <CardHeader className="px-4 py-3 sm:px-6 sm:py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg sm:text-xl">
                Available Items
              </CardTitle>
              <div className="flex items-center gap-3">
                {!isLoadingItems && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      className="whitespace-nowrap"
                      disabled={menuItems.length === 0}
                    >
                      {menuItems.length > 0 &&
                      menuItems.every((item) =>
                        formData.items.includes(item.id)
                      )
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">
                        Selected: {formData.items.length}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingItems ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : menuItems.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <p className="text-muted-foreground">
                    No menu items available
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-320px)]">
                  <div className="p-4 space-y-6">
                    {Object.entries(itemsByCategory).map(
                      ([category, items]) => (
                        <div key={category} className="mb-6">
                          <h3 className="text-base font-bold mb-3 capitalize border-b pb-2">
                            {category}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-3">
                            {items.map((item) => (
                              <div
                                key={item.id}
                                className={`p-3 border rounded-md cursor-pointer hover:bg-accent transition-colors ${
                                  formData.items.includes(item.id)
                                    ? "border-primary bg-primary/5"
                                    : "border-border"
                                }`}
                                onClick={() => handleItemToggle(item.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    id={`item-${item.id}`}
                                    checked={formData.items.includes(item.id)}
                                    onCheckedChange={() =>
                                      handleItemToggle(item.id)
                                    }
                                    className="flex-shrink-0"
                                  />
                                  {item.image ? (
                                    <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0 relative">
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                                      <span className="text-muted-foreground text-[10px]">
                                        No image
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-sm truncate">
                                        {item.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                      <span className="text-sm text-primary font-medium">
                                        ${item.price}
                                      </span>
                                      <span
                                        className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs ${
                                          item.is_active === false
                                            ? "bg-muted text-muted-foreground"
                                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        }`}
                                      >
                                        {item.is_active === false
                                          ? "Inactive"
                                          : "Active"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
