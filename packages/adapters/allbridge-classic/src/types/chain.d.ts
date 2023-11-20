/// TODO
// - [ ] Add support for other chains
// See the token info response for more information
export enum ChainSymbol {
  AVA = "AVA",
  BSC = "BSC",
  CELO = "CELO",
  ETH = "ETH",
  FTM = "FTM",
  HECO = "HECO",
  POL = "POL",
  SOL = "SOL",
  TEZ = "TEZ",
  TRA = "TRA",
  XRPL = "XRPL",
}

export enum ChainType {
  "EVM" = "EVM",
  "SOLANA" = "SOLANA",
  "XRPL" = "XRPL",
}

export interface BasicChainProperties {
  confirmations: number;
}

export interface ChainDetails extends BasicChainProperties {}
