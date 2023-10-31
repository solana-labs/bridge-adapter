import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import type { Wallet } from "@solana/wallet-adapter-react";
import { WalletAdapterIcon } from "../../shared/index";

const meta: Meta<typeof WalletAdapterIcon> = {
  title: "Shared/UI/Icons/WalletAdapterIcon",
  component: WalletAdapterIcon,
};

export default meta;

export const Default: StoryObj<typeof WalletAdapterIcon> = {
  args: {
    wallet: {
      adapter: {
        icon: "",
        name: "Phantom",
      } as Wallet["adapter"],
    },
  },
  render: ({ wallet }) => (
    <WalletAdapterIcon data-testid="icon" wallet={wallet} />
  ),
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const icon = ctx.getByTestId("icon");

    await expect(icon).toBeVisible();
    await expect(icon).toHaveAttribute("alt", "Phantom icon");
  },
};
