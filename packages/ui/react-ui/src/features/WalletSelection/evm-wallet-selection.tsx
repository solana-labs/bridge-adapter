import Debug from "debug";
import type { BridgeStepParams } from "@solana/bridge-adapter-react";
import type { ChainName } from "@solana/bridge-adapter-base";
import type { Connector } from "wagmi";
import type { ConnectorData } from "./evm-wallet-selection-base";
import type { FC } from "react";
import type { WalletName } from "../../shared/ui/icons/WalletIcon";
import { EvmWalletConnectionListBase } from "./evm-wallet-selection-base";
import { useBridgeModalStore } from "@solana/bridge-adapter-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEvmContext } from "@solana/bridge-adapter-react";

const debug = Debug("debug:react-ui:EvmWalletConnectionList");

export interface EvmWalletConnectionListProps {
  chain: ChainName;
  onError?: (_: { name?: string; connecting: boolean }) => void;
}

export const EvmWalletConnectionList: FC<EvmWalletConnectionListProps> = ({
  chain,
  onError,
}) => {
  const {
    isConnected,
    connect,
    connectors,
    isLoading,
    pendingConnector,
    disconnect,
    setChain,
  } = useEvmContext();

  // FIXME: remove "dead code" so the implementation for solana and ethereum be in sync
  const { onSuccess } =
    useBridgeModalStore.use.currentBridgeStepParams() as BridgeStepParams<"WALLET_SELECTION">;

  useEffect(() => {
    setChain(chain);
  }, [setChain, chain]);

  /* FIXME
   *useEffect(() => {
   *  if (isConnected) {
   *    // setCurrentBridgeStep({ step: "MULTI_CHAIN_SELECTION" });
   *  }
   *}, [isConnected, onSuccess]);
   */

  /**
   *  Handle 3rd-party wallet providers.
   *
   *  TODO: May move this to a hook
   *    - [] Add a hook
   *
   *  This is needed because there might be an issue with multiple external wallets.
   *  I use Coinbase & MetaMask in Chrome, and there is an issue connecting to the MetaMask wallet.
   *  It just throws an error to the VM runtime, and there is no nice handle (at the provider) to intercept it with.
   *  That's why we watch for the status by timer.
   */
  const WAIT_INTERVAL = 15_000;
  const timerRef = useRef<NodeJS.Timer>();
  const [isConnecting, setConnecting] = useState<{
    name?: Connector["name"];
    connecting: boolean;
  }>({ connecting: false });
  const onExternalError = useCallback(
    ({ status }: { status: typeof isConnecting }) => {
      debug("Handle 3rd-party wallet status", status);
      if (onError && !isConnected) onError(status);
    },
    [onError, isConnected],
  );

  useEffect(() => {
    if (isConnecting.connecting && !timerRef.current) {
      debug("Start watching for the connection status");
      timerRef.current = setTimeout(() => {
        onExternalError({
          status: { name: isConnecting.name, connecting: false },
        });
        setConnecting({ connecting: false });
      }, WAIT_INTERVAL);
    }

    return () => {
      if (isConnected && timerRef.current) {
        debug("Cleaning up the timer");
        clearTimeout(timerRef.current);
      }
    };
  }, [isConnecting, isConnected, onExternalError]);
  /** end */

  const onDisconnect = useCallback(
    ({ name }: { name: string }) => {
      const targetConnector = connectors.find(
        (connector: Pick<Connector, "name">) => connector.name === name,
      );
      disconnect(undefined, {
        onSuccess() {
          setConnecting({ name: targetConnector?.name, connecting: true });
          connect({
            connector: targetConnector,
            onSuccess: () => {
              onSuccess?.();
            },
          });
        },
      });
    },
    [connect, disconnect, connectors, onSuccess],
  );

  const connectorsData = connectors.map(formatConnector);
  const hasPendingConnectors = isConnecting.connecting;
  const activeConnector = pendingConnector
    ? formatConnector(pendingConnector)
    : pendingConnector;

  return (
    <EvmWalletConnectionListBase
      connectors={connectorsData}
      isLoading={isLoading}
      onDisconnect={onDisconnect}
      pendingConnector={hasPendingConnectors ? activeConnector : undefined}
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
