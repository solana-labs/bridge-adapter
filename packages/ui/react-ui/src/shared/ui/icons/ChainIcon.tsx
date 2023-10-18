import {
  Arbitrum,
  Avalanche,
  BinanceUsd,
  Ethereum,
  Optimism,
  Polygon,
  Solana,
} from "@thirdweb-dev/chain-icons";
import type { ChainSelectionType } from "@solana/bridge-adapter-react";
import type { SVGProps } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../../lib/styles";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { Link2Off } from "lucide-react";

const iconVariants = cva("", {
  variants: {
    size: {
      "2xs": "bsa-h-3 bsa-w-3",
      xs: "bsa-h-4 bsa-w-4",
      sm: "bsa-h-5 bsa-w-5",
      md: "bsa-h-6 bsa-w-6",
      lg: "bsa-h-7 bsa-w-7",
      xl: "bsa-h-8 bsa-w-8",
      "2xl": "bsa-h-12 bsa-w-12",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface ChainIconProps
  extends SVGProps<SVGSVGElement>,
    VariantProps<typeof iconVariants> {
  chainName: ChainSelectionType;
}

const ChainIcon = forwardRef<SVGSVGElement, ChainIconProps>(
  ({ chainName, className, size, ...props }, ref) => {
    switch (chainName) {
      case "Ethereum":
        return (
          <Ethereum
            className={cn(iconVariants({ size, className }))}
            ref={ref}
            {...props}
          />
        );
      case "Solana":
        return (
          <Solana
            className={cn(iconVariants({ size, className }))}
            ref={ref}
            {...props}
          />
        );
      case "Polygon":
        return (
          <Polygon
            className={cn(iconVariants({ size, className }))}
            ref={ref}
            {...props}
          />
        );
      case "Arbitrum":
        return (
          <Arbitrum
            className={cn(iconVariants({ size, className }))}
            ref={ref}
            {...props}
          />
        );
      case "Optimism":
        return (
          <Optimism
            className={cn(iconVariants({ size, className }))}
            ref={ref}
            {...props}
          />
        );
      case "Avalanche":
        return (
          <Avalanche
            className={cn(iconVariants({ size, className }))}
            ref={ref}
            {...props}
          />
        );
      case "BSC":
        return (
          <BinanceUsd
            className={cn(iconVariants({ size, className }))}
            ref={ref}
            {...props}
          />
        );
      case "Select a chain":
      default:
        return (
          <Link2Off
            className={cn(iconVariants({ size, className }))}
            ref={ref}
            {...props}
          />
        );
    }
  },
);

ChainIcon.displayName = "ChainIcon";
export { ChainIcon };
