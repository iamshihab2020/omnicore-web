"use client";

import { AppLayout } from "@/components/app/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { CategoryList, Category } from "@/components/category/category-list";
import { PageHeader } from "@/components/ui/page-header";
import { ChevronLeft } from "lucide-react";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id ? parseInt(params.id as string, 10) : null;

  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
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
      const res = await fetch("/api/save-category");
      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({
            message: `Failed to fetch categories: ${res.statusText}`,
          }));
        throw new Error(
          errorData.message || `Failed to fetch categories: ${res.statusText}`
        );
      }
      const data: Category[] = await res.json();
      setCategoriesList(data);

      // Find the current category and set the form data
      if (categoryId !== null) {
        const currentCategory = data.find((cat) => cat.id === categoryId);
        if (currentCategory) {
          setCategoryName(currentCategory.name);
          setCategoryDescription(currentCategory.description || "");
        } else {
          setMessage({
            type: "error",
            text: `Category with ID ${categoryId} not found.`,
          });
        }
      }
    } catch (error) {
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
  }, [categoryId]);

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
      id: categoryId,
      name: categoryName,
      description: categoryDescription,
    };

    try {
      const res = await fetch(`/api/edit-category/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCategory),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({
            message: `Failed to update category: ${res.statusText}`,
          }));
        throw new Error(
          errorData.message || `Failed to update category: ${res.statusText}`
        );
      }
      const responseData = await res.json();
      setMessage({
        type: "success",
        text: responseData.message || "Category updated successfully!",
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
      const res = await fetch(`/api/delete-category/${categoryId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({
            message: `Failed to delete category: ${res.statusText}`,
          }));
        throw new Error(
          errorData.message || `Failed to delete category: ${res.statusText}`
        );
      }
      const responseData = await res.json();
      setMessage({
        type: "success",
        text:
          responseData.message ||
          "Category deleted successfully! Redirecting...",
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
