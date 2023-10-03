import type { TokenWithAmount } from "@solana/bridge-adapter-base";

export const DEFAULT_TOKEN_WITH_AMOUNT: TokenWithAmount = {
  address: "",
  selectedAmountFormatted: "",
  selectedAmountInBaseUnits: "",
  chain: "Ethereum",
  decimals: 18,
  logoUri: "",
  name: "",
  symbol: "",
  bridgeNames: [],
};
