import { ChainSymbol, ChainType } from "../types/chain.d";
import type {
  ChainDetailsMap,
  ChainDetailsWithTokens,
  TokenWithChainDetails,
} from "../types/token.d";
import { clusterApiUrl } from "@solana/web3.js";
import type { ITokenService } from "../types/token-service.d";
import { TokenService } from "./token-service";

export interface IAllBridgeClassicSDK {
  chainDetailsMap(): Promise<ChainDetailsMap>;
  getGasFeeOptions(
    amount: string,
    source: TokenWithChainDetails,
  ): Promise<{
    stablecoin?: {
      int: string;
    };
  }>;
}

export class AllBridgeClassicSdk<T extends ITokenService>
  implements IAllBridgeClassicSDK
{
  private tokenService: TokenService;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rpcUrls: {
      solanaRpcUrl: string;
    } = { solanaRpcUrl: clusterApiUrl() },
    tokenService?: T,
  ) {
    this.tokenService = tokenService || new TokenService();
  }

  public async chainDetailsMap() {
    const tokensInfo = await this.tokenService.getTokensInfo();

    const result: ChainDetailsMap = {};
    for (const chainSymbol in tokensInfo) {
      const tokenInfo = tokensInfo[chainSymbol];

      let chainType;
      if (chainSymbol === "SOL") chainType = ChainType.SOLANA;
      else if (chainSymbol === "XRPL") chainType = ChainType.XRPL;
      else chainType = ChainType.EVM;

      const value: ChainDetailsWithTokens = {
        confirmations: tokenInfo.confirmations,
        chainSymbol,
        chainId: chainSymbol,
        chainType,
        tokens: tokenInfo.tokens,
      };
      result[chainSymbol] = value;
    }
    return result;
  }

  private isTransferSupported(chainSymbol: string) {
    const chainSymbols = [
      "AVA",
      "BSC",
      "CELO",
      "ETH",
      "FTM",
      "HECO",
      "POL",
      "SOL",
      "TEZ",
      "TRA",
      "XRPL",
    ];

    return chainSymbols.includes(chainSymbol);
  }

  protected getFixedFeeByChainSymbol(chainSymbol: string) {
    let data = { fee: 0.003, isStakingAvailable: true };
    const symbol: unknown = chainSymbol;

    /// https://docs.allbridge.io/allbridge-overview/bridge-fee#how-large-is-the-bridge-fee-on-every-blockchain
    switch (symbol as ChainSymbol) {
      case ChainSymbol.ETH: {
        data = { fee: 0.003, isStakingAvailable: false };
        break;
      }
      case ChainSymbol.XRPL: {
        data = { fee: 0.001, isStakingAvailable: false };
        break;
      }
    }

    return data;
  }

  /**
   *  Calculate fee according to a source chain
   *
   *  https://github.com/allbridge-io/allbridge-contract-docs#fee-calculation
   *
   *  TODO
   *  - [ ] Request staked ABR amount of token to calculate the dynamic percentage fee properly.
   *  - [ ] Adjust the static fee worth ~$0.5 to an amount of source token
   */
  public async getGasFeeOptions(
    amount: string,
    sourceToken: TokenWithChainDetails,
  ) {
    const { minFee, tokenSource } = sourceToken;
    switch (tokenSource) {
      case ChainSymbol.ETH: {
        return {
          stablecoin: {
            int: minFee,
          },
        };
      }
      case ChainSymbol.XRPL: {
        const { fee } = this.getFixedFeeByChainSymbol(sourceToken.tokenSource);
        const calculatedFee = Number(amount) * fee;
        const result =
          calculatedFee < Number(minFee) ? Number(minFee) : calculatedFee;

        return {
          stablecoin: {
            int: String(result),
          },
        };
      }
      default: {
        /// Return no fee info for the unsupported chains to mimic the AllBridgeCore fee behaviour
        if (!this.isTransferSupported(sourceToken.tokenSource)) {
          return {};
        }

        const { fee } = this.getFixedFeeByChainSymbol(sourceToken.tokenSource);
        const calculatedFee = Number(amount) * fee;

        return {
          stablecoin: {
            int: String(calculatedFee),
          },
        };
      }
    }
  }
}
