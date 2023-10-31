import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/jest";
import { userEvent, within } from "@storybook/testing-library";
import { SwapReviewBase } from "../../features/SwapDetails";

const meta: Meta<typeof SwapReviewBase> = {
  title: "Features/SwapDetails/SwapReviewBase",
  component: SwapReviewBase,
};

export default meta;

export const Default: StoryObj<typeof SwapReviewBase> = {
  args: {
    swapInformation: {
      bridgeName: "Yet Another Bridge",
      sourceToken: {
        logoUri: "",
        name: "TOKEN A",
        symbol: "A",
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
        symbol: "B",
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
            fromTokenSymbol: "A",
            toTokenSymbol: "B",
          },
        ],
      },
    },
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const btn = ctx.getByRole("button", { name: "Begin Swap" });
    await expect(btn).toBeEnabled();
    await userEvent.click(btn);
  },
};
