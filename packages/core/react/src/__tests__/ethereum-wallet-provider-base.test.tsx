/** @jest-environment jsdom */
import React from "react";
import * as rtl from "@testing-library/react";
import Debug from "debug";
import type { ReactNode, RefObject } from "react";
import { createRef, forwardRef, useImperativeHandle } from "react";
import { expect, test, describe, afterEach, beforeEach } from "vitest";
import { useEthereumWallet, useDefaultEthereumConfig } from "../index";
import { EvmWalletProviderBase } from "../features/evm-wallet-provider-base";

const warn = Debug("warn:react:EvmWalletProviderBase");

type MarkerRefType = {
  getContextState(): ReturnType<typeof useEthereumWallet>;
};

const MarkerComponent = forwardRef(function MarkerComponentImpl(_props, ref) {
  const wallet = useEthereumWallet();
  useImperativeHandle(
    ref,
    () => ({
      getContextState() {
        return wallet;
      },
    }),
    [wallet],
  );
  return null;
});

function WalletProvider(props: { autoConnect: boolean; children?: ReactNode }) {
  const config = useDefaultEthereumConfig({});

  return (
    <EvmWalletProviderBase
      autoConnect={props.autoConnect ?? false}
      logger={{
        warn,
      }}
      publicClient={config.publicClient}
      wsPublicClient={config.webSocketPublicClient}
      connectors={[]}
    >
      <div data-testid="children">{props.children}</div>
    </EvmWalletProviderBase>
  );
}

describe("EvmWalletProviderBase", () => {
  let container: HTMLElement;
  let ref: RefObject<MarkerRefType>;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    ref = createRef();
  });
  afterEach(() => {
    rtl.cleanup();
  });

  test("should render without crashing", () => {
    rtl.render(<WalletProvider autoConnect={false} />);

    expect(rtl.screen.getByTestId("children")).not.toBeNull();
  });

  test("should be idle after render", () => {
    rtl.render(
      <WalletProvider autoConnect>
        <MarkerComponent ref={ref} />
      </WalletProvider>,
    );

    expect(ref.current?.getContextState().isIdle).toBeTruthy();
  });
});
