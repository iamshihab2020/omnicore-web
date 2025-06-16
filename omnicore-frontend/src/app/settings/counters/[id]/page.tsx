"use client";

import { AppLayout } from "@/components/app/app-layout";
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
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, Loader2, Pencil, Trash2, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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

export default function CounterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const counterId = params.id as string;

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

  // Edit mode state to control form editing
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // UI state
  const [uiState, setUiState] = useState<{
    status: (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];
    message: string | null;
    isSubmitting: boolean;
    isDeleting: boolean;
  }>({
    status: STATUS_TYPES.LOADING,
    message: null,
    isSubmitting: false,
    isDeleting: false,
  });

  // State for menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingState, setLoadingState] = useState({
    items: true,
    currentCounter: true,
  });

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
      setLoadingState((prev) => ({ ...prev, items: true }));
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
      setLoadingState((prev) => ({ ...prev, items: false }));
    }
  }, [routerWrapper]);

  // Fetch current counter data
  const fetchCurrentCounter = useCallback(async () => {
    if (!counterId) return;
    setUiState((prev) => ({
      ...prev,
      status: STATUS_TYPES.LOADING,
      message: null,
    }));

    try {
      setLoadingState((prev) => ({ ...prev, currentCounter: true }));
      const counter = await apiRequest<null, Counter>(
        `settings/counters/${counterId}/`,
        routerWrapper,
        { method: "GET" },
        true
      );

      // Populate form with counter data
      setFormData({
        name: counter.name,
        description: counter.description || "",
        location: counter.location || "",
        status: counter.status,
        items: counter.item_details.map((item) => item.id),
      });
      setUiState((prev) => ({
        ...prev,
        status: STATUS_TYPES.SUCCESS,
        message: null,
      }));
    } catch (error) {
      console.error("Error fetching counter:", error);
      setUiState({
        status: STATUS_TYPES.ERROR,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load counter details",
        isSubmitting: false,
        isDeleting: false,
      });
    } finally {
      setLoadingState((prev) => ({ ...prev, currentCounter: false }));
    }
  }, [counterId, routerWrapper]);

  // Load all data when component mounts
  useEffect(() => {
    // Load data in parallel for better performance
    Promise.all([fetchMenuItems(), fetchCurrentCounter()]);
  }, [fetchMenuItems, fetchCurrentCounter]);

  // Handle form submission to update counter
  const handleUpdate = async (e: React.FormEvent) => {
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

      // Submit the update request
      await apiRequest(
        `settings/counters/${counterId}/`,
        routerWrapper,
        {
          method: "PUT",
          data: submitData,
        },
        true
      );

      showMessage("success", "Counter updated successfully!");

      // Turn off edit mode after successful update
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating counter:", error);
      showMessage(
        "error",
        error instanceof Error
          ? `Error updating counter: ${error.message}`
          : "An unknown error occurred while updating counter."
      );
    } finally {
      setUiState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  // Handle counter deletion
  const handleDelete = async () => {
    setUiState((prev) => ({
      ...prev,
      isDeleting: true,
      message: null,
    }));

    try {
      await apiRequest(
        `settings/counters/${counterId}/`,
        routerWrapper,
        { method: "DELETE" },
        true
      );

      showMessage("success", "Counter deleted successfully!");

      // Navigate back to counters list after a short delay
      setTimeout(() => {
        router.push("/settings/counters");
      }, 1500);
    } catch (error) {
      console.error("Error deleting counter:", error);
      showMessage(
        "error",
        error instanceof Error
          ? `Error deleting counter: ${error.message}`
          : "An unknown error occurred while deleting counter."
      );
      setUiState((prev) => ({ ...prev, isDeleting: false }));
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

  // Loading state for the page
  const isLoading = loadingState.items || loadingState.currentCounter;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Loading counter details...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {" "}
      <div className="px-2 sm:px-4">
        <PageHeader
          title={isEditMode ? "Edit Counter" : "Counter Details"}
          description={formData.name}
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
        {/* Counter Form */}{" "}
        <div className="w-full lg:w-1/2 flex flex-col">
          <Card className="flex flex-col h-auto">
            <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-y-2">
                <div className="text-lg sm:text-xl">
                  {isEditMode ? "Edit Counter" : "Counter Details"}
                </div>
                <div className="flex justify-start sm:justify-end gap-2 w-full sm:w-auto">
                  {" "}
                  {!isEditMode ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditMode(true)}
                        size="sm"
                        className="sm:size-default"
                      >
                        <Pencil className="mr-1 sm:mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="sm:size-default"
                          >
                            <Trash2 className="mr-1 sm:mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Counter</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this counter? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={handleDelete}
                              disabled={uiState.isDeleting}
                            >
                              {uiState.isDeleting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditMode(false);
                          fetchCurrentCounter();
                        }}
                        size="sm"
                        className="sm:size-default"
                      >
                        <span>Cancel</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            size="sm"
                            className="sm:size-default"
                          >
                            <Save className="mr-1 sm:mr-2 h-4 w-4" />
                            <span className="whitespace-nowrap">
                              Save Changes
                            </span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Save Changes</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to save these changes to the
                              counter?
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
                              Save
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </CardTitle>
            </CardHeader>{" "}
            <CardContent className="px-4 sm:px-6 pt-0">
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
              <form onSubmit={handleUpdate} className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="name">Counter Name*</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleTextChange}
                    className="mt-1.5"
                    placeholder="Main Counter"
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
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
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
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
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  {isEditMode ? (
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleFieldChange("status", value)
                      }
                      disabled={!isEditMode}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1.5">
                      <Badge
                        variant={
                          formData.status === "active" ? "default" : "secondary"
                        }
                      >
                        {formData.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        {/* Menu Items Selection */}{" "}
        <div className="w-full lg:w-1/2 flex flex-col">
          <Card className="flex flex-col h-auto">
            {" "}
            <CardHeader className="px-4 py-3 sm:px-6 sm:py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg sm:text-xl">
                {isEditMode ? "Select Items" : "Assigned Items"}
              </CardTitle>
              {isEditMode && (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="whitespace-nowrap"
                  >
                    {menuItems.length > 0 &&
                    menuItems.every((item) => formData.items.includes(item.id))
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">
                      Selected: {formData.items.length}
                    </span>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-320px)]">
                {isEditMode ? (
                  // Edit mode - show all items with improved card design
                  <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
                    {Object.entries(itemsByCategory).map(
                      ([category, items]) => (
                        <div key={category} className="mb-4 sm:mb-6">
                          <h3 className="text-base font-bold mb-2 sm:mb-3 capitalize border-b pb-2">
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
                ) : // View mode - show assigned items with improved cards
                formData.items.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No items assigned to this counter
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 sm:gap-4 sm:p-4">
                    {formData.items.map((itemId) => {
                      const item = menuItems.find((i) => i.id === itemId);
                      if (!item) return null;
                      return (
                        <div
                          key={item.id}
                          className="p-3 sm:p-4 border rounded-lg hover:bg-accent/20 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            {item.image ? (
                              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-md overflow-hidden flex-shrink-0 relative">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="(max-width: 640px) 48px, 56px"
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                                <span className="text-muted-foreground text-[10px]">
                                  No image
                                </span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between flex-wrap gap-1">
                                <h4 className="font-medium text-sm sm:text-base truncate">
                                  {item.name}
                                </h4>
                                <span className="text-xs sm:text-sm font-medium text-primary">
                                  ${item.price}
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {item.category_name}
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
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
