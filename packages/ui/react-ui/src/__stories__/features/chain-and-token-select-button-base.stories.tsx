import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/jest";
import { within, userEvent } from "@storybook/testing-library";
import { ChainAndTokenSelectButtonBase } from "../../features/ChainAndTokenSelect";
import * as mocks from "../../__mocks__/token";

const meta: Meta<typeof ChainAndTokenSelectButtonBase> = {
  title: "Features/ChainAndTokenSelect/ChainAndTokenSelectButtonBase",
  component: ChainAndTokenSelectButtonBase,
};

export default meta;

export const Default: StoryObj<typeof ChainAndTokenSelectButtonBase> = {
  args: {
    chain: "Solana",
    token: mocks.solanaToken(),
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const btn = ctx.getByRole("button", { name: "Select Token" });
    await expect(btn).toBeVisible();
    await userEvent.click(btn);
  },
};
