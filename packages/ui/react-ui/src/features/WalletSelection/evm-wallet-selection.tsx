import type { ChainName } from "bridge-adapter-base";
import type { FC } from "react";
import { useCallback } from "react";
import { chainNameToChainId } from "bridge-adapter-base";
import { useEtheriumChain } from "bridge-adapter-react";
import type { WalletName } from "../../shared/ui/icons/WalletIcon";
import type { ConnectorData } from "./evm-wallet-selection-base";
import { EvmWalletConnectionListBase } from "./evm-wallet-selection-base";

interface EvmWalletConnectionListProps {
  chain: ChainName;
  onSuccess?: () => void;
}

function formatConnector(data: {
  id: string;
  name: string;
  ready: boolean;
}): ConnectorData {
  const { id, name, ready } = data;
  const connectorName = name as WalletName;

  return { id, name: connectorName, ready };
}

export const EvmWalletConnectionList: FC<EvmWalletConnectionListProps> = ({
  chain,
  onSuccess,
}) => {
  const { connect, connectors, isLoading, pendingConnector, disconnect } =
    useEtheriumChain({
      chainId: chainNameToChainId(chain),
    });

  const onDisconnect = useCallback(
    ({ name }: { name: string }) => {
      const targetConnector = connectors.find(
        (connector) => connector.name === name,
      );
      disconnect(undefined, {
        onSuccess() {
          connect({ connector });
        },
      });
    },
    [disconnect, connectors],
  );

  const connectorsData = connectors.map(formatConnector);

  return (
    <EvmWalletConnectionListBase
      connectors={connectorsData}
      isLoading={isLoading}
      onDisconnect={onDisconnect}
      pendingConnector={
        pendingConnector ? formatConnector(pendingConnector) : pendingConnector
      }
    />
  );
};
