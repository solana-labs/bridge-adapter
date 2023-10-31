import type { FC, ReactNode } from "react";
import { ChainAndTokenSelect } from "../features/ChainAndTokenSelect";
import { MultiChainSelection } from "../pages";
import {
  CompletedTransaction,
  PendingTransaction,
} from "../features/TransactionLifecycle";
import { SwapDetails, SwapReview } from "../features/SwapDetails";
import { ProfileDetails, SwapSettings } from "../widgets";
import { WalletSelection } from "../features/WalletSelection";

export interface BridgeContentProps {
  currentBridgeStep: string;
  onComplete?: () => void;
}

export const BridgeContent: FC<BridgeContentProps> = ({
  currentBridgeStep,
  onComplete,
}) => {
  let body: ReactNode;
  switch (currentBridgeStep) {
    case "MULTI_CHAIN_SELECTION": {
      body = <MultiChainSelection />;
      break;
    }

    case "PENDING_TRANSACTION": {
      body = <PendingTransaction />;
      break;
    }
    case "SWAP_DETAILS": {
      body = <SwapDetails />;
      break;
    }
    case "SWAP_REVIEW": {
      body = <SwapReview />;
      break;
    }
    case "SWAP_SETTINGS": {
      body = <SwapSettings />;
      break;
    }
    case "WALLET_SELECTION": {
      body = <WalletSelection />;
      break;
    }
    case "PROFILE_DETAILS": {
      body = <ProfileDetails />;
      break;
    }
    case "TOKEN_CHAIN_SELECTION": {
      body = <ChainAndTokenSelect />;
      break;
    }
    case "TRANSACTION_COMPLETED": {
      body = <CompletedTransaction onComplete={onComplete} />;
      break;
    }
    default:
      throw new Error(`BAD STATE: Unknown bridge step`);
  }

  return body;
};
