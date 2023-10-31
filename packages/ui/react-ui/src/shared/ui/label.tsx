"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../lib/styles";

const labelVariants = cva(
  "bsa-text-sm bsa-font-medium bsa-leading-none peer-disabled:bsa-cursor-not-allowed peer-disabled:bsa-opacity-70",
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    aria-label="label"
    className={cn(labelVariants(), className)}
    ref={ref}
    {...props}
  />
));
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
