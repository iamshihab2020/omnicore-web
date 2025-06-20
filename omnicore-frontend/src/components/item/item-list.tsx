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
  image?: string;
}

interface ItemListProps {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  title?: string;
  onItemClick?: (item: Item) => void;
  highlightId?: number;
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
    <Card className="flex-grow flex flex-col gap-y-3 ">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        {isLoading && <p className="text-center">Loading items...</p>}
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertTitle>Error Fetching Items</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && items.length === 0 && (
          <p className="text-center4">No items added yet.</p>
        )}
        {!isLoading && !error && items.length > 0 && (
          <div className="h-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-3 pr-2">
              {items
                .slice()
                .reverse()
                .map((item) => {
                  const isHighlighted = item.id === highlightId;
                  return onItemClick ? (
                    <Card
                      key={item.id}
                      className={`p-3 cursor-pointer transition-colors duration-300 ${
                        isHighlighted
                          ? "border-primary border-2"
                          : "hover:bg-primary/10"
                      }`}
                      onClick={() => onItemClick(item)}
                    >
                      <div className="flex flex-col h-full">
                        {item.image && (
                          <div className="mb-3 text-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="rounded-md object-cover mx-auto"
                            />
                          </div>
                        )}
                        <div className="flex-grow">
                          <h3 className="font-semibold text-sm text-center">
                            {item.name}
                          </h3>
                          {item.categoryName && (
                            <div className="text-xs text-muted-foreground text-center">
                              Category: {item.categoryName}
                            </div>
                          )}
                          <div className="text-sm font-medium text-primary mt-1 text-center">
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
                      className="h-full"
                    >
                      <Card
                        className={`p-3 cursor-pointer transition-colors duration-300  ${
                          isHighlighted
                            ? "border-primary border-2"
                            : "hover:bg-primary/10"
                        }`}
                      >
                        <div className="flex flex-col h-full">
                          {item.image && (
                            <div className="mb-3  text-center">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="rounded-md object-contain mx-auto"
                              />
                            </div>
                          )}
                          <div className="flex-grow">
                            <h3 className="font-semibold text-sm text-center">
                              {item.name}
                            </h3>
                            {item.categoryName && (
                              <div className="text-xs text-muted-foreground text-center">
                                Category: {item.categoryName}
                              </div>
                            )}
                            <div className="text-sm font-medium text-primary mt-1 text-center">
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
