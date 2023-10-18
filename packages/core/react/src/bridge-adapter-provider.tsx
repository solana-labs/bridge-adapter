import * as React from "react";
import type { BridgeAdapterSdkArgs } from "@solana/bridge-adapter-base";
import { BridgeModalProvider } from "./providers/BridgeModalProvider";
import { EvmStateProvider, SolanaStateProvider } from "./features";

export interface BridgeAdapterContextState {
  /// Non-blocking notification about some kind of error.
  notification: Error | undefined;
  setNotification: (_?: Error) => void;
}

const STATE = {
  notification: undefined,
  setNotification() {},
};

const BridgeAdapterContext =
  React.createContext<BridgeAdapterContextState>(STATE);

export function BridgeAdapterProvider({
  bridgeAdapterSetting,
  children,
  error,
  settings,
  sourceChain,
  targetChain,
}: BridgeAdapterSdkArgs & {
  children: React.ReactNode;
  error?: Error;
}) {
  const [notification, setNotification] = React.useState(error);

  React.useEffect(() => {
    /// Handle any external error which is can not be obtained via hook
    setNotification(error);

    return () => {};
  }, [error, setNotification]);

  const onEvmError = React.useCallback(
    (err: Error) => {
      setNotification(err);
    },
    [setNotification],
  );

  const data = React.useMemo(
    () => ({
      notification,
      setNotification,
    }),
    [notification, setNotification],
  );

  return (
    <BridgeAdapterContext.Provider value={data}>
      <BridgeModalProvider
        bridgeAdapterSetting={bridgeAdapterSetting}
        settings={settings}
        sourceChain={sourceChain}
        targetChain={targetChain}
      >
        <SolanaStateProvider>
          <EvmStateProvider onError={onEvmError}>{children}</EvmStateProvider>
        </SolanaStateProvider>
      </BridgeModalProvider>
    </BridgeAdapterContext.Provider>
  );
}

export function useBridgeAdapter() {
  return React.useContext(BridgeAdapterContext);
}
