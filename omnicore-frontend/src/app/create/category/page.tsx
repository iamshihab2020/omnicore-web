"use client";

import { AppLayout } from "@/components/app/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CategoryList, Category } from "@/components/category/category-list"; // Import the new component

export default function CreateCategoryPage() {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({
    type: null,
    text: "",
  });
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [fetchCategoriesError, setFetchCategoriesError] = useState<
    string | null
  >(null);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    setFetchCategoriesError(null);
    try {
      const res = await fetch("/api/save-category");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({
          message: `Failed to fetch categories: ${res.statusText}`,
        }));
        throw new Error(
          errorData.message || `Failed to fetch categories: ${res.statusText}`
        );
      }
      const data: Category[] = await res.json();
      setCategoriesList(data);
    } catch (error) {
      if (error instanceof Error) {
        setFetchCategoriesError(error.message);
      } else {
        setFetchCategoriesError(
          "An unknown error occurred while fetching categories."
        );
      }
      setCategoriesList([]); // Clear list on error
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: null, text: "" });

    if (!categoryName) {
      setMessage({ type: "error", text: "Category name is required." });
      return;
    }

    const newCategoryPayload = {
      name: categoryName,
      description: categoryDescription,
    };

    try {
      const saveRes = await fetch("/api/save-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategoryPayload),
      });

      if (!saveRes.ok) {
        let errorText = `Failed to save category: ${saveRes.statusText}`;
        try {
          const errorData = await saveRes.json();
          errorText = errorData.message || errorText;
        } catch (jsonError) {
          console.error(
            "Could not parse error response from /api/save-category",
            jsonError
          );
        }
        throw new Error(errorText);
      }

      const savedCategoryResponse = await saveRes.json();

      setMessage({
        type: "success",
        text: savedCategoryResponse.message || "Category created successfully!",
      });
      setCategoryName("");
      setCategoryDescription("");
      fetchCategories(); // Refresh the list
    } catch (error) {
      if (error instanceof Error) {
        setMessage({ type: "error", text: `Error: ${error.message}` });
      } else {
        setMessage({ type: "error", text: "An unknown error occurred." });
      }
      console.error(error);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-1 p-4 gap-6">
        {/* Left Column: Create Category Form */}
        <div className="w-1/2 flex flex-col space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Item Category</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    className="mt-2"
                    id="categoryName"
                    type="text"
                    value={categoryName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCategoryName(e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="categoryDescription">
                    Category Description (Optional)
                  </Label>
                  <Textarea
                    className="mt-2"
                    id="categoryDescription"
                    value={categoryDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setCategoryDescription(e.target.value)
                    }
                  />
                </div>
                <Button type="submit">Create Category</Button>
              </form>
            </CardContent>
          </Card>
          {message.text && (
            <Alert
              variant={message.type === "error" ? "destructive" : "default"}
            >
              <AlertTitle>
                {message.type === "error" ? "Error" : "Success"}
              </AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </div>

        <Separator orientation="vertical" className="h-auto" />

        {/* Right Column: Display Added Categories */}
        <div className="w-1/2 flex flex-col">
          <CategoryList
            categories={categoriesList}
            isLoading={isLoadingCategories}
            error={fetchCategoriesError}
            title="Added Categories"
          />
        </div>
      </div>
    </AppLayout>
  );
}
