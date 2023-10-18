import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { EvmWalletProfile } from "../../features/MultiChainWalletButton";

const meta: Meta<typeof EvmWalletProfile> = {
  title: "Features/MultiChainWalletButton/EvmWalletProfile",
  component: EvmWalletProfile,
};

export default meta;

export const Empty: StoryObj<typeof EvmWalletProfile> = {
  args: {},
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const disconnectedEl = ctx.getByRole("status");

    await expect(disconnectedEl).toHaveAttribute("aria-label", "Not Connected");
  },
};

export const Connected: StoryObj<typeof EvmWalletProfile> = {
  args: {
    isConnected: true,
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const connectedEl = ctx.getByRole("status");
    const disconnectBtn = ctx.getByRole("button", { name: "Disconnect" });

    await expect(connectedEl).toHaveAttribute("aria-label", "Connected");
    await userEvent.click(disconnectBtn);
  },
};
