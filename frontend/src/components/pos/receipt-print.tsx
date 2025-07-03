import React from "react";
import type { CartItem } from "./cart-sidebar";

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

interface ReceiptPrintProps {
  cart: CartItem[];
  invoiceNo: string;
  paymentMethod?: string;
  orderType?: string;
  paidAmount?: number;
  changeAmount?: number;
  restaurant?: {
    name: string;
    address: string;
    phone: string;
  };
  counterName?: string;
  vat_taxes?: VatTax[]; // Add VAT tax information
}

const ReceiptPrint: React.FC<ReceiptPrintProps> = ({
  cart,
  invoiceNo,
  paymentMethod = "Cash",
  orderType = "Dine In",
  paidAmount,
  changeAmount = 0,
  restaurant,
  counterName = "Default",
  vat_taxes = [], // Default to empty array if not provided
}) => {
  // No longer needed as printing is handled by the parent component
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }); // Helper to parse price to number for calculations
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

  const netTotal = cart.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0
  );

  // Calculate VAT based on the provided VAT taxes
  // If no VAT taxes are defined, default to 0% VAT
  const vatDetails = vat_taxes
    .filter((tax) => tax.is_active)
    .map((tax) => {
      // Convert tax rate to number for calculation
      const rateAsNumber =
        typeof tax.rate === "string" ? parseFloat(tax.rate) : tax.rate;
      return {
        name: tax.name,
        rate: tax.rate,
        amount: +((netTotal * rateAsNumber) / 100).toFixed(2),
      };
    });

  const totalVatAmount = vatDetails.reduce((sum, tax) => sum + tax.amount, 0);
  const grossTotal = +(netTotal + totalVatAmount).toFixed(2);
  // Format helper functions for thermal printer style - specialized for fixed-width formatting
  const formatQty = (qty: number): string => `${qty}`.padStart(3, " ");
  const formatItemName = (name: string): string => {
    const maxLength = 20;
    const trimmedName =
      name.length > maxLength ? name.substring(0, maxLength - 3) + "..." : name;
    return trimmedName.padEnd(maxLength, " ");
  };
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === "number" ? price : parsePrice(price);
    return `৳${numPrice.toFixed(2)}`.padStart(8, " ");
  };
  const formatTotalPrice = (price: number | string): string => {
    const numPrice = typeof price === "number" ? price : parsePrice(price);
    return `৳${numPrice.toFixed(2)}`.padStart(10, " ");
  };
  // Format labels for total sections with consistent width
  const formatTotalLabel = (label: string): string => {
    return label.padEnd(23, " ");
  };

  // Helper for consistent dash separator lines - match the width of our columns (39 chars)
  // const getDashLine = (): string => "-".repeat(39);

  return (
    <div id="receipt" className="receipt-root">
      {" "}
      {/* No test button needed - printing is handled by the parent component */}
      {/* Restaurant information header */}
      <div className="receipt-header">
        {restaurant?.name || "Restaurant Name"}
      </div>
      <div className="receipt-address">
        {restaurant?.address || "Address, City"}
      </div>
      <div className="receipt-phone">
        {restaurant?.phone || "Phone: 0123456789"}
      </div>{" "}
      {/* First separator line */}
      <hr className="receipt-dash" />
      {/* Date/Time and Invoice section */}
      <div className="receipt-datetime-row">
        <span className="receipt-datetime-left">Date: {date}</span>
        <span className="receipt-datetime-right">Time: {time}</span>
      </div>
      <div className="receipt-invoice">Invoice No: {invoiceNo}</div>
      {/* Second separator line */}
      <hr className="receipt-dash" />{" "}
      {/* Items section with monospace pre-formatted layout */}
      <div className="receipt-items-pre">
        {/* Header row for items table */}
        <pre className="receipt-pre-row">
          <div>
            <span className="pre-qty">Qty x </span>
            <span className="pre-item">Item</span>
          </div>
          <div>
            <span className="pre-price">Price</span>
            <span className="pre-total">Total</span>
          </div>
        </pre>

        {/* Item rows */}
        {cart.map((item) => (
          <pre key={item.id} className="receipt-pre-row">
            <div>
              <span className="pre-qty">
                {formatQty(item.quantity)} {" x "}{" "}
              </span>
              <span className="pre-item ">{formatItemName(item.name)}</span>
            </div>
            <div>
              <span className="pre-price">{formatPrice(item.price)}</span>
              <span className="pre-total">
                {formatTotalPrice(parsePrice(item.price) * item.quantity)}
              </span>
            </div>
          </pre>
        ))}
      </div>
      {/* Third separator line */}
      <hr className="receipt-dash" />{" "}
      {/* Totals section using pre-formatted monospace text */}
      <pre className="receipt-total-pre">
        <span className="total-label">{formatTotalLabel("Net Total:")}</span>
        <span className="total-value">{formatTotalPrice(netTotal)}</span>
      </pre>
      {/* Fourth separator line */}
      <hr className="receipt-dash" />
      {/* VAT section - display all applicable VAT taxes */}
      {vatDetails.length > 0 ? (
        vatDetails.map((tax, index) => (
          <pre key={index} className="receipt-total-pre">
            <span className="total-label">
              {formatTotalLabel(`${tax.name} - ${tax.rate}%:`)}
            </span>
            <span className="total-value">{formatTotalPrice(tax.amount)}</span>
          </pre>
        ))
      ) : (
        <pre className="receipt-total-pre">
          <span className="total-label">{formatTotalLabel("VAT:")}</span>
          <span className="total-value">{formatTotalPrice(0)}</span>
        </pre>
      )}
      {/* Fifth separator line */}
      <hr className="receipt-dash" /> {/* Gross total section */}{" "}
      <pre className="receipt-total-pre receipt-grosstotal">
        <span className="total-label">{formatTotalLabel("Gross Total:")}</span>
        <span className="total-value">{formatTotalPrice(grossTotal)}</span>
      </pre>
      {/* Final separator line */}
      <hr className="receipt-dash" /> {/* Order Type section */}
      <pre className="receipt-total-pre">
        <span className="total-label">{formatTotalLabel("Order Type:")}</span>
        <span className="total-value">{orderType}</span>
      </pre>
      <hr className="receipt-dash" /> {/* Payment Method section */}
      <pre className="receipt-total-pre">
        <span className="total-label">
          {formatTotalLabel("Payment Method:")}
        </span>
        <span className="total-value">{paymentMethod}</span>
      </pre>
      <hr className="receipt-dash" />
      {/* Counter section */}
      <pre className="receipt-total-pre">
        <span className="total-label">{formatTotalLabel("Counter:")}</span>
        <span className="total-value">{counterName}</span>
      </pre>
      <hr className="receipt-dash" />
      {/* Payment and Change section - show for all payment methods */}
      {paidAmount !== undefined && (
        <>
          <pre className="receipt-total-pre">
            <span className="total-label">
              {formatTotalLabel("Amount Paid:")}
            </span>
            <span className="total-value">{formatTotalPrice(paidAmount)}</span>
          </pre>
          <pre className="receipt-total-pre">
            <span className="total-label">{formatTotalLabel("Change:")}</span>
            <span className="total-value">
              {formatTotalPrice(changeAmount)}
            </span>
          </pre>
          <hr className="receipt-dash" />
        </>
      )}
      {/* Notes section */}
      <div className="receipt-notes-label">Notes:</div>
      <div className="receipt-notes">
        Thank You for your order. Visit us again.
      </div>
      {/* Footer */}
      <div className="receipt-powered">
        Powered by OmniCore
        <br />
        Phone: 01954114410
      </div>
    </div>
  );
};

export default ReceiptPrint;
