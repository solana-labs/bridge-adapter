import {
  createContext,
  useCallback,
  useMemo,
  useContext,
  useState,
} from "react";
import Debug from "debug";
import type { ChainName } from "@solana/bridge-adapter-base";
import type { Connector } from "wagmi";
import type { ReactNode } from "react";
import {
  chainNameToChainId,
  SupportedChainNames,
} from "@solana/bridge-adapter-base";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const debug = Debug("debug:react-ui:EvmState");

type ChainNameSetter = (name: ChainName) => void;

interface EvmState {
  disconnect: () => unknown;
  connect: () => unknown;
  connectors: Connector[];
  isLoading: boolean;
  isConnected: boolean;
  onSuccess?: () => unknown;
  pendingConnector?: Connector;
  //changeChainHandler: ({ name?: ChainName }) => void;
  setChain: ChainNameSetter;
}

const STATE = {
  connect() {},
  connectors: [],
  disconnect: () => {},
  isLoading: false,
  isConnected: false,
  onSuccess: () => {},
  pendingConnector: undefined,
  //changeChainHandler: (a: { name?: ChainName }) => {},
  setChain() {},
} satisfies EvmState;

const EvmState = createContext<EvmState>(STATE);

export const EvmStateProvider = ({ children }: { children: ReactNode }) => {
  const [chainName, setChainName] = useState<ChainName>(SupportedChainNames[0]);
  const [onSuccess /*, setSuccessHandler*/] = useState<
    (() => unknown) | undefined
  >(undefined);

  const { isConnected } = useAccount();

  const { connect, connectors, isLoading, pendingConnector } = useConnect({
    chainId: chainNameToChainId(chainName),
    onSuccess,
  });
  const { disconnect } = useDisconnect();

  //const changeChainHandler = useCallback(
  //({ name, onSuccess }: { name?: ChainName; onSuccess?: () => unknown }) => {
  //setChainName(name || SupportedChainNames[0]);
  //setSuccessHandler(onSuccess);
  //},
  //[setChainName, setSuccessHandler],
  //);
  //
  const setChain = useCallback<ChainNameSetter>((name) => {
    debug(`Trying to set the new chain`, name);
    setChainName(name);
  }, []);

  console.log("rerender on setting chain");

  const data = useMemo(
    () => ({
      disconnect,
      connect,
      onSuccess,
      //changeChainHandler,
      connectors,
      isConnected,
      isLoading,
      pendingConnector,
      setChain,
    }),
    [
      disconnect,
      connect,
      connectors,
      onSuccess,
      //changeChainHandler,
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
