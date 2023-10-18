import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/jest";
import { userEvent, within } from "@storybook/testing-library";
import { Button } from "../../shared/index";

const meta: Meta<typeof Button> = {
  title: "Shared/UI/Button",
  component: Button,
};

export default meta;

export const Default: StoryObj<typeof Button> = {
  args: {
    children: "Click me!",
    size: "md",
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const btn = ctx.getByRole("button");
    await userEvent.click(btn);
  },
};

export const Loading: StoryObj<typeof Button> = {
  args: {
    children: "Loaded",
    isLoading: true,
    loadingText: "Loading...",
    size: "md",
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const btn = ctx.getByRole("button");

    await expect(btn).toBeDisabled();
  },
};
