/**
 *  https://github.com/allbridge-io/allbridge-contract-docs
 */
import type {
  BridgeAdapterArgs,
  Bridges,
  BridgeStatus,
  ChainDestType,
  ChainName,
  ChainSourceAndTarget,
  SolanaOrEvmAccount,
  SwapInformation,
  Token as TokenType,
  Token,
  TokenWithAmount,
  CHAIN_ALIASES,
} from "@solana/bridge-adapter-core";
import Debug from "debug";
import type { ITokenService } from "../types/token-service.d";
import type { ChainDetailsMap, TokenWithChainDetails } from "../types/token.d";
import { AllBridgeClassicSdk } from "../entities/allBridge-classic-sdk";
import {
  AbstractBridgeAdapter,
  BRIDGE_ALIASES,
  formatTokenBalance,
  getSourceAndTargetChain,
  getWalletAddress,
} from "@solana/bridge-adapter-core";
import { ChainSymbol } from "../types/chain.d";
import { getMapValueByRecords } from "../entities/utils/get-map-value-by-records";
import sendEthToEth from "../entities/send-eth-to-eth";
import sendEthToSolana from "../entities/send-eth-to-solana";
import sendSolanaToEth from "../entities/send-solana-to-eth";

const debug = Debug("debug:adapters:AllBridgeClassicBridgeAdapter");

type SupportedChain = { name: ChainName; symbol: ChainSymbol };

export class AllBridgeClassicBridgeAdapter<
  TS extends ITokenService,
