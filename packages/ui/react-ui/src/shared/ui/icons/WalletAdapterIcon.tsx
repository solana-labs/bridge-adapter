/**
 * Taken straight from @solana/wallet-adapter-react-ui.
 */

import type { Wallet } from "@solana/wallet-adapter-react";
import type { DetailedHTMLProps, FC, ImgHTMLAttributes } from "react";

export interface WalletAdapterIconProps
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  wallet: { adapter: Pick<Wallet["adapter"], "icon" | "name"> } | null;
}

export const WalletAdapterIcon: FC<WalletAdapterIconProps> = ({
  wallet,
  ...props
}) => {
  return (
    wallet && (
      <img
        src={wallet.adapter.icon}
        alt={`${wallet.adapter.name} icon`}
        {...props}
      />
    )
  );
};
