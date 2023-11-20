import type { TokenWithChainDetails } from "../types/token";

export const token = ({
  address,
  minFee,
  tokenSource,
  tokenSourceAddress,
  isBase,
  isWrapped,
  precision,
  symbol,
  logo,
}: Partial<TokenWithChainDetails>): TokenWithChainDetails => ({
  address: address || "",
  minFee: minFee || "0",
  tokenSource: tokenSource || "",
  tokenSourceAddress: tokenSourceAddress || "",
  isBase: isBase || false,
  isWrapped: isWrapped || false,
  precision: precision || 6,
  symbol: symbol || "",
  swapInfo: null,
  logo: logo || "",
});
