import type {
  ChainDestType,
  ChainName,
} from "@elasticbottle/core-bridge-adapter-sdk";

export const EMPTY_BRIDGE_STEP_TITLE = "Select a chain";

export type BridgeStep =
  | "MULTI_CHAIN_SELECTION"
  | "WALLET_SELECTION"
  | "TOKEN_SELECTION"
  | "TOKEN_CHAIN_SELECTION"
  | "SWAP_SETTINGS"
  | "SWAP_DETAILS"
  | "SWAP_REVIEW"
  | "PENDING_TRANSACTION"
  | "TRANSACTION_COMPLETED"
  | "PROFILE_DETAILS";

export const BridgeStepToTitle: Record<BridgeStep, string> = {
  MULTI_CHAIN_SELECTION: EMPTY_BRIDGE_STEP_TITLE,
  WALLET_SELECTION: "Select a wallet",
  TOKEN_SELECTION: "Select a token",
  TOKEN_CHAIN_SELECTION: "Select a token",
  SWAP_SETTINGS: "Swap settings",
  SWAP_DETAILS: "Swap details",
  SWAP_REVIEW: "Review swap",
  PENDING_TRANSACTION: "Pending transaction",
  TRANSACTION_COMPLETED: "Transaction completed",
  PROFILE_DETAILS: "Account",
};

export type SetCurrentBridgeStepType<T extends BridgeStep> = T extends
  | "TOKEN_CHAIN_SELECTION"
  | "WALLET_SELECTION"
  | "TOKEN_SELECTION"
  ? {
      step: T;
      params: BridgeStepParams<T>;
    }
  : {
      step: T;
    };

export type BridgeStepParams<T extends BridgeStep> = T extends
  | "TOKEN_SELECTION"
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
