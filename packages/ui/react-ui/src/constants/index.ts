import type { BridgeStep } from "@solana/bridge-adapter-react";

export const EMPTY_BRIDGE_STEP_TITLE = "Select a chain";

export const BridgeStepToTitle: Record<BridgeStep, string> = {
  MULTI_CHAIN_SELECTION: EMPTY_BRIDGE_STEP_TITLE,
  WALLET_SELECTION: "Select a wallet",
  TOKEN_CHAIN_SELECTION: "Select a token",
  SWAP_SETTINGS: "Swap settings",
  SWAP_DETAILS: "Swap details",
  SWAP_REVIEW: "Review swap",
  PENDING_TRANSACTION: "Pending transaction",
  TRANSACTION_COMPLETED: "Transaction completed",
  PROFILE_DETAILS: "Account",
};
