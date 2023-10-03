import * as R from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  EvmWalletProvider,
  SolanaWalletProvider,
  BridgeAdapterProvider,
} from "@solana/bridge-adapter-react";
import { within, userEvent } from "@storybook/testing-library";
import {
  CoinbaseWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { Button } from "../shared/index";
import { BridgeModal } from "../index";
import { BridgeModalTheme } from "../widgets/bridge-modal";

const meta: Meta<typeof BridgeModal> = {
  title: "Demo",
  component: BridgeModal,
};

export default meta;

export const Default: StoryObj<
  Parameters<typeof BridgeModal>[0] & { walletConnectProjectId: string }
> = {
  args: {
    modalTitle: "Demo",
    theme: BridgeModalTheme.light,
    walletConnectProjectId: "",
  },
  render: (props) => {
    if (!props.walletConnectProjectId)
      console.error("Define `walletConnectProjectId`");

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const wallets = R.useMemo(
      () =>
        typeof globalThis.window === "undefined"
          ? []
          : [
              new SolflareWalletAdapter(),
              new PhantomWalletAdapter(),
              new CoinbaseWalletAdapter(),
            ],
      [globalThis.window],
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const evmSettings = R.useMemo(
      () => ({
        coinbaseWalletSettings: {
          appName: props.modalTitle ?? "",
        },
        walletConnectProjectId:
          process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ??
          props.walletConnectProjectId ??
          "",
      }),
      [props.modalTitle],
    );

    return (
      <SolanaWalletProvider wallets={wallets} autoConnect={false}>
        <EvmWalletProvider
          coinbaseWalletSettings={evmSettings.coinbaseWalletSettings}
          walletConnectProjectId={evmSettings.walletConnectProjectId}
        >
          <BridgeAdapterProvider>
            <BridgeModal theme={props.theme} modalTitle={props.modalTitle}>
              <Button
                data-testid="open-modal"
                size="sm"
                type="button"
                className="mt-8 w-full bg-primary hover:bg-zinc-400"
              >
                Open demo modal
              </Button>
            </BridgeModal>
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
