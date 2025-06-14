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
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { ItemList, Item } from "@/components/item/item-list";
import { Category } from "@/components/category/category-list";
import { PageHeader } from "@/components/ui/page-header";
import { ChevronLeft, Loader2, X, Pencil, Trash2, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the interface for a working router wrapper compatible with apiRequest
interface RouterWrapper {
  push: (url: string) => Promise<boolean | void>;
}

// Define interfaces for our data models
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

// Define UI state types as constants
const STATUS_TYPES = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;

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
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null); // UI state  // Edit mode state to control form editing
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

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

  // Lists state
  const [itemsList, setItemsList] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingState, setLoadingState] = useState({
    items: true,
    categories: true,
    currentItem: true,
  }); // Generic form field change handler for text fields
  const handleFieldChange = (
    field: string,
    value: string | boolean | number | null
  ) => {
    // Only update form data if in edit mode
    if (isEditMode) {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
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
      "itemImageEdit"
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
    } finally {
      setLoadingState((prev) => ({ ...prev, items: false }));
    }
  }, [routerWrapper]);

  // Fetch current item data
  const fetchCurrentItem = useCallback(async () => {
    if (!itemId) return;
    setUiState((prev) => ({
      ...prev,
      status: STATUS_TYPES.LOADING,
      message: null,
    }));

    try {
      setLoadingState((prev) => ({ ...prev, currentItem: true }));
      const item = await apiRequest<null, MenuItemData>(
        `menu/items/${itemId}/`,
        routerWrapper,
        { method: "GET" },
        true
      );

      // Populate form with item data
      setFormData({
        name: item.name,
        description: item.description || "",
        price: item.price.toString(),
        cost: item.cost?.toString() || "",
        is_active: item.is_active,
        preparation_time: item.preparation_time?.toString() || "",
        category: item.category,
        image: item.image || null,
      });
      setUiState((prev) => ({
        ...prev,
        status: STATUS_TYPES.SUCCESS,
        message: null,
      }));
    } catch (error) {
      console.error("Error fetching item:", error);
      setUiState({
        status: STATUS_TYPES.ERROR,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load item details",
        isSubmitting: false,
        isDeleting: false,
      });
    } finally {
      setLoadingState((prev) => ({ ...prev, currentItem: false }));
    }
  }, [itemId, routerWrapper]);

  // Load all data when component mounts
  useEffect(() => {
    // Load data in parallel for better performance
    Promise.all([fetchCategories(), fetchItems(), fetchCurrentItem()]);
  }, [fetchCategories, fetchItems, fetchCurrentItem]);

  // Form submission to update item
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

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

      // Submit the update
      await apiRequest(
        `menu/items/${itemId}/`,
        routerWrapper,
        {
          method: "PUT",
          data: submitData,
          headers: {
            "Content-Type": undefined, // Let axios set the correct content type
          },
        },
        true
      );
      showMessage("success", "Item updated successfully");
      setIsEditMode(false); // Exit edit mode after successful update
      fetchItems(); // Refresh items list
    } catch (error) {
      console.error("Update error:", error);
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

  // Handle item deletion
  const handleDelete = async () => {
    if (!itemId) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setUiState((prev) => ({
      ...prev,
      isDeleting: true,
      message: null,
    }));

    try {
      await apiRequest(
        `menu/items/${itemId}/`,
        routerWrapper,
        { method: "DELETE" },
        true
      );

      showMessage("success", "Item deleted successfully! Redirecting...");
      // Redirect after a short delay so user can see the success message
      setTimeout(() => {
        router.push("/create/item");
      }, 1000);
    } catch (error) {
      console.error("Delete error:", error);
      showMessage(
        "error",
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unexpected error occurred"
      );
      setUiState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Handle clicking on an item in the list
  const handleItemClick = (item: Item) => {
    router.push(`/create/item/${item.id}`);
  };
  // Show loading state
  if (loadingState.currentItem || uiState.status === STATUS_TYPES.LOADING) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full p-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-lg">Loading item details...</p>
        </div>
      </AppLayout>
    );
  }
  // Show error state if item doesn't exist or couldn't be loaded
  if (uiState.status === STATUS_TYPES.ERROR || !formData.name) {
    return (
      <AppLayout>
        <div className="p-4">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {uiState.message || "Item could not be found or loaded"}
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/create/item")} className="mt-4">
            Back to Items
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4">
        <PageHeader
          title="Edit Menu Item"
          description="Update the details of your menu item"
          className="mb-4"
          actions={
            <Button
              variant="outline"
              onClick={() => router.push("/create/item")}
            >
              <ChevronLeft className="mr-2" />
              Back to Items
            </Button>
          }
        />
      </div>
      <div className="flex flex-col lg:flex-row flex-1 p-4 gap-6 ">
        {/* Left Column: Edit Form */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <Card className="flex flex-col h-auto">
            <CardHeader>
              
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-y-2">
                <div className="text-base sm:text-lg md:text-xl">
                  {isEditMode ? "Edit Item" : "Item Details"}:
                  <span className="font-normal ml-1 text-sm sm:text-base max-w-[150px] sm:max-w-xs md:max-w-md truncate inline-block">
                    {formData.name}
                  </span>
                </div>
                <div className="flex justify-start sm:justify-end gap-x-2 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant={isEditMode ? "outline" : "default"}
                    onClick={() => setIsEditMode(!isEditMode)}
                    disabled={uiState.isSubmitting || uiState.isDeleting}
                    size="sm"
                    className="h-9 px-3"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    {isEditMode ? "Cancel" : "Edit"}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        type="button"
                        disabled={uiState.isSubmitting || uiState.isDeleting}
                      >
                        {uiState.isDeleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete this menu item from your system.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Display message alert */}
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

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="itemNameEdit">Item Name</Label>
                  <Input
                    className={`mt-2 ${!isEditMode && "opacity-90"}`}
                    id="itemNameEdit"
                    type="text"
                    value={formData.name}
                    onChange={handleTextChange}
                    disabled={!isEditMode}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="itemDescriptionEdit">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="itemDescriptionEdit"
                    className={`mt-2 ${!isEditMode && "opacity-90"}`}
                    value={formData.description}
                    onChange={handleTextChange}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="itemPriceEdit">Price ($)</Label>
                    <Input
                      className={`mt-2 ${!isEditMode && "opacity-90"}`}
                      id="itemPriceEdit"
                      type="text"
                      inputMode="decimal"
                      value={formData.price}
                      onChange={handleNumericInput}
                      placeholder="0.00"
                      required
                      disabled={!isEditMode}
                    />
                  </div>

                  <div>
                    <Label htmlFor="itemCostEdit">Cost ($)</Label>
                    <Input
                      className={`mt-2 ${!isEditMode && "opacity-90"}`}
                      id="itemCostEdit"
                      type="text"
                      inputMode="decimal"
                      value={formData.cost}
                      onChange={handleNumericInput}
                      placeholder="0.00"
                      disabled={!isEditMode}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preparation_timeEdit">
                      Preparation Time (mins)
                    </Label>
                    <Input
                      className={`mt-2 ${!isEditMode && "opacity-90"}`}
                      id="preparation_timeEdit"
                      type="text"
                      inputMode="numeric"
                      value={formData.preparation_time}
                      onChange={handlePrepTimeInput}
                      placeholder="e.g., 30"
                      disabled={!isEditMode}
                    />
                  </div>

                  <div className="flex flex-col justify-end mb-2">
                    <div className="flex items-center gap-2">
                      
                      <Switch
                        id="is_activeEdit"
                        checked={formData.is_active}
                        onCheckedChange={(checked) =>
                          handleFieldChange("is_active", checked)
                        }
                        disabled={!isEditMode}
                      />
                      <Label htmlFor="is_activeEdit" className="cursor-pointer">
                        {formData.is_active ? "Active" : "Inactive"}
                      </Label>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="categoryEdit">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleFieldChange("category", value)
                    }
                    disabled={!isEditMode}
                  >
                    <SelectTrigger
                      id="categoryEdit"
                      className={`w-full mt-2 ${!isEditMode && "opacity-90"}`}
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
                  <Label htmlFor="itemImageEdit">Item Image (Optional)</Label>
                  <div className="mt-2 flex flex-col space-y-4">
                    <div className="flex items-center gap-2">
                      
                      <Input
                        id="itemImageEdit"
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className={`flex-1 ${!isEditMode && "opacity-90"}`}
                        disabled={!isEditMode}
                      />
                      {formData.image && isEditMode && (
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
                  {isEditMode && (
                    <>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            disabled={
                              uiState.isSubmitting || uiState.isDeleting
                            }
                          >
                            {uiState.isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Save Changes</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to save these changes to the
                              menu item?
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
                  <Button
                    variant="outline"
                    onClick={() => router.push("/create/item")}
                    type="button"
                    disabled={uiState.isSubmitting || uiState.isDeleting}
                  >
                    Back to Items
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        <Separator orientation="vertical" className="h-auto hidden lg:block" />
        <Separator className="my-6 lg:hidden" />
        {/* Right Column: Display All Items */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <Card className="h-auto">
            <CardHeader className="px-4 py-2 sm:px-6 sm:py-3">
              <CardTitle className="text-base sm:text-lg md:text-xl">
                All Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="px-3 sm:px-6 pb-4">
                  <ItemList
                    items={itemsList}
                    isLoading={loadingState.items}
                    error={null}
                    title=""
                    highlightId={itemId ? Number(itemId) : undefined}
                    onItemClick={handleItemClick}
                  />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
