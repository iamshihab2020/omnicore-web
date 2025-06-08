"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/app/app-layout";
import ProductGrid from "@/components/pos/product-grid";
import CartSidebar, { CartItem } from "@/components/pos/cart-sidebar";
import CartNotification from "@/components/pos/cart-notification";
import { useSoundEffect } from "@/components/pos/use-sound-effect";
import productsData from "@/json/products.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: number;
  name: string;
  category: string;
  type: string;
  price: number;
  imageUrl: string;
  description?: string;
}

interface Counter {
  id: number;
  name: string;
  location: string;
  status: string;
  availableProducts: number[];
}

const PosPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<
    "Cash" | "Card" | "Mobile"
  >("Cash");
  const [orderType, setOrderType] = useState<"Dine In" | "Parcel" | "On Call">(
    "Dine In"
  );
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    productName: "",
  });

  const { playCheckoutSound } = useSoundEffect();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load counters data
        const countersResponse = await fetch("/json/counters.json");
        if (!countersResponse.ok) throw new Error("Failed to load counters");
        const countersData = await countersResponse.json();
        setCounters(countersData);

        // Set all products
        setAllProducts(productsData);
        setProducts(productsData);

        // Set default counter if available
        if (countersData.length > 0) {
          const activeCounters = countersData.filter(
            (counter: Counter) => counter.status === "active"
          );
          if (activeCounters.length > 0) {
            setSelectedCounter(activeCounters[0]);
          }
        }

        setLoading(false);
      } catch (error) {
        setError(
          `Failed to load data: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []); 
  useEffect(() => {
    if (selectedCounter) {
      const filteredProducts = allProducts.filter((product) =>
        selectedCounter.availableProducts.includes(product.id)
      );
      setProducts(filteredProducts);
    } else {
      setProducts(allProducts);
    }
  }, [selectedCounter, allProducts]);
  const handleCounterChange = (counterId: number) => {
    const counter = counters.find((c) => c.id === counterId);
    setSelectedCounter(counter || null);

    // Clear cart when changing counter
    setCart([]);
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
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
        message: `Checkout complete! (${orderType}, ${paymentMethod})`,
        productName: "",
      });
      // Clear cart after print
      setCart([]);
    }, 500);
  }, [playCheckoutSound, paymentMethod, orderType]);

  // Setup keyboard shortcuts
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
        <main className="flex-1 p-2 md:p-4 w-full">
          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-red-500">{error}</div>
          ) : (
            <>
              {/* Counter Selection */}
              <div className="flex items-center justify-between mb-4">
                <div className="mb-4 flex items-center gap-2 max-w-xl">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="px-3 py-2 border border-border rounded-md w-full max-w-xl"
                    onChange={(e) => {
                      const searchTerm = e.target.value.toLowerCase();
                      if (searchTerm === "") {
                        // Reset to current counter's products or all products
                        if (selectedCounter) {
                          const filteredProducts = allProducts.filter(
                            (product) =>
                              selectedCounter.availableProducts.includes(
                                product.id
                              )
                          );
                          setProducts(filteredProducts);
                        } else {
                          setProducts(allProducts);
                        }
                      } else {
                        // Filter within current selection
                        const baseProducts = selectedCounter
                          ? allProducts.filter((p) =>
                              selectedCounter.availableProducts.includes(p.id)
                            )
                          : allProducts;

                        setProducts(
                          baseProducts.filter(
                            (product) =>
                              product.name.toLowerCase().includes(searchTerm) ||
                              product.category
                                .toLowerCase()
                                .includes(searchTerm)
                          )
                        );
                      }
                    }}
                  />
                </div>
                <div className="mb-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                  <label className="block text-sm font-medium mb-2">
                    Select Counter
                  </label>
                  <div className="max-w-sm mb-4">
                    {" "}
                    <Select
                      value={
                        selectedCounter ? selectedCounter.id.toString() : "all"
                      }
                      onValueChange={(value) => {
                        if (value === "all") {
                          setSelectedCounter(null);
                        } else {
                          const counterId = parseInt(value, 10);
                          handleCounterChange(counterId);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a counter" />
                      </SelectTrigger>{" "}
                      <SelectContent>
                        <SelectItem value="all">Default</SelectItem>
                        {counters
                          .filter((counter) => counter.status === "active")
                          .map((counter) => (
                            <SelectItem
                              key={counter.id}
                              value={counter.id.toString()}
                            >
                              {counter.name} ({counter.location})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              {/* Search and filter bar */}
              <ProductGrid products={products} onAddToCart={handleAddToCart} />
            </>
          )}
        </main>
        {/* Order Summary Sidebar */}{" "}
        <div className="w-full md:w-80 max-w-full md:max-w-xs lg:max-w-sm flex-shrink-0">
          <CartSidebar
            cart={cart}
            onReset={handleResetCart}
            onRemove={handleRemoveFromCart}
            onCheckout={handleCheckout}
            paymentMethod={paymentMethod}
            orderType={orderType}
            onPaymentMethodChange={setPaymentMethod}
            onOrderTypeChange={setOrderType}
            counterName={selectedCounter?.name || "Default"}
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
