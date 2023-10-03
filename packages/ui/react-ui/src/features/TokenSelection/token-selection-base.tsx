import type { FC } from "react";
import type {
  ChainDestType,
  Token,
  TokenWithAmount,
} from "@solana/bridge-adapter-base";
import { useEffect, useState } from "react";
import { AddressLine } from "../../shared/ui/AddressLine";
import { Button } from "../..//shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Skeleton } from "../../shared/ui/skeleton";

interface TokenSelectionBaseProps {
  chainDest: ChainDestType;
  tokens?: Token[];
  tokenSearch: string;
  isInitialLoading: boolean;
  onSetToken: (t: TokenWithAmount, c: ChainDestType) => void;
  onSearchToken: (v: string) => void;
}

export const TokenSelectionBase: FC<TokenSelectionBaseProps> = ({
  chainDest,
  tokens,
  tokenSearch,
  isInitialLoading,
  onSearchToken,
  onSetToken,
}) => {
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

  const onTokenClick = (token: Token) => {
    return () => {
      onSetToken(
        {
          ...token,
          selectedAmountFormatted: "",
          selectedAmountInBaseUnits: "0",
        },
        chainDest,
      );
    };
  };

  let TokenList = (
    <div className="bsa-w-full bsa-text-center bsa-text-muted-foreground">
      No Tokens found
    </div>
  );
  if (isInitialLoading) {
    TokenList = (
      <>
        {[...Array<undefined>(5)].map((_, idx) => {
          return <Skeleton key={idx} className="bsa-h-10 bsa-w-full" />;
        })}
      </>
    );
  } else if (filteredTokens.length > 0) {
    TokenList = (
      <>
        {filteredTokens.map((token) => {
          return (
            <Button
              key={token.address}
              variant={"ghost"}
              size={"lg"}
              className="bsa-items-center bsa-justify-between bsa-px-4"
              onClick={onTokenClick(token)}
            >
              <div className="bsa-flex bsa-items-center bsa-space-x-2">
                <img
                  className="bsa-h-8 bsa-w-8 bsa-rounded-md overflow-hidden"
                  src={token.logoUri}
                  alt={token.name}
                />
                <div>
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
        })}
      </>
    );
  }

  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-7">
      <Input
        placeholder="Search Token"
        type="text"
        value={tokenSearch}
        onChange={(e) => {
          onSearchToken(e.target.value);
        }}
      />
      <div className="bsa-flex bsa-max-h-96 bsa-flex-col bsa-space-y-5 bsa-overflow-auto bsa-px-1 bsa-py-1">
        {TokenList}
      </div>
    </div>
  );
};
