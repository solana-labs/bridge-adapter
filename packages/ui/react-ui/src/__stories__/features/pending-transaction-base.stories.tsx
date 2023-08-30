import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/jest";
import { within } from "@storybook/testing-library";
import { PendingTransactionBase } from "../../features/SwapDetails";

const meta: Meta<typeof PendingTransactionBase> = {
  title: "Features/SwapDetails/PendingTransactionBase",
  component: PendingTransactionBase,
};

export default meta;

export const Default: StoryObj<typeof PendingTransactionBase> = {
  args: {
    status: { name: "pending", status: "PENDING", information: "pending" },
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const btn = ctx.getByRole("status", { name: "Transaction Status" });

    await expect(btn).toBeVisible();
  },
};
