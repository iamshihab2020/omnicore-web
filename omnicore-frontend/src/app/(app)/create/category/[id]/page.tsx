"use client";

import { AppLayout } from "@/components/app/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { CategoryList, Category } from "@/components/category/category-list";
import { PageHeader } from "@/components/ui/page-header";
import { ChevronLeft, Trash2, Save, Loader2, Pencil } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
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

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id ? (params.id as string) : null;

  // Create a router wrapper compatible with apiRequest
  const routerWrapper = useMemo<RouterWrapper>(
    () => ({
      push: async (url: string) => router.push(url),
    }),
    [router]
  );
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [status, setStatus] = useState<string>("active");
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info" | null;
    text: string;
  }>({
    type: null,
    text: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // For the category list
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [fetchCategoriesError, setFetchCategoriesError] = useState<
    string | null
  >(null);
  const fetchAllCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    setFetchCategoriesError(null);
    try {
      const data = await apiRequest<null, Category[]>(
        "menu/categories/",
        routerWrapper,
        { method: "GET" },
        true
      );

      setCategoriesList(data);

      // Find the current category and set the form data
      if (categoryId !== null) {
        try {
          // Get specific category details
          const categoryDetails = await apiRequest<null, Category>(
            `menu/categories/${categoryId}/`,
            routerWrapper,
            { method: "GET" },
            true
          );

          setCategoryName(categoryDetails.name);
          setCategoryDescription(categoryDetails.description || "");
          setDisplayOrder(categoryDetails.display_order || 1);
          setStatus(categoryDetails.status || "active");
        } catch (fetchError) {
          console.error("Error fetching category details:", fetchError);
          showMessage("error", `Category with ID ${categoryId} not found.`);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (error instanceof Error) {
        setFetchCategoriesError(error.message);
      } else {
        setFetchCategoriesError(
          "An unknown error occurred while fetching categories."
        );
      }
      setCategoriesList([]);
    } finally {
      setIsLoadingCategories(false);
      setIsLoading(false); // Main loading state is also done
    }
  }, [categoryId, routerWrapper]);
  useEffect(() => {
    if (categoryId === null) {
      showMessage("error", "Category ID is missing.");
      setIsLoading(false);
      return;
    }

    fetchAllCategories();
  }, [categoryId, fetchAllCategories]);
  // Show message with auto-close for success messages
  const showMessage = (
    type: "success" | "error" | "info",
    messageText: string
  ) => {
    setMessage({ type, text: messageText });

    // Auto-clear success messages after 3 seconds
    if (type === "success") {
      setTimeout(() => {
        setMessage({ type: null, text: "" });
      }, 3000);
    }
  };

  const handleCategoryClick = (category: Category) => {
    router.push(`/create/category/${category.id}`);
  };
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryId === null) return;
    if (!isEditMode) return; // Don't proceed if not in edit mode

    showMessage("info", ""); // Clear any existing messages

    if (!categoryName) {
      showMessage("error", "Category name cannot be empty.");
      return;
    }
    const updatedCategory = {
      name: categoryName,
      description: categoryDescription,
      display_order: displayOrder,
      status: status,
    };

    try {
      await apiRequest(
        `menu/categories/${categoryId}/`,
        routerWrapper,
        {
          method: "PUT",
          data: updatedCategory,
        },
        true
      );
      showMessage("success", "Category updated successfully!");

      // Turn off edit mode after successful update
      setIsEditMode(false);

      // Refresh the category list
      fetchAllCategories();
    } catch (error) {
      if (error instanceof Error) {
        showMessage("error", `Error: ${error.message}`);
      } else {
        showMessage("error", "An unknown error occurred while updating.");
      }
    }
  };
  const handleDelete = async () => {
    if (categoryId === null) return;

    setIsDeleting(true);
    showMessage("info", ""); // Clear any existing messages

    try {
      await apiRequest(
        `menu/categories/${categoryId}/`,
        routerWrapper,
        { method: "DELETE" },
        true
      );
      showMessage("success", "Category deleted successfully! Redirecting...");
      router.push("/create/category");
    } catch (error) {
      if (error instanceof Error) {
        showMessage("error", `Error: ${error.message}`);
      } else {
        showMessage("error", "An unknown error occurred while deleting.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-4 flex justify-center items-center h-full">
          <p>Loading category details...</p>
        </div>
      </AppLayout>
    );
  }

  if (
    categoryId === null ||
    (!isLoading && !categoryName && !message.text.includes("not found"))
  ) {
    return (
      <AppLayout>
        <div className="p-4">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {message.text ||
                "Could not load category details or category does not exist."}
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => router.push("/create/category")}
            className="mt-4"
          >
            Back to Categories
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4">
        <PageHeader
          title="Edit Category"
          description="Modify the details of your category."
          className="mb-4"
          actions={
            <Button
              variant="outline"
              onClick={() => router.push("/create/category")}
            >
              <ChevronLeft className="" />
              Back
            </Button>
          }
        />
      </div>
      <div className="flex flex-col lg:flex-row flex-1 p-4 gap-6 h-[calc(100vh-110px)]">
        {/* Left Column: Edit Form */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <Card className="flex flex-col h-auto">
            {" "}
            <CardHeader>
              {" "}
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-y-2">
                <div className="text-base sm:text-lg md:text-xl">
                  {isEditMode ? "Edit Category" : "Category Details"}:
                  <span> {categoryName || `ID: ${categoryId}`}</span>
                </div>
                <div className="flex justify-start sm:justify-end gap-x-2 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant={isEditMode ? "outline" : "default"}
                    onClick={() => setIsEditMode(!isEditMode)}
                    disabled={isDeleting || isLoading}
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
                        disabled={isDeleting || isLoading}
                        size="sm"
                        className="h-9 px-3"
                      >
                        {isDeleting ? (
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
                          delete this category from your system.
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
            <CardContent>
              {message.text && (
                <Alert
                  variant={
                    message.type === "error"
                      ? "destructive"
                      : message.type === "success"
                      ? "default"
                      : "default"
                  }
                  className="mb-4"
                >
                  <AlertTitle>{message.type?.toUpperCase()}</AlertTitle>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  {" "}
                  <Label htmlFor="categoryNameEdit">Category Name</Label>{" "}
                  <Input
                    className={`mt-2 ${!isEditMode && "opacity-90"}`}
                    id="categoryNameEdit"
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    disabled={!isEditMode}
                    required
                  />
                </div>
                <div>
                  {" "}
                  <Label htmlFor="categoryDescriptionEdit">
                    Category Description (Optional)
                  </Label>{" "}
                  <Textarea
                    id="categoryDescriptionEdit"
                    className={`mt-2 ${!isEditMode && "opacity-90"}`}
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    disabled={!isEditMode}
                  />
                </div>
                <div>
                  {" "}
                  <Label htmlFor="displayOrderEdit">Display Order</Label>{" "}
                  <Input
                    className={`mt-2 ${!isEditMode && "opacity-90"}`}
                    id="displayOrderEdit"
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e) =>
                      setDisplayOrder(parseInt(e.target.value) || 1)
                    }
                    disabled={!isEditMode}
                    required
                  />
                </div>
                <div>
                  {" "}
                  <Label htmlFor="statusEdit">Status</Label>
                  <Select
                    value={status}
                    onValueChange={setStatus}
                    disabled={!isEditMode}
                  >
                    <SelectTrigger
                      className={`w-full mt-2 ${!isEditMode && "opacity-90"}`}
                      id="statusEdit"
                      aria-label="Category Status"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>{" "}
                {isEditMode && (
                  <div className="flex flex-wrap gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          disabled={isDeleting || isLoading}
                        >
                          {isLoading ? (
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
                            category?
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
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
        <Separator orientation="vertical" className="h-auto hidden lg:block" />
        <Separator className="my-6 lg:hidden" />
        {/* Right Column: Display All Categories */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <Card className="h-auto">
            <CardHeader className="px-4 py-2 sm:px-6 sm:py-3">
              <CardTitle className="text-base sm:text-lg md:text-xl">
                All Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="px-3 sm:px-6 pb-4">
                  <CategoryList
                    categories={categoriesList}
                    isLoading={isLoadingCategories}
                    error={fetchCategoriesError}
                    title=""
                    highlightId={categoryId || undefined}
                    onCategoryClick={handleCategoryClick}
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
