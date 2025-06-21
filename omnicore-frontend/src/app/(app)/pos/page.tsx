"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/app/layout/app-layout";
import { PageHeader } from "@/components/ui/page-header";
import ProductGrid from "@/components/pos/product-grid";
import CartSidebar, { CartItem } from "@/components/pos/cart-sidebar";
import CartAlert from "@/components/pos/cart-alert";
import { useSoundEffect } from "@/components/pos/use-sound-effect";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AnimatedCard } from "@/components/ui/animated-card";
import { apiRequest, ApiError } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define our Product interface to match the API response
interface Product {
  id: string;
  name: string;
  category: string;
  category_name: string;
  price: number | string; // Allow both number and string types
  image: string;
  description?: string;
  preparation_time?: number;
  is_active: boolean;
}

interface Counter {
  id: string;
  name: string;
  location: string;
  status: string;
  description?: string;
  item_details: Product[];
}

// Key for storing selected counter ID in localStorage
const SELECTED_COUNTER_KEY = "selectedCounterId";

const PosPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null);
  const [loading, setLoading] = useState({
    counters: true,
    items: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCartItemId, setSelectedCartItemId] = useState<string | null>(
    null
  ); // Track selected cart item
  const [searchQuery, setSearchQuery] = useState("");
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

  // Reference to store the notification timeout ID
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playCheckoutSound } = useSoundEffect();
  const nextRouter = useRouter();

  // Create a router adapter that matches the apiRequest expected interface
  const router = useMemo(
    () => ({
      push: async (url: string) => {
        nextRouter.push(url);
        return Promise.resolve();
      },
    }),
    [nextRouter]
  );

  // Fetch counters from the backend API using apiRequest
  useEffect(() => {
    const fetchCounters = async () => {
      try {
        setLoading((prev) => ({ ...prev, counters: true }));

        // Use apiRequest to handle authentication and error handling automatically
        const data = await apiRequest<null, Counter[]>(
          "settings/counters/",
          router,
          { method: "GET" },
          true // requireAuth = true
        );

        const activeCounters = data.filter(
          (counter: Counter) => counter.status === "active"
        );

        setCounters(activeCounters);

        // Get the saved counter ID from localStorage
        let savedCounterId: string | null = null;

        // We need to check if we're in a browser environment before accessing localStorage
        if (typeof window !== "undefined") {
          savedCounterId = localStorage.getItem(SELECTED_COUNTER_KEY);
        }

        // If we have a saved counter ID and it exists in the active counters, use it
        if (
          savedCounterId &&
          activeCounters.some((counter) => counter.id === savedCounterId)
        ) {
          const savedCounter = activeCounters.find(
            (counter) => counter.id === savedCounterId
          );
          setSelectedCounter(savedCounter || null);
        }
        // Otherwise use the first counter as default
        else if (activeCounters.length > 0) {
          setSelectedCounter(activeCounters[0]);
        }

        setLoading((prev) => ({ ...prev, counters: false }));
      } catch (error) {
        console.error("Error fetching counters:", error);

        // Enhanced error handling with fallback to static data
        let errorMessage = "Failed to load counters from the API."; // Check if the error is an ApiError
        if (error && typeof error === "object" && "status" in error) {
          // This is an ApiError from our apiRequest function
          const apiError = error as ApiError;

          const statusCode = apiError.status;
          if (statusCode === 401) {
            errorMessage = "Authentication failed. Please login again.";
          } else if (statusCode === 404) {
            errorMessage =
              "Counter API endpoint not found. Check API configuration.";
          } else {
            errorMessage = `API Error (${statusCode}): ${
              apiError.statusText || "Unknown error"
            }`;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        setError(errorMessage);

        // Fallback to load dummy data if API fails
        try {
          // Load static dummy data in production/development for demo purposes
          console.log("Attempting to load fallback dummy counter data...");
          // Dummy counter with items matching our API structure
          const dummyCounter: Counter = {
            id: "dummy-counter-1",
            name: "Demo Counter",
            location: "Front Entrance",
            description: "Demo Counter for testing",
            status: "active",
            item_details: [
              {
                id: "dummy-item-1",
                name: "Chicken Burger",
                description: "Delicious chicken burger with special sauce",
                price: 220.0, // Using number instead of string
                image: "/omnicore.png",
                is_active: true,
                preparation_time: 15,
                category: "burger-category",
                category_name: "Burger",
              },
              {
                id: "dummy-item-2",
                name: "Coffee",
                description: "Fresh brewed coffee",
                price: 150.0, // Using number instead of string
                image: "/omnicore.png",
                is_active: true,
                preparation_time: 5,
                category: "coffee-category",
                category_name: "Coffee",
              },
            ],
          };          setCounters([dummyCounter]);
          setSelectedCounter(dummyCounter);
          
          // Save the dummy counter to localStorage when using demo data
          if (typeof window !== 'undefined') {
            localStorage.setItem(SELECTED_COUNTER_KEY, dummyCounter.id);
          }
          
          setError(
            "Using demo data as API connection failed. Check backend server."
          );
        } catch (fallbackError) {
          console.error("Failed to load fallback data:", fallbackError);
        }

        setLoading((prev) => ({ ...prev, counters: false }));
      }
    };
    fetchCounters();
  }, [router]);

  // Update products when a counter is selected
  useEffect(() => {
    if (selectedCounter) {
      setLoading((prev) => ({ ...prev, items: true }));

      // Filter and process items from the selected counter
      const items = selectedCounter.item_details
        .filter((item) => item.is_active)
        .map((item) => ({
          ...item,
          imageUrl: item.image || "/omnicore.png", // Add imageUrl for compatibility
        }));

      setProducts(items);
      setLoading((prev) => ({ ...prev, items: false }));
    }
  }, [selectedCounter]);

  // Load selected counter from localStorage on mount
  useEffect(() => {
    const storedCounterId = localStorage.getItem(SELECTED_COUNTER_KEY);
    if (storedCounterId) {
      const counter = counters.find((c) => c.id === storedCounterId);
      setSelectedCounter(counter || null);
    }
  }, [counters]);

  // Save selected counter to localStorage whenever it changes
  useEffect(() => {
    if (selectedCounter) {
      localStorage.setItem(SELECTED_COUNTER_KEY, selectedCounter.id);
    }
  }, [selectedCounter]);
  // Handle counter change
  const handleCounterChange = (counterId: string) => {
    if (counterId === "all") {
      setSelectedCounter(null);
      // Remove from localStorage when selecting "All Products"
      if (typeof window !== 'undefined') {
        localStorage.removeItem(SELECTED_COUNTER_KEY);
      }
      return;
    }

    const counter = counters.find((c) => c.id === counterId);
    setSelectedCounter(counter || null);
    
    // Save selected counter ID to localStorage
    if (typeof window !== 'undefined' && counter) {
      localStorage.setItem(SELECTED_COUNTER_KEY, counter.id);
    }

    // Clear cart when changing counter
    setCart([]);

    // Close any existing notification
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  // Filter products based on search
  const filteredProducts = useCallback(() => {
    if (!searchQuery) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleAddToCart = (product: Product) => {
    // Cancel any existing notification timeout to prevent overlapping notifications
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
      notificationTimeoutRef.current = null;
    }

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

    // Set notification to auto-hide after 4 seconds
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification((prev) => ({ ...prev, isVisible: false }));
      notificationTimeoutRef.current = null;
    }, 4000);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };
  // Handle incrementing item quantity in cart
  const handleIncrementItem = useCallback((id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  // Handle decrementing item quantity in cart
  const handleDecrementItem = useCallback((id: string) => {
    setCart((prev) =>
      prev.map((item) => {
        // If quantity is 1, keep it at 1
        if (item.id === id && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
    );
  }, []);

  const handleResetCart = useCallback(() => {
    setCart([]);
    // Immediately close any existing notification
    setNotification((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const handleCheckout = useCallback(() => {
    // Clear any existing notification timeout
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
      notificationTimeoutRef.current = null;
    }

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

      // Auto-hide the checkout complete notification after 4 seconds
      notificationTimeoutRef.current = setTimeout(() => {
        setNotification((prev) => ({ ...prev, isVisible: false }));
        notificationTimeoutRef.current = null;
      }, 4000);
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
        // Handle + key for incrementing selected item or last item in cart
        case "+":
        case "=": // Same key as + on most keyboards
          event.preventDefault();
          if (!cart.length) return;

          // If an item is selected, increment that item
          if (selectedCartItemId) {
            handleIncrementItem(selectedCartItemId);
          }
          // If no item is selected, increment the last added item
          else if (cart.length > 0) {
            const lastItem = cart[cart.length - 1];
            handleIncrementItem(lastItem.id);
            // Briefly select this item to provide visual feedback
            setSelectedCartItemId(lastItem.id);
            setTimeout(() => {
              setSelectedCartItemId(null);
            }, 300);
          }
          break;
        // Handle - key for decrementing selected item or last item in cart
        case "-":
          event.preventDefault();
          if (!cart.length) return;

          // If an item is selected, decrement that item
          if (selectedCartItemId) {
            const selectedItem = cart.find(
              (item) => item.id === selectedCartItemId
            );
            if (selectedItem && selectedItem.quantity > 1) {
              handleDecrementItem(selectedCartItemId);
            }
          }
          // If no item is selected, decrement the last added item if it has quantity > 1
          else if (cart.length > 0) {
            const lastItem = cart[cart.length - 1];
            if (lastItem.quantity > 1) {
              handleDecrementItem(lastItem.id);
              // Briefly select this item to provide visual feedback
              setSelectedCartItemId(lastItem.id);
              setTimeout(() => {
                setSelectedCartItemId(null);
              }, 300);
            }
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    cart,
    selectedCartItemId,
    handleCheckout,
    handleResetCart,
    handleIncrementItem,
    handleDecrementItem,
  ]);

  // Cleanup effect to clear any notification timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
        notificationTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <AppLayout>
      <AnimatedCard variant="slideUp" className="mb-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Point of Sale" },
          ]}
        />
        <PageHeader
          title="Point of Sale"
          description={
            selectedCounter
              ? `Terminal: ${selectedCounter.name} - ${selectedCounter.location}`
              : "Select a counter below"
          }
        />
      </AnimatedCard>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main Product Grid */}
        <AnimatedCard
          variant="slideUp"
          className="flex-1 p-4 rounded-lg bg-card shadow border border-border"
          delay={0.1}
        >
          {loading.counters ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading counters...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              {" "}
              {/* Counter Selection and Search */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div className="relative w-full md:w-1/2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-3 py-2 border border-border rounded-md w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="w-full md:w-1/2 flex items-center gap-2">
                  <label className="whitespace-nowrap text-sm font-medium">
                    Select Counter:
                  </label>
                  <Select
                    value={selectedCounter ? selectedCounter.id : "all"}
                    onValueChange={handleCounterChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a counter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      {counters.length > 0 ? (
                        counters.map((counter) => (
                          <SelectItem key={counter.id} value={counter.id}>
                            {counter.name} ({counter.location})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="none">
                          No counters available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Show warning if using demo data */}
              {error && error.includes("demo data") && (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error} Make sure the backend server is running at
                    http://localhost:8000
                  </AlertDescription>
                </Alert>
              )}
              {/* Product Grid */}
              {loading.items ? (
                <div className="p-8 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : filteredProducts().length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No products found for this counter.
                    {searchQuery && " Try adjusting your search terms."}
                  </p>
                </div>
              ) : (
                <ProductGrid
                  products={filteredProducts()}
                  onAddToCart={handleAddToCart}
                />
              )}
            </>
          )}
        </AnimatedCard>{" "}
        {/* Order Summary Sidebar */}
        <AnimatedCard
          variant="slideUp"
          className="w-full lg:w-96 flex-shrink-0"
          delay={0.2}
        >
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
            onIncrementItem={handleIncrementItem}
            onDecrementItem={handleDecrementItem}
            selectedCartItemId={selectedCartItemId}
            onCartItemSelect={setSelectedCartItemId}
          />
        </AnimatedCard>
        <CartAlert
          isVisible={notification.isVisible}
          message={notification.message}
          itemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          duration={4000} // 4 seconds for regular notifications
          onClose={() =>
            setNotification((prev) => ({ ...prev, isVisible: false }))
          }
        />
      </div>
    </AppLayout>
  );
};

export default PosPage;
