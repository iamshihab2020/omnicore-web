import React from "react";
import type { CartItem } from "./cart-sidebar";

interface ReceiptPrintProps {
  cart: CartItem[];
  invoiceNo: string;
  restaurant?: {
    name: string;
    address: string;
    phone: string;
  };
}

const VAT_RATE = 0.05;

const ReceiptPrint: React.FC<ReceiptPrintProps> = ({
  cart,
  invoiceNo,
  restaurant,
}) => {  // No longer needed as printing is handled by the parent component
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const netTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const vat = +(netTotal * VAT_RATE).toFixed(2);
  const grossTotal = +(netTotal + vat).toFixed(2);
  // Format helper functions for thermal printer style - specialized for fixed-width formatting
  const formatQty = (qty: number): string => `${qty}`.padStart(3, " ");
  const formatItemName = (name: string): string => {
    const maxLength = 20;
    const trimmedName =
      name.length > maxLength ? name.substring(0, maxLength - 3) + "..." : name;
    return trimmedName.padEnd(maxLength, " ");
  };
  const formatPrice = (price: number): string =>
    `${price.toFixed(2)}`.padStart(7, " ");
  const formatTotalPrice = (price: number): string =>
    `${price.toFixed(2)}`.padStart(9, " ");
  // Format labels for total sections with consistent width
  const formatTotalLabel = (label: string): string => {
    return label.padEnd(23, " ");
  };

  // Helper for consistent dash separator lines - match the width of our columns (39 chars)
  // const getDashLine = (): string => "-".repeat(39);

  return (
    <div id="receipt" className="receipt-root">      {/* No test button needed - printing is handled by the parent component */}
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
            <span className="pre-qty">Qty  x  </span>
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
              <span className="pre-qty">{formatQty(item.quantity)} {' x '} </span>
              <span className="pre-item ">{formatItemName(item.name)}</span>
            </div>
            <div>
              <span className="pre-price">{formatPrice(item.price)}</span>
              <span className="pre-total">
                {formatTotalPrice(item.price * item.quantity)}
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
      <hr className="receipt-dash" /> {/* VAT section */}
      <pre className="receipt-total-pre">
        <span className="total-label">{formatTotalLabel("Vat - 5.00%:")}</span>
        <span className="total-value">{formatTotalPrice(vat)}</span>
      </pre>
      {/* Fifth separator line */}
      <hr className="receipt-dash" />{" "}
      {/* Gross total section */}
      <pre className="receipt-total-pre receipt-grosstotal">
        <span className="total-label">{formatTotalLabel("Gross Total:")}</span>
        <span className="total-value">{formatTotalPrice(grossTotal)}</span>
      </pre>
      {/* Final separator line */}
      <hr className="receipt-dash" /> {/* Notes section */}
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
