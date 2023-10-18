import Debug from "debug";
import type * as BridgeTypes from "../types/Bridges";
import type { AbstractBridgeAdapter } from "./BridgeAdapter/AbstractBridgeAdapter";
import type { BridgeAdapterSetting } from "../types/BridgeAdapterSetting";
import type { ChainDestType } from "../types/ChainDest";
import type { ChainName, ChainSourceAndTarget } from "../types/Chain";
import type { SwapInformation } from "../types/SwapInformation";
import type { Token, TokenWithAmount } from "../types/Token";
import { getBridgeAdapters } from "../utils/getBridgeAdapters";
import { getSourceAndTargetChain } from "../utils/getSourceAndTargetChain";

const warn = Debug("warn:base:BridgeAdapterSdk");

export type BridgeAdapterSdkArgs = BridgeTypes.BridgeAdapterArgs & {
  bridgeAdapterSetting?: BridgeAdapterSetting;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RouteError<T = any> = { index: number; reason: T };

export class BridgeAdapterSdk {
  sourceChain: ChainName | undefined;
  targetChain: ChainName | undefined;
  bridgeAdapterSetting: BridgeAdapterSetting | undefined;
  bridgeAdapters: AbstractBridgeAdapter[] = [];
  constructor(args?: BridgeAdapterSdkArgs) {
    if (args) {
      const { sourceChain, targetChain, bridgeAdapterSetting, settings } = args;
      this.sourceChain = sourceChain;
      this.targetChain = targetChain;
      this.bridgeAdapterSetting = bridgeAdapterSetting;
      this.bridgeAdapters = getBridgeAdapters({
        sourceChain: this.sourceChain,
        targetChain: this.targetChain,
        bridgeAdapterSetting: this.bridgeAdapterSetting,
        settings,
      });
    }
  }

  setSourceChain(sourceChain: ChainName) {
    this.sourceChain = sourceChain;
  }
  setTargetChain(targetChain: ChainName) {
    this.targetChain = targetChain;
  }

  async getSupportedChains(): Promise<ChainName[]> {
    const chainResponses = await Promise.allSettled(
      this.bridgeAdapters.map(async (bridgeAdapter) => {
        return bridgeAdapter.getSupportedChains();
      }),
    );

    const chains = chainResponses
      .map((chainResponse) => {
        if (chainResponse.status === "fulfilled") {
          return chainResponse.value;
        } else {
          console.error(
            "Failed to get tokens from bridge",
            chainResponse.reason as unknown,
          );
        }
      })
      .filter((tokenResponse) => !!tokenResponse)
      .flat() as ChainName[];

    return this.deduplicateChains(chains);
  }
  private deduplicateChains(chains: ChainName[]): ChainName[] {
    const chainSet = new Set<ChainName>();
    chains.map((chain) => {
      chainSet.add(chain);
    });
    // sort from larger alphabets (y, s, t etc.) to low (a, b, c etc.)
    return Array.from(chainSet).sort((a, b) => (a < b ? 1 : -1));
  }

  async getSupportedTokens(
    interestedTokenList: ChainDestType,
    chains?: Partial<ChainSourceAndTarget>,
    tokens?: { sourceToken: Token; targetToken: Token },
  ): Promise<Token[]> {
    const { source, target } = getSourceAndTargetChain({
      overrideSourceChain: chains?.sourceChain,
      overrideTargetChain: chains?.targetChain,
      sdkSourceChain: this.sourceChain,
      sdkTargetChain: this.targetChain,
      chainChecks: {
        needEitherChain: true,
      },
    });

    const tokenResponses = await Promise.allSettled(
      this.bridgeAdapters.map(async (bridgeAdapter) => {
        return bridgeAdapter.getSupportedTokens(
          interestedTokenList,
          {
            sourceChain: source,
            targetChain: target,
          },
          tokens,
        );
      }),
    );

    const supportedTokens = tokenResponses
      .map((tokenResponse) => {
        if (tokenResponse.status === "fulfilled") {
          return tokenResponse.value;
        } else {
          console.warn(
            "Failed to get tokens from bridge",
            tokenResponse.reason as unknown,
          );
        }
      })
      .filter((tokenResponse) => !!tokenResponse)
      .flat() as Token[];

    return this.deduplicateTokens(supportedTokens);
  }

  private deduplicateTokens(tokens: Token[]): Token[] {
    const deduplicatedTokens = tokens.reduce((prev, curr) => {
      if (prev.has(curr.address)) {
        const prevToken = prev.get(curr.address);
        if (!prevToken) throw new Error("prevToken is undefined");
        prev.set(curr.address, {
          ...prevToken,
          bridgeNames: [...prevToken.bridgeNames, ...curr.bridgeNames],
        });
      } else {
        prev.set(curr.address, curr);
      }
      return prev;
    }, new Map<string, Token>());

    return Array.from(deduplicatedTokens.values());
  }

  async getSwapInformation(
    sourceToken: TokenWithAmount,
    targetToken: Token,
    /// Allow to handle route errors
    onErrors?: (_: RouteError[] | undefined) => void,
  ) {
    const routeInfos = await Promise.allSettled(
      this.bridgeAdapters.map(async (bridgeAdapter) => {
        return bridgeAdapter.getSwapDetails(sourceToken, targetToken);
      }),
    );

    // NOTE: consider rewriting the logic as
    // multiple promises can be handled, for example,
    // using `useQueries` at the application level.
    const unfulfilledRoutes: RouteError[] = [];
    const routes = routeInfos
      .map((routeInfo, index) => {
        if (routeInfo.status === "fulfilled") {
          return routeInfo.value;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          unfulfilledRoutes.push({ index, reason: routeInfo.reason });
          warn("%o Failed to fetch route info with reason:", routeInfo.reason);
        }
      })
      .filter((routeInfo): routeInfo is SwapInformation => !!routeInfo);

    if (onErrors) {
      onErrors(unfulfilledRoutes.length > 0 ? unfulfilledRoutes : undefined);
    }

    return routes;
  }

  async bridge({
    onStatusUpdate,
    sourceAccount,
    swapInformation,
    targetAccount,
  }: {
    swapInformation: SwapInformation;
    sourceAccount: BridgeTypes.SolanaOrEvmAccount;
    targetAccount: BridgeTypes.SolanaOrEvmAccount;
    onStatusUpdate: (args: BridgeTypes.BridgeStatus) => void;
  }) {
    const bridgeAdapter = this.bridgeAdapters.find((bridgeAdapter) => {
      return bridgeAdapter.name() === swapInformation.bridgeName;
    });
    if (!bridgeAdapter) {
      throw new Error("No bridge adapter found");
    }
    return bridgeAdapter.bridge({
      onStatusUpdate,
      sourceAccount,
      targetAccount,
      swapInformation,
    });
  }
}
