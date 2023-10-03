import * as React from "react";
import type { WalletProviderProps } from "@solana/wallet-adapter-react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";

interface SolanaWalletProviderProps
  extends Omit<WalletProviderProps, "wallets"> {
  wallets?: WalletProviderProps["wallets"];
  rpcUrl?: string;
}

export const SolanaWalletProvider: React.FC<SolanaWalletProviderProps> = ({
  autoConnect = false,
  children,
  rpcUrl,
  wallets = [],
}) => {
  const adapters = React.useMemo(() => [...wallets], [wallets]);

  return (
    <ConnectionProvider endpoint={rpcUrl ?? clusterApiUrl("mainnet-beta")}>
      <WalletProvider wallets={adapters} autoConnect={autoConnect}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};
