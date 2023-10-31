import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { Input } from "../../shared/index";

const meta: Meta<typeof Input> = {
  title: "Shared/UI/Input",
  component: Input,
};

export default meta;

export const Default: StoryObj<typeof Input> = {
  args: {
    type: "text",
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const input = ctx.getByRole("text");

    await expect(input).toBeVisible();

    await userEvent.type(input, "Hello World!");
    await expect(input).toHaveValue("Hello World!");
  },
};
