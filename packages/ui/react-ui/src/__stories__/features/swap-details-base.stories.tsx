import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import type { SwapInformation } from "@solana/bridge-adapter-core";
import { SwapDetailsBase } from "../../features/SwapDetails";

const meta: Meta<typeof SwapDetailsBase> = {
  title: "Features/SwapDetails/SwapDetailsBase",
  component: SwapDetailsBase,
};

export default meta;

const getSwapInformation = (
  a: { symbol: string } & NonNullable<unknown>,
  b: { symbol: string } & NonNullable<unknown>,
  bridgeName: string = "Yet Another Bridge",
): SwapInformation => ({
  bridgeName,
  sourceToken: {
    logoUri: "",
    name: "TOKEN A",
    symbol: a.symbol,
    address: "TOKEN_A_ADDRESS",
    chain: "Solana",
    decimals: 9,
    bridgeNames: [],
    selectedAmountInBaseUnits: "1000000000",
    selectedAmountFormatted: "1 SOL",
  },
  targetToken: {
    logoUri: "",
    name: "TOKEN B",
    symbol: b.symbol,
    address: "TOKEN_B_ADDRESS",
    chain: "Ethereum",
    decimals: 8,
    bridgeNames: [],
    expectedOutputInBaseUnits: "",
    expectedOutputFormatted: "",
    minOutputInBaseUnits: "",
    minOutputFormatted: "",
  },
  tradeDetails: {
    fee: [
      {
        logoUri: "",
        name: "TOKEN A",
        symbol: "A",
        address: "TOKEN_A_ADDRESS",
        chain: "Solana",
        decimals: 9,
        bridgeNames: [],
        selectedAmountInBaseUnits: "1000000",
        selectedAmountFormatted: "0.001 SOL",
        details: "Details",
      },
    ],
    priceImpact: 0.01,
    estimatedTimeMinutes: 1,
    routeInformation: [
      {
        fromTokenSymbol: a.symbol,
        toTokenSymbol: b.symbol,
      },
    ],
  },
});

export const Default: StoryObj<typeof SwapDetailsBase> = {
  args: {
    currentSwapInfo: getSwapInformation({ symbol: "A" }, { symbol: "B" }),
    isLoading: false,
    swapInfo: [
      getSwapInformation({ symbol: "A" }, { symbol: "B" }),
      getSwapInformation({ symbol: "B" }, { symbol: "C" }),
    ],
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const btn1 = ctx.getByRole("button", {
      name: "Use Yet Another Bridge with Route A → B",
    });
    await userEvent.click(btn1);
    const btn2 = ctx.getByRole("button", {
      name: "Use Yet Another Bridge with Route B → C",
    });
    await userEvent.click(btn2);
  },
};
