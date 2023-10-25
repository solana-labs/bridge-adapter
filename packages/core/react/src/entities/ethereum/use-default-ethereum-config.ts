import * as adapters from "./adapters";
import type { Chain, Connector } from "wagmi";
import { arbitrum, avalanche, bsc, optimism, polygon } from "wagmi/chains";
import { configureChains, mainnet } from "wagmi";
import { useMemo } from "react";

export interface DefautEthereiumConfigOptions {
  alchemyApiKey?: string;
  coinbaseWalletOptions?: { appName: string };
  infuraApiKey?: string;
  metamaskWalletOptions?: NonNullable<unknown>;
  walletConnectProjectId?: string;
}

/**
 *  Segment
 *
 *  Provides the default configuration for the Ethereium provider.
 *  @param metamaskWalletOptions - Options for the metamask wallet.
 */
export const useDefaultEthereumConfig = ({
  alchemyApiKey,
  coinbaseWalletOptions,
  infuraApiKey,
  metamaskWalletOptions,
  walletConnectProjectId,
}: DefautEthereiumConfigOptions): Pick<
  ReturnType<typeof configureChains<Chain>>,
  "publicClient" | "webSocketPublicClient"
> & { readonly connectors: Connector[] } => {
  const config = useMemo(() => {
    const supportedChains = [
      mainnet,
      polygon,
      arbitrum,
      optimism,
      bsc,
      avalanche,
    ];

    const supportedProviders = [adapters.publicProvider()];

    if (infuraApiKey) {
      supportedProviders.push(
        adapters.infuraProvider({ apiKey: infuraApiKey }),
      );
    }

    if (alchemyApiKey) {
      supportedProviders.push(
        adapters.alchemyProvider({ apiKey: alchemyApiKey }),
      );
    }

    const { chains, publicClient, webSocketPublicClient } =
      configureChains<Chain>(supportedChains, supportedProviders);

    const injectedConnector = new adapters.InjectedConnector({ chains });

    const supportedConnectors: Connector[] = [injectedConnector];

    if (metamaskWalletOptions) {
      supportedConnectors.push(
        new adapters.MetaMaskConnector({
          options: {
            UNSTABLE_shimOnConnectSelectAccount: true,
            ...metamaskWalletOptions,
          },
        }),
      );
    }

    if (coinbaseWalletOptions) {
      supportedConnectors.push(
        new adapters.CoinbaseWalletConnector({
          chains,
          options: coinbaseWalletOptions,
        }),
      );
    }

    if (walletConnectProjectId) {
      supportedConnectors.push(
        new adapters.WalletConnectConnector({
          chains,
          options: {
            projectId: walletConnectProjectId,
          },
        }),
      );
    }

    return {
      connectors: supportedConnectors,
      publicClient,
      webSocketPublicClient,
    };
  }, [
    alchemyApiKey,
    coinbaseWalletOptions,
    infuraApiKey,
    metamaskWalletOptions,
    walletConnectProjectId,
  ]);

  return config;
};
