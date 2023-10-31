import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/jest";
import { userEvent, within } from "@storybook/testing-library";
import { SolanaWalletConnectionListBase } from "../../features/WalletSelection";
import type { SolanaWalletData } from "../../features/WalletSelection";

const meta: Meta<typeof SolanaWalletConnectionListBase> = {
  title: "Features/WalletSelection/SolanaWalletConnectionListBase",
  component: SolanaWalletConnectionListBase,
};

export default meta;

const wallet = (name: string) => {
  const walletName = name as SolanaWalletData["adapter"]["name"];
  return {
    adapter: { name: walletName, icon: "" },
  };
};

export const Default: StoryObj<typeof SolanaWalletConnectionListBase> = {
  args: {
    wallets: [wallet("Phantom"), wallet("Solflare")],
    buttonState: "connected",
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const btn = ctx.getByRole("button", { name: "Phantom Wallet" });
    await expect(btn).toBeEnabled();
    await userEvent.click(btn);

    const btns = ctx.getAllByRole("button");
    await expect(btns).toHaveLength(2);
  },
};
