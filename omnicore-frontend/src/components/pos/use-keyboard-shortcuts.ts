import { useEffect } from "react";

interface KeyboardShortcutProps {
  onCheckout?: () => void;
  onClearCart?: () => void;
  isCartEmpty: boolean;
}

/**
 * Hook to handle keyboard shortcuts for the POS application
 *
 * Current shortcuts:
 * - F2: Checkout (if cart is not empty)
 * - F3: Clear cart (if cart is not empty)
 * - Escape: Close any open dialog/modal
 */
export const useKeyboardShortcuts = ({
  onCheckout,
  onClearCart,
  isCartEmpty,
}: KeyboardShortcutProps) => {
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
          if (onCheckout && !isCartEmpty) {
            event.preventDefault();
            onCheckout();
          }
          break;
        case "F3":
          if (onClearCart && !isCartEmpty) {
            event.preventDefault();
            onClearCart();
          }
          break;
        case "Escape":
          // Close any open dialogs or modals
          // This is a placeholder for future modal implementations
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCheckout, onClearCart, isCartEmpty]);
};
