import * as React from "react";
import type { ReactNode } from "react";
import { useDefaultEthereumConfig } from "../provider-entities/ethereum";
import { logger } from "../lib/utils";
import { EvmWalletProviderBase } from "./evm-wallet-provider-base";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

interface EvmWalletProviderProps {
  alchemyApiKey?: string;
  children: ReactNode;
  coinbaseWalletSettings?: {
    // TODO : type as the parameter of the coinbase sdk
    appName: string;
  };
  infuraApiKey?: string;
  walletConnectProjectId?: string;
}

export const EvmWalletProvider: React.FC<EvmWalletProviderProps> = ({
  alchemyApiKey,
  children,
  coinbaseWalletSettings,
  infuraApiKey,
  walletConnectProjectId,
}) => {
  const { connectors, publicClient, webSocketPublicClient } =
    useDefaultEthereumConfig({
      alchemyApiKey,
      infuraApiKey,
      coinbaseWalletOptions: coinbaseWalletSettings,
      walletConnectProjectId,
      metamaskWalletOptions: {},
    });

  const defaultLogger = React.useMemo(() => {
    return IS_PRODUCTION ? logger : undefined;
  }, []);

  return (
    <EvmWalletProviderBase
      autoConnect
      logger={defaultLogger}
      publicClient={publicClient}
      wsPublicClient={webSocketPublicClient}
      connectors={connectors}
    >
      {children}
    </EvmWalletProviderBase>
  );
};
