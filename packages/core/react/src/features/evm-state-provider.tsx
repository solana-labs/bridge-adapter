import {
  createContext,
  useCallback,
  useMemo,
  useContext,
  useState,
} from "react";
import * as BridgeAdapterBase from "@solana/bridge-adapter-base";
import type { ChainName } from "@solana/bridge-adapter-base";
import type { Connector } from "wagmi";
import type { ReactNode } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { logger } from "../lib/logger";

type ChainNameSetter = (name: ChainName) => void;

type ConnectParams = Parameters<ReturnType<typeof useConnect>["connect"]>[0];

interface EvmState {
  disconnect: ReturnType<typeof useDisconnect>["disconnect"];
  connect: (_: ConnectParams & { onSuccess?: () => void }) => void;
  connectors: Connector[];
  isLoading: boolean;
  isConnected: boolean;
  pendingConnector?: Connector;
  setChain: ChainNameSetter;
}

const STATE = {
  connect() {},
  connectors: [],
  disconnect: () => {},
  isLoading: false,
  isConnected: false,
  pendingConnector: undefined,
  setChain() {},
} satisfies EvmState;

const EvmState = createContext<EvmState>(STATE);

export const EvmStateProvider = ({
  children,
  onError,
}: {
  children: ReactNode;
  onError?: (e: Error) => void;
}) => {
  const [chainName, setChainName] = useState<ChainName>(
    BridgeAdapterBase.SupportedChainNames[0],
  );

  const { isConnected } = useAccount();

  const handleConnectError = useCallback(
    (error: Error) => {
      logger.error("Can not establish connection due to error");
      onError?.(error);
    },
    [onError],
  );

  // FIXME: remove the implementation if it's not needed
  const handleConnectSuccess = useCallback(() => {
    logger.debug("Connection established successfully");
  }, []);

  const { connectAsync, connectors, isLoading, pendingConnector } = useConnect({
    chainId: BridgeAdapterBase.chainNameToChainId(chainName),
    onSuccess: handleConnectSuccess,
    onError: handleConnectError,
  });

  const { disconnect } = useDisconnect({
    onError: handleConnectError,
  });

  const connectToWallet = useCallback(
    async ({ connector, onSuccess }: Parameters<EvmState["connect"]>[0]) => {
      const data = await connectAsync({ connector });
      if (data) {
        const { name, id } = data.connector ?? {};
        logger.info(`Connected to wallet ${name}::${id}`);
        onSuccess?.();
      }
    },
    [connectAsync],
  );

  const setChain = useCallback<ChainNameSetter>((name) => {
    logger.debug(`Trying to set the new chain: ${name}`);
    setChainName(name);
  }, []);

  const data = useMemo(
    () => ({
      disconnect,
      connect: connectToWallet,
      connectors,
      isConnected,
      isLoading,
      pendingConnector,
      setChain,
    }),
    [
      disconnect,
      connectToWallet,
      connectors,
      isLoading,
      isConnected,
      pendingConnector,
      setChain,
    ],
  );

  return <EvmState.Provider value={data}>{children}</EvmState.Provider>;
};

export const useEvmContext = () => {
  return useContext(EvmState);
};

export const useEvmAccount = useAccount;

export const useEvmConnect = useConnect;

export const useEvmDisconnect = useDisconnect;
