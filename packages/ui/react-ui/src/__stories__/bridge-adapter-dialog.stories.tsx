import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BridgeAdapterProvider,
  EvmWalletProvider,
  SolanaWalletProvider,
} from "@solana/bridge-adapter-react";
import * as WalletAdapters from "@solana/wallet-adapter-wallets";
import { BridgeAdapterDialog } from "../index";
import { Button } from "../shared/index";
import { userEvent, within } from "@storybook/testing-library";
import { walletConnectProjectId, solanaRpcUrl } from "../env";
import { BridgeAdapterTheme } from "../types";

const meta: Meta<typeof BridgeAdapterDialog> = {
  title: "Bridge Adapter Dialog",
  component: BridgeAdapterDialog,
};

export default meta;

export const Default: StoryObj<
  Parameters<typeof BridgeAdapterDialog>[0] & { walletConnectProjectId: string }
> = {
  args: {
    title: "Demo",
    theme: BridgeAdapterTheme.light,
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
            settings={{
              solana: { solanaRpcUrl },
            }}
          >
            <BridgeAdapterDialog theme={props.theme} title={props.title}>
              <Button
                data-testid="open-modal"
                size="sm"
                type="button"
                className="bg-primary mt-8 w-full hover:bg-zinc-400"
              >
                Open demo modal
              </Button>
            </BridgeAdapterDialog>
          </BridgeAdapterProvider>
        </EvmWalletProvider>
      </SolanaWalletProvider>
    );
  },
  async play({ canvasElement, step }) {
    const ctx = within(canvasElement);

    await step("Open Modal", async () => {
      const openModalBtn = ctx.getByTestId("open-modal");
      await userEvent.click(openModalBtn);
    });
  },
};
