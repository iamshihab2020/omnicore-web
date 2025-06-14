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
    <Card className="flex-grow flex flex-col gap-y-2">
      <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden px-3 sm:px-6">
        {" "}
        {isLoading && (
          <p className="text-center text-sm sm:text-base py-4">
            Loading items...
          </p>
        )}
        {error && (
          <Alert variant="destructive" className="mx-0 sm:mx-2">
            <AlertTitle>Error Fetching Items</AlertTitle>
            <AlertDescription className="text-xs sm:text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && items.length === 0 && (
          <p className="text-center text-sm sm:text-base py-4">
            No items added yet.
          </p>
        )}
        {!isLoading && !error && items.length > 0 && (
          <div className="h-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5 pr-2 overflow-y-auto max-h-[70vh] pb-2">
              {items
                .slice()
                .map((item) => {
                  const isHighlighted = item.id === highlightId;
                  return onItemClick ? (
                    <Card
                      key={item.id}
                      className={`p-2 sm:p-3 cursor-pointer transition-colors duration-300 h-full ${
                        isHighlighted
                          ? "border-primary border-2"
                          : "hover:bg-primary/10"
                      }`}
                      onClick={() => onItemClick(item)}
                    >
                      <div className="flex flex-col h-full">
                        {item.image && (
                          <div className="mb-2 text-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={70}
                              height={70}
                              className="rounded-md object-cover mx-auto h-[60px] w-[60px] sm:h-[70px] sm:w-[70px]"
                            />
                          </div>
                        )}
                        <div className="flex-grow">
                          <h3 className="font-semibold text-xs sm:text-sm text-center line-clamp-2">
                            {item.name}
                          </h3>
                          {item.categoryName && (
                            <div className="text-[10px] sm:text-xs text-muted-foreground text-center line-clamp-1">
                              {item.categoryName}
                            </div>
                          )}
                          <div className="text-xs sm:text-sm font-medium text-primary mt-1 text-center">
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
                      {" "}
                      <Card
                        className={`p-2 sm:p-3 cursor-pointer transition-colors duration-300 h-full ${
                          isHighlighted
                            ? "border-primary border-2"
                            : "hover:bg-primary/10"
                        }`}
                      >
                        <div className="flex flex-col h-full">
                          {item.image && (
                            <div className="mb-2 text-center">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={70}
                                height={70}
                                className="rounded-md object-contain mx-auto h-[60px] w-[60px] sm:h-[70px] sm:w-[70px]"
                              />
                            </div>
                          )}
                          <div className="flex-grow">
                            <h3 className="font-semibold text-xs sm:text-sm text-center line-clamp-2">
                              {item.name}
                            </h3>
                            {item.categoryName && (
                              <div className="text-[10px] sm:text-xs text-muted-foreground text-center line-clamp-1">
                                {item.categoryName}
                              </div>
                            )}
                            <div className="text-xs sm:text-sm font-medium text-primary mt-1 text-center">
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
