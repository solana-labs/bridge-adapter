import * as BridgeAdapterReact from "@solana/bridge-adapter-react";
import type { BridgeAdapterTheme } from "../types";
import type { BridgeHeaderProps } from "../widgets/bridge-header";
import type { FC, HTMLProps } from "react";
import { BridgeContent } from "../app/bridge-content";
import { BridgeHeader, BridgeSwap } from "../widgets";
import { memo, useCallback } from "react";

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

/**
 *  Bridge Adapter
 */

export interface BridgeAdapterProps extends HTMLProps<HTMLElement> {
  title: string;
  theme?: BridgeAdapterTheme;
}

export const BridgeAdapter: FC<BridgeAdapterProps> = ({
  className,
  title,
  theme,
}) => {
  const onCompleted = useCallback(() => {
    BridgeAdapterReact.resetBridgeModalStore();
  }, []);

  return (
    <BridgeSwap
      BodyComponent={BodySlotComponent}
      className={className}
      HeaderComponent={HeaderSlotComponent}
      onSwapCompleted={onCompleted}
      theme={theme}
      title={title}
    />
  );
};
