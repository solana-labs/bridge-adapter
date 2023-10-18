/** @jest-environment jsdom */
import React from "react";
import * as rtl from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { setToken, SolanaWalletProvider } from "@solana/bridge-adapter-react";
import { useCanConnectWallet } from "../../features/WalletSelection";
import * as mock from "../../__mocks__/token";

const TestComponent = React.forwardRef(function ImperativeComponent(
  props: NonNullable<{ onEffect?: (p: unknown) => void }>,
  ref,
) {
  const data = useCanConnectWallet();

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
      typeof useCanConnectWallet
    >;

    return data;
  }
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  function getStateFromProps() {
    const data = ref.current?.getStateFromProps();

    return data;
  }

  describe("useCanConnectWallet", () => {
    test("should return flag that connection is not possible", () => {
      const Component = () => {
        return (
          <SolanaWalletProvider wallets={[]} autoConnect={false}>
            <TestComponent ref={ref} />
          </SolanaWalletProvider>
        );
      };
      rtl.render(<Component />);

      expect(getState()).toBeFalsy();
    });
    test("should return flag that connection is possible", () => {
      const Component = () => {
        React.useEffect(() => {
          /* eslint-disable @typescript-eslint/no-floating-promises */

          setToken(
            mock.solanaTokenWithAmount({
              address: "So11111111111111111111111111111111111111112",
            }),
            "source",
          );
          setToken(
            mock.ethereumTokenWithAmount({
              address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
            }),
            "target",
          );
          /* eslint-enable @typescript-eslint/no-floating-promises */
        }, []);
        return (
          <SolanaWalletProvider wallets={[]} autoConnect={false}>
            <TestComponent ref={ref} />
          </SolanaWalletProvider>
        );
      };
      rtl.render(<Component />);

      expect(getState()).toBeTruthy();
    });
  });
});
