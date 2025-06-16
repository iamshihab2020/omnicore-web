"use client";

import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Loader2, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Item data interface
 */
export interface Item {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  categoryName?: string;
  image?: string;
  is_active?: boolean;
}

/**
 * Response with counts and data interface
 */
export interface ItemResponseWithCounts {
  data: Item[];
  counts?: {
    total: number;
    active: number;
    inactive: number;
  };
}

interface ItemListProps {
  items: Item[] | ItemResponseWithCounts | null;
  isLoading: boolean;
  error: string | null;
  title?: string;
  onItemClick?: (item: Item) => void;
  highlightId?: number;
  showCounts?: boolean;
  initialView?: "grid" | "list"; // Default view option
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  isLoading,
  error,
  title = "Menu Items",
  onItemClick,
  highlightId,
  showCounts = false,
  initialView = "grid", // Default to grid view
}) => {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">(initialView);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Handle different response formats
  let itemData: Item[] = [];
  let counts = null;

  if (items) {
    if (Array.isArray(items)) {
      itemData = items;
    } else if (items.data && Array.isArray(items.data)) {
      itemData = items.data;
      counts = items.counts;
    }
  }

  if (itemData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No items found.
      </div>
    );
  }

  // Calculate counts if they weren't provided
  const activeCounts = counts?.active || itemData.filter(item => item.is_active !== false).length;
  const inactiveCounts = counts?.inactive || itemData.filter(item => item.is_active === false).length;

  return (
    <div className="flex-grow flex flex-col space-y-4">
      <div className="flex justify-between items-center mb-4">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}

        <div className="flex items-center gap-2">
          {showCounts && (
            <div className="hidden md:flex items-center gap-3 text-sm mr-2">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-muted-foreground">
                  Active: {activeCounts}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                <span className="text-muted-foreground">
                  Inactive: {inactiveCounts}
                </span>
              </div>
            </div>
          )}

          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-none px-3 h-8",
                viewMode === "grid" && "bg-muted"
              )}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-none px-3 h-8",
                viewMode === "list" && "bg-muted"
              )}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {viewMode === "list" ? (
        // List view (matching table-list style)
        <div className="space-y-2">
          {itemData.map((item) => {
            const isHighlighted = item.id === highlightId;
            const ItemComponent = (
              <div
                className={`p-4 border rounded-md cursor-pointer hover:bg-accent transition-colors ${
                  isHighlighted
                    ? "border-primary bg-accent/50"
                    : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex items-center gap-3">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="rounded-md object-cover h-12 w-12"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-[10px]">
                          No image
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        
                        {item.categoryName && (
                          <span>Category: {item.categoryName}</span>
                        )}
                        {item.description && (
                          <span className="line-clamp-1 hidden md:inline">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-primary">
                      {formatPrice(item.price)}
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        item.is_active === false
                          ? "bg-muted text-muted-foreground"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {item.is_active === false ? "Inactive" : "Active"}
                    </span>
                  </div>
                </div>
              </div>
            );

            return onItemClick ? (
              <div key={item.id} onClick={() => onItemClick(item)}>
                {ItemComponent}
              </div>
            ) : (
              <Link key={item.id} href={`/create/item/${item.id}`} passHref>
                {ItemComponent}
              </Link>
            );
          })}
        </div>
      ) : (
        // Grid view (updated to match table-list style more consistently)
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {itemData.map((item) => {
            const isHighlighted = item.id === highlightId;
            const ItemCard = (
              <Card
                className={`p-4 cursor-pointer hover:bg-accent transition-colors h-full ${
                  isHighlighted
                    ? "border-primary border-2"
                    : "border"
                }`}
              >
                <div className="flex flex-col h-full">
                  {item.image ? (
                    <div className="mb-3 text-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover mx-auto h-[80px] w-[80px]"
                      />
                    </div>
                  ) : (
                    <div className="mb-3 text-center bg-muted rounded-md h-[80px] w-[80px] mx-auto flex items-center justify-center">
                      <span className="text-muted-foreground text-xs">No image</span>
                    </div>
                  )}
                  <div className="flex-grow">
                    <h3 className="font-medium text-sm text-center line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          item.is_active === false
                            ? "bg-muted text-muted-foreground"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {item.is_active === false ? "Inactive" : "Active"}
                      </span>
                      {item.categoryName && (
                        <span className="text-xs text-muted-foreground">
                          {item.categoryName}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-primary mt-2 text-center">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                </div>
              </Card>
            );

            return onItemClick ? (
              <div key={item.id} onClick={() => onItemClick(item)}>
                {ItemCard}
              </div>
            ) : (
              <Link
                key={item.id}
                href={`/create/item/${item.id}`}
                passHref
                className="h-full"
              >
                {ItemCard}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
