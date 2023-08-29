"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import type { FallbackProps } from "react-error-boundary";
import { ErrorBoundary } from "react-error-boundary";
import {
  resetBridgeModalStore,
  useBridgeModalStore,
} from "../../providers/BridgeModalContext";
import "../../style/global.css";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { BridgeHeader } from "./BridgeHeader";
import { ChainAndTokenSelect } from "./ChainAndTokenSelect";
import { MultiChainSelection } from "./MultiChainSelection";
import { PendingTransaction } from "./PendingTransaction";
import { ProfileDetails } from "./ProfileDetails";
import { SwapDetails } from "./SwapDetails";
import { SwapReview } from "./SwapReview";
import { SwapSettings } from "./SwapSettings";
import { TokenSelection } from "./TokenSelection";
import { CompletedTransaction } from "./TransactionCompleted";
import { WalletSelection } from "./WalletSelection";

const queryClient = new QueryClient();

type BridgeModalProps = {
  children: React.ReactNode;
  customization?: Partial<{ modalTitle: string; theme: "dark" | "light" }>;
};

export function BridgeModal({ children, customization }: BridgeModalProps) {
  const currentBridgeStep = useBridgeModalStore.use.currentBridgeStep();

  useEffect(() => {
    if (customization?.theme === "dark") {
      document.body.classList.add("bsa-dark");
    } else {
      document.body.classList.remove("bsa-dark");
    }
  }, [customization?.theme]);

  let body: React.ReactNode;
  switch (currentBridgeStep) {
    case "MULTI_CHAIN_SELECTION": {
      body = <MultiChainSelection />;
      break;
    }

    case "PENDING_TRANSACTION": {
      body = <PendingTransaction />;
      break;
    }
    case "SWAP_DETAILS": {
      body = <SwapDetails />;
      break;
    }
    case "SWAP_REVIEW": {
      body = <SwapReview />;
      break;
    }
    case "SWAP_SETTINGS": {
      body = <SwapSettings />;
      break;
    }
    case "TOKEN_SELECTION": {
      body = <TokenSelection />;
      break;
    }
    case "WALLET_SELECTION": {
      body = <WalletSelection />;
      break;
    }
    case "PROFILE_DETAILS": {
      body = <ProfileDetails />;
      break;
    }
    case "TOKEN_CHAIN_SELECTION": {
      body = <ChainAndTokenSelect />;
      break;
    }
    case "TRANSACTION_COMPLETED": {
      body = <CompletedTransaction />;
      break;
    }
    default:
      throw new Error(`BAD STATE: Unknown bridge step`);
  }

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
          <BridgeHeader title={customization?.modalTitle} />
          <ErrorBoundary
            fallbackRender={fallbackRender}
            onReset={(details) => {
              console.log("details", details);
              // Reset the state of your app so the error doesn't happen again
            }}
          >
            <div className="bsa-my-4">{body}</div>
          </ErrorBoundary>
        </DialogContent>
      </Dialog>
    </QueryClientProvider>
  );
}

function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
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
  console.error(error);
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
