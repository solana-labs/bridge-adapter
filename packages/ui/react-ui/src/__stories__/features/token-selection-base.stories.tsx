import type { Meta, StoryObj } from "@storybook/react";
import { TokenSelectionBase } from "../../features/TokenSelection";
import * as mock from "../../__mocks__/token";

const meta: Meta<typeof TokenSelectionBase> = {
  title: "Features/TokenSelection/TokenSelectionBase",
  component: TokenSelectionBase,
};

export default meta;

export const Default: StoryObj<typeof TokenSelectionBase> = {
  args: {
    tokens: [
      mock.solanaToken({ symbol: "SOL" }),
      mock.ethereumToken({ symbol: "ETH" }),
    ],
    isLoadingTokens: false,
    chain: "Solana",
  },
};
