"use client";

import { AppLayout } from "@/components/app/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CategoryList, Category } from "@/components/category/category-list";
import { PageHeader } from "@/components/ui/page-header";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function CreateCategoryPage() {
  const router = useRouter();
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [status, setStatus] = useState<string>("active");
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

  // Create a router wrapper compatible with apiRequest
  const routerWrapper = useMemo<RouterWrapper>(
    () => ({
      push: async (url: string) => router.push(url),
    }),
    [router]
  );

  const fetchCategories = async () => {
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
    } catch (error) {
      console.error("Error fetching categories:", error);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      display_order: displayOrder,
      status: status,
    };

    try {
      await apiRequest(
        "menu/categories/",
        routerWrapper,
        {
          method: "POST",
          data: newCategoryPayload,
        },
        true
      );

      setMessage({
        type: "success",
        text: "Category created successfully!",
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
      <div className="px-4">
        <PageHeader
          title="Create Category"
          description="Create a new item category to organize your items."
          className="mb-4"
          actions={
            <Button variant="outline" onClick={() => router.push("/create")}>
              <ChevronLeft className="mr-2" />
              Back to Items
            </Button>
          }
        />
      </div>
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
                  </Label>{" "}
                  <Textarea
                    className="mt-2"
                    id="categoryDescription"
                    value={categoryDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setCategoryDescription(e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    className="mt-2"
                    id="displayOrder"
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setDisplayOrder(parseInt(e.target.value) || 1)
                    }
                    required
                  />
                </div>{" "}
                <div>
                  <Label htmlFor="status">Status</Label>{" "}
                  <Select value={status} onValueChange={setStatus}>
                    {" "}
                    <SelectTrigger
                      className="w-full mt-2"
                      id="status"
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
