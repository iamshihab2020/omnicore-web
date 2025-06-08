import React from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Banknote, CreditCard, Smartphone, Trash2 } from "lucide-react";
import ReceiptPrint from "./receipt-print";
import { Button } from "../ui/button";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartSidebarProps {
  cart: CartItem[];
  onReset: () => void;
  onCheckout: () => void;
  onRemove: (id: number) => void;
  paymentMethod: string;
  onPaymentMethodChange: (method: "Cash" | "Card" | "Mobile") => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  onReset,
  onRemove,
  onCheckout,
  paymentMethod,
  onPaymentMethodChange,
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Card className="rounded-2xl shadow-lg border-0 bg-background">
      <aside className="w-full md:w-80 max-w-full md:max-w-xs lg:max-w-sm flex-shrink-0 text-card-foreground p-0 flex flex-col min-h-[500px]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted rounded-t-2xl">
          <span className="text-xl font-bold text-foreground tracking-tight">
            🛒 Order Summary
          </span>{" "}
          <button
            className="text-sm text-destructive font-semibold px-3 py-1 rounded border border-transparent transition"
            onClick={onReset}
            disabled={cart.length === 0}
          >
            Reset <span className="text-xs opacity-70">[F3]</span>
          </button>
        </div>
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 border bg-background">
          {cart.length === 0 ? (
            <div className="text-muted-foreground text-center text-base mt-10">
              No items in cart
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 bg-muted/60 rounded-lg px-3 py-2 group shadow-sm"
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-base truncate text-foreground">
                        {item.name}
                      </span>
                      <Button
                        variant={"ghost"}
                        className="ml-2 text-destructive p-1 rounded-full transition"
                        onClick={() => onRemove(item.id)}
                        title="Remove"
                        aria-label="Remove item"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                      <span>${item.price.toFixed(2)}</span>
                      <span>×</span>
                      <span>
                        <Badge
                          variant="destructive"
                          className="rounded-full font-semibold px-2"
                        >
                          {item.quantity}
                        </Badge>
                      </span>
                      <span className="ml-auto font-bold text-foreground text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>{" "}
        {/* Footer */}
        <div className="px-6 py-5 border-t border-border bg-muted rounded-b-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-foreground text-lg">Total</span>
            <span className="font-bold text-2xl text-primary">
              ${total.toFixed(2)}
            </span>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              Payment Method:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={"ghost"}
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
                variant={"ghost"}
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
                variant={"ghost"}
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
        {/* Hidden Receipt for Print */}{" "}
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
            restaurant={{
              name: "OmniCore Restaurant",
              address: "123 Main St, City, Country",
              phone: "01954114410",
            }}
          />
        </div>
      </aside>
    </Card>
  );
};

export type { CartItem };
export default CartSidebar;
