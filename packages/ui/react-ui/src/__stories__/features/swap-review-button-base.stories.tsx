import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/jest";
import { userEvent, within } from "@storybook/testing-library";
import { SwapReviewButtonBase } from "../../features/SwapDetails";

const meta: Meta<typeof SwapReviewButtonBase> = {
  title: "Features/SwapDetails/SwapReviewButtonBase",
  component: SwapReviewButtonBase,
};

export default meta;

export const Default: StoryObj<typeof SwapReviewButtonBase> = {
  args: {
    isAbleReview: true,
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const btn = ctx.getByRole("button");

    await expect(btn).toBeVisible();
    await userEvent.click(btn);
  },
};

export const Disabled: StoryObj<typeof SwapReviewButtonBase> = {
  args: {
    isAbleReview: false,
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const btn = ctx.getByRole("button");

    await expect(btn).toBeVisible();
    await expect(btn).toBeDisabled();
  },
};
