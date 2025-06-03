import React from "react";
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
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  onReset,
  onCheckout,
  // onRemove,
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <aside className="w-full md:w-80 bg-card text-card-primary border-border border-2 p-0 flex flex-col h-full min-h-[300px] rounded-2xl">
      <div className="px-6 py-4 border-b border-t-0 border-l-0 border-r-0 rounded-2xl border-border flex items-center justify-between bg-muted">
        <span className="text-lg font-bold text-foreground">Order Summary</span>
        <Button
          onClick={onReset}
          className="bg-red-600 hover:bg-red-600"
          disabled={cart.length === 0}
        >
          Reset
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {cart.length === 0 ? (
          <div className="text-muted-foreground text-center text-base mt-10">
            No items in cart
          </div>
        ) : (
          <ul className="space-y-3">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 bg-sidebar rounded-lg px-3 py-2 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate text-foreground">
                    {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>
                      Qty:
                      <span className="font-semibold">{item.quantity}</span>
                    </span>
                    <span>×</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-foreground text-base">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  {/* <button
                    className="mt-1 text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded transition"
                    onClick={() => onRemove(item.id)}
                    title="Remove"
                  >
                    Remove
                  </button> */}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="px-6 py-4 border-t border-border bg-muted rounded-2xl">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-bold text-xl text-primary">
            ${total.toFixed(2)}
          </span>
        </div>
        <button
          className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 font-semibold text-base shadow hover:bg-primary/90 transition disabled:opacity-60"
          onClick={onCheckout}
          disabled={cart.length === 0}
        >
          Checkout
        </button>
      </div>
    </aside>
  );
};

export type { CartItem };
export default CartSidebar;
