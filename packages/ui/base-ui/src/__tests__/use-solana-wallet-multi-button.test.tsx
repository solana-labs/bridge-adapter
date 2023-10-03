/** @jest-environment jsdom */
import React from "react";
import * as rtl from "@testing-library/react";
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { SolanaWalletProvider } from "@solana/bridge-adapter-react";
import { useSolanaWalletMultiButton } from "../shared/use-solana-wallet-multi-button";

describe("useSolanaWalletMultiButton", () => {
  let container: HTMLElement;
  let ref: React.RefObject<{ getState(): NonNullable<unknown> }>;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    ref = React.createRef();
  });
  afterEach(() => {
    rtl.cleanup();
  });

  test("should return initial state (no-wallet)", () => {
    const Box = React.forwardRef(function useButton(_props, ref) {
      const data = useSolanaWalletMultiButton();
      React.useImperativeHandle(
        ref,
        () => ({
          getState() {
            return data;
          },
        }),
        [data],
      );
      return null;
    });

    rtl.render(
      <SolanaWalletProvider wallets={[]} autoConnect={false}>
        <Box ref={ref} />
      </SolanaWalletProvider>,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onSelectWallet: _, ...structSlice } =
      ref.current?.getState() as ReturnType<typeof useSolanaWalletMultiButton>;
    expect({
      buttonState: "no-wallet",
      onConnect: undefined,
      onDisconnect: undefined,
      publicKey: undefined,
      walletIcon: undefined,
      walletName: undefined,
      wallets: [],
    }).toEqual(structSlice);
  });
});
