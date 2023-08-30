/** @jest-environment jsdom */
import React from "react";
import * as rtl from "@testing-library/react";
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { SolanaWalletProvider, setToken } from "bridge-adapter-react";
import { useBridgeModalStore } from "bridge-adapter-react";
import { useIsWalletConnected } from "../../features/WalletSelection/use-is-wallet-connected";
import * as mock from "../../__mocks__/token";

const TestComponent = React.forwardRef(function ImperativeComponent(
  props: NonNullable<{ onEffect?: (p: unknown) => void }>,
  ref,
) {
  const data = useIsWalletConnected();

  React.useEffect(() => {
    const { onEffect, ...other } = props;
    onEffect?.(other);
  }, [props]);

  React.useImperativeHandle(
    ref,
    () => ({
      getState() {
        return data;
      },
      getStateFromProps() {
        return props;
      },
    }),
    [data, props],
  );
  return null;
});

describe("WalletSelection", () => {
  let container: HTMLElement;
  let ref: React.RefObject<{
    getState(): NonNullable<unknown>;
    getStateFromProps(): NonNullable<unknown>;
  }>;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    ref = React.createRef();
  });
  afterEach(() => {
    rtl.cleanup();
  });

  function getState() {
    const data = ref.current?.getState() as ReturnType<
      typeof useIsWalletConnected
    >;

    return data;
  }
  function getStateFromProps() {
    const data = ref.current?.getStateFromProps();

    return data;
  }

  describe("useIsWalletConnected", () => {
    /**
     *  Checking the initial token structure
     *  as the hook' logic relies on it
     */
    test("should return initial token combination", () => {
      const Component = () => {
        const tokens = useBridgeModalStore.use.token();

        return (
          <SolanaWalletProvider wallets={[]} autoConnect={false}>
            <TestComponent ref={ref} tokens={tokens} />
          </SolanaWalletProvider>
        );
      };
      rtl.render(<Component />);

      expect({
        sourceToken: mock.ethereumTokenWithAmount(),
        targetToken: mock.solanaTokenWithAmount(),
      }).toEqual(getStateFromProps().tokens);
    });
    test("should return initial state", () => {
      rtl.render(
        <SolanaWalletProvider wallets={[]} autoConnect={false}>
          <TestComponent ref={ref} />
        </SolanaWalletProvider>,
      );

      expect({
        isWalletConnected: false,
        evmChainNeeded: "Ethereum",
        needEvmWalletConnection: true,
        needSolanaWalletConnection: true,
      }).toEqual(getState());
    });
    test("should handle Solana <> Solana case", () => {
      const Component = () => {
        React.useEffect(() => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          setToken(mock.solanaTokenWithAmount(), "source");
        }, []);

        return (
          <SolanaWalletProvider wallets={[]} autoConnect={false}>
            <TestComponent ref={ref} />
          </SolanaWalletProvider>
        );
      };
      rtl.render(<Component />);

      expect({
        isWalletConnected: false,
        evmChainNeeded: "Solana",
        needEvmWalletConnection: false,
        needSolanaWalletConnection: true,
      }).toEqual(getState());
    });
    test("should handle Ethereum <> Ethereum case", () => {
      const Component = () => {
        React.useEffect(() => {
          /* eslint-disable @typescript-eslint/no-floating-promises */
          setToken(mock.ethereumTokenWithAmount({ symbol: "ETH1" }), "target");
          setToken(mock.ethereumTokenWithAmount({ symbol: "ETH2" }), "source");
          /* eslint-enable @typescript-eslint/no-floating-promises */
        }, []);

        return (
          <SolanaWalletProvider wallets={[]} autoConnect={false}>
            <TestComponent ref={ref} />
          </SolanaWalletProvider>
        );
      };
      rtl.render(<Component />);

      expect({
        evmChainNeeded: "Ethereum",
        isWalletConnected: false,
        needEvmWalletConnection: true,
        needSolanaWalletConnection: false,
      }).toEqual(getState());
    });
  });
});
