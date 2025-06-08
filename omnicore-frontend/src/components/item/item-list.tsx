"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

export interface Item {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  categoryName?: string;
  image?: string; // URL to the image
}

interface ItemListProps {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  title?: string;
  onItemClick?: (item: Item) => void;
  highlightId?: number; // ID of the item to highlight (e.g., currently being edited)
}

export function ItemList({
  items,
  isLoading,
  error,
  title = "Added Items",
  onItemClick,
  highlightId,
}: ItemListProps) {
  return (
    <Card className="flex-grow flex flex-col gap-y-3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        {isLoading && <p className="text-center p-4">Loading items...</p>}
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertTitle>Error Fetching Items</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && items.length === 0 && (
          <p className="text-center p-4">No items added yet.</p>
        )}
        {!isLoading && !error && items.length > 0 && (
          <div className="h-full overflow-y-auto p-1">
            <div className="space-y-2 pr-2">
              {items
                .slice()
                .reverse()
                .map((item) => {
                  const isHighlighted = item.id === highlightId;
                  return onItemClick ? (
                    // If onItemClick is provided, make it clickable but not a link
                    <Card
                      key={item.id}
                      className={`p-3 cursor-pointer transition-colors duration-300 ${
                        isHighlighted
                          ? "border-primary border-2"
                          : "hover:bg-primary/10"
                      }`}
                      onClick={() => onItemClick(item)}
                    >
                      <div className="flex items-start gap-3">
                        {item.image && (
                          <div className="flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={60}
                              height={60}
                              className="rounded-md object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-grow">
                          <h3 className="font-semibold text-sm">{item.name}</h3>
                          {item.categoryName && (
                            <div className="text-xs text-muted-foreground">
                              Category: {item.categoryName}
                            </div>
                          )}
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          )}
                          <div className="text-sm font-medium text-primary mt-1">
                            {formatPrice(item.price)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    // Default behavior: make it a link
                    <Link
                      key={item.id}
                      href={`/create/item/${item.id}`}
                      passHref
                    >
                      <Card
                        className={`p-3 cursor-pointer transition-colors duration-300 ${
                          isHighlighted
                            ? "border-primary border-2"
                            : "hover:bg-primary/10"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {item.image && (
                            <div className="flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={60}
                                height={60}
                                className="rounded-md object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-grow">
                            <h3 className="font-semibold text-sm">
                              {item.name}
                            </h3>
                            {item.categoryName && (
                              <div className="text-xs text-muted-foreground">
                                Category: {item.categoryName}
                              </div>
                            )}
                            {item.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.description}
                              </p>
                            )}
                            <div className="text-sm font-medium text-primary mt-1">
                              {formatPrice(item.price)}
                            </div>
                          </div>
                        </div>
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
