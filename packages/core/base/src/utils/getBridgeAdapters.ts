import Debug from "debug";
import type { AbstractBridgeAdapter } from "../lib/BridgeAdapter/AbstractBridgeAdapter";
import type { BridgeAdapterArgs } from "../types/Bridges";
import type { BridgeAdapterSetting } from "../types/BridgeAdapterSetting";
import { DeBridgeBridgeAdapter } from "../lib/BridgeAdapter/DeBridgeBridgeAdapter";
import { MayanBridgeAdapter } from "../lib/BridgeAdapter/MayanBridgeAdapter";
import { WormholeBridgeAdapter } from "../lib/BridgeAdapter/WormholeBridgeAdapter";

const log = Debug("log:getBridgeAdapters");

export function getBridgeAdapters({
  sourceChain,
  targetChain,
  settings,
  bridgeAdapterSettings,
}: {
  bridgeAdapterSettings?: BridgeAdapterSetting;
} & BridgeAdapterArgs) {
  const allowedBridgeAdapters: { [bridge: string]: AbstractBridgeAdapter } = {
    deBridge: new DeBridgeBridgeAdapter({
      sourceChain,
      targetChain,
      settings,
    }),
    mayan: new MayanBridgeAdapter({
      sourceChain,
      targetChain,
      settings,
    }),
    wormhole: new WormholeBridgeAdapter({ sourceChain, targetChain, settings }),
  };
  if (!bridgeAdapterSettings) {
    log("Active Bridge Adapters:", Object.keys(allowedBridgeAdapters));
    return Object.values(allowedBridgeAdapters);
  }

  if ("allow" in bridgeAdapterSettings) {
    const result = [];
    for (const bridgeAdapter of bridgeAdapterSettings.allow) {
      result.push(allowedBridgeAdapters[bridgeAdapter]);
    }
    log(
      "Allowed Bridge Adapters:",
      result.map((a) => a.name()),
    );
    return result.filter((x) => !!x);
  } else if ("deny" in bridgeAdapterSettings) {
    for (const bridgeAdapter of bridgeAdapterSettings.deny) {
      delete allowedBridgeAdapters[bridgeAdapter];
    }
    log("Allowed Bridge Adapters:", Object.keys(allowedBridgeAdapters));
    return Object.values(allowedBridgeAdapters);
  }

  throw new Error("Invalid bridge adapter setting");
}
