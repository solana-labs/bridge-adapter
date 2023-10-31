import type { ChainSelectionType } from "@solana/bridge-adapter-react";
import type { FC } from "react";
import type { Token } from "@solana/bridge-adapter-base";
import { AddressLine } from "../../shared/ui/AddressLine";
import { Button } from "../../shared/ui/button";
import { FixedSizeList } from "react-window";
import { Input } from "../../shared/ui/input";
import { Skeleton } from "../../shared/ui/skeleton";
import { useEffect, useState } from "react";

export interface TokenSelectBaseProps {
  isLoadingTokens: boolean;
  labels?: {
    [key: string]: string;
    searchPlaceholder: string;
    selectChain: string;
    noTokens: string;
  };
  onSelectToken: (t: Token) => () => void;
  chain: ChainSelectionType;
  tokens?: Token[];
}

const LABELS = {
  searchPlaceholder: "Search Token",
  selectChain: "Select a chain first",
  noTokens: "No Tokens found",
};

export const TokenSelectBase: FC<TokenSelectBaseProps> = ({
  isLoadingTokens,
  labels = LABELS,
  onSelectToken,
  chain: chainOfInterest,
  tokens,
}) => {
  const [tokenSearch, setTokenSearch] = useState("");
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);

  useEffect(() => {
    if (tokenSearch && tokens) {
      setFilteredTokens(
        tokens.filter((token) => {
          const searchTerm = tokenSearch.toLowerCase();
          return (
            token.name.toLowerCase().includes(searchTerm) ||
            token.address.toLowerCase().includes(searchTerm) ||
            token.symbol.toLowerCase().includes(searchTerm)
          );
        }),
      );
    } else if (tokens) {
      setFilteredTokens([...tokens]);
    }
  }, [tokenSearch, tokens]);
  let TokenList = (
    <div className="bsa-flex bsa-flex-col bsa-space-y-5 bsa-overflow-auto">
      {Array(5)
        .fill(0)
        .map((_, idx) => {
          return <Skeleton key={idx} className="bsa-h-10 bsa-w-full" />;
        })}
    </div>
  );
  if (chainOfInterest === "Select a chain") {
    TokenList = (
      <div className="bsa-w-full bsa-text-center bsa-text-muted-foreground">
        {labels.selectChain}
      </div>
    );
  } else if (!isLoadingTokens && filteredTokens.length === 0) {
    TokenList = (
      <div className="bsa-w-full bsa-text-center bsa-text-muted-foreground">
        {labels.noTokens}
      </div>
    );
  } else if (!isLoadingTokens && filteredTokens.length > 0) {
    const tokenItemHeight = 45;
    const gutter = 10;

    TokenList = (
      <FixedSizeList
        itemSize={tokenItemHeight + gutter}
        height={330}
        itemCount={filteredTokens.length}
        width="100%"
      >
        {({ index, style }) => {
          const token = filteredTokens[index];
          return (
            <Button
              aria-label={`${token.symbol} Token`}
              key={token.address}
              variant="ghost"
              size="lg"
              className="bsa-items-center bsa-justify-between bsa-px-4"
              style={{
                ...style,
                top:
                  (typeof style?.top === "number"
                    ? style?.top
                    : parseInt(style?.top ?? "0")) + gutter,
                height:
                  (typeof style.height === "number"
                    ? style.height
                    : parseInt(style?.height ?? "0")) - gutter,
              }}
              onClick={onSelectToken(token)}
            >
              <div className="bsa-flex bsa-items-center bsa-space-x-2">
                <img
                  className="bsa-h-8 bsa-w-8 bsa-rounded-md overflow-hidden"
                  src={token.logoUri}
                  alt={token.name}
                />
                <div className="bsa-flex bsa-flex-col bsa-items-start">
                  <div className="">{token.name}</div>
                  <AddressLine
                    address={token.address}
                    isName={false}
                    className="bsa-text-sm bsa-text-muted-foreground"
                  />
                </div>
              </div>
            </Button>
          );
        }}
      </FixedSizeList>
    );
  }

  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-5">
      <Input
        name="search"
        onChange={(e) => {
          setTokenSearch(e.target.value);
        }}
        placeholder={labels.searchPlaceholder}
        type="text"
        value={tokenSearch}
      />
      <div className="bsa-max-h-72 bsa-w-full bsa-overflow-hidden bsa-px-1 bsa-py-1">
        {TokenList}
      </div>
    </div>
  );
};
