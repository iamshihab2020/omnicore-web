import React, { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Banknote,
  CreditCard,
  Minus,
  Package,
  Phone,
  Plus,
  Smartphone,
  Trash2,
  Utensils,
} from "lucide-react";
import ReceiptPrint from "./receipt-print";
import { Button } from "../ui/button";

// Remove the hardcoded VAT rate
// const VAT_RATE = 0.05;

// Define VAT tax interface
interface VatTax {
  id: string;
  name: string;
  rate: string | number; // Accept both string and number types to match API response
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  category_name?: string;
  price: number | string;
  image?: string;
  imageUrl?: string;
  description?: string;
  preparation_time?: number;
  is_active?: boolean;
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

// Helper to parse price to number for calculations
const parsePrice = (price: number | string): number => {
  if (typeof price === "number") {
    return price;
  }
  try {
    return parseFloat(String(price));
  } catch (e) {
    console.error("Invalid price format:", price, e);
    return 0;
  }
};

export interface CartItem extends Product {
  quantity: number;
}

interface CartSidebarProps {
  cart: CartItem[];
  onReset: () => void;
  onCheckout: () => void;
  onRemove: (id: string) => void;
  onIncrementItem?: (id: string) => void; // Add increment function
  onDecrementItem?: (id: string) => void; // Add decrement function
  selectedCartItemId?: string | null; // ID of the selected cart item
  onCartItemSelect?: (id: string | null) => void; // Callback for selecting a cart item
  paymentMethod: string;
  orderType: string;
  onPaymentMethodChange: (method: "Cash" | "Card" | "Mobile") => void;
  onOrderTypeChange: (type: "Dine In" | "Parcel" | "On Call") => void;
  counterName?: string;
  vat_taxes?: VatTax[]; // Add VAT tax information from the counter
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  onReset,
  onRemove,
  onCheckout,
  onIncrementItem,
  onDecrementItem,
  selectedCartItemId,
  onCartItemSelect,
  paymentMethod,
  orderType,
  onPaymentMethodChange,
  onOrderTypeChange,
  counterName = "Default",
  vat_taxes = [], // Default to empty array if not provided
}) => {
  const subtotal = cart.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0
  );

  // Calculate VAT amount based on selected counter's VAT rates
  const vatAmount = vat_taxes.reduce((total, tax) => {
    // Convert tax rate to a number before calculation
    const rateAsNumber =
      typeof tax.rate === "string" ? parseFloat(tax.rate) : tax.rate;
    const taxAmount = (subtotal * rateAsNumber) / 100;
    return total + taxAmount;
  }, 0);

  const total = +(subtotal + vatAmount).toFixed(2);

  const [paidAmount, setPaidAmount] = useState<number>(total);
  const [changeAmount, setChangeAmount] = useState<number>(0);

  // Update paid amount and change whenever the total changes
  useEffect(() => {
    setPaidAmount(total);
    setChangeAmount(0);
  }, [total]);

  // Calculate change when paid amount changes
  useEffect(() => {
    if (paidAmount >= total) {
      setChangeAmount(paidAmount - total);
    } else {
      setChangeAmount(0);
    }
  }, [paidAmount, total]);

  return (
    <Card className="rounded-2xl shadow-lg w-full">
      <aside className="w-full max-w-full md:max-w-xs lg:max-w-sm flex-shrink-0 text-card-foreground p-0 flex flex-col min-h-[500px]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted rounded-t-2xl">
          <span className="text-xl font-bold text-foreground tracking-tight">
            🛒 Order Summary
          </span>
          <button
            className="text-sm text-destructive font-semibold px-3 py-1 rounded border border-transparent transition"
            onClick={onReset}
            disabled={cart.length === 0}
          >
            Reset <span className="text-xs opacity-70">[F3]</span>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 border-border border-2 bg-background">
          {cart.length === 0 ? (
            <div className="text-muted-foreground text-center text-base py-10">
              No items in cart
            </div>
          ) : (
            <>
              {/* <div className="text-xs text-muted-foreground mb-3 p-2 bg-muted/40 rounded">
                <p>Select an item and use keyboard shortcuts:</p>
                <p className="mt-1">
                  • Press <kbd className="px-1 border rounded">+</kbd> to
                  increase quantity
                </p>
                <p>
                  • Press <kbd className="px-1 border rounded">-</kbd> to
                  decrease quantity
                </p>
              </div> */}
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 group shadow-sm cursor-pointer transition-colors ${
                      selectedCartItemId === item.id
                        ? "bg-primary/20 border border-primary/50"
                        : "bg-muted/60 hover:bg-muted/80"
                    }`}
                    onClick={() =>
                      onCartItemSelect && onCartItemSelect(item.id)
                    }
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-base truncate text-foreground">
                          {item.name}
                        </span>
                        <Button
                          variant="ghost"
                          className="ml-2 text-destructive p-1 rounded-full transition"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent item selection
                            onRemove(item.id);
                          }}
                          title="Remove"
                          aria-label="Remove item"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <span>৳{formatPrice(item.price)}</span>
                        <span>×</span>
                        <div className="flex items-center gap-1">
                          {onDecrementItem && (
                            <button
                              title="Decrement item [-]"
                              className="font-bold bg-primary hover:bg-secondary/50 px-2 py-1 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDecrementItem(item.id);
                              }}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-5 w-5 text-white font-bold" />
                            </button>
                          )}
                          <Badge
                            variant="destructive"
                            className="rounded-full font-semibold px-2"
                          >
                            {item.quantity}
                          </Badge>
                          {onIncrementItem && (
                            <button
                              title="Increment item [+]"
                              className="font-bold bg-primary hover:bg-secondary/50 px-2 py-1 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                onIncrementItem(item.id);
                              }}
                            >
                              <Plus className="h-5 w-5 text-white font-bold" />
                            </button>
                          )}
                        </div>
                        <span className="ml-auto font-bold text-foreground text-sm">
                          ৳{(parsePrice(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-border bg-muted rounded-b-2xl">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-foreground">Subtotal</span>
              <span className="font-medium">৳{formatPrice(subtotal)}</span>
            </div>
            {/* VAT section - show all applicable VATs or a message if none */}
            {vat_taxes.filter((tax) => tax.is_active).length > 0 ? (
              vat_taxes
                .filter((tax) => tax.is_active)
                .map((tax, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-foreground">
                      {tax.name} ({tax.rate}%)
                    </span>
                    <span className="font-medium">
                      ৳
                      {formatPrice(
                        (subtotal *
                          (typeof tax.rate === "string"
                            ? parseFloat(tax.rate)
                            : tax.rate)) /
                          100
                      )}
                    </span>
                  </div>
                ))
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-foreground">VAT</span>
                <span className="font-medium">৳0.00</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2 border-border flex justify-between items-center">
              <span className="font-semibold text-foreground text-lg">
                Total
              </span>
              <span className="font-bold text-2xl text-primary">
                ৳{formatPrice(total)}
              </span>
            </div>
          </div>

          {/* Order Type Selection */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Order Type:</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="ghost"
                className={`${
                  orderType === "Dine In"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted/70"
                }`}
                onClick={() => onOrderTypeChange("Dine In")}
              >
                <Utensils />
                Dine In
              </Button>
              <Button
                variant="ghost"
                className={` ${
                  orderType === "Parcel"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted/70"
                }`}
                onClick={() => onOrderTypeChange("Parcel")}
              >
                <Package />
                Parcel
              </Button>
              <Button
                variant="ghost"
                className={` ${
                  orderType === "On Call"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted/70"
                }`}
                onClick={() => onOrderTypeChange("On Call")}
              >
                <Phone />
                On Call
              </Button>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              Payment Method:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="ghost"
                className={`${
                  paymentMethod === "Cash"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted/70"
                }`}
                onClick={() => onPaymentMethodChange("Cash")}
              >
                <Banknote />
                Cash
              </Button>
              <Button
                variant="ghost"
                className={` ${
                  paymentMethod === "Card"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted/70"
                }`}
                onClick={() => onPaymentMethodChange("Card")}
              >
                <CreditCard />
                Card
              </Button>
              <Button
                variant="ghost"
                className={` ${
                  paymentMethod === "Mobile"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted/70"
                }`}
                onClick={() => onPaymentMethodChange("Mobile")}
              >
                <Smartphone />
                Mobile
              </Button>
            </div>
          </div>

          {/* Payment Amount Section - Show for all payment methods */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Payment Amount:</p>
              <div className="text-sm font-medium">
                Change:{" "}
                <span className="text-primary font-bold">
                  ৳{formatPrice(changeAmount)}
                </span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="flex mb-2">
              <input
                type="number"
                className="w-full px-3 py-2 border border-border rounded-md"
                value={paidAmount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    setPaidAmount(value);
                  } else {
                    setPaidAmount(0);
                  }
                }}
                min={0}
                step={0.01}
                aria-label="Payment amount"
                placeholder="Enter payment amount"
              />
            </div>

            {/* Preset Buttons */}
            <div className="grid grid-cols-5 gap-1 mb-2">
              <Button
                variant="outline"
                className="text-xs py-1"
                onClick={() => setPaidAmount(200)}
              >
                200
              </Button>
              <Button
                variant="outline"
                className="text-xs py-1"
                onClick={() => setPaidAmount(500)}
              >
                500
              </Button>
              <Button
                variant="outline"
                className="text-xs py-1"
                onClick={() => setPaidAmount(1000)}
              >
                1000
              </Button>
              <Button
                variant="outline"
                className="text-xs py-1"
                onClick={() => setPaidAmount(2000)}
              >
                2000
              </Button>
              <Button
                variant="outline"
                className="text-xs py-1 font-bold"
                onClick={() => setPaidAmount(total)}
              >
                Exact
              </Button>
            </div>
          </div>

          <button
            className="w-full bg-primary text-primary-foreground rounded-lg px-4 py-2 font-semibold text-base shadow hover:bg-primary/90 transition disabled:opacity-60"
            onClick={() => {
              // When checkout is clicked, call the passed onCheckout function
              // The parent component will handle printing and clearing the cart
              onCheckout();
            }}
            disabled={cart.length === 0}
          >
            Checkout <span className="text-xs opacity-70">[F2]</span>
          </button>
        </div>

        {/* Hidden Receipt for Print */}
        <div className="screen-hidden">
          <ReceiptPrint
            cart={cart}
            invoiceNo={
              // Simple invoice number: date + time
              new Date()
                .toISOString()
                .replace(/[-:T.]/g, "")
                .slice(0, 14)
            }
            paymentMethod={paymentMethod}
            orderType={orderType}
            paidAmount={paidAmount}
            changeAmount={changeAmount}
            restaurant={{
              name: "OmniCore Restaurant",
              address: "123 Main St, City, Country",
              phone: "01954114410",
            }}
            counterName={counterName} // Pass the counter name to the receipt
            vat_taxes={vat_taxes} // Pass VAT tax information to the receipt
          />
        </div>
      </aside>
    </Card>
  );
};

export default CartSidebar;
