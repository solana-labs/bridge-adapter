import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { PublicKey } from "@solana/web3.js";
import { PublicKeyLine } from "../../shared/index";

const meta: Meta<typeof PublicKeyLine> = {
  title: "Shared/UI/PublicKeyLine",
  component: PublicKeyLine,
  args: {
    publicKey: new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"),
  },
};

export default meta;

export const WithCopying: StoryObj<typeof PublicKeyLine> = {
  args: {
    showCopyButton: true,
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const copyBtn = ctx.getByRole("button");
    await userEvent.click(copyBtn);
  },
};
