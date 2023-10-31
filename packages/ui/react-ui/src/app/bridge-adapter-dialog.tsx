import * as BridgeAdapterReact from "@solana/bridge-adapter-react";
import * as Dialog from "../shared/ui/dialog";
import type { BridgeAdapterTheme } from "../types";
import type { BridgeHeaderProps } from "../widgets";
import type { FC, HTMLProps, JSX } from "react";
import { BridgeContent } from "./bridge-content";
import { BridgeHeader, BridgeSwap } from "../widgets";
import { memo } from "react";

const HeaderSlotComponent = memo<BridgeHeaderProps>(
  ({ currentBridgeStep, title }) => (
    <Dialog.DialogHeader aria-description="Modal to swap assets between various blockchains">
      <BridgeHeader currentBridgeStep={currentBridgeStep} title={title} />
    </Dialog.DialogHeader>
  ),
);
HeaderSlotComponent.displayName = "BridgeHeader";

const BodySlotComponent = memo<{ currentBridgeStep: string }>(BridgeContent);
BodySlotComponent.displayName = "BridgeBody";

/**
 *  Bridge Adapter Dialog
 */
export interface BridgeAdapterDialogProps extends HTMLProps<HTMLElement> {
  children: JSX.Element;
  title: string;
  theme: BridgeAdapterTheme;
}

export const BridgeAdapterDialog: FC<BridgeAdapterDialogProps> = ({
  children,
  className,
  title,
  theme,
}) => {
  const currentBridgeStep =
    BridgeAdapterReact.useBridgeModalStore.use.currentBridgeStep();

  const onSwapCompleted = () => {
    BridgeAdapterReact.resetBridgeModalStore();
  };

  const onOpenChange = () => {
    if (currentBridgeStep === "TRANSACTION_COMPLETED") {
      onSwapCompleted();
    }
  };

  return (
    <Dialog.Dialog onOpenChange={onOpenChange} modal={false}>
      <Dialog.DialogTrigger asChild>{children}</Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <BridgeSwap
          BodyComponent={BodySlotComponent}
          className={className}
          HeaderComponent={HeaderSlotComponent}
          onSwapCompleted={onSwapCompleted}
          theme={theme}
          title={title}
        />
      </Dialog.DialogContent>
    </Dialog.Dialog>
  );
};
