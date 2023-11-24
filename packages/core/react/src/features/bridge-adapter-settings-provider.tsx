import type { BridgeAdapterSdkArgs } from "@solana/bridge-adapter-base";
import { setBridgeAdapterSdkSettings } from "../entities/bridge-adapter-context";
import { useEffect } from "react";

export function BridgeAdapterSettingsProvider({
  adapters,
  children,
  settings,
  sourceChain,
  targetChain,
}: BridgeAdapterSdkArgs & {
  children: React.ReactNode;
}) {
  useEffect(() => {
    setBridgeAdapterSdkSettings({
      adapters,
      settings,
      sourceChain,
      targetChain,
    });
  }, [adapters, settings, sourceChain, targetChain]);

  return <>{children}</>;
}
