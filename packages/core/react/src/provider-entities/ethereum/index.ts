import { useMemo } from "react";
import { configureChains, mainnet } from "wagmi";
import type { Chain, Connector } from "wagmi";
import { arbitrum, avalanche, bsc, optimism, polygon } from "wagmi/chains";
import * as providers from "./providers";
import * as connectors from "./connectors";

interface DefautEthereiumConfigOptions {
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

    const supportedProviders = [providers.publicProvider()];

    if (infuraApiKey) {
      supportedProviders.push(
        providers.infuraProvider({ apiKey: infuraApiKey }),
      );
    }

    if (alchemyApiKey) {
      supportedProviders.push(
        providers.alchemyProvider({ apiKey: alchemyApiKey }),
      );
    }

    const { chains, publicClient, webSocketPublicClient } =
      configureChains<Chain>(supportedChains, supportedProviders);

    const injectedConnector = new connectors.InjectedConnector({ chains });

    const supportedConnectors: Connector[] = [injectedConnector];

    if (metamaskWalletOptions) {
      supportedConnectors.push(
        new connectors.MetaMaskConnector({
          options: {
            UNSTABLE_shimOnConnectSelectAccount: true,
            ...metamaskWalletOptions,
          },
        }),
      );
    }

    if (coinbaseWalletOptions) {
      supportedConnectors.push(
        new connectors.CoinbaseWalletConnector({
          chains,
          options: coinbaseWalletOptions,
        }),
      );
    }

    if (walletConnectProjectId) {
      supportedConnectors.push(
        new connectors.WalletConnectConnector({
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
