import * as React from "react";
import type { BridgeAdapterSdkArgs } from "@solana/bridge-adapter-base";
import {
  BridgeAdapterSettingsProvider,
  EvmStateProvider,
  SolanaStateProvider,
} from "./features";

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
  adapters,
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

  const bridgeAdapters = React.useMemo(() => adapters, [adapters]);

  return (
    <BridgeAdapterContext.Provider value={data}>
      <BridgeAdapterSettingsProvider
        adapters={bridgeAdapters}
        settings={settings}
        sourceChain={sourceChain}
        targetChain={targetChain}
      >
        <SolanaStateProvider>
          <EvmStateProvider onError={onEvmError}>{children}</EvmStateProvider>
        </SolanaStateProvider>
      </BridgeAdapterSettingsProvider>
    </BridgeAdapterContext.Provider>
  );
}

export function useBridgeAdapter() {
  return React.useContext(BridgeAdapterContext);
}
