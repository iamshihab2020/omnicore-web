"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, onCheckedChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(event.target.checked);
      }
    };

    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="checkbox"
            ref={ref}
            checked={checked}
            onChange={handleChange}
            className={cn(
              "peer h-4 w-4 shrink-0 opacity-0 absolute",
              className
            )}
            {...props}
          />
          <div
            className={cn(
              "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "peer-checked:bg-primary",
              "flex items-center justify-center",
              "transition-colors"
            )}
          >
            {checked && <Check className="h-3 w-3 text-primary-foreground" />}
          </div>
        </div>
        {label && <span className="text-sm">{label}</span>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
Checkbox.displayName = "Checkbox";

export { Checkbox };
