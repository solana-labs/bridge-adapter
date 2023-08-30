import React, { memo } from "react";
import type { FC, JSX, ReactNode } from "react";
import { BridgeHeader, BridgeModal as Content } from "./widgets"; // TODO: reword component
import type { BridgeModalTheme } from "./widgets/bridge-modal";
import type { BridgeHeaderProps } from "./widgets/bridge-header";
import { ChainAndTokenSelect } from "./features/ChainAndTokenSelect";
import { MultiChainSelection } from "./pages";
import { PendingTransaction } from "./features";
import { ProfileDetails } from "./features";
import { SwapDetails, SwapReview } from "./features/SwapDetails";
import { SwapSettings } from "./features";
import { TokenSelection } from "./features";
import { CompletedTransaction } from "./features";
import { WalletSelection } from "./features/WalletSelection";

const HeaderSlotComponent = memo<BridgeHeaderProps>(({ title }) => (
  <BridgeHeader title={title} />
));
HeaderSlotComponent.displayName = BridgeHeader.displayName;

const BodySlotComponent = memo<{ currentBridgeStep: string }>(
  ({ currentBridgeStep }) => {
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
      case "TOKEN_SELECTION": {
        body = <TokenSelection />;
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
        body = <CompletedTransaction />;
        break;
      }
      default:
        throw new Error(`BAD STATE: Unknown bridge step`);
    }

    return body;
  },
);
BodySlotComponent.displayName = "BridgeBody";

export const BridgeModal: FC<{
  children: JSX.Element;
  modalTitle: string;
  theme: BridgeModalTheme;
}> = ({ children, modalTitle, theme }) => {
  const headerSlot = <HeaderSlotComponent title={modalTitle} />;

  return (
    <Content
      BodyComponent={BodySlotComponent}
      headerSlot={headerSlot}
      theme={theme}
    >
      {children}
    </Content>
  );
};
