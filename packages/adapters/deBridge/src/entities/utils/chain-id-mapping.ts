import type { ChainName, Token } from "@solana/bridge-adapter-core";
import { zeroAddress } from "viem";
import {
  arbitrum,
  avalanche,
  bsc,
  fantom,
  mainnet,
  optimism,
  polygon,
} from "viem/chains";

export function chainIdToChainName(chainId: number): ChainName | undefined {
  switch (chainId) {
    case mainnet.id: {
      return "Ethereum";
    }
    case fantom.id: {
      // return 'Fantom'
      break;
    }
    case arbitrum.id: {
      return "Arbitrum";
    }
    case avalanche.id: {
      return "Avalanche";
    }
    case optimism.id: {
      return "Optimism";
    }
    case bsc.id: {
      return "BSC";
    }
    case polygon.id: {
      return "Polygon";
    }
  }
}

export function chainNameToNativeCurrency(chainName: ChainName): Token {
  const ethCoin = {
    address: zeroAddress,
    bridgeNames: [],
    chain: chainName,
    decimals: 18,
    logoUri: "",
    name: "Ether",
    symbol: "ETH",
  };

  switch (chainName) {
    case "Ethereum": {
      return ethCoin;
    }
    case "Arbitrum": {
      return ethCoin;
    }
    case "Optimism": {
      return ethCoin;
    }
    case "Avalanche": {
      return {
        address: zeroAddress,
        bridgeNames: [],
        chain: chainName,
        decimals: 18,
        logoUri: "",
        name: "AVAX",
        symbol: "AVAX",
      };
    }
    case "BSC": {
      return {
        address: zeroAddress,
        bridgeNames: [],
        chain: chainName,
        decimals: 18,
        logoUri: "",
        name: "BNB",
        symbol: "BNB",
      };
    }
    case "Polygon": {
      return {
        address: zeroAddress,
        bridgeNames: [],
        chain: chainName,
        decimals: 18,
        logoUri: "",
        name: "Matic",
        symbol: "MATIC",
      };
    }
    case "Solana": {
      return {
        address: "11111111111111111111111111111111",
        bridgeNames: [],
        chain: chainName,
        decimals: 9,
        logoUri: "",
        name: "SOL",
        symbol: "SOL",
      };
    }
    default: {
      throw new Error("Invalid chain name");
    }
  }
}
