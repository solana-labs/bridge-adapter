import type { ChainType } from "./chain.d";

export interface TokenWithChainDetails {
  address: string;
  minFee: string;
  tokenSource: string;
  tokenSourceAddress: string;
  isBase: boolean;
  isWrapped: boolean;
  precision: number;
  symbol: string;
  swapInfo: null | NonNullable<unknown>;
  logo: string;
}

export interface BasicChainProperties {
  confirmations: number;
}

export interface ChainDetails extends BasicChainProperties {
  chainId: string;
  chainSymbol: string;
  chainType: ChainType;
}

export interface ChainDetailsWithTokens extends ChainDetails {
  tokens: TokenWithChainDetails[];
}

export type ChainDetailsMap = Record<string, ChainDetailsWithTokens>;
