import * as R from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { Popover, PopoverContent, PopoverTrigger } from "../../shared/index";

const meta: Meta<typeof Popover> = {
  title: "Shared/UI/Popover",
  component: Popover,
};

export default meta;

export const Default: StoryObj<typeof Popover> = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, toggleOpen] = R.useState(false);

    return (
      <Popover>
        <PopoverTrigger
          data-testid="trigger"
          onClick={() => toggleOpen((a) => !a)}
        >
          {opened ? "Close" : "Open"}
        </PopoverTrigger>
        <PopoverContent data-testid="content">content</PopoverContent>
      </Popover>
    );
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const trigger = ctx.getByTestId("trigger");

    await userEvent.click(trigger);

    const content = within(globalThis.document.body).getByTestId("content");

    await expect(content).toBeValid();
  },
};
