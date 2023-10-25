import type { BridgeAdapterSdkArgs } from "@solana/bridge-adapter-base";
import { setBridgeAdapterSdkSettings } from "../entities/bridge-adapter-context";
import { useEffect } from "react";

export function BridgeAdapterSettingsProvider({
  bridgeAdapterSettings,
  children,
  settings,
  sourceChain,
  targetChain,
}: {
  children: React.ReactNode;
} & BridgeAdapterSdkArgs) {
  // Hack here to prevent the useEffect from continuously firing on every render
  const bridgeAdapterSettingString = bridgeAdapterSettings
    ? JSON.stringify(bridgeAdapterSettings)
    : "";

  useEffect(() => {
    const setting = bridgeAdapterSettingString
      ? (JSON.parse(
          bridgeAdapterSettingString,
        ) as BridgeAdapterSdkArgs["bridgeAdapterSettings"])
      : undefined;

    setBridgeAdapterSdkSettings({
      bridgeAdapterSettings: setting,
      settings,
      sourceChain,
      targetChain,
    });
  }, [bridgeAdapterSettingString, settings, sourceChain, targetChain]);

  return <>{children}</>;
}
