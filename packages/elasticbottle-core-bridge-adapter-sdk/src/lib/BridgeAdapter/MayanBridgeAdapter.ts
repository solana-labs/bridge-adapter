import { approveEth, getAllowanceEth } from "@certusone/wormhole-sdk";
import type {
  ChainName as MayanChainName,
  Quote,
  SolanaTransactionSigner,
} from "@mayanfinance/swap-sdk";
import {
  fetchQuote,
  fetchTokenList,
  swapFromEvm,
  swapFromSolana,
} from "@mayanfinance/swap-sdk";
import { Connection } from "@solana/web3.js";
import { object, parse, string } from "valibot";
import { parseUnits } from "viem";
import type {
  BridgeAdapterArgs,
  BridgeStatus,
  Bridges,
  SolanaOrEvmAccount,
} from "../../types/Bridges";
import type { ChainName, ChainSourceAndTarget } from "../../types/Chain";
import type { ChainDestType } from "../../types/ChainDest";
import type { SwapInformation } from "../../types/SwapInformation";
import type { Token, TokenWithAmount } from "../../types/Token";
import { isEvmAccount, isSolanaAccount } from "../../utils/bridge";
import { formatTokenBalance } from "../../utils/formatTokenBalance";
import { getSourceAndTargetChain } from "../../utils/getSourceAndTargetChain";
import { getWalletAddress } from "../../utils/getWalletAddress";
import {
  getProviderFromKeys,
  walletClientToSigner,
} from "../../utils/viem/ethers";
import { AbstractBridgeAdapter } from "./AbstractBridgeAdapter";

export class MayanBridgeAdapter extends AbstractBridgeAdapter {
  private tokenList: Record<string, Token[]> = {};
  private mayanQuote: Quote | undefined;
  private mayanSolanaFee = "3uAfBoHB1cTyB7H8G2KTpSgZS1T1ME4bHb8uqzqhWsfe";
  private mayanSwapContractAddress =
    "0x80F53dcf568bE566F99Ab9F37eaa2B3AA10B3C95";

  constructor(args: BridgeAdapterArgs) {
    super(args);
  }

  name(): Bridges {
    return "mayan";
  }
  async getSupportedChains(): Promise<ChainName[]> {
    return Promise.resolve([
      "Solana",
      "BSC",
      "Arbitrum",
      "Ethereum",
      "Polygon",
      "Avalanche",
    ]);
  }

  async getSupportedTokens(
    interestedTokenList: ChainDestType,
    chains?: Partial<ChainSourceAndTarget> | undefined
  ): Promise<Token[]> {
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
    const supportedChainList = await this.getSupportedChains();
    if (!supportedChainList.includes(chain)) {
      throw new Error(`Chain ${chain} is not supported by ${this.name()}`);
    }
    if (!this.tokenList[chain]) {
      console.log("fetching Mayan Solana token list");
      const tokenList = await fetchTokenList(
        chain.toLowerCase() as MayanChainName
      );
      this.tokenList[chain] = tokenList.map((token) => {
        return {
          bridgeNames: ["mayan"],
          chain,
          logoUri: token.logoURI,
          address: chain === "Solana" ? token.mint : token.contract,
          decimals: token.decimals,
          name: token.name,
          symbol: token.symbol,
        };
      });
    }
    return this.tokenList[chain];
  }

  async getSwapDetails(
    sourceToken: TokenWithAmount,
    targetToken: Token
  ): Promise<SwapInformation> {
    const supportedChainList = await this.getSupportedChains();
    if (
      !supportedChainList.includes(sourceToken.chain) ||
      !supportedChainList.includes(targetToken.chain)
    ) {
      throw new Error(
        `The source token's chain ${
          sourceToken.chain
        } or the target token's chain ${
          targetToken.chain
        } is not supported by ${this.name()}`
      );
    }

    const quote = await fetchQuote({
      amount: parseFloat(sourceToken.selectedAmountFormatted),
      fromToken: sourceToken.address,
      toToken: targetToken.address,
      fromChain: sourceToken.chain.toLowerCase() as MayanChainName,
      toChain: targetToken.chain.toLowerCase() as MayanChainName,
      slippage: 3,
      gasDrop: 0.01, // optional
      referrer: this.mayanSolanaFee,
    });
    console.log("quote", quote);
    this.mayanQuote = quote;
    return {
      sourceToken: sourceToken,
      targetToken: {
        ...targetToken,
        expectedOutputFormatted: formatTokenBalance(
          quote.expectedAmountOut.toString()
        ),
        expectedOutputInBaseUnits: parseUnits(
          quote.expectedAmountOut.toString(),
          targetToken.decimals
        ).toString(),
        minOutputFormatted: formatTokenBalance(quote.minAmountOut.toString()),
        minOutputInBaseUnits: parseUnits(
          quote.minAmountOut.toString(),
          targetToken.decimals
        ).toString(),
      },
      bridgeName: this.name(),
      tradeDetails: {
        priceImpact: quote.priceImpact,
        estimatedTimeMinutes: quote.eta,
        fee: [
          {
            ...sourceToken,
            selectedAmountFormatted: formatTokenBalance(
              quote.swapRelayerFee.toString()
            ),
            selectedAmountInBaseUnits: parseUnits(
              quote.swapRelayerFee.toString(),
              sourceToken.decimals
            ).toString(),
            details: "Relayer Fee",
          },
        ],
        routeInformation: quote.route.map((info) => {
          return {
            fromTokenSymbol: info.fromSymbol,
            toTokenSymbol: info.toSymbol,
          };
        }),
      },
    };
  }

