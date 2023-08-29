import type { TokenWithAmount } from "@elasticbottle/core-bridge-adapter-sdk";

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
