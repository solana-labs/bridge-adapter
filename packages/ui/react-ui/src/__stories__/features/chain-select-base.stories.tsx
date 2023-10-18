import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/jest";
import { userEvent, within } from "@storybook/testing-library";
import { ChainSelectBase } from "../../features/ChainAndTokenSelect";

const meta: Meta<typeof ChainSelectBase> = {
  title: "Features/ChainAndTokenSelect/ChainSelectBase",
  component: ChainSelectBase,
};

export default meta;

export const Default: StoryObj<typeof ChainSelectBase> = {
  args: {
    chains: ["Solana", "Ethereum", "Polygon"],
    isLoadingChains: false,
    chain: "Solana",
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const btn = ctx.getByRole("button", { name: "Solana Chain" });
    await expect(btn).toBeVisible();
    await userEvent.click(btn);

    const btns = ctx.getAllByRole("button");
    await expect(btns).toHaveLength(3);
  },
};

export const Empty: StoryObj<typeof ChainSelectBase> = {};

export const Loading: StoryObj<typeof ChainSelectBase> = {
  args: { isLoadingChains: true },
};
