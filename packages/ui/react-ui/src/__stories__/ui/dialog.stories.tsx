import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../shared/index";

const meta: Meta<typeof Dialog> = {
  title: "Shared/UI/Dialog",
  component: Dialog,
};

export default meta;

export const Default: StoryObj<typeof Dialog> = {
  render: () => {
    return (
      <Dialog>
        <DialogTrigger data-testid="toggle">Open</DialogTrigger>
        <DialogContent data-testid="content">Content</DialogContent>
      </Dialog>
    );
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const toggle = ctx.getByTestId("toggle");

    await expect(toggle).toBeVisible();
    await userEvent.click(toggle);

    const content = within(globalThis.document.body).getByTestId("content");
    await expect(content).toBeValid();
  },
};

export const Rich: StoryObj<typeof Dialog> = {
  render: () => {
    return (
      <Dialog>
        <DialogTrigger data-testid="toggle">Open</DialogTrigger>
        <DialogContent data-testid="content">
          <DialogHeader>
            <DialogTitle>Header</DialogTitle>
          </DialogHeader>
          <DialogDescription>Description</DialogDescription>
          Content
          <DialogFooter>Footer</DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const toggle = ctx.getByTestId("toggle");

    await expect(toggle).toBeVisible();
    await userEvent.click(toggle);

    const content = within(globalThis.document.body).getByTestId("content");

    await expect(content).toBeValid();
  },
};
