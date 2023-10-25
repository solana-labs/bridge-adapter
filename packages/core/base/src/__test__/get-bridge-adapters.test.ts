import it from "ava";
import { getBridgeAdapters } from "../utils/getBridgeAdapters";

it("should return adapters", (t) => {
  const adapters = getBridgeAdapters({
    sourceChain: "Ethereum",
    targetChain: "Solana",
    settings: undefined,
    bridgeAdapterSettings: undefined,
  });
  t.deepEqual(
    ["deBridge", "mayan", "wormhole"],
    adapters.map((a) => a.name()),
  );
});

it("should return allowed adapters", (t) => {
  const adapters = getBridgeAdapters({
    sourceChain: "Ethereum",
    targetChain: "Solana",
    settings: undefined,
    bridgeAdapterSettings: {
      allow: ["deBridge", "wormhole"],
    },
  });
  t.deepEqual(
    ["deBridge", "wormhole"],
    adapters.map((a) => a.name()),
  );
});

it("should return adapters unless denied", (t) => {
  const adapters = getBridgeAdapters({
    sourceChain: "Ethereum",
    targetChain: "Solana",
    settings: undefined,
    bridgeAdapterSettings: {
      deny: ["deBridge", "wormhole"],
    },
  });
  t.deepEqual(
    ["mayan"],
    adapters.map((a) => a.name()),
  );
});

it("should return adapters according to the allowed & denied", (t) => {
  const adapters = getBridgeAdapters({
    sourceChain: "Ethereum",
    targetChain: "Solana",
    settings: undefined,
    bridgeAdapterSettings: {
      allow: ["deBridge", "wormhole"],
      deny: ["deBridge"],
    },
  });
  t.deepEqual(
    ["deBridge", "wormhole"],
    adapters.map((a) => a.name()),
  );
});

it("should fail with the wrong settings", (t) => {
  t.throws(
    () => {
      getBridgeAdapters({
        sourceChain: "Ethereum",
        targetChain: "Solana",
        settings: undefined,
        bridgeAdapterSettings: {
          // @ts-expect-error negative case
          denied: ["mayan"],
        },
      });
    },
    { message: "Invalid bridge adapter setting" },
  );
});
