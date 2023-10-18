import { memo } from "react";
import type { FC, JSX } from "react";
import * as BridgeAdapterReact from "@solana/bridge-adapter-react";
import { BridgeHeader, BridgeSwap } from "../widgets";
import type { BridgeHeaderProps } from "../widgets";
import type { BridgeAdapterTheme } from "../types";
import { BridgeContent } from "./bridge-content";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../shared/ui/dialog";

const HeaderSlotComponent = memo<BridgeHeaderProps>(
  ({ currentBridgeStep, title }) => (
    <DialogHeader aria-description="Modal to swap assets between various blockchains">
      <BridgeHeader currentBridgeStep={currentBridgeStep} title={title} />
    </DialogHeader>
  ),
);
HeaderSlotComponent.displayName = "BridgeHeader";

const BodySlotComponent = memo<{ currentBridgeStep: string }>(BridgeContent);
BodySlotComponent.displayName = "BridgeBody";

/**
 *  Bridge Adapter Dialog
 */
export const BridgeAdapterDialog: FC<{
  children: JSX.Element;
  title: string;
  theme: BridgeAdapterTheme;
}> = ({ children, title, theme }) => {
  const currentBridgeStep =
    BridgeAdapterReact.useBridgeModalStore.use.currentBridgeStep();

  const onOpenChange = () => {
    if (currentBridgeStep === "TRANSACTION_COMPLETED") {
      BridgeAdapterReact.resetBridgeModalStore();
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} modal={false}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <BridgeSwap
          BodyComponent={BodySlotComponent}
          HeaderComponent={HeaderSlotComponent}
          theme={theme}
          title={title}
        />
      </DialogContent>
    </Dialog>
  );
};
