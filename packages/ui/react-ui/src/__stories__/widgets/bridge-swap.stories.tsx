import type { Meta, StoryObj } from "@storybook/react";
import { memo } from "react";
import { expect } from "@storybook/jest";
import { within } from "@storybook/testing-library";
import { BridgeSwap } from "../../widgets";

const meta: Meta<typeof BridgeSwap> = {
  title: "Widgets/BridgeSwap",
  component: BridgeSwap,
};

export default meta;

const BodyComponent = memo(() => <div data-testid="body-component">Body</div>);
BodyComponent.displayName = "BodyComponent";

const HeaderComponent = memo(() => (
  <div data-testid="header-component">Header</div>
));
HeaderComponent.displayName = "HeaderComponent";

export const Safe: StoryObj<typeof BridgeSwap> = {
  args: {
    BodyComponent,
    HeaderComponent,
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const bodyComponentEl = ctx.getByTestId("body-component");
    await expect(bodyComponentEl).toBeVisible();
    const headerComponentEl = ctx.getByTestId("header-component");
    await expect(headerComponentEl).toBeVisible();
  },
};
