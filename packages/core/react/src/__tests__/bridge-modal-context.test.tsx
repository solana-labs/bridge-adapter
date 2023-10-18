/** @jest-environment jsdom */
import * as ctx from "../providers/BridgeModalContext";
import * as rtl from "@testing-library/react";
import React from "react";
import type { BridgeStepParams } from "../types/bridge-adapter";
import { BridgeAdapterSdk } from "@solana/bridge-adapter-base";
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { setCurrentBridgeStep } from "../providers/BridgeModalContext";

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

describe("BridgeModalContext::setCurrentBridgeStep", () => {
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

  test("should set step", () => {
    const Box = React.forwardRef(function ChainAndToken(_props, ref) {
      const currentBridgeStep = ctx.useBridgeModalStore.use.currentBridgeStep();
      const previousBridgeStep =
        ctx.useBridgeModalStore.use.previousBridgeStep();
      React.useImperativeHandle(
        ref,
        () => ({
          getState() {
            return { currentBridgeStep, previousBridgeStep };
          },
        }),
        [currentBridgeStep, previousBridgeStep],
      );
      React.useEffect(() => {
        setCurrentBridgeStep({
          step: "WALLET_SELECTION",
          params: { chain: "Solana" },
        });
      }, []);

      return null;
    });

    rtl.render(<Box ref={ref} />);

    expect({
      currentBridgeStep: "WALLET_SELECTION",
      previousBridgeStep: ["MULTI_CHAIN_SELECTION"],
    }).toEqual(ref.current?.getState());
  });

  test("should navigate through the same step with different chains", () => {
    const Box = React.forwardRef(function ChainAndToken(_props, ref) {
      const currentBridgeStep = ctx.useBridgeModalStore.use.currentBridgeStep();
      const currentBridgeStepParams =
        ctx.useBridgeModalStore.use.currentBridgeStepParams();
      const previousBridgeStep =
        ctx.useBridgeModalStore.use.previousBridgeStep();
      const previousBridgeStepParams =
        ctx.useBridgeModalStore.use.previousBridgeStepParams();
      React.useImperativeHandle(
        ref,
        () => ({
          getState() {
            return {
              currentBridgeStep,
              currentBridgeStepParams,
              previousBridgeStep,
              previousBridgeStepParams,
            };
          },
        }),
        [
          currentBridgeStep,
          currentBridgeStepParams,
          previousBridgeStep,
          previousBridgeStepParams,
        ],
      );
      const { onSuccess } =
        currentBridgeStepParams as BridgeStepParams<"WALLET_SELECTION">;
      React.useEffect(() => {
        setCurrentBridgeStep({
          step: "WALLET_SELECTION",
          params: {
            chain: "Solana",
            onSuccess: () => {
              setCurrentBridgeStep({
                step: "WALLET_SELECTION",
                params: { chain: "Ethereum" },
              });
            },
          },
        });
      }, []);
      React.useEffect(() => {
        onSuccess?.();
      }, [onSuccess]);

      return null;
    });

    rtl.render(<Box ref={ref} />);

    /// We do not duplicate the step in the state as it breaks the back button
    expect({
      currentBridgeStep: "WALLET_SELECTION",
      currentBridgeStepParams: { chain: "Ethereum" },
      previousBridgeStep: ["MULTI_CHAIN_SELECTION"],
      previousBridgeStepParams: [undefined],
    }).toEqual(ref.current?.getState());
  });
});
