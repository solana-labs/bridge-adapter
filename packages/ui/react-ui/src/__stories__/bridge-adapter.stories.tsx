import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { Bridges } from "@solana/bridge-adapter-react";
import { BridgeAdapterTheme } from "../types";
import {
  BridgeAdapterProvider,
  EvmWalletProvider,
  SolanaWalletProvider,
} from "@solana/bridge-adapter-react";
import * as WalletAdapters from "@solana/wallet-adapter-wallets";
import { BridgeAdapter } from "../index";
import { expect } from "@storybook/jest";
import { walletConnectProjectId, solanaRpcUrl } from "../env";
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
  Parameters<typeof BridgeAdapter>[0] & { walletConnectProjectId: string } & {
    allowSetting: Bridges[];
    denySetting?: Bridges[];
  }
> = {
  args: {
    allowSetting: ["deBridge"],
    denySetting: undefined,
    walletConnectProjectId,
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

    const bridgeAdapterSettings: { allow: Bridges[]; deny?: Bridges[] } = {
      allow: props.allowSetting,
    };
    if (props.denySetting) bridgeAdapterSettings.deny = props.denySetting;

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
            error={error}
            bridgeAdapterSettings={bridgeAdapterSettings}
            settings={{
              solana: { solanaRpcUrl },
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
