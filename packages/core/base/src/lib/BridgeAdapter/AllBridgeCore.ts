import type { ChainDetailsMap } from "@allbridge/bridge-core-sdk";
import { AllbridgeCoreSdk, ChainSymbol } from "@allbridge/bridge-core-sdk";
import type {
  BridgeAdapterArgs,
  BridgeStatus,
  Bridges,
  SolanaOrEvmAccount,
} from "../../types/Bridges";
import type { ChainName, ChainSourceAndTarget } from "../../types/Chain";
import type { ChainDestType } from "../../types/ChainDest";
import type { SwapInformation } from "../../types/SwapInformation";
import type {
  Token,
  Token as TokenType,
  TokenWithAmount,
} from "../../types/Token";
import { getSourceAndTargetChain } from "../../utils/getSourceAndTargetChain";
import { AbstractBridgeAdapter } from "./AbstractBridgeAdapter";

export class AllBridgeCoreBridgeAdapter extends AbstractBridgeAdapter {
  private sdk: AllbridgeCoreSdk;
  private chainMapping: ChainDetailsMap | undefined;

  constructor(args: BridgeAdapterArgs) {
    super(args);
    this.sdk = new AllbridgeCoreSdk({
      solanaRpcUrl: this.getSolanaConnection().rpcEndpoint,
      tronRpcUrl: "NOT SUPPORTED",
    });
  }
  name(): Bridges {
    return "allBridgeCore";
  }
  private mapAllBridgeChainNameToChainName(
    allBridgeChainName: string,
  ): ChainName | undefined {
    switch (allBridgeChainName) {
      case ChainSymbol.BSC: {
        return "BSC";
      }
      case ChainSymbol.ARB: {
        return "Arbitrum";
      }
      case ChainSymbol.POL: {
        return "Polygon";
      }
      case ChainSymbol.SOL: {
        return "Solana";
      }
      case ChainSymbol.ETH: {
        return "Ethereum";
      }

      default: {
        return;
      }
    }
  }
  private mapChainNameToAllBridgeChainName(
    chainName: ChainName,
  ): ChainSymbol | undefined {
    switch (chainName) {
      case "BSC": {
        return ChainSymbol.BSC;
      }
      case "Arbitrum": {
        return ChainSymbol.ARB;
      }
      case "Polygon": {
        return ChainSymbol.POL;
      }
      case "Solana": {
        return ChainSymbol.SOL;
      }
      case "Ethereum": {
        return ChainSymbol.ETH;
      }

      default: {
        return;
      }
    }
  }
  async getSupportedChains(): Promise<ChainName[]> {
    if (!this.chainMapping) {
      this.chainMapping = await this.sdk.chainDetailsMap();
    }
    const chains: ChainName[] = [];
    for (const chain in this.chainMapping) {
      const chainName = this.mapAllBridgeChainNameToChainName(chain);
      if (!chainName) {
        continue;
      }
      chains.push(chainName);
    }
    return chains;
  }
  async getSupportedTokens(
    interestedTokenList: ChainDestType,
    chains?: Partial<ChainSourceAndTarget> | undefined,
  ): Promise<TokenType[]> {
    const { source, target } = getSourceAndTargetChain({
      overrideSourceChain: chains?.sourceChain,
      overrideTargetChain: chains?.targetChain,
      sdkSourceChain: super.sourceChain,
      sdkTargetChain: super.targetChain,
      chainChecks: {
        needEitherChain: true,
      },
    });
    const chain = interestedTokenList === "source" ? source : target;
    if (!chain) {
      throw new Error(`Missing chain for ${interestedTokenList}`);
    }

    const allBridgeChainName = this.mapChainNameToAllBridgeChainName(chain);
    if (!allBridgeChainName) {
      return [];
    }

    if (!this.chainMapping && !this.chainMapping?.[allBridgeChainName]) {
      this.chainMapping = await this.sdk.chainDetailsMap();
    }
    const { tokens } = this.chainMapping[allBridgeChainName];

    return tokens.map((token) => {
      return {
        address: token.tokenAddress,
        bridgeNames: [this.name()],
        chain: chain,
        decimals: token.decimals,
        logoUri: "",
        name: token.name,
        symbol: token.symbol,
      };
    });
  }

  getSwapDetails(
    // eslint-disable-next-line
    sourceToken: TokenWithAmount,
    // eslint-disable-next-line
    targetToken: Token,
  ): Promise<SwapInformation> {
    throw new Error("Method not implemented.");
  }

  /* async */ bridge({
    // eslint-disable-next-line
    onStatusUpdate,
    // eslint-disable-next-line
    sourceAccount,
    // eslint-disable-next-line
    targetAccount,
    // eslint-disable-next-line
    swapInformation,
  }: {
    swapInformation: SwapInformation;
    sourceAccount: SolanaOrEvmAccount;
    targetAccount: SolanaOrEvmAccount;
    onStatusUpdate: (args: BridgeStatus) => void;
  }): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
