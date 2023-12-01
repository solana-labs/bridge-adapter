import type { ChainDestType, ChainName } from "@solana/bridge-adapter-core";

export type BridgeStep =
  | "MULTI_CHAIN_SELECTION"
  | "WALLET_SELECTION"
  | "TOKEN_CHAIN_SELECTION"
  | "SWAP_SETTINGS"
  | "SWAP_DETAILS"
  | "SWAP_REVIEW"
  | "PENDING_TRANSACTION"
  | "TRANSACTION_COMPLETED"
  | "PROFILE_DETAILS";

export type SetCurrentBridgeStepType<T extends BridgeStep> = T extends
  | "TOKEN_CHAIN_SELECTION"
  | "WALLET_SELECTION"
  ? {
      step: T;
      params: BridgeStepParams<T>;
    }
  : {
      step: T;
    };

export type BridgeStepParams<T extends BridgeStep> = T extends
  | "TOKEN_CHAIN_SELECTION"
  ? { chainDest: ChainDestType }
  : T extends "WALLET_SELECTION"
  ? { chain: ChainName; onSuccess?: () => void }
  : undefined;

export type ChainSelectionType = ChainName | "Select a chain";

export type SlippageToleranceType = number | "auto";

export type RelayerFeeType = {
  active?: boolean;
  sourceFee?: number;
  targetFee?: number;
};
