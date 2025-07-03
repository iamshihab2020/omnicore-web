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
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  Loader2,
  Pencil,
  Trash2,
  Save,
  Search,
  X,
  Settings,
  ShoppingBasket,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ); // State for UI interaction and filtering
  const [search, setSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("details");
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<string>("all");

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

  // Filter menu items based on search and category filter
  const filteredItemsByCategory = useMemo(() => {
    const filtered = menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (selectedCategoryFilter === "all" ||
          item.category_name === selectedCategoryFilter)
    );

    const grouped: { [key: string]: MenuItem[] } = {};
    filtered.forEach((item) => {
      if (!grouped[item.category_name]) {
        grouped[item.category_name] = [];
      }
      grouped[item.category_name].push(item);
    });

    return grouped;
  }, [menuItems, search, selectedCategoryFilter]);

  // Get unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    menuItems.forEach((item) => categories.add(item.category_name));
    return Array.from(categories);
  }, [menuItems]);

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setSelectedCategoryFilter("all");
  };
  // This implementation has been replaced by filteredItemsByCategory above

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
      <div className="px-2 sm:px-6 pb-6">
        {/* Page Header */}
        <PageHeader
          title={isEditMode ? "Edit Counter" : "Counter Details"}
          description={formData.name}
          className="mb-4 sm:mb-6"
          actions={
            <Button
              variant="outline"
              onClick={() => router.push("/settings/counters")}
              size="sm"
              className="sm:size-default"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              <span>Back to Counters</span>
            </Button>
          }
        />

        {/* Display message alert */}
        {uiState.message && (
          <Alert
            variant={
              uiState.status === STATUS_TYPES.ERROR ? "destructive" : "default"
            }
            className="mb-4"
          >
            <AlertTitle>
              {uiState.status === STATUS_TYPES.ERROR ? "Error" : "Success"}
            </AlertTitle>
            <AlertDescription>{uiState.message}</AlertDescription>
          </Alert>
        )}

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid w-auto grid-cols-2">
              <TabsTrigger value="details" className="px-6 sm:px-8">
                <Settings className="w-4 h-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="items" className="px-6 sm:px-8">
                <ShoppingBasket className="w-4 h-4 mr-2" />
                Items
                <Badge variant="secondary" className="ml-2 bg-muted">
                  {formData.items.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
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
                        <span className="whitespace-nowrap">Save Changes</span>
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
                            document
                              .getElementById("counterForm")
                              ?.dispatchEvent(
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
          </div>

          {/* Counter Details Tab */}
          <TabsContent value="details" className="mt-0">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <form
                  id="counterForm"
                  onSubmit={handleUpdate}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-base font-medium">
                        Counter Name<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleTextChange}
                        className="mt-2"
                        placeholder="Main Counter"
                        readOnly={!isEditMode}
                        disabled={!isEditMode}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="location"
                        className="text-base font-medium"
                      >
                        Location
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleTextChange}
                        className="mt-2"
                        placeholder="Front Entrance"
                        readOnly={!isEditMode}
                        disabled={!isEditMode}
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="description"
                      className="text-base font-medium"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleTextChange}
                      className="mt-2 min-h-[120px] resize-none"
                      placeholder="Main selling point at the entrance"
                      readOnly={!isEditMode}
                      disabled={!isEditMode}
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-base font-medium">
                      Status
                    </Label>
                    {isEditMode ? (
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleFieldChange("status", value)
                        }
                        disabled={!isEditMode}
                      >
                        <SelectTrigger className="mt-2 w-full md:w-1/3">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="mt-2">
                        <Badge
                          variant={
                            formData.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className="text-sm py-1 px-3"
                        >
                          {formData.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Items Selection Tab */}
          <TabsContent value="items" className="mt-0">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle className="text-lg sm:text-xl">
                    {isEditMode ? "Select Items for Counter" : "Assigned Items"}
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
                        menuItems.every((item) =>
                          formData.items.includes(item.id)
                        )
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                      <div className="text-sm font-medium bg-muted rounded-full px-3 py-1">
                        Selected: {formData.items.length}
                      </div>
                    </div>
                  )}
                </div>

                {/* Search and filter bar - only show in edit mode */}
                {isEditMode && (
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search items..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      {search && (
                        <button
                          type="button"
                          aria-label="Clear search"
                          onClick={() => setSearch("")}
                          className="absolute right-2.5 top-2.5"
                        >
                          <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </button>
                      )}
                    </div>
                    <Select
                      value={selectedCategoryFilter}
                      onValueChange={setSelectedCategoryFilter}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {uniqueCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(search || selectedCategoryFilter !== "all") && (
                      <Button
                        variant="ghost"
                        className="px-3 sm:w-auto h-10"
                        onClick={clearFilters}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-360px)]">
                  {isEditMode ? (
                    // Edit mode with search and filter
                    Object.entries(filteredItemsByCategory).length > 0 ? (
                      <div className="p-4 space-y-6">
                        {Object.entries(filteredItemsByCategory).map(
                          ([category, items]) => (
                            <div key={category} className="mb-6">
                              <h3 className="text-base font-bold mb-3 capitalize border-b pb-2 flex items-center">
                                {category}
                                <Badge variant="outline" className="ml-2">
                                  {items.length}
                                </Badge>
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {items.map((item) => (
                                  <div
                                    key={item.id}
                                    className={`p-3 border rounded-lg cursor-pointer hover:bg-accent/20 transition-all duration-200 ${
                                      formData.items.includes(item.id)
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-border"
                                    }`}
                                    onClick={() => handleItemToggle(item.id)}
                                  >
                                    <div className="flex items-center gap-3">
                                      <Checkbox
                                        id={`item-${item.id}`}
                                        checked={formData.items.includes(
                                          item.id
                                        )}
                                        onCheckedChange={() =>
                                          handleItemToggle(item.id)
                                        }
                                        className="flex-shrink-0"
                                      />
                                      {item.image ? (
                                        <div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0 relative">
                                          <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            sizes="56px"
                                            className="object-cover"
                                          />
                                        </div>
                                      ) : (
                                        <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                                          <span className="text-muted-foreground text-xs">
                                            No image
                                          </span>
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                          <span className="font-medium text-sm truncate">
                                            {item.name}
                                          </span>
                                          <span className="text-sm text-primary font-medium">
                                            ${item.price}
                                          </span>
                                        </div>
                                        {item.description && (
                                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                            {item.description}
                                          </p>
                                        )}
                                        <div className="flex items-center justify-between mt-1">
                                          <span className="text-xs text-muted-foreground">
                                            {Math.round(
                                              item.preparation_time || 0
                                            )}
                                            min prep
                                          </span>
                                          <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                                              item.is_active === false
                                                ? "bg-muted text-muted-foreground"
                                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
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
                    ) : (
                      <div className="p-12 text-center">
                        <p className="text-muted-foreground mb-2">
                          No items match your search
                        </p>
                        <Button variant="outline" onClick={clearFilters}>
                          Clear Filters
                        </Button>
                      </div>
                    )
                  ) : // View mode - show assigned items with improved cards
                  formData.items.length === 0 ? (
                    <div className="p-12 text-center">
                      <p className="text-muted-foreground mb-2">
                        No items assigned to this counter
                      </p>
                      {!isEditMode && (
                        <Button
                          onClick={() => {
                            setIsEditMode(true);
                            setActiveTab("items");
                          }}
                        >
                          Assign Items
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                      {formData.items.map((itemId) => {
                        const item = menuItems.find((i) => i.id === itemId);
                        if (!item) return null;
                        return (
                          <div
                            key={item.id}
                            className="p-4 border rounded-lg hover:bg-accent/10 transition-colors shadow-sm"
                          >
                            <div className="flex items-start gap-4">
                              {item.image ? (
                                <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 relative">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                                  <span className="text-muted-foreground text-xs">
                                    No image
                                  </span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className="font-medium text-base truncate pr-2">
                                    {item.name}
                                  </h4>
                                  <span className="text-sm font-medium text-primary whitespace-nowrap">
                                    ${item.price}
                                  </span>
                                </div>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                    {item.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <Badge
                                    variant="outline"
                                    className="bg-background"
                                  >
                                    {item.category_name}
                                  </Badge>
                                  {item.preparation_time && (
                                    <Badge
                                      variant="outline"
                                      className="bg-background"
                                    >
                                      {Math.round(item.preparation_time)} min
                                      prep
                                    </Badge>
                                  )}
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                                      item.is_active === false
                                        ? "bg-muted text-muted-foreground"
                                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
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
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
