import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { isSwapInfoEqual } from "../../shared/lib/utils";
import { setSwapInformation, useBridgeModalStore } from "bridge-adapter-react";
import { useCanGetSwapInfo } from "./use-can-get-swap-info";

// FIXME: write tests

export function useSwapInfo() {
  const sdk = useBridgeModalStore.use.sdk();
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  const currentSwapInformation = useBridgeModalStore.use.swapInformation();
  const { canGetSwapInfo } = useCanGetSwapInfo();

  const { data, isLoading, error } = useQuery({
    queryFn: async () => {
      const routeInfo = await sdk.getSwapInformation(sourceToken, targetToken);
      console.log("routeInfo", routeInfo);
      return routeInfo;
    },
    queryKey: ["bridgeInfo", sourceToken, targetToken],
    enabled: canGetSwapInfo,
  });

  useEffect(() => {
    if (data && data.length && !currentSwapInformation) {
      setSwapInformation(data[0]);
    }
    if (data && data.length && currentSwapInformation) {
      for (const newSwapInfo of data) {
        if (isSwapInfoEqual(newSwapInfo, currentSwapInformation)) {
          setSwapInformation(newSwapInfo);
        }
      }
    }
  }, [currentSwapInformation, data]);

  if (error) {
    throw error;
  }

  return { swapInfo: data, isLoadingSwapInfo: isLoading };
}
