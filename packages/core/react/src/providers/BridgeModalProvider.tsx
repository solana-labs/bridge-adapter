import type { BridgeAdapterSdkArgs } from "bridge-adapter-base";
import { useEffect } from "react";
import { setBridgeAdapterSdkSettings } from "./BridgeModalContext";

export function BridgeModalProvider({
  children,
  bridgeAdapterSetting,
  sourceChain,
  targetChain,
  settings,
}: {
  children: React.ReactNode;
} & BridgeAdapterSdkArgs) {
  // Hack here to prevent the useEffect from continuously firing on every render
  const bridgeAdapterSettingString = bridgeAdapterSetting
    ? JSON.stringify(bridgeAdapterSetting)
    : "";

  useEffect(() => {
    setBridgeAdapterSdkSettings({
      bridgeAdapterSetting: bridgeAdapterSettingString
        ? (JSON.parse(
            bridgeAdapterSettingString,
          ) as BridgeAdapterSdkArgs["bridgeAdapterSetting"])
        : undefined,
      sourceChain,
      targetChain,
      settings,
    });
  }, [bridgeAdapterSettingString, settings, sourceChain, targetChain]);

  return <>{children}</>;
}
