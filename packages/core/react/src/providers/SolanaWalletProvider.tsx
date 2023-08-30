import React, { useMemo } from "react";
import type { WalletProviderProps } from "@solana/wallet-adapter-react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";

export interface SolanaWalletProviderProps
  extends Omit<WalletProviderProps, "wallets"> {
  wallets?: WalletProviderProps["wallets"];
  rpcUrl?: string;
}

export const SolanaWalletProvider: React.FC<SolanaWalletProviderProps> = ({
  children,
  wallets = [],
  autoConnect = true,
  rpcUrl,
}) => {
  const adapters = useMemo(() => [...wallets], [wallets]);

  return (
    <ConnectionProvider endpoint={rpcUrl ?? clusterApiUrl("mainnet-beta")}>
      <WalletProvider wallets={adapters} autoConnect={autoConnect}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};