> extends AbstractBridgeAdapter {
  private sdk: AllBridgeClassicSdk<TS>;

  private chainMapping: ChainDetailsMap | undefined;

  private SUPPORTED_CHAINS = new Map<string, SupportedChain>([
    ["BSC", { name: "BSC", symbol: ChainSymbol.BSC }],
    ["ETH", { name: "Ethereum", symbol: ChainSymbol.ETH }],
    ["POL", { name: "Polygon", symbol: ChainSymbol.POL }],
    ["SOL", { name: "Solana", symbol: ChainSymbol.SOL }],
  ]);

  constructor(args: BridgeAdapterArgs, tokenService?: TS) {
    super(args);
    this.sdk = new AllBridgeClassicSdk(
      {
        solanaRpcUrl: this.getSolanaConnection().rpcEndpoint,
      },
      tokenService,
    );
  }

  name(): Bridges {
    return BRIDGE_ALIASES.AllBridgeClassic;
  }

  private findChainSymbolByName(chainName: string) {
    const supportedChain: { symbol: ChainSymbol; name: ChainName } | undefined =
      [...this.SUPPORTED_CHAINS.values()].find(({ name }) => {
        return name === chainName;
      });

    return supportedChain?.symbol;
  }

  async getSupportedChains() {
    // Update chains
    if (!this.chainMapping) {
      this.chainMapping = await this.sdk.chainDetailsMap();
    }

    const supportedChains: (keyof typeof CHAIN_ALIASES)[] = [];
    const chains: SupportedChain[] = getMapValueByRecords(
      this.chainMapping,
      this.SUPPORTED_CHAINS,
      (r) => r.chainSymbol,
    );
    chains.forEach((chain) => supportedChains.push(chain.name));

    return supportedChains;
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

    const chainSymbol = this.findChainSymbolByName(chain);

    if (!chainSymbol) return [];

    if (!this.chainMapping?.[chainSymbol]) {
      this.chainMapping = await this.sdk.chainDetailsMap();
    }

    const { tokens } = this.chainMapping[chainSymbol];

    if (!tokens) return [];

    return tokens.map<TokenType>((token) => ({
      ...populateTokenFromTokenInfo(token),
      bridgeNames: [this.name()],
      chain,
    }));
  }

  private findTokenWithChainDetailsAtChainDetails(
    token: Token | TokenWithAmount,
  ): TokenWithChainDetails | undefined {
    if (!this.chainMapping) {
      throw new Error("Absent chain mapping");
    }

    const tokenChainName = token.chain;
    const targetChainSymbol = this.findChainSymbolByName(tokenChainName);

    if (!targetChainSymbol) return undefined;

    const targetChainDetailsWithTokens = this.chainMapping[targetChainSymbol];

    const desiredToken = targetChainDetailsWithTokens.tokens.find(
      ({ symbol }) => symbol === token.symbol,
    );

    return desiredToken;
  }

  async getChainToken(
    token: Token | TokenWithAmount,
  ): Promise<TokenWithChainDetails | undefined> {
    if (!this.chainMapping) {
      throw new Error("Absent chain mapping");
    }
    const chainToken = await this.findTokenWithChainDetailsAtChainDetails(token);

    return chainToken
  }

  async getSwapDetails(
    sourceToken: TokenWithAmount,
    targetToken: Token,
  ): Promise<SwapInformation> {
    // Update chains
    if (!this.chainMapping) {
      this.chainMapping = await this.sdk.chainDetailsMap();
    }

    const sourceChain = sourceToken.chain;
    const targetChain = targetToken.chain;

    const sourceChainSymbol = this.findChainSymbolByName(sourceChain);
    const targetChainSymbol = this.findChainSymbolByName(targetChain);

    if (!sourceChainSymbol || !targetChainSymbol) {
      throw new Error("Unknown source or target chain");
    }

    // consider filter source token and target token by the different fields
    const sourceChainToken =
      this.findTokenWithChainDetailsAtChainDetails(sourceToken);
    const targetChainToken =
      this.findTokenWithChainDetailsAtChainDetails(targetToken);

    if (!sourceChainToken || !targetChainToken) {
      throw new Error("Can not resolve one of the tokens");
    }

    const transferTimeMs = 0;

    const { stablecoin } = await this.sdk.getGasFeeOptions(
      sourceToken.selectedAmountInBaseUnits,
      targetChainToken,
    );

    if (!stablecoin) throw new Error("Transfer is not supported");

    const amountToReceive = String(
      Number(sourceToken.selectedAmountInBaseUnits) - Number(stablecoin.int),
    );

    const feeToken = {
      ...sourceToken,
      amount: stablecoin.int,
      details: "",
    };

    const amountFormatted = formatTokenBalance(
      formatStringUnits(amountToReceive, targetToken.decimals),
    );

    return {
      bridgeName: this.name(),
      sourceToken,
      targetToken: {
        ...targetToken,
        expectedOutputFormatted: amountFormatted,
        expectedOutputInBaseUnits: amountToReceive,
        minOutputFormatted: amountFormatted,
        minOutputInBaseUnits: amountToReceive,
      },
      tradeDetails: {
        estimatedTimeMinutes: transferTimeMs
          ? Math.round(transferTimeMs / 60_000_000)
          : 0,
        fee: [feeToken],
        priceImpact: 0,
        routeInformation: [
          {
            fromTokenSymbol: sourceChainToken.symbol,
            toTokenSymbol: targetChainToken.symbol,
          },
        ],
      },
    };
  }

  async bridge({
    onStatusUpdate,
    sourceAccount,
    swapInformation,
    targetAccount,
  }: {
    onStatusUpdate: (args: BridgeStatus) => void;
    sourceAccount: SolanaOrEvmAccount;
    swapInformation: SwapInformation;
    targetAccount: SolanaOrEvmAccount;
  }): Promise<boolean> {
    const { sourceToken, targetToken } = swapInformation;

    debug("Transfer", sourceToken, "for", targetToken);

    onStatusUpdate({
      information: `Approving ${sourceToken.selectedAmountFormatted} ${sourceToken.symbol}`,
      name: "Approval",
      status: "IN_PROGRESS",
    });

    const sourceChainToken =
      this.findTokenWithChainDetailsAtChainDetails(sourceToken);
    const targetChainToken =
      this.findTokenWithChainDetailsAtChainDetails(targetToken);

    if (!sourceChainToken || !targetChainToken) {
      throw new Error("Can not resolve one of the tokens");
    }

    const sourceAddress = getWalletAddress(sourceAccount);
    const targetAddress = getWalletAddress(targetAccount);

    let result;
    if (sourceToken.chain === "Solana") {
      // Solana -> EVM
      result = await sendSolanaToEth(this.sdk, {
        sourceAccount,
        targetAccount,
      });
    } else if (targetToken.chain === "Solana") {
      /// EVM -> Solana
      result = await sendEthToSolana(
        this.sdk,
        { onStatusUpdate, sourceChainToken, targetChainToken,sourceAccount, swapInformation, targetAccount },
      );
    } else {
      //  EVM -> EVM
      result = await sendEthToEth(this.sdk, { sourceAccount, targetAccount });
    }

    return false;
  }
}

function populateTokenFromTokenInfo(tokenInfo: TokenWithChainDetails) {
  return {
    address: tokenInfo.address,
    decimals: tokenInfo.precision,
    logoUri: tokenInfo.logo,
    name: tokenInfo.symbol,
    symbol: tokenInfo.symbol,
  };
}

function formatStringUnits(display: string, decimals: number) {
  const negative = display.startsWith("-");
  if (negative) display = display.slice(1);

  display = display.padStart(decimals, "0");

  let [integer, fraction] = [
    display.slice(0, display.length - decimals),
    display.slice(display.length - decimals),
  ];
  fraction = fraction.replace(/(0+)$/, "");
  if (integer.endsWith(".")) integer = integer.replace(/(\.+)$/, "");
  return `${negative ? "-" : ""}${integer || "0"}${
    fraction ? `.${fraction}` : ""
  }`;
}