  async bridge({
    onStatusUpdate,
    sourceAccount,
    targetAccount,
    swapInformation,
  }: {
    swapInformation: SwapInformation;
    sourceAccount: SolanaOrEvmAccount;
    targetAccount: SolanaOrEvmAccount;
    onStatusUpdate: (args: BridgeStatus) => void;
  }): Promise<boolean> {
    if (!this.mayanQuote) {
      throw new Error("No quote found");
    }
    const { sourceToken } = swapInformation;

    const timoutInSeconds = 4_200; // 70 minutes, mayan's default value
    let transactionHash = "";

    if (sourceToken.chain !== "Solana") {
      if (!isEvmAccount(sourceAccount)) {
        throw new Error("Source account is not an EVM account");
      }
      const sourceSigner = walletClientToSigner(sourceAccount);

      const allowance = await getAllowanceEth(
        this.mayanSwapContractAddress,
        swapInformation.sourceToken.address,
        sourceSigner
      );
      if (allowance.lt(swapInformation.sourceToken.selectedAmountInBaseUnits)) {
        onStatusUpdate({
          information: `Approving ${swapInformation.sourceToken.selectedAmountFormatted} ${swapInformation.sourceToken.symbol}`,
          name: "Approval",
          status: "IN_PROGRESS",
        });
        await approveEth(
          this.mayanSwapContractAddress,
          swapInformation.sourceToken.address,
          sourceSigner,
          swapInformation.sourceToken.selectedAmountInBaseUnits
        );
        onStatusUpdate({
          information: `Approving ${swapInformation.sourceToken.selectedAmountFormatted} ${swapInformation.sourceToken.symbol}`,
          name: "Approval",
          status: "COMPLETED",
        });
      }

      onStatusUpdate({
        information: `Pending confirmation to lock  ${swapInformation.sourceToken.selectedAmountFormatted} ${swapInformation.sourceToken.symbol}`,
        name: "Lock",
        status: "IN_PROGRESS",
      });
      const swapTrx = await swapFromEvm(
        this.mayanQuote,
        getWalletAddress(targetAccount),
        timoutInSeconds,
        this.mayanSolanaFee,
        getProviderFromKeys({
          chainName: sourceToken.chain,
          alchemyApiKey: this.settings?.evm?.alchemyApiKey,
          infuraApiKey: this.settings?.evm?.infuraApiKey,
        }),
        walletClientToSigner(sourceAccount)
      );
      onStatusUpdate({
        information: `Locking  ${swapInformation.sourceToken.selectedAmountFormatted} ${swapInformation.sourceToken.symbol}`,
        name: "Lock",
        status: "IN_PROGRESS",
      });
      const receipt = await swapTrx.wait();
      onStatusUpdate({
        information: `Locking  ${swapInformation.sourceToken.selectedAmountFormatted} ${swapInformation.sourceToken.symbol}`,
        name: "Lock",
        status: "IN_PROGRESS",
      });
      transactionHash = receipt.transactionHash;
    } else {
      if (!isSolanaAccount(sourceAccount)) {
        throw new Error("Source account is not a Solana account");
      }
      onStatusUpdate({
        information: `Locking  ${swapInformation.sourceToken.selectedAmountFormatted} ${swapInformation.sourceToken.symbol}`,
        name: "Lock",
        status: "IN_PROGRESS",
      });
      transactionHash = await swapFromSolana(
        this.mayanQuote,
        getWalletAddress(sourceAccount),
        getWalletAddress(targetAccount),
        timoutInSeconds,
        this.mayanSolanaFee,
        sourceAccount.signTransaction as SolanaTransactionSigner,
        this.settings?.solana?.solanaRpcUrl
          ? new Connection(this.settings?.solana?.solanaRpcUrl)
          : undefined
      );
      onStatusUpdate({
        information: `Locking  ${swapInformation.sourceToken.selectedAmountFormatted} ${swapInformation.sourceToken.symbol}`,
        name: "Lock",
        status: "COMPLETED",
      });
    }

    const interval = setInterval(() => {
      this.getMayanTransactionStatus(transactionHash)
        .then((status) => {
          let information = status;
          if (status.includes("INITIATED")) {
            information =
              "Waiting for locked token transaction to be finalized";
          } else if (status.includes("CLAIMED")) {
            information = "Unlocking tokens";
          } else if (status.includes("SETTLED")) {
            information = "Swap Successfully completed.";
            onStatusUpdate({
              information: information,
              name: "Completed",
              status: "IN_PROGRESS",
            });
            clearInterval(interval);
            return;
          }

          onStatusUpdate({
            information: information,
            name: "PendingConfirmation",
            status: "IN_PROGRESS",
          });
          return false;
        })
        .catch((e) => {
          console.error("Error fetching mayan transaction status", e);
        });
    }, 5_000);
    return true;
  }

  private async getMayanTransactionStatus(transactionHash: string) {
    const statusUrl = `https://explorer-api.mayan.finance/v3/swap/trx/${transactionHash}`;
    const response = await fetch(statusUrl);
    if (!response.ok) {
      throw new Error("Error fetching mayan transaction status");
    }
    const rawData = await response.json();
    const parsedData = parse(
      object({
        status: string(),
      }),
      rawData
    );
    return parsedData.status;
  }
}
