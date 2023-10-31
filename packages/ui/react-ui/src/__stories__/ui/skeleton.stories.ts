import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { Skeleton } from "../../shared/index";

const meta: Meta<typeof Skeleton> = {
  title: "Shared/UI/Skeleton",
  component: Skeleton,
};

export default meta;

export const Default: StoryObj<typeof Skeleton> = {
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const skeleton = ctx.getByRole("figure");

    await expect(skeleton).toBeVisible();
  },
};
