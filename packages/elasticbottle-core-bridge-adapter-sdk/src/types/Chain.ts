import type { CHAIN_NAMES } from "../constants/ChainNames";

export type ChainName = (typeof CHAIN_NAMES)[number];

export type ChainSourceAndTarget = {
  sourceChain: ChainName;
  targetChain: ChainName;
};
