import {
  chainNameToChainId,
  type ChainName,
} from "@elasticbottle/core-bridge-adapter-sdk";
import { useConnect, useDisconnect } from "wagmi";
import { Button } from "../../ui/button";
import { WalletIcon } from "../../ui/icons/WalletIcon";
import { EvmWalletDetailedProfile } from "../ProfileDisplays/EvmWalletDetailedProfile";

export function EvmWalletConnectionList({
  chain,
  onSuccess,
}: {
  chain: ChainName;
  onSuccess?: () => void;
}) {
  const { connect, connectors, isLoading, pendingConnector } = useConnect({
    chainId: chainNameToChainId(chain),
    onSuccess,
  });
  const { disconnect } = useDisconnect();

  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-4">
      {connectors.map((connector) => {
        if (!connector.ready) {
          return null;
        }
        if (
          connector.id === "injected" &&
          connector.name.toLowerCase() === "metamask"
        ) {
          return null;
        }

        const isCurrentlyConnecting =
          isLoading && connector.id === pendingConnector?.id;
        return (
          <Button
            key={connector.id}
            size={"lg"}
            variant={"secondary"}
            className="bsa-flex bsa-w-full bsa-items-center bsa-justify-start bsa-space-x-3 bsa-py-5"
            isLoading={!connector.ready || isCurrentlyConnecting}
            loadingText={`Connecting ${connector.name}`}
            onClick={() => {
              disconnect(undefined, {
                onSuccess() {
                  connect({ connector });
                },
              });
            }}
          >
            <WalletIcon walletName={connector.name} className="bsa-mr-2" />{" "}
            {connector.name}
          </Button>
        );
      })}
    </div>
  );
}
