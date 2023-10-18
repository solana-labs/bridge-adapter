"use client";
import "../shared/styles/global.css";
import * as BridgeAdapterReact from "@solana/bridge-adapter-react";
import * as Notification from "../shared/ui/notification";
import * as React from "react";
import type { BridgeStep } from "@solana/bridge-adapter-react";
import type { ErrorBoundaryProps } from "react-error-boundary";
import type { FallbackProps } from "react-error-boundary";
import type { FC, NamedExoticComponent } from "react";
import { BridgeAdapterTheme } from "../types";
import { Button } from "../shared/ui/button";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export interface BridgeSwapProps {
  BodyComponent: NamedExoticComponent<{ currentBridgeStep: string }>;
  HeaderComponent: NamedExoticComponent<{
    currentBridgeStep: BridgeStep;
    title: string;
  }>;
  onResetAfterError?: ErrorBoundaryProps["onReset"];
  onSwapCompleted?: () => void;
  theme?: BridgeAdapterTheme;
  title: string;
}

/**
 *  Widget
 *
 *  Modal component
 */
export const BridgeSwap: FC<BridgeSwapProps> = ({
  BodyComponent,
  HeaderComponent,
  onResetAfterError,
  onSwapCompleted,
  theme = BridgeAdapterTheme.light,
  title,
}) => {
  const currentBridgeStep =
    BridgeAdapterReact.useBridgeModalStore.use.currentBridgeStep();

  const { notification } = BridgeAdapterReact.useBridgeAdapter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    let tid: NodeJS.Timeout | undefined;
    if (notification) {
      setOpen(true);
      tid = globalThis.setTimeout(() => {
        setOpen(false);
      }, Notification.NOTIFICATION_DURATION);
    }
    return () => {
      if (tid) globalThis.clearTimeout(tid);
    };
  }, [notification]);

  React.useEffect(() => {
    if (theme === BridgeAdapterTheme.dark) {
      document.body.classList.add("bsa-dark");
    } else {
      document.body.classList.remove("bsa-dark");
    }
  }, [theme]);

  React.useEffect(() => {
    if (currentBridgeStep === "TRANSACTION_COMPLETED") {
      if (onSwapCompleted) onSwapCompleted();
    }
  }, [currentBridgeStep, onSwapCompleted]);

  const onReset = React.useCallback(
    (details: Parameters<NonNullable<ErrorBoundaryProps["onReset"]>>[0]) => {
      // Reset the state of your app so the error doesn't happen again
      onResetAfterError && onResetAfterError(details);
    },
    [onResetAfterError],
  );

  if (!BodyComponent) {
    throw new Error("BodyComponent is required");
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className="bsa-h-[600px] bsa-max-w-md bsa-border-border bsa-bg-background bsa-text-foreground bsa-overflow-y"
        style={{
          fontFeatureSettings: '"rlig" 1, "calt" 1',
        }}
      >
        <HeaderComponent currentBridgeStep={currentBridgeStep} title={title} />
        <ErrorBoundary fallbackRender={fallbackRender} onReset={onReset}>
          <div className="bsa-my-4">
            <BodyComponent currentBridgeStep={currentBridgeStep} />
          </div>
        </ErrorBoundary>
        <Notification.NotificationProvider
          rootProps={{ open }}
          className="bsa-absolute"
        >
          {notification ? (
            <Notification.Notification
              title={notification.name}
              description={notification.message}
              variant="error"
            />
          ) : null}
        </Notification.NotificationProvider>
      </div>
    </QueryClientProvider>
  );
};

export function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  if (error instanceof Error) {
    if (error.message.includes("No QueryClient set")) {
      return (
        <>
          <div>Something went wrong while querying.</div>
          <div>
            Did you wrap the{" "}
            <pre className="bsa-inline-block">{"<BridgeModal/>"}</pre> component
            in a{" "}
            <pre className="bsa-inline-block">{"<BridgeAdapterProvider/>"}</pre>
            ?
          </div>
          <Button onClick={resetErrorBoundary}>Retry</Button>
        </>
      );
    }
    if (
      error.message.includes("`useConfig` must be used within `WagmiConfig`.")
    ) {
      return (
        <>
          <div>Error initializing wallet connection list.</div>
          <div>
            Did you wrap the{" "}
            <pre className="bsa-inline-block">{"<BridgeModal/>"}</pre> component
            in a{" "}
            <pre className="bsa-inline-block">{"<EvmWalletProvider/>"}</pre>?
          </div>
          <Button onClick={resetErrorBoundary}>Retry</Button>
        </>
      );
    }
  }
  return (
    <>
      <div>
        Something unknown went wrong, check the developer console for more
        information.
      </div>
      <pre>Raw Error: {JSON.stringify(error)}</pre>
      <Button onClick={resetErrorBoundary}>Retry</Button>
    </>
  );
}
