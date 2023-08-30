/** @jest-environment jsdom */
import React from "react";
import * as ctx from "../providers/BridgeModalContext";
import * as rtl from "@testing-library/react";
import { BridgeAdapterSdk } from "bridge-adapter-base";
import { describe, test, expect, beforeEach, afterEach } from "vitest";

const defaultTokenAmount = {
  address: "",
  selectedAmountFormatted: "",
  selectedAmountInBaseUnits: "",
  chain: "Ethereum",
  decimals: 18,
  logoUri: "",
  name: "",
  symbol: "",
  bridgeNames: [],
};

describe("BridgeModalContext::State", () => {
  test("should be initialized with default state", () => {
    const data = ctx.useBridgeModalStore;

    expect(data.getState()).toStrictEqual({
      sdk: new BridgeAdapterSdk(),
      previousBridgeStep: [],
      currentBridgeStep: "MULTI_CHAIN_SELECTION",
      previousBridgeStepParams: [],
      currentBridgeStepParams: undefined,
      chain: {
        sourceChain: "Select a chain",
        targetChain: "Select a chain",
      },
      token: {
        sourceToken: defaultTokenAmount,
        targetToken: { ...defaultTokenAmount, chain: "Solana" },
      },
      swapInformation: undefined,
      relayerFee: {
        active: false,
        sourceFee: 0,
        targetFee: 0,
      },
      slippageTolerance: "auto",
    });
  });
});

describe("BridgeModalContext::use", () => {
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

  test("should return chain & token info", () => {
    const Box = React.forwardRef(function ChainAndToken(_props, ref) {
      const chainInfo = ctx.useBridgeModalStore.use.chain();
      const tokenInfo = ctx.useBridgeModalStore.use.token();
      React.useImperativeHandle(
        ref,
        () => ({
          getState() {
            return { chainInfo, tokenInfo };
          },
        }),
        [chainInfo, tokenInfo],
      );
      return null;
    });

    rtl.render(<Box ref={ref} />);

    expect({
      chainInfo: {
        sourceChain: "Select a chain",
        targetChain: "Select a chain",
      },
      tokenInfo: {
        sourceToken: defaultTokenAmount,
        targetToken: { ...defaultTokenAmount, chain: "Solana" },
      },
    }).toStrictEqual(ref.current?.getState());
  });
});
