import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/jest";
import { userEvent, within } from "@storybook/testing-library";
import { WalletSelectionButtonBase } from "../../features/WalletSelection";

const meta: Meta<typeof WalletSelectionButtonBase> = {
  title: "Features/WalletSelection/WalletSelectionButtonBase",
  component: WalletSelectionButtonBase,
};

export default meta;

export const Default: StoryObj<typeof WalletSelectionButtonBase> = {
  args: {
    canConnectWallet: true,
    hasSourceChain: true,
    hasTargetChain: true,
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const btn = ctx.getByRole("button", { name: "Connect Wallet" });
    await expect(btn).toBeEnabled();
    await userEvent.click(btn);
  },
};

export const WithDisconenctedChains: StoryObj<
  typeof WalletSelectionButtonBase
> = {
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const btn = ctx.getByRole("button", { name: "Select Tokens" });
    await expect(btn).toBeDisabled();
  },
};
