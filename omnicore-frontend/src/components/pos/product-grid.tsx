"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { useSoundEffect } from "./use-sound-effect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
  id: number;
  name: string;
  category: string;
  type: string;
  price: number;
  imageUrl: string;
  description?: string;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const fallbackImg = "/omnicore.png";

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  const [fallbacks, setFallbacks] = useState<{ [id: number]: boolean }>({});
  const [clickedProductId, setClickedProductId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { playAddToCartSound } = useSoundEffect();

  // Extract unique product types and sort them alphabetically
  const productTypes = useMemo(() => {
    const types = Array.from(new Set(products.map((product) => product.type)));
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
      if (product.type) {
        if (!groupedProducts[product.type]) {
          groupedProducts[product.type] = [];
        }
        groupedProducts[product.type].push(product);
      }
    });

    return groupedProducts;
  }, [products, productTypes]);
  // Handle product click with simple animation
  const handleProductClick = (product: Product) => {
    // If already clicked, don't trigger animation again
    if (clickedProductId === product.id) return;

    setClickedProductId(product.id);

    // Play sound effect
    playAddToCartSound();

    // Add to cart
    onAddToCart(product);

    // Reset animation after 400ms (shorter duration for better performance)
    setTimeout(() => {
      setClickedProductId(null);
    }, 400);
  };
  // Product card component for reuse with simplified animation
  const ProductCard = ({ product }: { product: Product }) => (
    <div
      key={product.id}
      className={`bg-card text-card-foreground rounded-lg shadow border border-border flex flex-col cursor-pointer group max-w-sm w-full min-w-0 ${
        clickedProductId === product.id ? "ring-1 ring-primary" : ""
      }`}
      onClick={() => handleProductClick(product)}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <Image
          src={fallbacks[product.id] ? fallbackImg : product.imageUrl}
          alt={product.name}
          width={300}
          height={200}
          className="w-full h-52 object-cover object-center bg-muted"
          onError={() => setFallbacks((f) => ({ ...f, [product.id]: true }))}
          unoptimized
        />
        {clickedProductId === product.id && (
          <div className="absolute bottom-0 right-0 m-2">
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <CheckCircle size={12} />
              Added
            </span>
          </div>
        )}
      </div>{" "}
      <div className="p-3 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h3 className="text-base font-semibold mb-0.5 truncate">
            {product.name}
          </h3>
          <div className="text-xs capitalize text-muted-foreground mb-1">
            {product.type}
          </div>
        </div>
        <div
          className={`text-base font-bold mb-1 ${
            clickedProductId === product.id ? "text-primary" : "text-primary"
          }`}
        >
          ${product.price.toFixed(2)}
        </div>
      </div>
    </div>
  );

  return (
    <Tabs
      defaultValue="all"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
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
      </TabsContent>

      {/* Individual type tabs */}
      {productTypes.map((type) => (
        <TabsContent key={`tab-${type}`} value={type}>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-center mx-auto gap-3 sm:gap-4 mb-10 lg:mb-0">
            {products
              .filter((product) => product.type === type)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ProductGrid;
