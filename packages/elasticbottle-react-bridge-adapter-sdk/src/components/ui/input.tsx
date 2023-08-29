import * as React from "react";
import { cn } from "../../lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "bsa-flex bsa-h-10 bsa-w-full bsa-rounded-md bsa-border bsa-border-input bsa-bg-background bsa-px-3 bsa-py-2 bsa-text-sm bsa-ring-offset-background file:bsa-border-0 file:bsa-bg-transparent file:bsa-text-sm file:bsa-font-medium placeholder:bsa-text-muted-foreground focus-visible:bsa-outline-none focus-visible:bsa-ring-2 focus-visible:bsa-ring-ring focus-visible:bsa-ring-offset-2 disabled:bsa-cursor-not-allowed disabled:bsa-opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
