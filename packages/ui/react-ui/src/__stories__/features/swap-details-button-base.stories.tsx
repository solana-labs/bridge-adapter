import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/jest";
import { within, userEvent } from "@storybook/testing-library";
import { SwapDetailsButtonBase } from "../../features/SwapDetails";

const meta: Meta<typeof SwapDetailsButtonBase> = {
  title: "Features/SwapDetails/SwapDetailsButtonBase",
  component: SwapDetailsButtonBase,
  args: {
    labels: {
      idle: "No Swap Route Found",
      loading: "Fetching Swap Route Details",
      done: "View Swap Route Details",
    },
  },
};

export default meta;

export const Default: StoryObj<typeof SwapDetailsButtonBase> = {
  args: {
    hasDetails: false,
    isLoadingDetails: false,
    isAbleRetrieveDetails: true,
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const btn = ctx.getByRole("button");
    const innerEl = ctx.getByRole("status");

    await expect(btn).toBeVisible();
    await expect(innerEl).toHaveAttribute("aria-label", "Idle");
    await userEvent.click(btn);
  },
};

export const Loading: StoryObj<typeof SwapDetailsButtonBase> = {
  args: {
    hasDetails: false,
    isLoadingDetails: true,
    isAbleRetrieveDetails: true,
  },
};
