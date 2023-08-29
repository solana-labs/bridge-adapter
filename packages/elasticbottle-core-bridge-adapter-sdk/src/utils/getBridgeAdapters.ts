import type { AbstractBridgeAdapter } from "../lib/BridgeAdapter/AbstractBridgeAdapter";
import { DeBridgeBridgeAdapter } from "../lib/BridgeAdapter/DeBridgeBridgeAdapter";
import { MayanBridgeAdapter } from "../lib/BridgeAdapter/MayanBridgeAdapter";
import { WormholeBridgeAdapter } from "../lib/BridgeAdapter/WormholeBridgeAdapter";
import type { BridgeAdapterSetting } from "../types/BridgeAdapterSetting";
import type { BridgeAdapterArgs } from "../types/Bridges";

export function getBridgeAdapters({
  sourceChain,
  targetChain,
  settings,
  bridgeAdapterSetting,
}: {
  bridgeAdapterSetting?: BridgeAdapterSetting;
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
  if (!bridgeAdapterSetting) {
    return Object.values(allowedBridgeAdapters);
  }

  if ("allow" in bridgeAdapterSetting) {
    const result = [];
    for (const bridgeAdapter of bridgeAdapterSetting.allow) {
      result.push(allowedBridgeAdapters[bridgeAdapter]);
    }
    return result.filter((x) => !!x);
  } else if ("deny" in bridgeAdapterSetting) {
    for (const bridgeAdapter of bridgeAdapterSetting.deny) {
      delete allowedBridgeAdapters[bridgeAdapter];
    }
    return Object.values(allowedBridgeAdapters);
  }
  throw new Error("Invalid bridge adapter setting");
}
