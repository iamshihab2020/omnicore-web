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
import { ChevronLeft, Save } from "lucide-react";
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

  // Show message with auto-close for success messages
  const showMessage = (type: "success" | "error", messageText: string) => {
    setMessage({ type, text: messageText });

    // Auto-clear success messages after 3 seconds
    if (type === "success") {
      setTimeout(() => {
        setMessage({ type: null, text: "" });
      }, 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: null, text: "" });

    if (!categoryName) {
      showMessage("error", "Category name is required.");
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
      showMessage("success", "Category created successfully!");
      setCategoryName("");
      setCategoryDescription("");
      fetchCategories();
    } catch (error) {
      if (error instanceof Error) {
        showMessage("error", `Error: ${error.message}`);
      } else {
        showMessage("error", "An unknown error occurred.");
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
              <ChevronLeft />
              Back to Create
            </Button>
          }
        />
      </div>
      <div className="flex flex-col lg:flex-row flex-1 p-4 gap-6 h-[calc(100vh-110px)]">
        {/* Left Column: Create Category Form */}
        <div className="w-full lg:w-1/2 flex flex-col space-y-4">
          <Card className="h-auto">
            <CardHeader className="px-4 py-2 sm:px-6 sm:py-3">
              <CardTitle className="text-base sm:text-lg md:text-xl">
                Create Item Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Display message alert */}
              {message.text && (
                <Alert
                  variant={message.type === "error" ? "destructive" : "default"}
                  className="mb-4"
                >
                  <AlertTitle>
                    {message.type === "error" ? "Error" : "Success"}
                  </AlertTitle>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}
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
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button">
                      <Save className="mr-2 h-4 w-4" />
                      Create Category
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Create New Category</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to create this new category?
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
        <Separator orientation="vertical" className="h-auto hidden lg:block" />
        <Separator className="my-6 lg:hidden" />
        {/* Right Column: Display Added Categories */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <Card className="h-auto">
            <CardHeader className="px-4 py-2 sm:px-6 sm:py-3">
              <CardTitle className="text-base sm:text-lg md:text-xl">
                Added Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="px-3 sm:px-6 pb-4">
                  <CategoryList
                    categories={categoriesList}
                    isLoading={isLoadingCategories}
                    error={fetchCategoriesError}
                    title=""
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
