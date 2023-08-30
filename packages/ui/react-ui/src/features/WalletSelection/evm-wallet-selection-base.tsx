import type { FC } from "react";
import type { Connector } from "wagmi";
import { Button } from "../../shared/ui/button";
import type { WalletName } from "../../shared/ui/icons/WalletIcon";
import { WalletIcon } from "../../shared/ui/icons/WalletIcon";

export type ConnectorData<T = unknown, K = unknown> = Pick<
  Connector<T, K>,
  "id" | "name" | "ready"
> & { name: WalletName };

interface EvmWalletConnectionListBaseProps {
  connectors: ConnectorData[];
  isLoading?: boolean;
  pendingConnector?: ConnectorData;
  onDisconnect: (a: Pick<ConnectorData, "name">) => void;
}

export const EvmWalletConnectionListBase: FC<
  EvmWalletConnectionListBaseProps
> = ({ connectors, isLoading = false, pendingConnector, onDisconnect }) => {
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
        const isLoadingConnector = !connector.ready || isCurrentlyConnecting;

        return (
          <Button
            key={connector.id}
            size="lg"
            variant="secondary"
            className="bsa-flex bsa-w-full bsa-items-center bsa-justify-start bsa-space-x-3 bsa-py-5"
            isLoading={isLoadingConnector}
            loadingText={`Connecting ${connector.name}`}
            aria-label={
              isLoadingConnector
                ? "Loading Connector"
                : `${connector.name} Connector`
            }
            onClick={() => onDisconnect({ name: connector.name })}
          >
            <WalletIcon walletName={connector.name} className="bsa-mr-2" />{" "}
            {connector.name}
          </Button>
        );
      })}
    </div>
  );
};
