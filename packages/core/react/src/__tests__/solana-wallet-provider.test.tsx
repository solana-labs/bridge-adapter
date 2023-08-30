/** @jest-environment jsdom */
import React from "react";
import { expect, test, describe, afterEach, beforeEach } from "vitest";
import * as rtl from "@testing-library/react";
import { SolanaWalletProvider } from "../providers/SolanaWalletProvider";

let container: HTMLElement;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(rtl.cleanup);

function WalletProvider() {
  return (
    <SolanaWalletProvider>
      <div data-testid="children">content</div>
    </SolanaWalletProvider>
  );
}

describe("SolanaWalletProvider", () => {
  test("should render without crashing", () => {
    rtl.render(<WalletProvider />);

    expect(rtl.screen.getByTestId("children")).not.toBeNull();
  });
});
