"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as React from "react";
import { cn } from "../lib/styles";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref,
  ) => {
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        data-testid="div"
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "bsa-shrink-0 bsa-bg-border",
          orientation === "horizontal"
            ? "bsa-h-[1px] bsa-w-full"
            : "bsa-h-full bsa-w-[1px]",
          className,
        )}
        {...props}
      />
    );
  },
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
