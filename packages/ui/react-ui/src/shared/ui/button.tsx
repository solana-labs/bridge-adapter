import * as React from "react";
import type { SpinnerProps } from "./spinner";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../../lib/styles";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "bsa-inline-flex bsa-items-center bsa-justify-center bsa-border bsa-rounded-md bsa-text-sm bsa-font-medium bsa-ring-offset-background bsa-transition-colors focus-visible:bsa-outline-none focus-visible:bsa-ring-2 focus-visible:bsa-ring-ring focus-visible:bsa-ring-offset-2 disabled:bsa-pointer-events-none disabled:bsa-opacity-50",
  {
    variants: {
      variant: {
        default:
          "bsa-bg-primary bsa-text-primary-foreground hover:bsa-bg-primary/90",
        destructive:
          "bsa-bg-destructive bsa-text-destructive-foreground hover:bsa-bg-destructive/90",
        outline:
          "bsa-border bsa-border-input bsa-bg-background hover:bsa-bg-accent hover:bsa-text-accent-foreground",
        secondary:
          "bsa-bg-secondary bsa-text-secondary-foreground hover:bsa-bg-secondary/80",
        ghost: "hover:bsa-bg-accent hover:bsa-text-accent-foreground",
        link: "bsa-text-primary bsa-underline-offset-4 hover:bsa-underline",
      },
      size: {
        md: "bsa-h-10 bsa-px-4 bsa-py-2",
        sm: "bsa-h-9 bsa-rounded-md bsa-px-3 bsa-py-1.5",
        lg: "bsa-h-11 bsa-rounded-md bsa-px-8 bsa-py-4",
        icon: "bsa-h-10 bsa-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      loadingText,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    let spinnerVariant: SpinnerProps["variant"];
    if (variant === "outline" || variant === "link" || variant === "ghost") {
      spinnerVariant = "default";
    } else {
      spinnerVariant = variant;
    }
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        role="button"
        {...props}
        disabled={props.disabled || isLoading}
      >
        {isLoading ? (
          <>
            <Spinner
              size={size === "icon" ? "md" : size}
              variant={spinnerVariant}
            />
            {loadingText && <div>{loadingText}</div>}
          </>
        ) : (
          props.children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
