import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BridgeAdapterTheme } from "../types";
import {
  BridgeAdapterProvider,
  EvmWalletProvider,
  SolanaWalletProvider,
} from "@solana/bridge-adapter-react";
import * as WalletAdapters from "@solana/wallet-adapter-wallets";
import { BridgeAdapter } from "../index";
import { expect } from "@storybook/jest";
import { AllBridgeCoreBridgeAdapter } from "@solana/bridge-adapter-allbridge-core-adapter";
//import { DeBridgeBridgeAdapter } from "@solana/bridge-adapter-debridge-adapter";
//import { WormholeBridgeAdapter } from "@solana/bridge-adapter-wormhole-adapter";
import {
  walletConnectProjectId,
  solanaRpcUrl,
  infuraApiKey,
  alchemyApiKey,
} from "../env";
import { within } from "@storybook/testing-library";

const meta: Meta<typeof BridgeAdapter> = {
  title: "Bridge Adapter",
  component: BridgeAdapter,
  args: {
    title: "Demo",
    theme: BridgeAdapterTheme.light,
  },
};

export default meta;

export const Default: StoryObj<
  Parameters<typeof BridgeAdapter>[0] & {
    walletConnectProjectId?: string;
    infuraApiKey?: string;
    alchemyApiKey?: string;
    solanaRpcUrl?: string;
  }
> = {
  args: {
    walletConnectProjectId,
    infuraApiKey,
    alchemyApiKey,
    solanaRpcUrl,
  },
  render: (props) => {
    if (!props.walletConnectProjectId) {
      throw new Error("Define `walletConnectProjectId`");
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const wallets = React.useMemo(
      () =>
        typeof globalThis.window === "undefined"
          ? []
          : [
              new WalletAdapters.SolflareWalletAdapter(),
              new WalletAdapters.CoinbaseWalletAdapter(),
            ],
      [],
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const evmSettings = React.useMemo(
      () => ({
        coinbaseWalletSettings: {
          appName: props.title ?? "",
        },
        walletConnectProjectId: props.walletConnectProjectId,
      }),
      [props.title, props.walletConnectProjectId],
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error, setError] = React.useState<Error | undefined>();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const adapters = React.useMemo(
      () => [
        // FIXME: remove on completion
        AllBridgeCoreBridgeAdapter,
        //DeBridgeBridgeAdapter, WormholeBridgeAdapter
      ],
      [],
    );

    return (
      <SolanaWalletProvider
        wallets={wallets}
        autoConnect={false}
        onError={(e: Error) => setError(e)}
      >
        <EvmWalletProvider
          coinbaseWalletSettings={evmSettings.coinbaseWalletSettings}
          walletConnectProjectId={evmSettings.walletConnectProjectId}
        >
          <BridgeAdapterProvider
            adapters={adapters}
            error={error}
            settings={{
              evm: {
                infuraApiKey: props.infuraApiKey,
                alchemyApiKey: props.alchemyApiKey,
              },
              solana: { solanaRpcUrl: props.solanaRpcUrl },
            }}
          >
            <BridgeAdapter theme={props.theme} title={props.title} />
          </BridgeAdapterProvider>
        </EvmWalletProvider>
      </SolanaWalletProvider>
    );
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const headerEl = ctx.getByLabelText("Select Tokens");
    await expect(headerEl).toBeVisible();
  },
};
