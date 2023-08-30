import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { Switch } from "../../shared/index";

const meta: Meta<typeof Switch> = {
  title: "Shared/UI/Switch",
  component: Switch,
};

export default meta;

export const Default: StoryObj<typeof Switch> = {
  render: (props) => (
    <Switch data-testid="toggle" {...props}>
      Toggle
    </Switch>
  ),
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const switchEl = ctx.getByTestId("toggle");

    await expect(switchEl).toBeVisible();
    await userEvent.click(switchEl);
  },
};
