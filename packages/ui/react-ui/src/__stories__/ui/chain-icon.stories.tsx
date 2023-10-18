import type { Meta, StoryObj } from "@storybook/react";
import type { ChainSelectionType } from "@solana/bridge-adapter-react";
import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { ChainIcon } from "../../shared/index";

const meta: Meta<typeof ChainIcon> = {
  title: "Shared/UI/Icons/ChainIcon",
  component: ChainIcon,
};

export default meta;

export const Default: StoryObj<typeof ChainIcon> = {
  args: {
    size: "md",
    chainName: "Select a chain",
  },
  render: (props) => {
    const chains: ChainSelectionType[] = [
      "Ethereum",
      "Solana",
      "Polygon",
      "Arbitrum",
      "Optimism",
      "Avalanche",
      "BSC",
      "Select a chain",
    ];

    return (
      <div data-testid="icons">
        <ChainIcon {...props} />
        All
        {chains.map((chainName) => (
          <ChainIcon key={chainName} {...props} chainName={chainName} />
        ))}
      </div>
    );
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const icons = ctx.getByTestId("icons");
    await expect(icons).toBeVisible();
  },
};
