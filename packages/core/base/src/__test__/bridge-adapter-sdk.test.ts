import it from "ava";
import type { Bridges } from "../types/Bridges";
import type { ChainName } from "../types/Chain";
import { BridgeAdapterSdk } from "../lib/BridgeAdapterSdk";

it("should setup adapters", async (t) => {
  let adapter = new BridgeAdapterSdk();
  t.is(adapter.sourceChain, undefined);
  t.is(adapter.targetChain, undefined);
  t.is(adapter.bridgeAdapterSettings, undefined);
  t.deepEqual(adapter.bridgeAdapters, []);

  const data = {
    sourceChain: "Solana" as ChainName,
    targetChain: "Ethereum" as ChainName,
    bridgeAdapterSettings: {
      deny: ["wormhole"] as Bridges[],
      allow: ["wormhole"] as Bridges[],
    },
    settings: {
      solana: { solanaRpcUrl: "https://mainnet-beta.solana.com" },
    },
  };

  adapter = new BridgeAdapterSdk({
    sourceChain: data.sourceChain,
    targetChain: data.targetChain,
    bridgeAdapterSettings: data.bridgeAdapterSettings,
    settings: data.settings,
  });

  const targetBridge = adapter.bridgeAdapters[0];
  t.is(adapter.sourceChain, data.sourceChain);
  t.is(adapter.targetChain, data.targetChain);
  t.is(adapter.bridgeAdapterSettings, data.bridgeAdapterSettings);
  // @ts-expect-error property exists for instance
  t.is(targetBridge.sourceChain, "Solana");
  // @ts-expect-error property exists for instance
  t.is(targetBridge.targetChain, "Ethereum");
  // @ts-expect-error property exists for instance
  t.is(targetBridge.settings, data.settings);
  // @ts-expect-error property exists for instance
  t.deepEqual(targetBridge.tokenList, []);
  // @ts-expect-error property exists for instance
  t.deepEqual(targetBridge.WORMHOLE_RPC_HOSTS, [
    "https://wormhole-v2-mainnet-api.certus.one",
    "https://wormhole.inotel.ro",
    "https://wormhole-v2-mainnet-api.mcf.rocks",
    "https://wormhole-v2-mainnet-api.chainlayer.network",
    "https://wormhole-v2-mainnet-api.staking.fund",
    "https://wormhole-v2-mainnet.01node.com",
  ]);

  t.deepEqual(await adapter.getSupportedChains(), [
    "Solana",
    "Polygon",
    "Optimism",
    "Ethereum",
    "BSC",
    "Avalanche",
    "Arbitrum",
  ]);

  // @ts-expect-error private method
  t.deepEqual(adapter.deduplicateChains(["Solana", "Solana"] as ChainName[]), [
    "Solana",
  ] as ChainName[]);
});

it("should validate chain intersection", (t) => {
  const data = {
    sourceChain: "Solana" as ChainName,
    targetChain: "Solana" as ChainName,
    bridgeAdapterSettings: {
      deny: ["wormhole"] as Bridges[],
      allow: ["wormhole"] as Bridges[],
    },
    settings: {
      solana: { solanaRpcUrl: "https://mainnet-beta.solana.com" },
    },
  };

  // Cover the case when the source and target chains are the same
  const adapter = new BridgeAdapterSdk({
    sourceChain: data.sourceChain,
    targetChain: data.targetChain,
    bridgeAdapterSettings: data.bridgeAdapterSettings,
    settings: data.settings,
  });

  t.is(adapter.sourceChain, data.sourceChain);
  t.is(adapter.targetChain, data.targetChain);
});
