"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/app/app-layout";
import ProductGrid from "@/components/pos/product-grid";
import CartSidebar, { CartItem } from "@/components/pos/cart-sidebar";
import CartNotification from "@/components/pos/cart-notification";
import { useSoundEffect } from "@/components/pos/use-sound-effect";

interface Product {
  id: number;
  name: string;
  category: string;
  type: string;
  price: number;
  imageUrl: string;
  description?: string;
}

const PosPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    productName: "",
  });


  const { playCheckoutSound } = useSoundEffect();

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
        // Show notification for increased quantity
        setNotification({
          isVisible: true,
          message: `Added ${product.name} (${existing.quantity + 1})`,
          productName: product.name,
        });

        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      setNotification({
        isVisible: true,
        message: `Added ${product.name} to cart`,
        productName: product.name,
      });

      return [...prev, { ...product, quantity: 1 }];
    });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isVisible: false }));
    }, 2000);
  };
  const handleRemoveFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetCart = useCallback(() => {
    setCart([]);
  }, []);
  const handleCheckout = useCallback(() => {
    playCheckoutSound();

    setNotification({
      isVisible: true,
      message: "Processing checkout...",
      productName: "",
    });
    setTimeout(() => {
      window.print();

      // Update notification
      setNotification({
        isVisible: true,
        message: "Checkout complete!",
        productName: "",
      });
      // Clear cart after print
      setCart([]);
    }, 500);
  }, [playCheckoutSound]); // Setup keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if modifiers are pressed or if typing in an input
      if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        ["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName)
      ) {
        return;
      }

      switch (event.key) {
        case "F2":
          if (!cart.length) return;
          event.preventDefault();
          handleCheckout();
          break;
        case "F3":
          if (!cart.length) return;
          event.preventDefault();
          handleResetCart();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart.length, handleCheckout, handleResetCart]); 
  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row h-full min-h-screen">
        {/* Main Product Grid */}
        <main className="flex-1 p-2 md:p-4">
          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-red-500">{error}</div>
          ) : (
            <>
              {/* Search and filter bar */}
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="px-3 py-2 border border-border rounded-md w-full max-w-sm"
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    if (searchTerm === "") {
                      fetch("/products.json")
                        .then((res) => res.json())
                        .then((data) => setProducts(data));
                    } else {
                      setProducts((prevProducts) =>
                        prevProducts.filter(
                          (product) =>
                            product.name.toLowerCase().includes(searchTerm) ||
                            product.category.toLowerCase().includes(searchTerm)
                        )
                      );
                    }
                  }}
                />
              </div>
              <ProductGrid products={products} onAddToCart={handleAddToCart} />
            </>
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
        </div>{" "}
        <CartNotification
          isVisible={notification.isVisible}
          message={notification.message}
          itemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          duration={4000} // 4 seconds for regular notifications
        />
      </div>
    </AppLayout>
  );
};

export default PosPage;
