import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/jest";
import { within } from "@storybook/testing-library";
import { RelayerFeeBase } from "../../features/SwapSettings";
import * as mock from "../../__mocks__/token";

const meta: Meta<typeof RelayerFeeBase> = {
  title: "Features/SwapSettings/RelayerFeeBase",
  component: RelayerFeeBase,
};

export default meta;

export const Default: StoryObj<typeof RelayerFeeBase> = {
  args: {
    active: true,
    sourceChain: "Ethereum",
    sourceFee: 0,
    sourceToken: mock.ethereumTokenWithAmount({ symbol: "ETH" }),
    targetChain: "Solana",
    targetFee: 1,
    targetToken: mock.solanaTokenWithAmount({ symbol: "SOL" }),
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const inputEls = ctx.getAllByRole("text", { name: "Relayer Fee" });
    await expect(inputEls).toHaveLength(2);
  },
};

export const Empty: StoryObj<typeof RelayerFeeBase> = {
  args: {
    sourceChain: "Select a chain",
    targetChain: "Select a chain",
  },
  async play({ canvasElement }) {
    await expect(canvasElement.children).toHaveLength(0);
  },
};
