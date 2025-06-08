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
import { X } from "lucide-react";

export default function CreateItemPage() {
  // Form state
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);

  // Feedback message
  const [message, setMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({
    type: null,
    text: "",
  });

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

  const fetchItems = async () => {
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
    } catch (error) {
      if (error instanceof Error) {
        setFetchItemsError(error.message);
      } else {
        setFetchItemsError("An unknown error occurred while fetching items.");
      }
      setItemsList([]); // Clear list on error
    } finally {
      setIsLoadingItems(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

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
      "itemImage"
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: null, text: "" });

    // Validate form data
    if (!itemName) {
      setMessage({ type: "error", text: "Item name is required." });
      return;
    }

    if (!itemPrice || parseFloat(itemPrice) <= 0) {
      setMessage({
        type: "error",
        text: "Please enter a valid price greater than zero.",
      });
      return;
    }

    if (!selectedCategoryId) {
      setMessage({ type: "error", text: "Please select a category." });
      return;
    }

    // Handle image upload if there's a new image
    let imageUrl = "";
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
        return;
      }
    }

    const newItemPayload = {
      name: itemName,
      description: itemDescription,
      price: parseFloat(itemPrice),
      categoryId: selectedCategoryId,
      image: imageUrl || undefined,
    };

    try {
      const saveRes = await fetch("/api/save-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItemPayload),
      });

      if (!saveRes.ok) {
        let errorText = `Failed to save item: ${saveRes.statusText}`;
        try {
          const errorData = await saveRes.json();
          errorText = errorData.message || errorText;
        } catch (jsonError) {
          console.error(
            "Could not parse error response from /api/save-item",
            jsonError
          );
        }
        throw new Error(errorText);
      }

      const savedItemResponse = await saveRes.json();

      setMessage({
        type: "success",
        text: savedItemResponse.message || "Item created successfully!",
      });

      // Reset form
      setItemName("");
      setItemDescription("");
      setItemPrice("");
      setSelectedCategoryId(null);
      clearImage();

      // Refresh the list
      fetchItems();
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
        {/* Left Column: Create Item Form */}
        <div className="w-1/2 flex flex-col space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Menu Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    className="mt-2"
                    id="itemName"
                    type="text"
                    value={itemName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setItemName(e.target.value)
                    }
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
                    value={itemDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setItemDescription(e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="itemPrice">Price ($)</Label>
                  <Input
                    className="mt-2"
                    id="itemPrice"
                    type="text"
                    inputMode="decimal"
                    value={itemPrice}
                    onChange={handlePriceChange}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="categorySelect">Category</Label>
                  <Select
                    value={selectedCategoryId?.toString() || ""}
                    onValueChange={(value) =>
                      setSelectedCategoryId(Number(value))
                    }
                  >
                    <SelectTrigger id="categorySelect" className="w-full mt-2">
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
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit">Create Item</Button>
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

        {/* Right Column: Display Added Items */}
        <div className="w-1/2 flex flex-col">
          <ItemList
            items={itemsList}
            isLoading={isLoadingItems}
            error={fetchItemsError}
            title="Added Items"
          />
        </div>
      </div>
    </AppLayout>
  );
}
