import type { Connector } from "wagmi";
import type { FC } from "react";
import type { WalletName } from "../../shared/ui/icons/WalletIcon";
import { Button } from "../../shared/ui/button";
import { WalletIcon } from "../../shared/ui/icons/WalletIcon";

export type ConnectorData<T = unknown, K = unknown> = Pick<
  Connector<T, K>,
  "id" | "name" | "ready"
> & { name: WalletName };

export interface EvmWalletConnectionListBaseProps {
  connectors: ConnectorData[];
  isLoading?: boolean;
  pendingConnector?: ConnectorData;
  onDisconnect: (a: Pick<ConnectorData, "name">) => void;
}

export const EvmWalletConnectionListBase: FC<
  EvmWalletConnectionListBaseProps
> = ({ connectors, isLoading = false, pendingConnector, onDisconnect }) => {
  /// Reduce the number of connectors as `injected` might overlap the existing.
  const uniqConnectors = connectors.reduce<ConnectorData[]>((acc, next) => {
    const exists = acc.findIndex((item) => {
      return item.name === next.name;
    });

    if (exists !== -1) return acc;
    else return acc.concat(next);
  }, []);

  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-4">
      {uniqConnectors.map((connector) => {
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
