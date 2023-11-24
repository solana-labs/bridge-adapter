import type { BridgeStatus } from "@solana/bridge-adapter-core";
import { useBridgeModalStore } from "@solana/bridge-adapter-react";
import { useBridgeParams } from "./use-bridge-params";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export function useSubmitAndTrackTransaction({
  enabled,
  onError,
  onStatusUpdate,
}: {
  enabled?: (args: ReturnType<typeof useBridgeParams>) => boolean;
  onStatusUpdate: (args: BridgeStatus) => void;
  onError(error: Error): void;
}) {
  const { sourceAccount, swapInformation, targetAccount } = useBridgeParams();
  const sdk = useBridgeModalStore.use.sdk();

  const { error } = useQuery<boolean | undefined, Error>({
    queryKey: [
      "submitAndTrackTransaction",
      swapInformation,
      sourceAccount,
      targetAccount,
      onError,
      onStatusUpdate,
    ],
    queryFn: async () => {
      if (!sourceAccount || !targetAccount || !swapInformation) {
        return;
      }
      return sdk.bridge({
        sourceAccount,
        targetAccount,
        swapInformation,
        onStatusUpdate,
      });
    },
    enabled: enabled
      ? enabled({ targetAccount, sourceAccount, swapInformation })
      : !!targetAccount && !!sourceAccount && !!swapInformation,
  });
  useEffect(() => {
    if (error) onError(error);
  }, [error, onError]);
}
