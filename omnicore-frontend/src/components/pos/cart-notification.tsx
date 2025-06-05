import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

interface CartNotificationProps {
  isVisible: boolean;
  message: string;
  itemCount: number;
}

const CartNotification: React.FC<CartNotificationProps> = ({
  isVisible,
  message,
  itemCount,
}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible && !isActive) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-lg shadow-lg p-3 flex items-center gap-2 transform transition-all duration-500 ${
        isActive ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      <div className="relative">
        <ShoppingCart size={22} />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </div>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default CartNotification;
