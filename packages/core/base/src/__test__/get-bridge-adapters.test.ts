import it from "ava";
import { getBridgeAdapters } from "../utils/getBridgeAdapters";
import { MockBridgeAdapter } from "../__mocks__/bridge-adapters";

it("should return initial adapters", (t) => {
  t.deepEqual(
    [],
    getBridgeAdapters({
      sourceChain: "Ethereum",
      targetChain: "Solana",
      settings: undefined,
    }),
  );
});

it("should return allowed adapters", (t) => {
  const adapters = getBridgeAdapters({
    adapters: [MockBridgeAdapter],
    sourceChain: "Ethereum",
    targetChain: "Solana",
    settings: undefined,
  });
  t.deepEqual(
    ["mock"],
    adapters.map((a) => a.name()),
  );
});
