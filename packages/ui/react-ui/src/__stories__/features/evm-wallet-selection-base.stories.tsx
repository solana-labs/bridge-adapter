import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/jest";
import { userEvent, within } from "@storybook/testing-library";
import { EvmWalletConnectionListBase } from "../../features/WalletSelection";
import type { ConnectorData } from "../../features/WalletSelection";

const meta: Meta<typeof EvmWalletConnectionListBase> = {
  title: "Features/WalletSelection/EvmWalletConnectionListBase",
  component: EvmWalletConnectionListBase,
};

export default meta;

const connector1 = (ready = false) =>
  ({
    id: "connector_id_1",
    name: "MetaMask",
    ready,
  } as ConnectorData);
const connector2 = (ready = false) =>
  ({
    id: "connector_id_2",
    name: "walletConnect",
    ready,
  } as ConnectorData);

export const Default: StoryObj<typeof EvmWalletConnectionListBase> = {
  args: {
    pendingConnector: connector2(),
    connectors: [connector1(true), connector2()],
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const btn = ctx.getByRole("button", { name: "MetaMask Connector" });
    await expect(btn).toBeEnabled();
    await userEvent.click(btn);

    const btns = ctx.getAllByRole("button");
    await expect(btns).toHaveLength(1);
  },
};

export const Loading: StoryObj<typeof EvmWalletConnectionListBase> = {
  args: {
    pendingConnector: connector1(true),
    connectors: [connector1(true), connector2(true)],
    isLoading: true,
  },
  async play({ canvasElement }) {
    const ctx = within(canvasElement);
    const btn = ctx.getByRole("button", { name: "Loading Connector" });
    await expect(btn).toBeDisabled();

    const btns = ctx.getAllByRole("button");
    await expect(btns).toHaveLength(2);
  },
};
