import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { PublicKey } from "@solana/web3.js";
import { SolanaWalletProfile } from "../shared/ui/SolanaWalletProfile";

const meta: Meta<typeof SolanaWalletProfile> = {
  title: "Shared/UI/SolanaWalletProfile",
  component: SolanaWalletProfile,
};

export default meta;

export const Empty: StoryObj<typeof SolanaWalletProfile> = {
  args: {},
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const disconnectedEl = ctx.getByRole("status");

    await expect(disconnectedEl).toHaveAttribute("aria-label", "Not Connected");
  },
};

export const Connected: StoryObj<typeof SolanaWalletProfile> = {
  args: {
    isConnected: true,
    publicKey: new PublicKey("So11111111111111111111111111111111111111112"),
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const connectedEl = ctx.getByRole("status");
    const disconnectBtn = ctx.getByRole("button", { name: "Disconnect" });

    await expect(connectedEl).toHaveAttribute("aria-label", "Connected");
    await userEvent.click(disconnectBtn);
  },
};
