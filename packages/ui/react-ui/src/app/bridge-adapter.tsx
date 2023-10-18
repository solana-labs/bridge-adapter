import { memo, useCallback } from "react";
import type { FC } from "react";
import type { BridgeHeaderProps } from "../widgets/bridge-header";
import type { BridgeAdapterTheme } from "../types";
import * as BridgeAdapterReact from "@solana/bridge-adapter-react";
import { BridgeContent } from "../app/bridge-content";
import { BridgeHeader, BridgeSwap } from "../widgets";

const HeaderSlotComponent = memo<BridgeHeaderProps>(
  ({ currentBridgeStep, title }) => (
    <div aria-description="Swap assets between various blockchains">
      <BridgeHeader currentBridgeStep={currentBridgeStep} title={title} />
    </div>
  ),
);
HeaderSlotComponent.displayName = BridgeHeader.displayName;

const BodySlotComponent = memo<{ currentBridgeStep: string }>(BridgeContent);
BodySlotComponent.displayName = "BridgeBody";

export const BridgeAdapter: FC<{
  title: string;
  theme: BridgeAdapterTheme;
}> = ({ title, theme }) => {
  const onCompleted = useCallback(() => {
    BridgeAdapterReact.resetBridgeModalStore();
  }, []);

  return (
    <BridgeSwap
      BodyComponent={BodySlotComponent}
      HeaderComponent={HeaderSlotComponent}
      onSwapCompleted={onCompleted}
      theme={theme}
      title={title}
    />
  );
};
