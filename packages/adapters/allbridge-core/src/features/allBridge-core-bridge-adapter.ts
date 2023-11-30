/**
 *  https://github.com/allbridge-io/allbridge-core-js-sdk
 */
import type {
  ChainDetailsMap,
  TokenWithChainDetails,
} from "@allbridge/bridge-core-sdk";
import {
  BridgeAdapterArgs,
  Bridges,
  BridgeStatus,
  ChainDestType,
  ChainName,
  ChainSourceAndTarget,
  getProviderFromKeys,
  SolanaOrEvmAccount,
  SwapInformation,
  Token as TokenType,
  Token,
  TokenWithAmount,
} from "@solana/bridge-adapter-core";
import Debug from "debug";
import {
  AllbridgeCoreSdk,
  ChainSymbol,
  Messenger,
} from "@allbridge/bridge-core-sdk";
import {
  AbstractBridgeAdapter,
  BRIDGE_ALIASES,
  CHAIN_ALIASES,
  formatTokenBalance,
  getSourceAndTargetChain,
  getWalletAddress,
} from "@solana/bridge-adapter-core";
import sendEthToSolana from "../entities/send-eth-to-solana";
import sendEthToEth from "../entities/send-eth-to-eth";
import sendSolanaToEth from "../entities/send-solana-to-eth";

const debug = Debug("debug:adapters:AllBridgeCoreBridgeAdapter");

interface ProviderWithConnection extends ReturnType<typeof getProviderFromKeys> {
  connection: {
    url: string;
  }
}

export class AllBridgeCoreBridgeAdapter extends AbstractBridgeAdapter {
  private sdk: AllbridgeCoreSdk;

  private chainMapping: ChainDetailsMap | undefined;

  protected SUPPORTED_CHAINS = new Map([
    [ChainSymbol.BSC, { symbol: ChainSymbol.BSC, name: CHAIN_ALIASES.BSC }],
    [
      ChainSymbol.ARB,
      { symbol: ChainSymbol.ARB, name: CHAIN_ALIASES.Arbitrum },
    ],
    [ChainSymbol.POL, { symbol: ChainSymbol.POL, name: CHAIN_ALIASES.Polygon }],
    [ChainSymbol.SOL, { symbol: ChainSymbol.SOL, name: CHAIN_ALIASES.Solana }],
    [
      ChainSymbol.ETH,
      { symbol: ChainSymbol.ETH, name: CHAIN_ALIASES.Ethereum },
    ],
  ]);

  constructor(args: BridgeAdapterArgs) {
    super(args);

    const rpcUrls = {
      [ChainSymbol.SOL]: this.getSolanaConnection().rpcEndpoint,
      [ChainSymbol.ETH]: this.getRpcEndpoint("Ethereum"),
      [ChainSymbol.ARB]: this.getRpcEndpoint("Arbitrum"),
      [ChainSymbol.POL]: this.getRpcEndpoint("Polygon")
    };

    this.sdk = new AllbridgeCoreSdk(rpcUrls);
  }

  name(): Bridges {
    return BRIDGE_ALIASES.AllBridgeCore;
  }

  private getRpcEndpoint(chain: ChainName): string {
    const provider = getProviderFromKeys({
      chainName: chain,
      alchemyApiKey: this.settings?.evm?.alchemyApiKey,
      infuraApiKey: this.settings?.evm?.infuraApiKey,
    }) as ProviderWithConnection;

    const { connection } = provider as ProviderWithConnection;

    return connection.url;
  }

  private findChainSymbolByName(chainName: string) {
    const supportedChain: { symbol: ChainSymbol; name: ChainName } | undefined =
      [...this.SUPPORTED_CHAINS.values()].find(({ name }) => {
        return name === chainName;
      });

    return supportedChain?.symbol;
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

  async getSupportedChains() {
    // Update chains
    if (!this.chainMapping) {
      this.chainMapping = await this.sdk.chainDetailsMap();
    }

    const supportedChains: (keyof typeof CHAIN_ALIASES)[] = [];
    for (let chain in this.chainMapping) {
      const chainData = this.chainMapping[chain];
      if (this.SUPPORTED_CHAINS.has(chainData.chainSymbol)) {
        const chainAlias = this.SUPPORTED_CHAINS.get(
          chainData.chainSymbol,
        )?.name;

        if (!chainAlias) throw new Error("Unknown chain");

        supportedChains.push(chainAlias);
      } else {
        continue;
      }
    }

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

    return tokens.map<TokenType>((token) => ({
      address: token.tokenAddress,
      bridgeNames: [this.name()],
      chain,
      decimals: token.decimals,
      logoUri: "",
      name: token.name,
      symbol: token.symbol,
    }));
  }

  async getSwapDetails(
    sourceToken: TokenWithAmount,
    targetToken: Token,
  ): Promise<SwapInformation> {
    // Update chain information
    await this.getSupportedChains();

    const sourceChain = sourceToken.chain;
    const targetChain = targetToken.chain;

    const sourceChainSymbol = this.findChainSymbolByName(sourceChain);
    const targetChainSymbol = this.findChainSymbolByName(targetChain);

    if (!sourceChainSymbol || !targetChainSymbol) {
      throw new Error("Unknown source or target chain");
    }

    const sourceChainToken =
      this.findTokenWithChainDetailsAtChainDetails(sourceToken);
    const targetChainToken =
      this.findTokenWithChainDetailsAtChainDetails(targetToken);

    if (!sourceChainToken || !targetChainToken) {
      throw new Error("Can not resolve one of the tokens");
    }

    const transferTimeMs = this.sdk.getAverageTransferTime(
      sourceChainToken,
      targetChainToken,
      Messenger.ALLBRIDGE,
    );

    const amountToReceive = await this.sdk.getAmountToBeReceived(
      sourceToken.selectedAmountFormatted,
      sourceChainToken,
      targetChainToken,
    );

    const { stablecoin } = await this.sdk.getGasFeeOptions(
      sourceChainToken,
      targetChainToken,
      Messenger.ALLBRIDGE,
    );

    if (!stablecoin) {
      throw new Error("Transfer is not supported");
    }

    const feeToken = {
      ...sourceToken,
      amount: stablecoin.float,
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
    const bridgeParams = {
      onStatusUpdate,
      sourceAddress,
      sourceAccount,
      targetAccount,
      targetAddress,
      sourceChainToken,
      targetChainToken,
      swapInformation,
    };
    if (sourceToken.chain === "Solana") {
      // Solana -> EVM
      result = await sendSolanaToEth(this.sdk, bridgeParams);
    } else if (targetToken.chain === "Solana") {
      /// EVM -> Solana
      result = await sendEthToSolana(this.sdk, bridgeParams);
    } else {
      //  EVM -> EVM
      result = await sendEthToEth(this.sdk, bridgeParams);
    }

    debug(`Transfer ${result ? "was" : "was not"} successful`);

    return false;
  }
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
