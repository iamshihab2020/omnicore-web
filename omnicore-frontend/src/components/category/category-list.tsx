"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import React from "react";

export interface Category {
  id: string | number;
  name: string;
  description?: string;
  status?: string;
  display_order?: number;
}

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  title?: string;
  onCategoryClick?: (category: Category) => void;
  highlightId?: string | number; // ID of the category to highlight (e.g., currently being edited)
}

export function CategoryList({
  categories,
  isLoading,
  error,
  title = "Added Categories",
  onCategoryClick,
  highlightId,
}: CategoryListProps) {
  return (
    <Card className="flex-grow flex flex-col gap-y-3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        {isLoading && <p className="text-center p-4">Loading categories...</p>}
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertTitle>Error Fetching Categories</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && categories.length === 0 && (
          <p className="text-center p-4">No categories added yet.</p>
        )}
        {!isLoading && !error && categories.length > 0 && (
          <div className="h-full overflow-y-auto p-1">
            <div className="space-y-2 pr-2">
              {categories
                .slice()
                .reverse()
                .map((category) => {
                  const isHighlighted =
                    String(category.id) === String(highlightId);
                  return onCategoryClick ? (
                    // If onCategoryClick is provided, make it clickable but not a link
                    <Card
                      key={category.id}
                      className={`p-3 mb-4 cursor-pointer transition-colors duration-300 ${
                        isHighlighted
                          ? "border-primary border-2"
                          : "hover:bg-primary/10"
                      }`}
                      onClick={() => onCategoryClick(category)}
                    >
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                      {category.description && (
                        <p className="text-xs text-muted-foreground">
                          {category.description}
                        </p>
                      )}
                    </Card>
                  ) : (
                    // Default behavior: make it a link
                    <Link
                      key={category.id}
                      href={`/create/category/${category.id}`}
                      passHref
                      className="mb-4"
                    >
                      <Card
                        className={`p-3 cursor-pointer transition-colors mb-4 duration-300 ${
                          isHighlighted
                            ? "border-primary border-2"
                            : "hover:bg-primary/10"
                        }`}
                      >
                        <h3 className="font-semibold text-sm">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-xs text-muted-foreground">
                            {category.description}
                          </p>
                        )}
                      </Card>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
