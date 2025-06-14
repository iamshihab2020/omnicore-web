"use client";

import { AppLayout } from "@/components/app/app-layout";
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
import { ChevronLeft } from "lucide-react";
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
          setMessage({
            type: "error",
            text: `Category with ID ${categoryId} not found.`,
          });
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
      setMessage({ type: "error", text: "Category ID is missing." });
      setIsLoading(false);
      return;
    }

    fetchAllCategories();
  }, [categoryId, fetchAllCategories]);
  const handleCategoryClick = (category: Category) => {
    router.push(`/create/category/${category.id}`);
  };
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryId === null) return;

    setMessage({ type: null, text: "" });

    if (!categoryName) {
      setMessage({ type: "error", text: "Category name cannot be empty." });
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

      setMessage({
        type: "success",
        text: "Category updated successfully!",
      });

      // Refresh the category list
      fetchAllCategories();
    } catch (error) {
      if (error instanceof Error) {
        setMessage({ type: "error", text: `Error: ${error.message}` });
      } else {
        setMessage({
          type: "error",
          text: "An unknown error occurred while updating.",
        });
      }
    }
  };
  const handleDelete = async () => {
    if (categoryId === null) return;
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    setIsDeleting(true);
    setMessage({ type: null, text: "" });

    try {
      await apiRequest(
        `menu/categories/${categoryId}/`,
        routerWrapper,
        { method: "DELETE" },
        true
      );

      setMessage({
        type: "success",
        text: "Category deleted successfully! Redirecting...",
      });
      router.push("/create/category");
    } catch (error) {
      if (error instanceof Error) {
        setMessage({ type: "error", text: `Error: ${error.message}` });
      } else {
        setMessage({
          type: "error",
          text: "An unknown error occurred while deleting.",
        });
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
              <ChevronLeft className="mr-2" />
              Back to Items
            </Button>
          }
        />
      </div>
      <div className="flex flex-1 p-4 gap-6">
        {/* Left Column: Edit Form */}
        <div className="w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>
                Edit Category: {categoryName || `ID: ${categoryId}`}
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
                  <Label htmlFor="categoryNameEdit">Category Name</Label>
                  <Input
                    className="mt-2"
                    id="categoryNameEdit"
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="categoryDescriptionEdit">
                    Category Description (Optional)
                  </Label>
                  <Textarea
                    id="categoryDescriptionEdit"
                    className="mt-2"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="displayOrderEdit">Display Order</Label>
                  <Input
                    className="mt-2"
                    id="displayOrderEdit"
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e) =>
                      setDisplayOrder(parseInt(e.target.value) || 1)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="statusEdit">Status</Label>{" "}
                  <Select value={status} onValueChange={setStatus}>
                    {" "}
                    <SelectTrigger
                      className="w-full mt-2"
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
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" disabled={isDeleting || isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting || isLoading}
                  >
                    {isDeleting ? "Deleting..." : "Delete Category"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/create/category")}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <Separator orientation="vertical" className="h-auto" />

        {/* Right Column: Display All Categories */}
        <div className="w-1/2 flex flex-col">
          <CategoryList
            categories={categoriesList}
            isLoading={isLoadingCategories}
            error={fetchCategoriesError}
            title="All Categories"
            highlightId={categoryId || undefined}
            onCategoryClick={handleCategoryClick}
          />
        </div>
      </div>
    </AppLayout>
  );
}
