"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";
import { cn } from "../../lib/styles";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "bsa-peer bsa-inline-flex bsa-h-[24px] bsa-w-[44px] bsa-shrink-0 bsa-cursor-pointer bsa-items-center bsa-rounded-full bsa-border-2 bsa-border-transparent bsa-transition-colors focus-visible:bsa-outline-none focus-visible:bsa-ring-2 focus-visible:bsa-ring-ring focus-visible:bsa-ring-offset-2 focus-visible:bsa-ring-offset-background disabled:bsa-cursor-not-allowed disabled:bsa-opacity-50 data-[state=checked]:bsa-bg-primary data-[state=unchecked]:bsa-bg-input",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "bsa-pointer-events-none bsa-block bsa-h-5 bsa-w-5 bsa-rounded-full bsa-bg-background bsa-shadow-lg bsa-ring-0 bsa-transition-transform data-[state=checked]:bsa-translate-x-5 data-[state=unchecked]:bsa-translate-x-0",
      )}
      aria-label="Toggle Switch"
      role="button"
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
