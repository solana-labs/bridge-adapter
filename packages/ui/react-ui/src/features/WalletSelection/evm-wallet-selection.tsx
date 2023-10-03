import type { ChainName } from "@solana/bridge-adapter-base";
import type { FC } from "react";
import type { Connector } from "wagmi";
import { useCallback, useEffect } from "react";
import { useEvmContext } from "@solana/bridge-adapter-react";
import type { WalletName } from "../../shared/ui/icons/WalletIcon";
import type { ConnectorData } from "./evm-wallet-selection-base";
import { EvmWalletConnectionListBase } from "./evm-wallet-selection-base";

interface EvmWalletConnectionListProps {
  chain: ChainName;
}

export const EvmWalletConnectionList: FC<EvmWalletConnectionListProps> = ({
  chain,
}) => {
  console.log("EVM", { chain });

  const {
    connect,
    connectors,
    isLoading,
    pendingConnector,
    disconnect,
    setChain,
  } = useEvmContext();

  useEffect(() => {
    setChain(chain);
    console.log("settings chaint");
  }, [setChain, chain]);

  const onDisconnect = useCallback(
    ({ name }: { name: string }) => {
      const targetConnector = connectors.find(
        (connector: Connector) => connector.name === name,
      );
      disconnect(undefined, {
        onSuccess() {
          connect({ connector: targetConnector });
        },
      });
    },
    [connect, disconnect, connectors],
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

function formatConnector(data: {
  id: string;
  name: string;
  ready: boolean;
}): ConnectorData {
  const { id, name, ready } = data;
  const connectorName = name as WalletName;

  return { id, name: connectorName, ready };
}
