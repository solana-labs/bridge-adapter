import React, { useMemo } from "react";
import type { ReactNode } from "react";
import { WagmiConfig, createConfig } from "wagmi";
import type { Connector, configureChains } from "wagmi";

type ChainsConfig = ReturnType<typeof configureChains>;

export function EvmWalletProviderBase({
  autoConnect = false,
  children,
  connectors,
  logger,
  publicClient,
  wsPublicClient,
}: {
  autoConnect?: boolean;
  publicClient: ChainsConfig["publicClient"];
  wsPublicClient: ChainsConfig["webSocketPublicClient"];
  connectors: Connector[];
  logger: {
    warn(m: unknown): void;
  };
  children: ReactNode;
}) {
  const config = useMemo(() => {
    return createConfig({
      autoConnect,
      logger,
      publicClient: publicClient,
      webSocketPublicClient: wsPublicClient,
      connectors: connectors,
    });
  }, [autoConnect, logger, publicClient, wsPublicClient, connectors]);

  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
