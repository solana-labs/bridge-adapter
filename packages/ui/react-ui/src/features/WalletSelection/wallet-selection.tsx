import * as React from "react";
import type {
  BridgeStep,
  BridgeStepParams,
} from "@solana/bridge-adapter-react";
import type { ChainName } from "@solana/bridge-adapter-core";
import type { FC } from "react";
import { AbsentChainError } from "../../errors";
import { EvmWalletConnectionList } from "./evm-wallet-selection";
import { SolanaWalletConnectionList } from "./solana-wallet-selecton";
import {
  useBridgeAdapter,
  useBridgeModalStore,
} from "@solana/bridge-adapter-react";

type SolanaChainName = Extract<ChainName, "Solana">;

export const WalletSelection: FC<unknown> = () => {
  const params = useBridgeModalStore.use.currentBridgeStepParams();

  const { setNotification } = useBridgeAdapter();

  if (!hasChain(params)) {
    throw new AbsentChainError("Missing chain");
  }
  const { chain } = params;

  const onEvmError = React.useCallback(
    (status: { name?: string; connecting: boolean }) => {
      if (!status.connecting) {
        setNotification(
          new Error(
            "Can not establish connection to the wallet in the reasonable time",
          ),
        );
      }
    },
    [setNotification],
  );

  if (isSolana(chain)) {
    return <SolanaWalletConnectionList />;
  } else {
    return <EvmWalletConnectionList chain={chain} onError={onEvmError} />;
  }
};

function isSolana(chain: ChainName): chain is SolanaChainName {
  return chain === "Solana";
}

function hasChain(
  params: BridgeStepParams<BridgeStep>,
): params is { chain: ChainName } {
  if (!params) {
    return false;
  }
  return "chain" in params;
}
