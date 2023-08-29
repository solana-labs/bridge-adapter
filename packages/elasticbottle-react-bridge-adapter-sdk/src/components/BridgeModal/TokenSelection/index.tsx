// import { useQuery } from "@tanstack/react-query";
import { type Token } from "@elasticbottle/core-bridge-adapter-sdk";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { hasChainDest } from "../../../lib/utils";
import {
  setToken,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import { AddressLine } from "../../ui/AddressLine";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Skeleton } from "../../ui/skeleton";

export function TokenSelection() {
  const params = useBridgeModalStore.use.currentBridgeStepParams();
  if (!hasChainDest(params)) {
    throw new Error("Missing chainDest in params");
  }
  const { chainDest } = params;

  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const sdk = useBridgeModalStore.use.sdk();

  const [tokenSearch, setTokenSearch] = useState("");
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const {
    data: tokens,
    isInitialLoading,
    error,
  } = useQuery({
    queryFn: async () => {
      if (
        sourceChain === "Select a chain" &&
        targetChain === "Select a chain"
      ) {
        throw new Error("Either Source or Target chain must be selected");
      }
      return await sdk.getSupportedTokens(chainDest, {
        sourceChain: sourceChain === "Select a chain" ? undefined : sourceChain,
        targetChain: targetChain === "Select a chain" ? undefined : targetChain,
      });
    },
    queryKey: ["getTokens", sourceChain, targetChain, chainDest],
  });
  if (error) {
    console.error(error);
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
          selectedAmountFormatted: "",
          selectedAmountInBaseUnits: "0",
        },
        chainDest
      ).catch((e) => {
        console.error("ERROR: Something went wrong setting token", e);
      });
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
                  className="bsa-h-8 bsa-w-8 bsa-rounded-md"
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
          setTokenSearch(e.target.value);
        }}
      />
      <div className="bsa-flex bsa-max-h-96 bsa-flex-col bsa-space-y-5 bsa-overflow-auto bsa-px-1 bsa-py-1">
        {TokenList}
      </div>
    </div>
  );
}
