"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  category: string;
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

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-center mx-auto gap-3 sm:gap-4  mb-10 lg:mb-0">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-card text-card-foreground rounded-lg shadow hover:shadow-lg transition-shadow border border-border flex flex-col cursor-pointer group max-w-sm w-full min-w-0"
          onClick={() => onAddToCart(product)}
        >
          <Image
            src={fallbacks[product.id] ? fallbackImg : product.imageUrl}
            alt={product.name}
            width={300}
            height={200}
            className="w-full h-52 object-cover object-center rounded-t-lg bg-muted"
            onError={() => setFallbacks((f) => ({ ...f, [product.id]: true }))}
            unoptimized
          />
          <div className="p-3 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h3 className="text-base font-semibold mb-0.5 truncate">
                {product.name}
              </h3>
              <div className="text-xs text-muted-foreground mb-1">
                {product.category}
              </div>
            </div>
            <div className="text-base font-bold text-primary mb-1">
              ${product.price.toFixed(2)}
            </div>
            {/* {product.description && (
              <div className="text-muted-foreground text-xs mb-2 line-clamp-2 flex-1">
                {product.description}
              </div>
            )} */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
