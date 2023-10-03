import * as React from "react";
import type { BridgeAdapterSdkArgs } from "@solana/bridge-adapter-base";
import { BridgeModalProvider } from "./providers/BridgeModalProvider";
import { EvmStateProvider, SolanaStateProvider } from "./features";

interface BridgeAdapterContextState {}

const STATE = {};

const BridgeAdapterContext =
  React.createContext<BridgeAdapterContextState>(STATE);

export function BridgeAdapterProvider({
  children,
  bridgeAdapterSetting,
  sourceChain,
  targetChain,
  settings,
}: BridgeAdapterSdkArgs & {
  children: React.ReactNode;
}) {
  const data = React.useMemo(() => ({}), []);

  return (
    <BridgeAdapterContext.Provider value={data}>
      <BridgeModalProvider
        bridgeAdapterSetting={bridgeAdapterSetting}
        sourceChain={sourceChain}
        targetChain={targetChain}
        settings={settings}
      >
        <SolanaStateProvider>
          <EvmStateProvider>{children}</EvmStateProvider>
        </SolanaStateProvider>
      </BridgeModalProvider>
    </BridgeAdapterContext.Provider>
  );
}

export function useBridgeAdapter() {
  return React.useContext(BridgeAdapterContext);
}
