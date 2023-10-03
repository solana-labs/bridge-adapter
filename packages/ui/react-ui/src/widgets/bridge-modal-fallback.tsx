import type { FallbackProps } from "react-error-boundary";
import { Button } from "../shared/ui/button";

export function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
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
