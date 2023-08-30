import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { Label } from "../../shared/index";

const meta: Meta<typeof Label> = {
  title: "Shared/UI/Label",
  component: Label,
};

export default meta;

export const Default: StoryObj<typeof Label> = {
  args: {
    children: "Label",
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const label = ctx.getByLabelText("label");
    await expect(label).toBeVisible();
  },
};
