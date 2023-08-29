import React, { useMemo } from "react";
import {
  WagmiConfig,
  configureChains,
  createConfig,
  mainnet,
  type Chain,
  type ChainProviderFn,
} from "wagmi";
import { arbitrum, avalanche, bsc, optimism, polygon } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

export function EvmWalletProvider({
  children,
  settings,
}: {
  settings?: {
    walletConnectProjectId?: string;
    alchemyApiKey?: string;
    infuraApiKey?: string;
    coinbaseWalletSettings?: {
      // TODO : type as the parameter of the coinbase sdk
      appName: string;
    };
  };
  children: React.ReactNode;
}) {
  const infuraApiKey = settings?.infuraApiKey;
  const alchemyApiKey = settings?.alchemyApiKey;
  const walletConnectProjectId = settings?.walletConnectProjectId;
  const coinbaseWalletSettings = settings?.coinbaseWalletSettings;

  const config = useMemo(() => {
    const { chains, publicClient, webSocketPublicClient } =
      configureChains<Chain>(
        [mainnet, polygon, arbitrum, optimism, bsc, avalanche],
        [
          publicProvider(),
          !!infuraApiKey && infuraProvider({ apiKey: infuraApiKey }),
          !!alchemyApiKey && alchemyProvider({ apiKey: alchemyApiKey }),
        ].filter(Boolean) as ChainProviderFn<Chain>[]
      );

    const connectors: (InjectedConnector | WalletConnectConnector)[] = [
      new MetaMaskConnector({
        options: {
          UNSTABLE_shimOnConnectSelectAccount: true,
        },
      }),
      new InjectedConnector({ chains }),
      !!coinbaseWalletSettings &&
        new CoinbaseWalletConnector({
          chains,
          options: coinbaseWalletSettings,
        }),
      !!walletConnectProjectId &&
        new WalletConnectConnector({
          chains,
          options: {
            projectId: walletConnectProjectId,
          },
        }),
    ].filter(Boolean) as (InjectedConnector | WalletConnectConnector)[];

    const config = createConfig({
      autoConnect: true,
      publicClient,
      webSocketPublicClient,
      connectors,
      logger: {
        warn: (message) => {
          process.env.NODE_ENV === "development" && console.warn(message);
        },
      },
    });
    return config;
  }, [
    alchemyApiKey,
    coinbaseWalletSettings,
    infuraApiKey,
    walletConnectProjectId,
  ]);

  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
