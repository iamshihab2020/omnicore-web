import React, { useState } from "react";
import { X, Printer, Download, ArrowRight } from "lucide-react";
import { CartItem } from "./cart-sidebar";

interface SalesSummaryModalProps {
  isVisible: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  invoiceNo: string;
}

const SalesSummary: React.FC<SalesSummaryModalProps> = ({
  isVisible,
  onClose,
  cartItems,
  invoiceNo,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isVisible) return null;

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const vatRate = 0.05;
  const vatAmount = total * vatRate;
  const grandTotal = total + vatAmount;

  const handlePrintSummary = () => {
    window.print();
  };

  const handleCopyToClipboard = () => {
    const summaryText = `
Invoice: ${invoiceNo}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
---------------------------------------
${cartItems
  .map(
    (item) =>
      `${item.name} x ${item.quantity} = $${(
        item.price * item.quantity
      ).toFixed(2)}`
  )
  .join("\n")}
---------------------------------------
Subtotal: $${total.toFixed(2)}
VAT (5%): $${vatAmount.toFixed(2)}
Total: $${grandTotal.toFixed(2)}
    `.trim();

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border bg-muted">
          <h3 className="font-bold text-lg">Sale Complete</h3>{" "}
          <button
            className="rounded-full p-1 hover:bg-background/80 transition"
            onClick={onClose}
            aria-label="Close sales summary"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          <div className="mb-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full mb-2">
              <ArrowRight size={24} />
            </div>
            <h4 className="font-semibold text-lg mb-1">
              Transaction #{invoiceNo}
            </h4>
            <p className="text-muted-foreground text-sm">
              {new Date().toLocaleDateString()} at{" "}
              {new Date().toLocaleTimeString()}
            </p>
          </div>

          {/* Items */}
          <div className="space-y-2 mb-4">
            <h5 className="font-medium text-sm text-muted-foreground">ITEMS</h5>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b border-border/40 last:border-0"
              >
                <div className="flex items-center">
                  <div className="mr-2 bg-muted rounded-md w-6 h-6 flex items-center justify-center text-xs font-medium">
                    {item.quantity}
                  </div>
                  <span>{item.name}</span>
                </div>
                <div className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-2 bg-muted/40 p-3 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">VAT (5%):</span>
              <span>${vatAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold mt-2 pt-2 border-t border-border/40">
              <span>Total:</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer with actions */}
        <div className="flex flex-col sm:flex-row gap-2 p-4 bg-muted/50 border-t border-border">
          <button
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
            onClick={handlePrintSummary}
          >
            <Printer size={16} />
            Print Receipt
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted text-muted-foreground rounded-md text-sm font-medium"
            onClick={handleCopyToClipboard}
          >
            <Download size={16} />
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesSummary;
