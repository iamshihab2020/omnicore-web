"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { ShoppingCart, CheckCircle } from "lucide-react";
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

  // Handle product click with animation
  const handleProductClick = (product: Product) => {
    // If already clicked, don't trigger animation again
    if (clickedProductId === product.id) return;

    setClickedProductId(product.id);

    // Play sound effect
    playAddToCartSound();

    // Add to cart
    onAddToCart(product);

    // Reset animation after 800ms (allowing for complete animation sequence)
    setTimeout(() => {
      setClickedProductId(null);
    }, 800);
  };

  // Product card component for reuse
  const ProductCard = ({ product }: { product: Product }) => (
    <div
      key={product.id}
      className={`bg-card text-card-foreground rounded-lg shadow hover:shadow-lg border border-border flex flex-col cursor-pointer group max-w-sm w-full min-w-0 transition-all duration-300 ${
        clickedProductId === product.id
          ? "product-card-click ring-2 ring-primary shadow-lg"
          : "scale-100"
      }`}
      onClick={() => handleProductClick(product)}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <Image
          src={fallbacks[product.id] ? fallbackImg : product.imageUrl}
          alt={product.name}
          width={300}
          height={200}
          className={`w-full h-52 object-cover object-center bg-muted transition-all duration-300 ${
            clickedProductId === product.id
              ? "opacity-80 scale-105"
              : "opacity-100 scale-100"
          }`}
          onError={() =>
            setFallbacks((f) => ({ ...f, [product.id]: true }))
          }
          unoptimized
        />
        {clickedProductId === product.id && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-bold product-added-badge shadow-lg flex items-center gap-2">
              <CheckCircle size={16} className="animate-bounce" />
              Added to Cart
              <ShoppingCart size={16} className="ml-1" />
            </span>
          </div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h3 className="text-base font-semibold mb-0.5 truncate">
            {product.name}
          </h3>
          <div className="text-xs text-muted-foreground mb-1">
            {product.category}
          </div>
        </div>
        <div
          className={`text-base font-bold mb-1 transition-all duration-300 ${
            clickedProductId === product.id
              ? "text-primary scale-110"
              : "text-primary"
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
