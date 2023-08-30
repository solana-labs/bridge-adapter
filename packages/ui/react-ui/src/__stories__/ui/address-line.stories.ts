import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { AddressLine } from "../../shared/index";

const meta: Meta<typeof AddressLine> = {
  title: "Shared/UI/AddressLine",
  component: AddressLine,
  args: {
    address:
      "j9rb2Von1Stzgx1RUPyYWP2rSKGBtSSDFawM47ddtQnoS84cEmHJGM5seoNmA2yoXeSU1gg2QVXYHb4wEVoeFH8",
  },
};

export default meta;

export const WithCopying: StoryObj<typeof AddressLine> = {
  args: {
    showCopyButton: true,
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const copyBtn = ctx.getByRole("button");
    await userEvent.click(copyBtn);
  },
};
