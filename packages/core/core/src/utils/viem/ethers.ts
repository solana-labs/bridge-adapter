import { getDefaultProvider, providers } from "ethers";
import type { WalletClient } from "viem";
import type { ChainName } from "../../types/Chain";
import { chainNameToViemChain } from "../chain-id-mapping";

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = chain
    ? {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
      }
    : undefined;
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account?.address);
  return signer;
}

const supportedAlchemyChains: ChainName[] = [
  "Ethereum",
  "Polygon",
  "Arbitrum",
  "Optimism",
];
const supportedInfuraChains: ChainName[] = [
  "BSC",
  "Avalanche",
  "Arbitrum",
  "Optimism",
  "Polygon",
  "Ethereum",
];

export function getProviderFromKeys({
  chainName,
  alchemyApiKey,
  infuraApiKey,
}: {
  alchemyApiKey?: string;
  infuraApiKey?: string;
  chainName: ChainName;
}) {
  const chain = chainNameToViemChain(chainName);

  function parseApiKey(apiKey: string | undefined) {
    let result: string | undefined;
    if (apiKey?.length === 0) result = undefined;
    else result = apiKey;
    return result;
  }

  if (
    parseApiKey(alchemyApiKey) &&
    supportedAlchemyChains.includes(chainName)
  ) {
    return new providers.AlchemyProvider(chain.id, alchemyApiKey);
  }
  if (parseApiKey(infuraApiKey) && supportedInfuraChains.includes(chainName)) {
    return new providers.InfuraProvider(chain.id, infuraApiKey);
  }
  return getDefaultProvider(chain.rpcUrls.default.http[0]);
}
