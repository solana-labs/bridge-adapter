import { useMemo } from "react";
import type { ReactNode } from "react";
import { WagmiConfig, createConfig } from "wagmi";
import { useDefaultEtheriumConfig } from "../provider-entities/etherium";
import { logger } from "../lib/utils";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export function EvmWalletProvider({
  alchemyApiKey,
  children,
  coinbaseWalletSettings,
  infuraApiKey,
  walletConnectProjectId,
}: {
  alchemyApiKey?: string;
  children: ReactNode;
  coinbaseWalletSettings?: {
    // TODO : type as the parameter of the coinbase sdk
    appName: string;
  };
  infuraApiKey?: string;
  walletConnectProjectId?: string;
}) {
  const { connectors, publicClient, webSocketPublicClient } =
    useDefaultEtheriumConfig({
      alchemyApiKey,
      infuraApiKey,
      coinbaseWalletOptions: coinbaseWalletSettings,
      walletConnectProjectId,
      metamaskWalletOptions: {},
    });

  const defaultLogger = useMemo(() => {
    return IS_PRODUCTION ? logger : undefined;
  }, []);

  const config = useMemo(() => {
    return createConfig({
      autoConnect: true,
      logger: defaultLogger,
      publicClient: publicClient,
      webSocketPublicClient,
      connectors: connectors,
    });
  }, [defaultLogger, publicClient, webSocketPublicClient, connectors]);

  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
