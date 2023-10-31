import * as React from "react";
import type { ReactNode } from "react";
import { useDefaultEthereumConfig } from "../entities/ethereum";
import { logger } from "../lib/logger";
import { EvmWalletProviderBase } from "./evm-wallet-provider-base";

export interface EvmWalletProviderProps {
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

  return (
    <EvmWalletProviderBase
      autoConnect
      logger={logger}
      publicClient={publicClient}
      wsPublicClient={webSocketPublicClient}
      connectors={connectors}
    >
      {children}
    </EvmWalletProviderBase>
  );
};
