import * as BridgeAdapter from "@solana/bridge-adapter-react";
import type { RouteError } from "@solana/bridge-adapter-base";
import { isSwapInfoEqual } from "../../shared/lib/utils";
import { useCanGetSwapInfo } from "./use-can-get-swap-info";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export function useSwapInfo() {
  const sdk = BridgeAdapter.useBridgeModalStore.use.sdk();
  const { sourceToken, targetToken } =
    BridgeAdapter.useBridgeModalStore.use.token();
  const currentSwapInformation =
    BridgeAdapter.useBridgeModalStore.use.swapInformation();
  const { canGetSwapInfo } = useCanGetSwapInfo();

  const [routeErrors, setRouteErrors] = useState<RouteError[]>();

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const routeInfo = await sdk.getSwapInformation(
        sourceToken,
        targetToken,
        setRouteErrors,
      );
      return routeInfo;
    },
    queryKey: ["bridgeInfo", sourceToken, targetToken, setRouteErrors],
    enabled: canGetSwapInfo,
    useErrorBoundary: true,
  });

  useEffect(() => {
    if (data && data.length && !currentSwapInformation) {
      BridgeAdapter.setSwapInformation(data[0]);
    }
    if (data && data.length && currentSwapInformation) {
      for (const newSwapInfo of data) {
        if (isSwapInfoEqual(newSwapInfo, currentSwapInformation)) {
          BridgeAdapter.setSwapInformation(newSwapInfo);
        }
      }
    }
  }, [currentSwapInformation, data]);

  return { swapInfo: data, isLoadingSwapInfo: isLoading, routeErrors };
}
