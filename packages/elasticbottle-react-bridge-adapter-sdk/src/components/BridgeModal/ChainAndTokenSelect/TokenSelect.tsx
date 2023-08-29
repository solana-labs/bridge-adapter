// import { useQuery } from "@tanstack/react-query";
import { type Token } from "@elasticbottle/core-bridge-adapter-sdk";
import { useEffect, useState } from "react";
import { FixedSizeList } from "react-window";
import { formatUnits, parseUnits } from "viem";
import { hasChainDest } from "../../../lib/utils";
import {
  setToken,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import { AddressLine } from "../../ui/AddressLine";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Skeleton } from "../../ui/skeleton";
import { useTokenInfo } from "./useTokenInfo";

export function TokenSelect() {
  const params = useBridgeModalStore.use.currentBridgeStepParams();
  if (!hasChainDest(params)) {
    throw new Error("Missing chainDest in params");
  }
  const { chainDest } = params;
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  const chainOfInterest = chainDest === "source" ? sourceChain : targetChain;
  const tokenOfInterest = chainDest === "source" ? sourceToken : targetToken;

  const [tokenSearch, setTokenSearch] = useState("");
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const { error, isLoadingTokens, tokens } = useTokenInfo(chainDest);
  if (error) {
    throw error;
  }

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
        })
      );
    } else if (tokens) {
      setFilteredTokens([...tokens]);
    }
  }, [tokenSearch, tokens]);

  const onTokenClick = (token: Token) => {
    return () => {
      setToken(
        {
          ...token,
          selectedAmountFormatted: tokenOfInterest.selectedAmountFormatted,
          selectedAmountInBaseUnits: formatUnits(
            parseUnits(tokenOfInterest.selectedAmountFormatted, token.decimals),
            token.decimals
          ),
        },
        chainDest
      ).catch((e) => {
        console.error("ERROR: Something went wrong setting token", e);
      });
    };
  };

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
        Select a chain first
      </div>
    );
  } else if (!isLoadingTokens && filteredTokens.length === 0) {
    TokenList = (
      <div className="bsa-w-full bsa-text-center bsa-text-muted-foreground">
        No Tokens found
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
        width={"100%"}
      >
        {({ index, style }) => {
          const token = filteredTokens[index];
          return (
            <Button
              key={token.address}
              variant={"ghost"}
              size={"lg"}
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
              onClick={onTokenClick(token)}
            >
              <div className="bsa-flex bsa-items-center bsa-space-x-2">
                <img
                  className="bsa-h-8 bsa-w-8 bsa-rounded-md"
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
        placeholder="Search Token"
        type="text"
        value={tokenSearch}
        onChange={(e) => {
          setTokenSearch(e.target.value);
        }}
      />
      <div className=" bsa-max-h-72 bsa-w-full bsa-overflow-hidden bsa-px-1 bsa-py-1">
        {TokenList}
      </div>
    </div>
  );
}
