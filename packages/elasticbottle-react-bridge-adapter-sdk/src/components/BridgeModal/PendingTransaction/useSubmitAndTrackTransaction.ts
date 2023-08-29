import type { BridgeStatus } from "@elasticbottle/core-bridge-adapter-sdk";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useBridgeModalStore } from "../../../providers/BridgeModalContext";
import { useBridgeParams } from "./useBridgeParams";

export function useSubmitAndTrackTransaction({
  onError,
  onStatusUpdate,
}: {
  onStatusUpdate: (args: BridgeStatus) => void;
  onError(error: Error): void;
}) {
  const { sourceAccount, swapInformation, targetAccount } = useBridgeParams();
  const sdk = useBridgeModalStore.use.sdk();

  const { error } = useQuery({
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
    enabled: !!targetAccount && !!sourceAccount && !!swapInformation,
  });
  useEffect(() => {
    if (error) {
      onError(new Error(JSON.stringify(error)));
    }
  }, [error, onError]);
}
