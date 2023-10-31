import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/jest";
import { within } from "@storybook/testing-library";
import { SingleRelayerFeeInputBase } from "../../features/SwapSettings";

const meta: Meta<typeof SingleRelayerFeeInputBase> = {
  title: "Features/SwapSettings/SingleRelayerFeeInputBase",
  component: SingleRelayerFeeInputBase,
};

export default meta;

export const Default: StoryObj<typeof SingleRelayerFeeInputBase> = {
  args: {
    active: true,
    chain: "Solana",
    token: "SOL",
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const inputEl = ctx.getByRole("text", { name: "Relayer Fee" });
    await expect(inputEl).toHaveValue(0);
    await expect(inputEl).toHaveAttribute("placeholder", "0.00");
  },
};

export const Empty: StoryObj<typeof SingleRelayerFeeInputBase> = {
  args: {},
  async play({ canvasElement }) {
    await expect(canvasElement.children).toHaveLength(0);
  },
};
