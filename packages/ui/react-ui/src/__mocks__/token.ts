import type { ChainName } from "@solana/bridge-adapter-core";

export const token = ({
  address = "",
  symbol = "",
  chain,
}: {
  address?: string;
  chain: ChainName;
  symbol?: string;
}) => ({
  address,
  bridgeNames: [],
  chain,
  decimals: 18,
  logoUri: "",
  name: "",
  symbol,
});

export const tokenWithAmount = ({
  address = "",
  symbol = "",
  chain,
}: {
  address?: string;
  chain: ChainName;
  symbol?: string;
}) => ({
  ...token({ address, symbol, chain }),
  selectedAmountFormatted: "",
  selectedAmountInBaseUnits: "",
});

export const solanaToken = (p: { address?: string; symbol?: string } = {}) =>
  token({ address: p.address, symbol: p.symbol, chain: "Solana" });

export const ethereumToken = (p: { address?: string; symbol?: string } = {}) =>
  token({ address: p.address, symbol: p.symbol, chain: "Ethereum" });

export const solanaTokenWithAmount = (
  p: { address?: string; symbol?: string } = {},
) => tokenWithAmount({ address: p.address, symbol: p.symbol, chain: "Solana" });

export const ethereumTokenWithAmount = (
  p: { address?: string; symbol?: string } = {},
) =>
  tokenWithAmount({ address: p.address, symbol: p.symbol, chain: "Ethereum" });
