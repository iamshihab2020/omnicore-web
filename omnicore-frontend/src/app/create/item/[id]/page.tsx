"use client";

import { AppLayout } from "@/components/app/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { ItemList, Item } from "@/components/item/item-list";
import { Category } from "@/components/category/category-list";
import { PageHeader } from "@/components/ui/page-header";
import { ChevronLeft, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id ? parseInt(params.id as string, 10) : null;

  // Form state
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);

  // UI state
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info" | null;
    text: string;
  }>({
    type: null,
    text: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Items list state
  const [itemsList, setItemsList] = useState<Item[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(true);
  const [fetchItemsError, setFetchItemsError] = useState<string | null>(null);

  // Categories state for dropdown
  const [categories, setCategories] = useState<Category[]>([]);
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
      setCategories(data);
    } catch (error) {
      if (error instanceof Error) {
        setFetchCategoriesError(error.message);
      } else {
        setFetchCategoriesError(
          "An unknown error occurred while fetching categories."
        );
      }
      setCategories([]); // Clear list on error
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const fetchItems = useCallback(async () => {
    setIsLoadingItems(true);
    setFetchItemsError(null);
    try {
      const res = await fetch("/api/save-item");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({
          message: `Failed to fetch items: ${res.statusText}`,
        }));
        throw new Error(
          errorData.message || `Failed to fetch items: ${res.statusText}`
        );
      }
      const data: Item[] = await res.json();
      setItemsList(data);

      // Find the current item and set the form data
      if (itemId !== null) {
        const itemRes = await fetch(`/api/edit-item/${itemId}`);
        if (!itemRes.ok) {
          const errorData = await itemRes.json().catch(() => ({
            message: `Failed to fetch item: ${itemRes.statusText}`,
          }));
          throw new Error(
            errorData.message || `Failed to fetch item: ${itemRes.statusText}`
          );
        }
        const currentItem: Item = await itemRes.json();
        if (currentItem) {
          setItemName(currentItem.name);
          setItemDescription(currentItem.description || "");
          setItemPrice(currentItem.price.toString());
          setSelectedCategoryId(currentItem.categoryId);
          if (currentItem.image) {
            setItemImage(currentItem.image);
          }
        } else {
          setMessage({
            type: "error",
            text: `Item with ID ${itemId} not found.`,
          });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setFetchItemsError(error.message);
        setMessage({ type: "error", text: error.message });
      } else {
        const errorMsg = "An unknown error occurred while fetching items.";
        setFetchItemsError(errorMsg);
        setMessage({ type: "error", text: errorMsg });
      }
      setItemsList([]); // Clear list on error
    } finally {
      setIsLoadingItems(false);
      setIsLoading(false); // Main loading state is also done
    }
  }, [itemId]);

  useEffect(() => {
    if (itemId === null) {
      setMessage({ type: "error", text: "Item ID is missing." });
      setIsLoading(false);
      return;
    }

    fetchCategories();
    fetchItems();
  }, [itemId, fetchItems]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedImageFile(file);
      // Create a preview URL
      const imageUrl = URL.createObjectURL(file);
      setItemImage(imageUrl);
    }
  };
  const clearImage = () => {
    setItemImage(null);
    setUploadedImageFile(null);
    // Reset the input field
    const inputElement = document.getElementById(
      "itemImageEdit"
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const validatePrice = (value: string) => {
    if (value === "") return true;
    const regex = /^\d+(\.\d{0,2})?$/; // Allow numbers with up to 2 decimal places
    return regex.test(value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validatePrice(value)) {
      setItemPrice(value);
    }
  };

  const handleItemClick = (item: Item) => {
    router.push(`/create/item/${item.id}`);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (itemId === null) return;

    setMessage({ type: null, text: "" });
    setIsUpdating(true);

    // Validate form data
    if (!itemName) {
      setMessage({ type: "error", text: "Item name cannot be empty." });
      setIsUpdating(false);
      return;
    }

    if (!itemPrice || parseFloat(itemPrice) <= 0) {
      setMessage({
        type: "error",
        text: "Please enter a valid price greater than zero.",
      });
      setIsUpdating(false);
      return;
    }

    if (!selectedCategoryId) {
      setMessage({ type: "error", text: "Please select a category." });
      setIsUpdating(false);
      return;
    } // Handle image upload if there's a new image
    let imageUrl = itemImage;

    if (uploadedImageFile) {
      try {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append("file", uploadedImageFile);

        // Upload the image to our API endpoint
        const uploadRes = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json().catch(() => ({
            error: `Failed to upload image: ${uploadRes.statusText}`,
          }));
          throw new Error(
            errorData.error || `Failed to upload image: ${uploadRes.statusText}`
          );
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.imageUrl;
      } catch (error) {
        setMessage({
          type: "error",
          text:
            error instanceof Error ? error.message : "Failed to upload image",
        });
        setIsUpdating(false);
        return;
      }
    }

    const updatedItem = {
      id: itemId,
      name: itemName,
      description: itemDescription,
      price: parseFloat(itemPrice),
      categoryId: selectedCategoryId,
      image: imageUrl || undefined,
    };

    try {
      const res = await fetch(`/api/edit-item/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({
          message: `Failed to update item: ${res.statusText}`,
        }));
        throw new Error(
          errorData.message || `Failed to update item: ${res.statusText}`
        );
      }
      const responseData = await res.json();
      setMessage({
        type: "success",
        text: responseData.message || "Item updated successfully!",
      });

      // Refresh the item list
      fetchItems();
    } catch (error) {
      if (error instanceof Error) {
        setMessage({ type: "error", text: `Error: ${error.message}` });
      } else {
        setMessage({
          type: "error",
          text: "An unknown error occurred while updating.",
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (itemId === null) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setIsDeleting(true);
    setMessage({ type: null, text: "" });

    try {
      const res = await fetch(`/api/delete-item/${itemId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({
          message: `Failed to delete item: ${res.statusText}`,
        }));
        throw new Error(
          errorData.message || `Failed to delete item: ${res.statusText}`
        );
      }
      const responseData = await res.json();
      setMessage({
        type: "success",
        text:
          responseData.message || "Item deleted successfully! Redirecting...",
      });
      router.push("/create/item");
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
          <p>Loading item details...</p>
        </div>
      </AppLayout>
    );
  }

  if (
    itemId === null ||
    (!isLoading && !itemName && !message.text.includes("not found"))
  ) {
    return (
      <AppLayout>
        <div className="p-4">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {message.text ||
                "Could not load item details or item does not exist."}
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
          title="Edit Item"
          description="Modify the details of your item."
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
      <div className="flex flex-1 p-4 gap-6">
        {/* Left Column: Edit Form */}
        <div className="w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>Edit Item: {itemName || `ID: ${itemId}`}</CardTitle>
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
                  <Label htmlFor="itemNameEdit">Item Name</Label>
                  <Input
                    className="mt-2"
                    id="itemNameEdit"
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="itemDescriptionEdit">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="itemDescriptionEdit"
                    className="mt-2"
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="itemPriceEdit">Price ($)</Label>
                  <Input
                    className="mt-2"
                    id="itemPriceEdit"
                    type="text"
                    inputMode="decimal"
                    value={itemPrice}
                    onChange={handlePriceChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="categorySelectEdit">Category</Label>
                  <Select
                    value={selectedCategoryId?.toString() || ""}
                    onValueChange={(value) =>
                      setSelectedCategoryId(Number(value))
                    }
                  >
                    <SelectTrigger
                      id="categorySelectEdit"
                      className="w-full mt-2"
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingCategories ? (
                        <SelectItem value="loading" disabled>
                          Loading categories...
                        </SelectItem>
                      ) : fetchCategoriesError ? (
                        <SelectItem value="error" disabled>
                          Error loading categories
                        </SelectItem>
                      ) : categories.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          No categories available
                        </SelectItem>
                      ) : (
                        categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
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
                        className="flex-1"
                      />
                      {itemImage && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={clearImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>{" "}
                    {itemImage && (
                      <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden">
                        <Image
                          src={itemImage}
                          alt="Item Preview"
                          className="w-full h-full object-cover"
                          width={300}
                          height={160}
                          unoptimized={itemImage.startsWith("blob:")}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" disabled={isDeleting || isUpdating}>
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting || isUpdating}
                  >
                    {isDeleting ? "Deleting..." : "Delete Item"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/create/item")}
                    disabled={isDeleting || isUpdating}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <Separator orientation="vertical" className="h-auto" />

        {/* Right Column: Display All Items */}
        <div className="w-1/2 flex flex-col">
          <ItemList
            items={itemsList}
            isLoading={isLoadingItems}
            error={fetchItemsError}
            title="All Items"
            highlightId={itemId || undefined}
            onItemClick={handleItemClick}
          />
        </div>
      </div>
    </AppLayout>
  );
}
