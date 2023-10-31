import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../../shared/index";

const meta: Meta<typeof Command> = {
  title: "Shared/UI/Command",
  component: Command,
};

export default meta;

export const Default: StoryObj<typeof Command> = {
  render: () => {
    return <Command data-testid="command">Command</Command>;
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const command = ctx.getByTestId("command");
    await expect(command).toBeVisible();
  },
};

export const Input: StoryObj<typeof Command> = {
  render: () => {
    return (
      <Command>
        <CommandInput />
      </Command>
    );
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const input = ctx.getByRole("combobox");

    await userEvent.type(input, "command");
    await expect(input).toHaveValue("command");
  },
};

export const List: StoryObj<typeof Command> = {
  render: () => {
    return (
      <Command>
        <CommandList data-testid="command-list">
          <>command1</>
        </CommandList>
      </Command>
    );
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const list = ctx.getByTestId("command-list");
    await expect(list).toBeVisible();
  },
};

export const Group: StoryObj<typeof Command> = {
  render: () => {
    return (
      <Command>
        <CommandGroup data-testid="command-group">
          <>command1</>
          <>command2</>
        </CommandGroup>
      </Command>
    );
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const list = ctx.getByTestId("command-group");
    await expect(list).toBeVisible();
  },
};

export const GroupWithSeparator: StoryObj<typeof Command> = {
  render: () => {
    return (
      <Command>
        <CommandGroup data-testid="command-group">
          <>command1</>
          <CommandSeparator />
          <>command2</>
        </CommandGroup>
      </Command>
    );
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const list = ctx.getByTestId("command-group");
    await expect(list).toBeVisible();
  },
};

export const GroupWithItems: StoryObj<typeof Command> = {
  render: () => {
    return (
      <Command>
        <CommandGroup data-testid="command-group">
          <CommandItem>command1</CommandItem>
          <CommandSeparator />
          <CommandItem>command2</CommandItem>
        </CommandGroup>
      </Command>
    );
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const list = ctx.getByTestId("command-group");
    await expect(list).toBeVisible();
  },
};

export const GroupWithShortcuts: StoryObj<typeof Command> = {
  render: () => {
    return (
      <Command>
        <CommandGroup data-testid="command-group">
          <CommandItem>
            <CommandShortcut>cut</CommandShortcut>
            command1
          </CommandItem>
          <CommandSeparator />
          <CommandItem>command2</CommandItem>
        </CommandGroup>
      </Command>
    );
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const list = ctx.getByTestId("command-group");
    await expect(list).toBeVisible();
  },
};
