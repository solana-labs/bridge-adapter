import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import type { VariantProps } from "class-variance-authority";
import type { ToastProps, ToastProviderProps } from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { cn } from "../lib/styles";

const notificationVariants = cva(
  "bsa-pointer-events-auto bsa-flex bsa-w-full bsa-max-w-md bsa-divide-x bsa-divide-gray-200 bsa-rounded-lg bsa-shadow-lg bsa-ring-1 bsa-ring-black bsa-ring-opacity-5",
  {
    variants: {
      variant: {
        default: "bsa-bg-white",
        error: "bsa-bg-red-50",
      },
    },
  },
);

export interface NotificationProps
  extends React.ComponentPropsWithoutRef<React.FC>,
    VariantProps<typeof notificationVariants> {
  description: string;
  title: string;
}

export const NOTIFICATION_DURATION = 5_000;

export const Notification = React.forwardRef<
  React.ElementRef<React.FC>,
  NotificationProps
>(({ variant, title, description }, ref) => (
  <div className={notificationVariants({ variant })} ref={ref}>
    <div className="bsa-flex bsa-w-0 bsa-flex-1 bsa-items-start bsa-p-4">
      <div className="bsa-w-full">
        <Toast.Title className="bsa-text-sm bsa-font-bold bsa-text-gray-900 bsa-mb-1">
          {title}
        </Toast.Title>
        <Toast.Description className="bsa-mt-1 bsa-text-sm bsa-text-gray-500">
          {description}
        </Toast.Description>
      </div>
    </div>
  </div>
));
Notification.displayName = "Notification";

export interface NotificationProviderProps
  extends Pick<ToastProviderProps, "duration" | "children"> {
  className?: string;
  rootProps: ToastProps;
}

/**
 *  Notification Provider
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  duration = NOTIFICATION_DURATION,
  className,
  rootProps,
}) => (
  <Toast.Provider duration={duration}>
    <div
      className={cn(
        "bsa-left-1.5 bsa-bottom-1.5 bsa-w-[calc(100%-3rem)]",
        className,
      )}
    >
      <Toast.Root {...rootProps}>{children}</Toast.Root>
      <Toast.Viewport />
    </div>
  </Toast.Provider>
);
