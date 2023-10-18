import * as R from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Notification,
  NotificationProvider,
} from "../../shared";
import { cn } from "../../shared/lib/styles";

const meta: Meta<typeof Notification> = {
  title: "Shared/UI/Notification",
  component: Notification,
  args: {
    title: "Notification",
    description: "Notifications may include alerts, sounds, and badges.",
  },
};

export default meta;

export const Default: StoryObj<typeof Notification> = {
  render: (props) => {
    return (
      <NotificationProvider rootProps={{ open: true }}>
        <Notification {...props} />
      </NotificationProvider>
    );
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const notificationEl = ctx.getByRole("status");
    await expect(notificationEl).toBeVisible();
  },
};

export const WithDialog: StoryObj<typeof Notification> = {
  render: (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = R.useState(false);

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            data-testid="open-modal"
            size="sm"
            type="button"
            className="bsa-bg-primary bsa-mt-8 bsa-w-full hover:bsa-bg-zinc-400"
          >
            Open Dialog
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle
              className={cn({
                "bsa-items-right bsa-flex bsa-text-xl": true,
              })}
            >
              <Button
                data-testid="show-notification"
                size="sm"
                type="button"
                className="bsa-bg-primary bsa-mt-8 bsa-w-full hover:bsa-bg-zinc-400"
                onClick={() => {
                  setOpen((prev) => (prev ? false : true));
                }}
              >
                {open ? "Close" : "Open"} Notification
              </Button>
            </DialogTitle>
          </DialogHeader>
          <NotificationProvider rootProps={{ open }}>
            <Notification {...props} />
          </NotificationProvider>
        </DialogContent>
      </Dialog>
    );
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const dialogBtn = ctx.getByTestId("open-modal");
    await userEvent.click(dialogBtn);

    const notificationBtn = within(globalThis.document.body).getByTestId(
      "show-notification",
    );
    await userEvent.click(notificationBtn);

    const notificationEl = within(globalThis.document.body).getAllByRole(
      "status",
    );
    await expect(notificationEl[0]).toBeVisible();
  },
};
