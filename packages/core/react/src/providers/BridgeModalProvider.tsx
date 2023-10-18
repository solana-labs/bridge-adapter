import type { BridgeAdapterSdkArgs } from "@solana/bridge-adapter-base";
import { useEffect } from "react";
import { setBridgeAdapterSdkSettings } from "./BridgeModalContext";

export function BridgeModalProvider({
  bridgeAdapterSetting,
  children,
  settings,
  sourceChain,
  targetChain,
}: {
  children: React.ReactNode;
} & BridgeAdapterSdkArgs) {
  // Hack here to prevent the useEffect from continuously firing on every render
  const bridgeAdapterSettingString = bridgeAdapterSetting
    ? JSON.stringify(bridgeAdapterSetting)
    : "";

  useEffect(() => {
    const setting = bridgeAdapterSettingString
      ? (JSON.parse(
          bridgeAdapterSettingString,
        ) as BridgeAdapterSdkArgs["bridgeAdapterSetting"])
      : undefined;

    setBridgeAdapterSdkSettings({
      bridgeAdapterSetting: setting,
      settings,
      sourceChain,
      targetChain,
    });
  }, [bridgeAdapterSettingString, settings, sourceChain, targetChain]);

  return <>{children}</>;
}
