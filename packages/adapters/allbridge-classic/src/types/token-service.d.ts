import type { BasicChainProperties, TokenWithChainDetails } from "./token.d";

export interface TokenInfo {
  [key: string]: BasicChainProperties & { tokens: TokenWithChainDetails[] };
}

export interface ITokenService {
  readonly endpoint: string;
  getTokensInfo(): Promise<TokenInfo>;
}
