import type { ChainDestType } from "bridge-adapter-base";
import { Ban, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "bridge-adapter-react";
import { Button } from "../../../shared/ui/button";

export function TokenSelectionButton({
  chainDest,
  className,
}: {
  chainDest: ChainDestType;
  className?: string;
}) {
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  const tokenOfInterest = chainDest === "source" ? sourceToken : targetToken;
  const isTokenChosen = !!tokenOfInterest.address;

  let TokenDisplay = (
    <>
      <img
        className="bsa-h-6 bsa-w-6"
        src={tokenOfInterest.logoUri}
        alt={tokenOfInterest.name}
      />
      <div className="bsa-max-w-[100px] bsa-overflow-hidden bsa-text-ellipsis bsa-whitespace-nowrap">
        {tokenOfInterest.name}
      </div>
    </>
  );
  if (!isTokenChosen) {
    TokenDisplay = (
      <>
        <Ban className="bsa-h-4 bsa-w-4 bsa-text-muted-foreground" />
        <div className="bsa-text-sm bsa-text-muted-foreground">
          Select Token
        </div>
      </>
    );
  }

  return (
    <Button
      variant={isTokenChosen ? "ghost" : "secondary"}
      size={"lg"}
      className={cn("space-x-2 bsa-min-w-fit", className)}
      onClick={() => {
        setCurrentBridgeStep({
          step: "TOKEN_SELECTION",
          params: { chainDest },
        });
      }}
    >
      <div className="bsa-flex bsa-flex-grow bsa-items-center bsa-space-x-2">
        {TokenDisplay}
      </div>
      <ChevronRight />
    </Button>
  );
}
