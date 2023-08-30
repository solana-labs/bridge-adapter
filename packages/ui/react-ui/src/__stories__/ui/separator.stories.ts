import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { Separator } from "../../shared/index";

const meta: Meta<typeof Separator> = {
  title: "Shared/UI/Separator",
  component: Separator,
};

export default meta;

export const Default: StoryObj<typeof Separator> = {
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const separator = ctx.getByTestId("div");

    await expect(separator).toBeVisible();
  },
};
