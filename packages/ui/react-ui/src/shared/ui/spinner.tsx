import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/styles";

const spinnerVariants = cva("bsa-p-1 bsa-animate-spin bsa-rounded-full", {
  variants: {
    variant: {
      default: "bsa-bg-primary-background",
      destructive: "bsa-bg-destructive bsa-text-destructive-foreground",
      secondary:
        "bsa-bg-secondary bsa-text-secondary-foreground hover:bsa-bg-secondary/80",
    },
    size: {
      md: "bsa-h-7 bsa-w-7",
      sm: "bsa-h-6 bsa-w-6",
      lg: "bsa-h-8 bsa-w-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Loader2
        ref={ref}
        {...props}
        className={cn(spinnerVariants({ variant, size, className }))}
      />
    );
  },
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
