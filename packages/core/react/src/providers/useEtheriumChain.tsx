import { createContext, useMemo, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import type { Connector } from "wagmi";
import { EvmWalletProvider } from "../index";
import { chainNameToChainId, SupportedChainNames } from "bridge-adapter-base";
import type { ChainName } from "bridge-adapter-base";

export interface EtheriumChainContextState {
  disconnect: () => unknown;
  connect: () => unknown;
  connectors: Connector[];
  isLoading: boolean;
  isConnected: boolean;
  onSuccess?: () => unknown;
  pendingConnector?: Connector;
  //changeChainHandler: ({ name?: ChainName }) => void;
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
} satisfies EtheriumChainContextState;

export const EtheriumChainContext =
  createContext<EtheriumChainContextState>(STATE);

export const Provider = ({
  children,
  settings,
}: {
  children: ReactNode;
  settings: {
    walletConnectProjectId?: string;
    alchemyApiKey?: string;
    infuraApiKey?: string;
    coinbaseWalletSettings?: {
      appName: string;
    };
  };
}) => {
  console.log({ chainNameToChainId });

  const [chainName /*, setChainName*/] = useState<ChainName>(
    SupportedChainNames[0],
  );
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
    ],
  );

  return (
    <EtheriumChainContext.Provider value={data}>
      <EvmWalletProvider
        walletConnectProjectId={settings.walletConnectProjectId}
        coinbaseWalletSettings={settings.coinbaseWalletSettings}
        infuraApiKey={settings.infuraApiKey}
        alchemyApiKey={settings.alchemyApiKey}
      >
        {children}
      </EvmWalletProvider>
    </EtheriumChainContext.Provider>
  );
};

export const useEtheriumChain = () => useContext(EtheriumChainContext);

export const useEvmAccount = useAccount;

export const useEvmConnect = useConnect;

export const useEvmDisconnect = useDisconnect;
