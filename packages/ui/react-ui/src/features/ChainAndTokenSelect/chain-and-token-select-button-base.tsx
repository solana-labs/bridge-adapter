import type { TokenWithAmount } from "bridge-adapter-base";
import type { FC } from "react";
import { Ban, ChevronRight } from "lucide-react";
import type { ChainSelectionType } from "../../types/BridgeModal";
import { Button } from "../../shared/ui/button";
import { ChainIcon } from "../../shared/ui/icons/ChainIcon";
import { cn } from "../../shared/lib/styles";

interface ChainAndTokenSelectButtonBaseProps {
  className?: string;
  labels?: {
    [key: string]: string;
    selectToken: string;
  };
  onSelect: () => void;
  chain: ChainSelectionType;
  token: Pick<TokenWithAmount, "address" | "logoUri" | "name">;
}

const LABELS = {
  selectToken: "Select Token",
};

export const ChainAndTokenSelectButtonBase: FC<
  ChainAndTokenSelectButtonBaseProps
> = ({ className, labels = LABELS, onSelect, chain, token }) => {
  const isTokenChosen = !!token.address;

  let TokenDisplay = (
    <div className="bsa-relative bsa-flex bsa-flex-grow bsa-items-center bsa-space-x-2 bsa-py-1">
      <ChainIcon
        size="sm"
        chainName={chain}
        className="bsa-absolute bsa-bottom-0 bsa-left-0.5 bsa-rounded-full bsa-border bsa-border-accent bsa-bg-accent bsa-p-1"
      />
      <img className="bsa-h-8 bsa-w-8" src={token.logoUri} alt={token.name} />
      <div className="bsa-max-w-[100px] bsa-overflow-hidden bsa-text-ellipsis bsa-whitespace-nowrap">
        {token.name}
      </div>
    </div>
  );

  if (!isTokenChosen) {
    TokenDisplay = (
      <>
        <Ban className="bsa-h-4 bsa-w-4 bsa-text-muted-foreground" />
        <div className="bsa-text-sm bsa-text-muted-foreground">
          {labels.selectToken}
        </div>
      </>
    );
  }

  return (
    <Button
      aria-label="Select Token"
      className={cn("bsa-w-max bsa-space-x-2", className)}
      onClick={onSelect}
      size="lg"
      variant={isTokenChosen ? "ghost" : "secondary"}
    >
      {TokenDisplay}
      <ChevronRight />
    </Button>
  );
};
