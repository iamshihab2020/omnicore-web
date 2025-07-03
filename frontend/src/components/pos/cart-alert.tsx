import React, { useEffect, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartAlertProps {
  isVisible: boolean;
  message: string;
  itemCount: number;
  duration?: number;
  onClose: () => void;
}

const CartAlert: React.FC<CartAlertProps> = ({
  isVisible,
  message,
  itemCount,
  duration = 4000,
  onClose,
}) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShown(true);
      const timer = setTimeout(() => {
        setIsShown(false);
        onClose();
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setIsShown(false);
    }
  }, [isVisible, duration, onClose]);

  if (!isShown) return null;

  return (
    <div className="fixed right-10 top-26 z-50 max-w-[550px] transition-opacity">
      <Alert
        className="border-primary/20 bg-primary text-primary-foreground shadow-md"
        variant="default"
      >
        <ShoppingCart className="h-4 w-4" />
        <div className="flex w-full items-center justify-between">
          <div>
            <AlertTitle className="text-primary-foreground">
              {message}
            </AlertTitle>
            {itemCount > 0 && (
              <AlertDescription className="text-primary-foreground/90">
                {itemCount} item{itemCount !== 1 ? "s" : ""} in cart
              </AlertDescription>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default CartAlert;
