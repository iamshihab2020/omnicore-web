import React, { useEffect, useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import "./cart-notification.css";

interface CartNotificationProps {
  isVisible: boolean;
  message: string;
  itemCount: number;
  duration?: number; // Duration in milliseconds before auto-closing
}

const CartNotification: React.FC<CartNotificationProps> = ({
  isVisible,
  message,
  itemCount,
  duration = 4000, // Default to 4 seconds
}) => {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isClosed, setIsClosed] = useState(false);

  // Handle manual close
  const handleClose = () => {
    setIsActive(false);
    setIsClosed(true);
  };

  useEffect(() => {
    if (isVisible && !isClosed) {
      setIsActive(true);
      setProgress(100);

      // Create progress animation
      const startTime = Date.now();
      const endTime = startTime + duration;

      // Update progress bar
      const progressInterval = setInterval(() => {
        const now = Date.now();
        const timeLeft = Math.max(0, endTime - now);
        const progressValue = (timeLeft / duration) * 100;

        setProgress(progressValue);

        if (progressValue <= 0) {
          clearInterval(progressInterval);
        }
      }, 100);

      // Set timeout to hide notification
      const timer = setTimeout(() => {
        setIsActive(false);
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [isVisible, duration, isClosed]);

  // Reset closed state when isVisible changes to true
  useEffect(() => {
    if (isVisible) {
      setIsClosed(false);
    }
  }, [isVisible]);

  if ((!isVisible && !isActive) || isClosed) return null;
  // Get the appropriate progress class based on current progress value
  const getProgressClass = () => {
    const roundedProgress = Math.round(progress / 10) * 10;
    return `progress-${roundedProgress}`;
  };

  return (
    <div
      className={`fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-lg shadow-lg p-3 flex flex-col transform ${
        isActive ? "notification-enter" : "notification-exit"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="relative">
          <ShoppingCart size={22} />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
        <span className="text-sm font-medium flex-1">{message}</span>
        <button
          onClick={handleClose}
          className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="notification-progress-container">
        <div className={`notification-progress ${getProgressClass()}`}></div>
      </div>
    </div>
  );
};

export default CartNotification;
