import Debug from "debug";
import type { BridgeToken } from "../../types/Token";
import { csv2json, parseValue } from "csv42";

const debug = Debug("debug:react:get-wormhole-token-list");

enum WormholeChainAliases {
  Arbitrum = "arbitrum",
  Avalanche = "avax",
  BSC = "bsc",
  Ethereum = "eth",
  Optimism = "optimism",
  Polygon = "matic",
  Solana = "sol",
}

function getChainNameByAlias(value: unknown) {
  let result = undefined;

  if (value === WormholeChainAliases.Solana) {
    result = "Solana";
  } else if (value === WormholeChainAliases.Ethereum) {
    result = "Ethereum";
  } else if (value === WormholeChainAliases.Polygon) {
    result = "Polygon";
  } else if (value === WormholeChainAliases.Avalanche) {
    result = "Avalanche";
  } else if (value === WormholeChainAliases.Arbitrum) {
    result = "Arbitrum";
  } else if (value === WormholeChainAliases.BSC) {
    result = "BSC";
  } else if (value === WormholeChainAliases.Optimism) {
    result = "Optimism";
  }

  return result;
}

export const getTokenList = async () => {
  const tokenList = await fetch(
    "https://raw.githubusercontent.com/certusone/wormhole-token-list/main/content/by_dest.csv",
  );
  if (!tokenList.ok) {
    throw new Error("Failed to fetch token list");
  }
  const csv = await tokenList.text();
  const token: BridgeToken[] = csv2json(csv, {
    fields: [
      {
        name: "address",
        setValue(item, value) {
          item.targetAddress = value;
        },
      },
      {
        name: "sourceAddress",
        setValue(item, value) {
          item.sourceAddress = value;
        },
      },
      {
        name: "name",
        setValue(item, value) {
          item.name = value;
        },
      },
      {
        name: "symbol",
        setValue(item, value) {
          item.symbol = value;
        },
      },
      {
        name: "logo",
        setValue(item, value) {
          item.logoUri = value;
        },
      },
      {
        name: "decimals",
        setValue(item, value) {
          if (typeof value === "string") {
            item.targetDecimals = parseInt(value);
          } else if (typeof value === "number") {
            item.targetDecimals = value;
          } else {
            item.targetDecimals = 0;
          }
        },
      },
      {
        name: "sourceDecimals",
        setValue(item, value) {
          if (typeof value === "string") {
            item.sourceDecimals = parseInt(value);
          } else if (typeof value === "number") {
            item.sourceDecimals = value;
          } else {
            item.sourceDecimals = 0;
          }
        },
      },
      {
        name: "origin",
        setValue(item, value) {
          const name = getChainNameByAlias(value);
          if (name) {
            item.sourceChain = name;
          } else {
            debug("Unrecognized origin:", value);
            item.sourceChain = value;
          }
        },
      },
      {
        name: "dest",
        setValue(item, value) {
          const name = getChainNameByAlias(value);
          if (name) {
            item.targetChain = name;
          } else {
            debug("Unrecognized dest:", value);
            item.targetChain = value;
          }
        },
      },
    ],
    parseValue: (value) => {
      if (value.startsWith("0x")) {
        return value;
      }
      return parseValue(value);
    },
  });

  return token;
};
