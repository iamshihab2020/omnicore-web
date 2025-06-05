"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/app/app-layout";
import ProductGrid from "@/components/pos/product-grid";
import CartSidebar, { CartItem } from "@/components/pos/cart-sidebar";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description?: string;
}

const PosPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    fetch("/products.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetCart = () => setCart([]);  const handleCheckout = () => {
    // Add a small delay to ensure the receipt is fully rendered before printing
    setTimeout(() => {
      window.print();
      setCart([]); // Clear cart after print
    }, 100);
  };

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row h-full min-h-screen">
        {/* Main Product Grid */}
        <main className="flex-1 p-2 md:p-4">
          {loading ? (
            <div className="p-8">Loading products...</div>
          ) : error ? (
            <div className="p-8 text-red-500">{error}</div>
          ) : (
            <ProductGrid products={products} onAddToCart={handleAddToCart} />
          )}
        </main>
        {/* Order Summary Sidebar */}
        <div className="w-full md:w-80 max-w-full md:max-w-xs lg:max-w-sm flex-shrink-0">
          <CartSidebar
            cart={cart}
            onReset={handleResetCart}
            onRemove={handleRemoveFromCart}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default PosPage;
