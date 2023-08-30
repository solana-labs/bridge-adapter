"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import type { FC, ReactNode, NamedExoticComponent } from "react";
import type { FallbackProps } from "react-error-boundary";
import { ErrorBoundary } from "react-error-boundary";
import {
  resetBridgeModalStore,
  useBridgeModalStore,
} from "bridge-adapter-react";
import "../shared/styles/global.css";
import { Button } from "../shared/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../shared/ui/dialog";

const queryClient = new QueryClient();

export enum BridgeModalTheme {
  "dark" = "dark",
  "light" = "light",
}

export interface BridgeModalProps {
  BodyComponent: NamedExoticComponent<{ currentBridgeStep: string }>;
  children: ReactNode;
  headerSlot: ReactNode;
  theme?: BridgeModalTheme;
}

/**
 *  Widget
 *
 *  Modal component
 */
export const BridgeModal: FC<BridgeModalProps> = ({
  BodyComponent,
  children,
  headerSlot,
  theme = BridgeModalTheme.light,
}) => {
  const currentBridgeStep = useBridgeModalStore.use.currentBridgeStep();

  useEffect(() => {
    if (theme === BridgeModalTheme.dark) {
      document.body.classList.add("bsa-dark");
    } else {
      document.body.classList.remove("bsa-dark");
    }
  }, [theme]);

  const onOpenChange = () => {
    if (currentBridgeStep === "TRANSACTION_COMPLETED") {
      resetBridgeModalStore();
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="bsa-h-[600px] bsa-max-w-md bsa-border-border bsa-bg-background bsa-text-foreground"
          style={{
            fontFeatureSettings: '"rlig" 1, "calt" 1',
          }}
        >
          {headerSlot}
          <ErrorBoundary
            fallbackRender={fallbackRender}
            onReset={(details) => {
              console.log("details", details);
              // Reset the state of your app so the error doesn't happen again
            }}
          >
            <div className="bsa-my-4">
              <BodyComponent currentBridgeStep={currentBridgeStep} />
            </div>
          </ErrorBoundary>
        </DialogContent>
      </Dialog>
    </QueryClientProvider>
  );
};

function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  console.log(error);

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
    </>
  );
}
