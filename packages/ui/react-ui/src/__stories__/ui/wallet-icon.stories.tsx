import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { WalletIcon, WalletName } from "../../shared/index";

const meta: Meta<typeof WalletIcon> = {
  title: "Shared/UI/Icons/WalletIcon",
  component: WalletIcon,
};

export default meta;

export const Default: StoryObj<typeof WalletIcon> = {
  args: {
    walletName: WalletName.walletConnect,
    background: false,
  },
  render: (props) => <WalletIcon data-testid="icon" {...props} />,
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const icon = ctx.getByTestId("icon");

    await expect(icon).toBeVisible();
  },
};
