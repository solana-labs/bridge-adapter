import it from "ava";
import type { ChainName } from "@solana/bridge-adapter-core";
import { BridgeAdapterSdk } from "../lib/BridgeAdapterSdk";
import { MockBridgeAdapter } from "../__mocks__/bridge-adapters";

it("should sdk be initialized", (t) => {
  let sdk = new BridgeAdapterSdk();
  t.is(sdk.sourceChain, undefined);
  t.is(sdk.targetChain, undefined);
  t.deepEqual(sdk.bridgeAdapters, []);

  sdk = new BridgeAdapterSdk({
    sourceChain: "Ethereum",
    targetChain: "Solana",
    settings: {
      solana: { solanaRpcUrl: "https://mainnet-beta.solana.com" },
    },
  });
  t.deepEqual([], sdk.bridgeAdapters);
  t.is(sdk.sourceChain, "Ethereum");
  t.is(sdk.targetChain, "Solana");

  sdk = new BridgeAdapterSdk({
    adapters: [MockBridgeAdapter],
    sourceChain: "Ethereum",
    targetChain: "Solana",
    settings: {
      solana: { solanaRpcUrl: "https://mainnet-beta.solana.com" },
    },
  });
  t.is(sdk.bridgeAdapters.length, 1);
});

it("should setup adapters", async (t) => {
  const data = {
    sourceChain: "Solana" as ChainName,
    targetChain: "Ethereum" as ChainName,
    settings: {
      solana: { solanaRpcUrl: "https://mainnet-beta.solana.com" },
    },
  };

  const sdk = new BridgeAdapterSdk({
    adapters: [MockBridgeAdapter],
    sourceChain: data.sourceChain,
    targetChain: data.targetChain,
    settings: data.settings,
  });

  const targetBridge = sdk.bridgeAdapters[0];
  t.is(sdk.sourceChain, data.sourceChain);
  t.is(sdk.targetChain, data.targetChain);
  // @ts-expect-error property exists for instance
  t.is(targetBridge.sourceChain, "Solana");
  // @ts-expect-error property exists for instance
  t.is(targetBridge.targetChain, "Ethereum");
  // @ts-expect-error property exists for instance
  t.is(targetBridge.settings, data.settings);
  // @ts-expect-error property exists for instance
  t.deepEqual(targetBridge.tokenList, []);

  t.deepEqual(await sdk.getSupportedChains(), ["Solana", "Ethereum"]);

  // @ts-expect-error private method
  t.deepEqual(sdk.deduplicateChains(["Solana", "Solana"] as ChainName[]), [
    "Solana",
  ] as ChainName[]);
});

it("should validate chain intersection", (t) => {
  const data = {
    sourceChain: "Solana" as ChainName,
    targetChain: "Solana" as ChainName,
    settings: {
      solana: { solanaRpcUrl: "https://mainnet-beta.solana.com" },
    },
  };

  // Cover the case when the source and target chains are the same
  const sdk = new BridgeAdapterSdk({
    sourceChain: data.sourceChain,
    targetChain: data.targetChain,
    settings: data.settings,
  });

  t.is(sdk.sourceChain, data.sourceChain);
  t.is(sdk.targetChain, data.targetChain);
});
