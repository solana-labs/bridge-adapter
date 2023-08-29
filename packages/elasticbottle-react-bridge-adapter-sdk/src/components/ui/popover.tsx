"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";
import { cn } from "../../lib/utils";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align as "center" | "start" | "end" | undefined}
      sideOffset={sideOffset}
      className={cn(
        "bsa-z-50 bsa-w-72 bsa-rounded-md bsa-border bsa-bg-popover bsa-p-4 bsa-text-popover-foreground bsa-shadow-md bsa-outline-none data-[state=open]:bsa-animate-in data-[state=closed]:bsa-animate-out data-[state=closed]:bsa-fade-out-0 data-[state=open]:bsa-fade-in-0 data-[state=closed]:bsa-zoom-out-95 data-[state=open]:bsa-zoom-in-95 data-[side=bottom]:bsa-slide-in-from-top-2 data-[side=left]:bsa-slide-in-from-right-2 data-[side=right]:bsa-slide-in-from-left-2 data-[side=top]:bsa-slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverContent, PopoverTrigger };
