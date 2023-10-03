import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/jest";
import { within, userEvent } from "@storybook/testing-library";
import { SlippageToleranceBase } from "../../features/SwapSettings";

const meta: Meta<typeof SlippageToleranceBase> = {
  title: "Features/SwapSettings/SlippageToleranceBase",
  component: SlippageToleranceBase,
};

export default meta;

export const Default: StoryObj<typeof SlippageToleranceBase> = {
  args: {
    slippageTolerance: "auto",
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const inputEl = ctx.getByRole("text", { name: "Slippage Tolerance" });
    await expect(inputEl).toHaveValue("");
    await expect(inputEl).toHaveAttribute("placeholder", "0.00");
    await userEvent.type(inputEl, "0.01");
  },
};
