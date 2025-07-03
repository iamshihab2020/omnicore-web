import React, { useEffect, useState, useRef } from "react";
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
  const [displayMessage, setDisplayMessage] = useState(message);

  // Refs to store timeouts and intervals to properly clean them up
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle manual close
  const handleClose = () => {
    setIsActive(false);

    // Use a timeout to match the animation duration before setting isClosed
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = setTimeout(() => {
      setIsClosed(true);
    }, 300); // Match the CSS animation duration
  };

  // Cleanup function for all intervals and timeouts
  const clearAllTimers = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  };
  useEffect(() => {
    if (isVisible) {
      // Update the displayed message when a new notification becomes visible
      setDisplayMessage(message);
      setIsActive(true);
      setIsClosed(false);
      setProgress(100);

      // Clear any existing timers
      clearAllTimers();

      // Create progress animation
      const startTime = Date.now();
      const endTime = startTime + duration;

      // Update progress bar
      progressIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const timeLeft = Math.max(0, endTime - now);
        const progressValue = (timeLeft / duration) * 100;

        setProgress(progressValue);

        if (progressValue <= 0) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
        }
      }, 100);

      // Set timeout to hide notification
      timerRef.current = setTimeout(() => {
        setIsActive(false);

        // Add a timeout for the exit animation to complete before setting isClosed
        animationTimeoutRef.current = setTimeout(() => {
          setIsClosed(true);
        }, 300); // Match the CSS animation duration
      }, duration);
    } else if (!isVisible && isActive) {
      // When isVisible changes to false while notification is active
      // Start exit animation by setting isActive to false
      setIsActive(false);

      // Set a timeout to completely remove the element after animation completes
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      animationTimeoutRef.current = setTimeout(() => {
        setIsClosed(true);
      }, 300); // Match the CSS animation duration
    }

    // Cleanup function
    return () => {
      clearAllTimers();
    };
  }, [isVisible, duration, message, itemCount, isActive]);

  // Don't render if notification shouldn't be visible
  if ((!isVisible && !isActive) || isClosed) return null; // Get the appropriate progress class based on current progress value
  const getProgressClass = () => {
    const roundedProgress = Math.round(progress / 10) * 10;
    return `progress-${roundedProgress}`;
  };
  return (
    <div
      className={`fixed top-24 right-6 bg-primary text-primary-foreground rounded-lg shadow-lg p-3 flex flex-col transform ${
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
        <span className="text-sm font-medium flex-1">{displayMessage}</span>
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
