import type { ChainName } from "@solana/bridge-adapter-core";

export const token = ({
  address = "",
  chain,
  decimals = 18,
  name = "",
  symbol = "",
}: {
  address?: string;
  chain: ChainName;
  decimals?: number;
  name?: string;
  symbol?: string;
}) => ({
  address,
  bridgeNames: [],
  chain,
  decimals,
  logoUri: "",
  name,
  symbol,
});

export const tokenWithAmount = ({
  address,
  chain,
  decimals,
  name,
  selectedAmountFormatted = "",
  selectedAmountInBaseUnits = "",
  symbol,
}: {
  address?: string;
  chain: ChainName;
  decimals?: number;
  name?: string;
  selectedAmountFormatted?: string;
  selectedAmountInBaseUnits?: string;
  symbol?: string;
}) => ({
  ...token({ address, symbol, chain, name, decimals }),
  selectedAmountFormatted,
  selectedAmountInBaseUnits,
});

export const solanaToken = (
  p: {
    address?: string;
    decimals?: number;
    symbol?: string;
    name?: string;
  } = {},
) =>
  token({
    address: p.address,
    chain: "Solana",
    decimals: p.decimals,
    name: p.name,
    symbol: p.symbol,
  });

export const ethereumToken = (
  p: {
    address?: string;
    decimals?: number;
    symbol?: string;
    name?: string;
  } = {},
) =>
  token({
    address: p.address,
    chain: "Ethereum",
    decimals: p.decimals,
    name: p.name,
    symbol: p.symbol,
  });

export const solanaTokenWithAmount = (
  p: {
    address?: string;
    decimals?: number;
    name?: string;
    selectedAmountFormatted?: string;
    selectedAmountInBaseUnits?: string;
    symbol?: string;
  } = {},
) =>
  tokenWithAmount({
    address: p.address,
    chain: "Solana",
    decimals: p.decimals,
    name: p.name,
    selectedAmountFormatted: p.selectedAmountFormatted,
    selectedAmountInBaseUnits: p.selectedAmountInBaseUnits,
    symbol: p.symbol,
  });

export const ethereumTokenWithAmount = (
  p: {
    address?: string;
    decimals?: number;
    name?: string;
    selectedAmountFormatted?: string;
    selectedAmountInBaseUnits?: string;
    symbol?: string;
  } = {},
) =>
  tokenWithAmount({
    address: p.address,
    chain: "Ethereum",
    decimals: p.decimals,
    name: p.name,
    selectedAmountFormatted: p.selectedAmountFormatted,
    selectedAmountInBaseUnits: p.selectedAmountInBaseUnits,
    symbol: p.symbol,
  });
