import type { Connector, configureChains } from "wagmi";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { WagmiConfig, createConfig } from "wagmi";

type ChainsConfig = ReturnType<typeof configureChains>;

type WagmiLogger = Parameters<typeof createConfig>[0]["logger"];

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
  logger: WagmiLogger;
  children: ReactNode;
}) {
  const config = useMemo(() => {
    return createConfig({
      autoConnect,
      logger,
      publicClient: publicClient,
      webSocketPublicClient: wsPublicClient,
      connectors,
    });
  }, [autoConnect, connectors, logger, publicClient, wsPublicClient]);

  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
