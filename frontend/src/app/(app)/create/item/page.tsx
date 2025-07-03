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
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ItemList, Item } from "@/components/item/item-list";
import { Category } from "@/components/category/category-list";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Loader2, X, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Switch } from "@/components/ui/switch";
import React, { useState, useEffect, useCallback, useMemo } from "react";

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

// Define interfaces for our data models
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  cost?: number;
  is_active: boolean;
  preparation_time?: number;
  category: string;
  image?: string;
}

export default function CreateItemPage() {
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
    price: string;
    cost: string;
    is_active: boolean;
    preparation_time: string;
    category: string;
    image: string | null;
  }>({
    name: "",
    description: "",
    price: "",
    cost: "",
    is_active: true,
    preparation_time: "",
    category: "",
    image: null,
  });

  // Uploaded image file reference
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);

  // UI state
  const [uiState, setUiState] = useState<{
    status: (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];
    message: string | null;
    isSubmitting: boolean;
  }>({
    status: STATUS_TYPES.LOADING,
    message: null,
    isSubmitting: false,
  });

  // Lists state
  const [itemsList, setItemsList] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingState, setLoadingState] = useState({
    items: true,
    categories: true,
  });
  // Generic form field change handler for text fields
  const handleFieldChange = (
    field: string,
    value: string | boolean | number | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle text input changes (name, description)
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    // Clean field name (remove Edit suffix and item prefix)
    const fieldName = id
      .replace(/Edit$/, "")
      .replace(/^item/, "")
      .toLowerCase();
    handleFieldChange(fieldName, value);
  };

  // Handle numeric input with validation (price, cost)
  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const fieldName = id
      .replace(/Edit$/, "")
      .replace(/^item/, "")
      .toLowerCase();

    // Validate decimal input (allow empty or numbers with up to 2 decimal places)
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      handleFieldChange(fieldName, value);
    }
  };

  // Handle preparation time input (integers only)
  const handlePrepTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow positive integers
    if (value === "" || /^\d+$/.test(value)) {
      handleFieldChange("preparation_time", value);
    }
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedImageFile(file);

      // Create preview URL for image
      const imageUrl = URL.createObjectURL(file);
      handleFieldChange("image", imageUrl);
    }
  };

  // Clear uploaded image
  const clearImage = () => {
    handleFieldChange("image", null);
    setUploadedImageFile(null);

    // Reset file input
    const inputElement = document.getElementById(
      "itemImage"
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
  };

  // Show message (success or error)
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
  // Fetch data functions - can be executed in parallel

  // Fetch categories for dropdown
  const fetchCategories = useCallback(async () => {
    try {
      setLoadingState((prev) => ({ ...prev, categories: true }));
      const data = await apiRequest<null, Category[]>(
        "menu/categories/",
        routerWrapper,
        { method: "GET" },
        true
      );
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      showMessage(
        "error",
        error instanceof Error
          ? `Error loading categories: ${error.message}`
          : "An unknown error occurred while loading categories."
      );
    } finally {
      setLoadingState((prev) => ({ ...prev, categories: false }));
    }
  }, [routerWrapper]);

  // Fetch all items for the list
  const fetchItems = useCallback(async () => {
    try {
      setLoadingState((prev) => ({ ...prev, items: true }));
      const data = await apiRequest<null, Item[]>(
        "menu/items/",
        routerWrapper,
        { method: "GET" },
        true
      );
      setItemsList(data);
    } catch (error) {
      console.error("Error loading items:", error);
      showMessage(
        "error",
        error instanceof Error
          ? `Error loading items: ${error.message}`
          : "An unknown error occurred while loading items."
      );
    } finally {
      setLoadingState((prev) => ({ ...prev, items: false }));
    }
  }, [routerWrapper]);

  // Initialize form and data when component mounts
  useEffect(() => {
    // Reset UI state to initial state
    setUiState((prev) => ({
      ...prev,
      status: STATUS_TYPES.SUCCESS,
      message: null,
    }));

    // Load data in parallel for better performance
    Promise.all([fetchCategories(), fetchItems()]);
  }, [fetchCategories, fetchItems]);
  // Handle form submission to create item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset any previous messages
    setUiState((prev) => ({ ...prev, message: null }));

    // Form validation
    if (!formData.name.trim()) {
      showMessage("error", "Item name is required");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      showMessage("error", "Please enter a valid price greater than zero");
      return;
    }

    if (!formData.category) {
      showMessage("error", "Please select a category");
      return;
    }

    setUiState((prev) => ({
      ...prev,
      isSubmitting: true,
      message: null,
    }));

    try {
      // Create FormData for multipart/form-data submission (needed for file upload)
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("is_active", formData.is_active.toString());
      submitData.append("category", formData.category);

      // Add optional fields if they have valid values
      if (formData.cost && parseFloat(formData.cost) >= 0) {
        submitData.append("cost", formData.cost);
      }

      if (
        formData.preparation_time &&
        parseInt(formData.preparation_time) >= 0
      ) {
        submitData.append("preparation_time", formData.preparation_time);
      }

      // Append image file if selected
      if (uploadedImageFile) {
        submitData.append("image", uploadedImageFile);
      }

      // Submit the create request
      await apiRequest(
        "menu/items/",
        routerWrapper,
        {
          method: "POST",
          data: submitData,
          headers: {
            "Content-Type": undefined, // Let axios set the correct content type
          },
        },
        true
      );

      showMessage("success", "Item created successfully!");

      // Reset form after successful creation
      setFormData({
        name: "",
        description: "",
        price: "",
        cost: "",
        is_active: true,
        preparation_time: "",
        category: "",
        image: null,
      });

      setUploadedImageFile(null);

      // Reset file input if it exists
      const inputElement = document.getElementById(
        "itemImage"
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = "";
      }

      // Refresh items list
      fetchItems();
    } catch (error) {
      console.error("Create error:", error);
      showMessage(
        "error",
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unexpected error occurred"
      );
    } finally {
      setUiState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  // Handle clicking on an item in the list
  const handleItemClick = (item: Item) => {
    router.push(`/create/item/${item.id}`);
  };
  return (
    <AppLayout>
      <div className="px-4">
        <Breadcrumb
          items={[{ label: "Create", href: "/create" }, { label: "Items" }]}
          className="mb-4"
        />

        <AnimatedCard variant="fadeIn" duration={0.4}>
          <PageHeader
            title="Create Menu Item"
            description="Add new items to your menu."
            className="mb-4"
            actions={
              <Button variant="outline" onClick={() => router.push("/create")}>
                <ChevronLeft className="mr-2" />
                Back to Create
              </Button>
            }
          />
        </AnimatedCard>
      </div>
      <div className="flex flex-col lg:flex-row flex-1 p-4 gap-6">
        {/* Left Column: Create Item Form */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <AnimatedCard variant="slideUp" delay={0.1} duration={0.4}>
            <Card className="flex flex-col h-auto">
              <CardHeader>
                <CardTitle>Create Menu Item</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                {/* Display message alert */}
                {uiState.message && (
                  <AnimatedCard variant="fadeIn" duration={0.3}>
                    <Alert
                      variant={
                        String(uiState.status) === "error"
                          ? "destructive"
                          : "default"
                      }
                      className="mb-4"
                    >
                      <AlertTitle>
                        {String(uiState.status) === "error"
                          ? "ERROR"
                          : "SUCCESS"}
                      </AlertTitle>
                      <AlertDescription>{uiState.message}</AlertDescription>
                    </Alert>
                  </AnimatedCard>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="itemName">Item Name</Label>
                    <Input
                      className="mt-2"
                      id="itemName"
                      type="text"
                      value={formData.name}
                      onChange={handleTextChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="itemDescription">
                      Description (Optional)
                    </Label>
                    <Textarea
                      className="mt-2"
                      id="itemDescription"
                      value={formData.description}
                      onChange={handleTextChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="itemPrice">Price ($)</Label>
                      <Input
                        className="mt-2"
                        id="itemPrice"
                        type="text"
                        inputMode="decimal"
                        value={formData.price}
                        onChange={handleNumericInput}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="itemCost">Cost ($) (Optional)</Label>
                      <Input
                        className="mt-2"
                        id="itemCost"
                        type="text"
                        inputMode="decimal"
                        value={formData.cost}
                        onChange={handleNumericInput}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prepTime">
                        Preparation Time (minutes)
                      </Label>
                      <Input
                        className="mt-2"
                        id="prepTime"
                        type="text"
                        inputMode="numeric"
                        value={formData.preparation_time}
                        onChange={handlePrepTimeInput}
                        placeholder="10"
                      />
                    </div>
                    <div className="flex flex-col justify-end mb-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          id="isActive"
                          checked={formData.is_active}
                          onCheckedChange={(checked) =>
                            handleFieldChange("is_active", checked)
                          }
                        />
                        <Label htmlFor="isActive" className="cursor-pointer">
                          {formData.is_active ? "Active" : "Inactive"}
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="categorySelect">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleFieldChange("category", value)
                      }
                    >
                      <SelectTrigger
                        id="categorySelect"
                        className="w-full mt-2"
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingState.categories ? (
                          <SelectItem value="loading" disabled>
                            Loading categories...
                          </SelectItem>
                        ) : categories.length === 0 ? (
                          <SelectItem value="empty" disabled>
                            No categories available
                          </SelectItem>
                        ) : (
                          categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="itemImage">Item Image (Optional)</Label>
                    <div className="mt-2 flex flex-col space-y-4">
                      <div className="flex items-center gap-2">
                        <Input
                          id="itemImage"
                          type="file"
                          onChange={handleImageChange}
                          accept="image/*"
                          className="flex-1"
                        />
                        {formData.image && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={clearImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {formData.image && (
                        <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden">
                          <Image
                            src={formData.image}
                            alt="Item Preview"
                            className="w-full h-full object-cover"
                            width={300}
                            height={160}
                            unoptimized={formData.image.startsWith("blob:")}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button type="button" disabled={uiState.isSubmitting}>
                          {uiState.isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Create Item
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Create New Item</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to create this new menu item?
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
                    <Button
                      variant="outline"
                      onClick={() => router.push("/create")}
                      type="button"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </AnimatedCard>
          {uiState.message &&
            (function () {
              // Create a temporary string to avoid type comparison issues
              const currentStatus = String(uiState.status);
              const isError = currentStatus === "error";

              return (
                <Alert
                  variant={isError ? "destructive" : "default"}
                  className="mb-4"
                >
                  <AlertTitle>{isError ? "ERROR" : "SUCCESS"}</AlertTitle>
                  <AlertDescription>{uiState.message}</AlertDescription>
                </Alert>
              );
            })()}
        </div>
        <Separator orientation="vertical" className="h-auto hidden lg:block" />
        <Separator className="my-6 lg:hidden" />
        {/* Right Column: Display All Items */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <AnimatedCard variant="slideUp" delay={0.2} duration={0.4}>
            <Card className="h-auto">
              <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
                <CardTitle className="text-lg sm:text-xl">All Items</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-290px)]">
                  <div className="px-3 sm:px-6 pb-4">
                    <ItemList
                      items={itemsList}
                      isLoading={loadingState.items}
                      error={null}
                      title=""
                      onItemClick={handleItemClick}
                    />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>
      </div>
    </AppLayout>
  );
}
