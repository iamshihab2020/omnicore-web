"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { useSoundEffect } from "./use-sound-effect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Product {
  id: string;
  name: string;
  category: string;
  category_name: string;
  price: number | string; // Accept both number and string for price
  image: string;
  imageUrl?: string; // For backward compatibility
  type?: string; // For grouping
  description?: string;
  preparation_time?: number;
  is_active: boolean;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

// Helper function to format price regardless of whether it's a number or string
const formatPrice = (price: number | string): string => {
  if (typeof price === "number") {
    return price.toFixed(2);
  }
  // Handle string price by parsing it first
  try {
    return parseFloat(String(price)).toFixed(2);
  } catch (e) {
    console.error("Invalid price format:", price, e);
    return "0.00";
  }
};

const fallbackImg = "/omnicore.png";

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  const [fallbacks, setFallbacks] = useState<{ [id: string]: boolean }>({});
  const [clickedProductId, setClickedProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { playAddToCartSound } = useSoundEffect();

  // Extract unique product types/categories and sort them alphabetically
  const productTypes = useMemo(() => {
    const types = Array.from(
      new Set(
        products.map((product) => product.category_name || "Uncategorized")
      )
    );
    return types.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }, [products]);

  // Group products by type for the "All" tab
  const productsByType = useMemo(() => {
    const groupedProducts: { [type: string]: Product[] } = {};

    // Initialize with empty arrays for each type
    productTypes.forEach((type) => {
      groupedProducts[type] = [];
    });

    // Populate the groups
    products.forEach((product) => {
      const type = product.category_name || "Uncategorized";
      if (!groupedProducts[type]) {
        groupedProducts[type] = [];
      }
      groupedProducts[type].push(product);
    });

    return groupedProducts;
  }, [products, productTypes]); // Handle product click with elegant animation
  const handleProductClick = (product: Product) => {
    // If already clicked, don't trigger animation again
    if (clickedProductId === product.id) return;

    setClickedProductId(product.id);

    // Play sound effect
    playAddToCartSound();

    // Add to cart
    onAddToCart(product);

    // Reset animation after 800ms for a more noticeable but still snappy effect
    setTimeout(() => {
      setClickedProductId(null);
    }, 800);
  }; // Product card component with elegant animation
  const ProductCard = ({ product }: { product: Product }) => (
    <div
      key={product.id}
      className={`bg-card text-card-foreground rounded-lg shadow-sm border border-border flex flex-col cursor-pointer group max-w-sm w-full min-w-0 relative overflow-hidden transition-all duration-300 ${
        clickedProductId === product.id
          ? "shadow-lg"
          : "hover:shadow hover:border-muted-foreground/20"
      }`}
      onClick={() => handleProductClick(product)}
    >
      {" "}
      <div className="relative overflow-hidden rounded-t-lg">
        <Image
          src={
            fallbacks[product.id]
              ? fallbackImg
              : product.imageUrl || product.image || fallbackImg
          }
          alt={product.name}
          width={300}
          height={200}
          className={`w-full h-52 object-cover object-center bg-muted transition-transform duration-300 ${
            clickedProductId === product.id
              ? "scale-[1.03]"
              : "group-hover:scale-[1.01]"
          }`}
          onError={() => setFallbacks((f) => ({ ...f, [product.id]: true }))}
          unoptimized
        />

        {/* Overlay and effects on click */}
        {clickedProductId === product.id && (
          <>
            {/* Elegant overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent animate-in fade-in duration-200"></div>

            {/* Centered success indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-primary/90 p-3 shadow-lg animate-in zoom-in-50 duration-300">
                <CheckCircle className="text-white h-8 w-8" />
              </div>
            </div>

            {/* Bottom banner */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="bg-primary py-1.5 px-3 text-sm font-medium text-primary-foreground text-center animate-in slide-in-from-bottom duration-200">
                Added to Order
              </div>
            </div>
          </>
        )}
      </div>{" "}
      <div
        className={`p-3 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between transition-all duration-300 ${
          clickedProductId === product.id
            ? "bg-gradient-to-r from-primary/5 to-transparent"
            : ""
        }`}
      >
        <div>
          <h3
            className={`text-base font-semibold mb-0.5 truncate transition-colors duration-300 ${
              clickedProductId === product.id ? "text-primary" : ""
            }`}
          >
            {product.name}
          </h3>
          <div className="text-xs capitalize text-muted-foreground mb-1">
            {product.category_name || "Uncategorized"}
          </div>
        </div>
        <div
          className={`text-base font-bold mb-1 transition-all duration-300 ${
            clickedProductId === product.id
              ? "text-primary transform translate-y-[-2px]"
              : "text-primary"
          }`}
        >
          ৳{formatPrice(product.price)}
        </div>
      </div>
    </div>
  );
  return (
    <Tabs
      defaultValue="all"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full flex flex-col h-full"
    >
      <TabsList className="mb-4 flex flex-wrap">
        <TabsTrigger value="all">All</TabsTrigger>
        {productTypes.map((type) => (
          <TabsTrigger key={type} value={type} className="capitalize">
            {type}
          </TabsTrigger>
        ))}
      </TabsList>
      {/* All products tab, organized by type */}
      <TabsContent value="all" className="space-y-8">
        <ScrollArea className="h-[calc(100vh-20rem)] md:h-[calc(100vh-16rem)] lg:h-[calc(100vh-12rem)] pr-4">
          {productTypes.map(
            (type) =>
              productsByType[type]?.length > 0 && (
                <div key={`group-${type}`} className="mb-6">
                  <h2 className="text-xl font-bold mb-3 capitalize border-b pb-2">
                    {type}
                  </h2>
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-center mx-auto gap-3 sm:gap-4">
                    {productsByType[type].map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )
          )}
        </ScrollArea>
      </TabsContent>
      {/* Individual type tabs */}
      {productTypes.map((type) => (
        <TabsContent key={`tab-${type}`} value={type}>
          <ScrollArea className="h-[calc(100vh-20rem)] md:h-[calc(100vh-16rem)] lg:h-[calc(100vh-12rem)] pr-4">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-center mx-auto gap-3 sm:gap-4 mb-10 lg:mb-0">
              {products
                .filter(
                  (product) =>
                    (product.category_name || "Uncategorized") === type
                )
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ProductGrid;
