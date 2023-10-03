"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { cn } from "../lib/styles";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal: React.FC<DialogPrimitive.DialogPortalProps> = ({
  className,
  ...props
}) => <DialogPrimitive.Portal className={cn(className)} {...props} />;
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "bsa-fixed bsa-inset-0 bsa-z-50 bsa-bg-background/80 bsa-backdrop-blur-sm data-[state=open]:bsa-animate-in data-[state=closed]:bsa-animate-out data-[state=closed]:bsa-fade-out-0 data-[state=open]:bsa-fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <DialogPortal about="">
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "bsa-fixed bsa-left-[50%] bsa-top-[50%] bsa-z-50 bsa-grid bsa-w-full bsa-max-w-lg bsa-translate-x-[-50%] bsa-translate-y-[-50%] bsa-auto-rows-min bsa-gap-4 bsa-border bsa-bg-background bsa-p-6 bsa-shadow-lg bsa-duration-200 data-[state=open]:bsa-animate-in data-[state=closed]:bsa-animate-out data-[state=closed]:bsa-fade-out-0 data-[state=open]:bsa-fade-in-0 data-[state=closed]:bsa-zoom-out-95 data-[state=open]:bsa-zoom-in-95 data-[state=closed]:bsa-slide-out-to-left-1/2 data-[state=closed]:bsa-slide-out-to-top-[48%] data-[state=open]:bsa-slide-in-from-left-1/2 data-[state=open]:bsa-slide-in-from-top-[48%] sm:bsa-rounded-lg md:bsa-w-full",
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "bsa-flex bsa-flex-col bsa-space-y-1.5 bsa-text-center sm:bsa-text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "bsa-flex bsa-flex-col-reverse sm:bsa-flex-row sm:bsa-justify-end sm:bsa-space-x-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "bsa-text-lg bsa-font-semibold bsa-leading-none bsa-tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("bsa-text-sm bsa-text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
