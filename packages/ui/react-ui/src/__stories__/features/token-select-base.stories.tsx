import type { Meta, StoryObj } from "@storybook/react";
import { TokenSelectBase } from "../../features/ChainAndTokenSelect";
import * as mock from "../../__mocks__/token";

const meta: Meta<typeof TokenSelectBase> = {
  title: "Features/ChainAndTokenSelect/TokenSelectBase",
  component: TokenSelectBase,
};

export default meta;

export const Default: StoryObj<typeof TokenSelectBase> = {
  args: {
    tokens: [
      mock.solanaToken({ symbol: "SOL" }),
      mock.ethereumToken({ symbol: "ETH" }),
    ],
    isLoadingTokens: false,
    chain: "Solana",
  },
};

export const Empty: StoryObj<typeof TokenSelectBase> = {};

export const Loading: StoryObj<typeof TokenSelectBase> = {
  args: { isLoadingTokens: true },
};
