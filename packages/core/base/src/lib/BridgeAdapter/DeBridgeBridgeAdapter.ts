import { approveEth, getAllowanceEth } from "@certusone/wormhole-sdk";
import { VersionedTransaction } from "@solana/web3.js";
import {
  ValiError,
  array,
  boolean,
  flatten,
  merge,
  number,
  object,
  omit,
  optional,
  parse,
  record,
  string,
  union,
  useDefault,
} from "valibot";
import type { Output } from "valibot";
import type { Hash } from "viem";
import { formatUnits } from "viem";
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
import {
  chainIdToChainName,
  chainNameToChainId,
  chainNameToNativeCurrency,
  chainNameToViemChain,
} from "../../utils/chainIdMapping";
import { dedupFeesTokens } from "../../utils/dedupFeeTokens";
import { formatTokenBalance } from "../../utils/formatTokenBalance";
import { getSourceAndTargetChain } from "../../utils/getSourceAndTargetChain";
import { getWalletAddress } from "../../utils/getWalletAddress";
import { submitSolanaTransaction } from "../../utils/solana";
import { walletClientToSigner } from "../../utils/viem/ethers";
import { AbstractBridgeAdapter } from "./AbstractBridgeAdapter";

export class DeBridgeBridgeAdapter extends AbstractBridgeAdapter {
  private supportedChains: ChainName[] = [];
  private tokenList: Record<string, Token[]> = {};
  private TokenSchema = object({
    symbol: string(),
    name: string(),
    decimals: number(),
    address: string(),
    logoURI: useDefault(string([]), ""),
  });
  private TokenListSchema = array(this.TokenSchema);
  private TokenRecordSchema = record(string(), this.TokenSchema);
  private TokenObjectSchema = object({
    tokens: this.TokenRecordSchema,
  });
  private deBridgeEvmFee = "0xb3E9C57fB983491416a0C77b07629C0991c3FD59";
  private deBridgeSolanaFee = "3uAfBoHB1cTyB7H8G2KTpSgZS1T1ME4bHb8uqzqhWsfe";
  private deBridgeSolanaChainId = 7565164;

  private QuoteSchema = object({
    estimation: object({
      srcChainTokenIn: merge([
        omit(this.TokenSchema, ["logoURI"]),
        object({
          chainId: number(),
          amount: string(),
          mutatedWithOperatingExpense: boolean(),
          approximateOperatingExpense: string(),
        }),
      ]),
      srcChainTokenOut: optional(
        merge([
          omit(this.TokenSchema, ["logoURI"]),
          object({
            chainId: number(),
            amount: string(),
            maxRefundAmount: string(),
          }),
        ]),
      ),
      dstChainTokenOut: merge([
        omit(this.TokenSchema, ["logoURI"]),
        object({
          chainId: number(),
          amount: string(),
          recommendedAmount: string(),
        }),
      ]),
    }),
    tx: optional(
      object({
        allowanceTarget: string(),
        allowanceValue: optional(string()),
      }),
    ),
    order: object({
      approximateFulfillmentDelay: number(),
    }),
    fixFee: string(),
  });
  private debridgeQuote: Output<typeof this.QuoteSchema> | undefined;

  private CreateTxSchema = union([
    object({
      tx: object({
        data: string(),
        to: string(),
        value: string(),
      }),
    }),
    object({
      tx: object({
        data: string(),
      }),
    }),
  ]);

  constructor(args: BridgeAdapterArgs) {
    super(args);
  }

  name(): Bridges {
    return "deBridge";
  }
  async getSupportedChains(): Promise<ChainName[]> {
    if (!this.supportedChains.length) {
      console.log("fetching debridge chain");
      const chainsResp = await fetch(
        "https://api.dln.trade/v1.0/supported-chains",
      );
      if (!chainsResp.ok) {
        throw new Error("Failed to fetch supported chains");
      }
      const { chains } = object({ chains: array(number()) }).parse(
        await chainsResp.json(),
      );
      if (!(chains instanceof Array)) {
        throw new Error("Invalid response from server");
      }

      const chainNames = chains
        .map((chainId: number) => chainIdToChainName(chainId))
        .filter(
          (chainName: ChainName | undefined): chainName is ChainName =>
            !!chainName,
        );
      this.supportedChains = chainNames.concat(["Solana"]);
    }
    return this.supportedChains;
  }

  async getSupportedTokens(
    interestedTokenList: ChainDestType,
    chains?: Partial<ChainSourceAndTarget> | undefined,
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
    const chainId = chainNameToChainId(chain);
    if (!this.tokenList[chain]) {
      if (chain === "Solana") {
        console.log("fetching debridge Solana token list");
        const solanaTokenListUrl = new URL("https://cache.jup.ag/tokens");
        const solanaTokenListResp = await fetch(solanaTokenListUrl);
        if (!solanaTokenListResp.ok) {
          throw new Error("Failed to fetch token list");
        }
        const solanaTokenListRaw: unknown = await solanaTokenListResp.json();
        const solanaTokenList = parse(this.TokenListSchema, solanaTokenListRaw);
        this.tokenList[chain] = solanaTokenList.map((token) => {
          return {
            bridgeNames: ["deBridge"],
            chain,
            logoUri: token.logoURI,
            address: token.address,
            decimals: token.decimals,
            name: token.name,
            symbol: token.symbol,
          };
        });
      } else {
        console.log("fetching debridge EVM token list");
        const tokenListUrl = new URL("https://api.dln.trade/v1.0/token-list");
        tokenListUrl.searchParams.set("chainId", chainId.toString());
        const tokenListResp = await fetch(tokenListUrl);
        if (!tokenListResp.ok) {
          throw new Error("Failed to fetch token list");
        }
        const tokenListRaw: unknown = await tokenListResp.json();

        try {
          const tokenList = parse(this.TokenObjectSchema, tokenListRaw);
          if (chain === "Ethereum") {
            // blur token image missing on debridge
            tokenList.tokens[
              "0x5283d291dbcf85356a21ba090e6db59121208b44"
            ].logoURI =
              "https://assets.coingecko.com/coins/images/28453/large/blur.png?1670745921";
          }
          this.tokenList[chain] = Object.values(tokenList.tokens).map(
            (token) => {
              return {
                bridgeNames: ["deBridge"],
                chain,
                logoUri: token.logoURI,
                address: token.address,
                decimals: token.decimals,
                name: token.name,
                symbol: token.symbol,
              };
            },
          );
          console.log("this.tokenList[chain]", this.tokenList[chain], chain);
        } catch (e) {
          if (e instanceof ValiError) {
            console.log(
              "Error parsing response from server for deBridge",
              flatten(e),
            );
          }
          throw e;
        }
      }
    }
    return this.tokenList[chain];
  }

  async getSwapDetails(
    sourceToken: TokenWithAmount,
    targetToken: Token,
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
        } is not supported by ${this.name()}`,
      );
    }

    const quoteUrl = new URL("https://api.dln.trade/v1.0/dln/order/quote");
    quoteUrl.searchParams.set(
      "srcChainId",
      chainNameToChainId(
        sourceToken.chain,
        this.deBridgeSolanaChainId,
      ).toString(),
    );
    quoteUrl.searchParams.set("srcChainTokenIn", sourceToken.address);
    quoteUrl.searchParams.set(
      "srcChainTokenInAmount",
      sourceToken.selectedAmountInBaseUnits,
    );
    quoteUrl.searchParams.set(
      "dstChainId",
      chainNameToChainId(
        targetToken.chain,
        this.deBridgeSolanaChainId,
      ).toString(),
    );
    quoteUrl.searchParams.set("dstChainTokenOut", targetToken.address);
    quoteUrl.searchParams.set("dstChainTokenOutAmount", "auto");
    quoteUrl.searchParams.set("prependOperatingExpense", "true");
    quoteUrl.searchParams.set("affiliateFeePercent", "0.05");
    const quoteResp = await fetch(quoteUrl);
    if (!quoteResp.ok) {
      throw new Error(
        `Failed to fetch quote for debridge. ${await quoteResp.text()}`,
      );
    }
    const quoteRaw: unknown = await quoteResp.json();
    console.log("quoteRaw", quoteRaw);
    const quote = parse(this.QuoteSchema, quoteRaw);
    this.debridgeQuote = quote;
    const sourceNativeCurrency = chainNameToNativeCurrency(sourceToken.chain);

    return {
      bridgeName: this.name(),
      sourceToken: sourceToken,
      targetToken: {
        ...targetToken,
        expectedOutputFormatted: formatTokenBalance(
          formatUnits(
            BigInt(quote.estimation.dstChainTokenOut.recommendedAmount),
            targetToken.decimals,
          ),
        ),
        expectedOutputInBaseUnits:
          quote.estimation.dstChainTokenOut.recommendedAmount,
        minOutputFormatted: formatTokenBalance(
          formatUnits(
            BigInt(quote.estimation.dstChainTokenOut.recommendedAmount),
            targetToken.decimals,
          ),
        ),
        minOutputInBaseUnits:
          quote.estimation.dstChainTokenOut.recommendedAmount,
      },
      tradeDetails: {
        estimatedTimeMinutes: Math.round(
          quote.order.approximateFulfillmentDelay / 60,
        ),
        fee: dedupFeesTokens([
          {
            ...sourceToken,
            selectedAmountInBaseUnits:
              quote.estimation.srcChainTokenIn.approximateOperatingExpense,
            selectedAmountFormatted: formatTokenBalance(
              formatUnits(
                BigInt(
                  quote.estimation.srcChainTokenIn.approximateOperatingExpense,
                ),
                sourceToken.decimals,
              ),
            ),
            details: `Taker's gas fee on ${targetToken.chain}`,
          },
          {
            ...sourceNativeCurrency,
            details: "Debridge Protocol Fee",
            selectedAmountInBaseUnits: quote.fixFee,
            selectedAmountFormatted: formatTokenBalance(
              formatUnits(BigInt(quote.fixFee), sourceNativeCurrency.decimals),
            ),
          },
        ]),
        priceImpact: 0,
        routeInformation: quote.estimation.srcChainTokenOut
          ? [
              {
                fromTokenSymbol: sourceToken.symbol,
                toTokenSymbol: quote.estimation.srcChainTokenOut.symbol,
              },
              {
                fromTokenSymbol: quote.estimation.srcChainTokenOut.symbol,
                toTokenSymbol: targetToken.symbol,
              },
            ]
          : [
              {
                fromTokenSymbol: quote.estimation.srcChainTokenIn.symbol,
                toTokenSymbol: targetToken.symbol,
              },
            ],
      },
    };
  }

  private async createDebridgeTransaction(
    sourceAddress: string,
    targetAddress: string,
  ) {
    if (!this.debridgeQuote) {
      throw new Error("No quote found for deBridge");
    }
    const createTxUrl = new URL(
      "https://api.dln.trade/v1.0/dln/order/create-tx?",
    );
    createTxUrl.searchParams.set(
      "srcChainId",
      this.debridgeQuote.estimation.srcChainTokenIn.chainId.toString(),
    );
    createTxUrl.searchParams.set(
      "srcChainTokenIn",
      this.debridgeQuote.estimation.srcChainTokenIn.address,
    );
    createTxUrl.searchParams.set(
      "srcChainTokenInAmount",
      this.debridgeQuote.estimation.srcChainTokenIn.amount,
    );
    createTxUrl.searchParams.set(
      "dstChainId",
      this.debridgeQuote.estimation.dstChainTokenOut.chainId.toString(),
    );
    createTxUrl.searchParams.set(
      "dstChainTokenOut",
      this.debridgeQuote.estimation.dstChainTokenOut.address,
    );
    createTxUrl.searchParams.set(
      "dstChainTokenOutAmount",
      this.debridgeQuote.estimation.dstChainTokenOut.recommendedAmount,
    );
    createTxUrl.searchParams.set(
      "srcChainOrderAuthorityAddress",
      sourceAddress,
    );
    createTxUrl.searchParams.set("dstChainTokenOutRecipient", targetAddress);
    createTxUrl.searchParams.set(
      "dstChainOrderAuthorityAddress",
      targetAddress,
    );
    createTxUrl.searchParams.set("affiliateFeeRecipient", this.deBridgeEvmFee);
    createTxUrl.searchParams.set("affiliateFeePercent", "0.1");
    createTxUrl.searchParams.set("prependOperatingExpenses", "true");

    const createTxResp = await fetch(createTxUrl);
    if (!createTxResp.ok) {
      throw new Error("Failed to create transaction");
    }
    const createTxRaw: unknown = await createTxResp.json();
    console.log("createTxRaw", createTxRaw);
    const createTx = parse(this.CreateTxSchema, createTxRaw);
    return createTx;
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
    if (!this.debridgeQuote) {
      throw new Error("No quote found");
    }
    const { sourceToken } = swapInformation;
    let transactionHash = "";
    if (sourceToken.chain !== "Solana") {
      if (!isEvmAccount(sourceAccount)) {
        throw new Error("Source account is not an EVM account");
      }

      const destAddress = getWalletAddress(targetAccount);

      if (
        "allowanceValue" in (this.debridgeQuote.tx ?? {}) &&
        this.debridgeQuote.tx?.allowanceTarget
      ) {
        // handle approval
        const ethersSigner = walletClientToSigner(sourceAccount);
        const allowance = await getAllowanceEth(
          this.debridgeQuote.tx?.allowanceTarget,
          sourceToken.address,
          ethersSigner,
        );
        if (
          allowance.lt(this.debridgeQuote.estimation.srcChainTokenIn.amount)
        ) {
          onStatusUpdate({
            information: `Approving ${sourceToken.selectedAmountFormatted} ${sourceToken.symbol}`,
            name: "Approval",
            status: "IN_PROGRESS",
          });
          await approveEth(
            this.debridgeQuote.tx.allowanceTarget,
            sourceToken.address,
            ethersSigner,
            this.debridgeQuote.estimation.srcChainTokenIn.amount,
          );
          onStatusUpdate({
            information: `Approving ${swapInformation.sourceToken.selectedAmountFormatted} ${swapInformation.sourceToken.symbol}`,
            name: "Approval",
            status: "COMPLETED",
          });
        }
      }

      const { tx } = await this.createDebridgeTransaction(
        sourceAccount.account?.address || "",
        destAddress,
      );
      if (!("value" in tx)) {
        throw new Error("No value in tx");
      }
      const chain = chainNameToViemChain(sourceToken.chain);
      onStatusUpdate({
        information: `Pending confirmation to lock ${swapInformation.sourceToken.selectedAmountFormatted} ${swapInformation.sourceToken.symbol}`,
        name: "Lock",
        status: "IN_PROGRESS",
      });
      transactionHash = await sourceAccount.sendTransaction({
        account: sourceAccount.account?.address || "0x",
        chain,
        to: tx.to as Hash,
        data: tx.data as Hash,
        value: BigInt(tx.value),
      });
      const ethersSigner = walletClientToSigner(sourceAccount);
      const provider = ethersSigner.provider;
      await provider.getTransactionReceipt(transactionHash);

      onStatusUpdate({
        information: `Pending confirmation to lock  ${swapInformation.sourceToken.selectedAmountFormatted} ${swapInformation.sourceToken.symbol}`,
        name: "Lock",
        status: "COMPLETED",
      });
    } else {
      if (!isSolanaAccount(sourceAccount)) {
        throw new Error("Source account is not a Solana account");
      }
      const { tx } = await this.createDebridgeTransaction(
        getWalletAddress(sourceAccount),
        getWalletAddress(targetAccount),
      );
      const connection = this.getSolanaConnection();
      const solanaTransaction = await sourceAccount.signTransaction(
        VersionedTransaction.deserialize(Buffer.from(tx.data.slice(2), "hex")),
      );
      ({ signature: transactionHash } = await submitSolanaTransaction(
        solanaTransaction,
        connection,
      ));
    }

    const interval = setInterval(() => {
      this.getDeBridgeTransactionStatus(transactionHash)
        .then((status) => {
          switch (status) {
            case "Created": {
              onStatusUpdate({
                information: "Successfully locked tokens on source chain",
                name: "PendingConfirmation",
                status: "IN_PROGRESS",
              });
              break;
            }
            case "SentUnlock":
            case "ClaimedUnlock":
            case "Fulfilled": {
              onStatusUpdate({
                information: "Successfully completed swap",
                name: "Completed",
                status: "COMPLETED",
              });
              clearInterval(interval);

              break;
            }
            case "ClaimedOrderCancel":
            case "SentOrderCancel":
            case "OrderCancelled": {
              onStatusUpdate({
                information: "Cancelled swap",
                name: "Cancelled",
                status: "FAILED",
              });
              clearInterval(interval);
              break;
            }
          }
        })
        .catch((e: unknown) => {
          console.log("Error getting debridge transaction status", e);
        });
    }, 5_000);

    return true;
  }

  private async getDebridgeTransactionId(txnHash: string) {
    const orderIdUrl = new URL(
      `https://api.dln.trade/v1.0/dln/tx/${txnHash}/order-ids`,
    );
    const orderIdResp = await fetch(orderIdUrl);
    if (!orderIdResp.ok) {
      throw new Error("Failed to get order id");
    }
    const orderIdRaw: unknown = await orderIdResp.json();
    console.log("orderIdRaw", orderIdRaw);
    const { orderIds } = parse(
      object({ orderIds: array(string()) }),
      orderIdRaw,
    );
    const orderId = orderIds[0];
    return orderId;
  }

  private async getDeBridgeTransactionStatus(txnHash: string) {
    const orderId = await this.getDebridgeTransactionId(txnHash);

    const txnStatusUrl = new URL(
      `https://api.dln.trade/v1.0/dln/order/${orderId}/status`,
    );
    const txnStatusResp = await fetch(txnStatusUrl);
    if (!txnStatusResp.ok) {
      throw new Error("Failed to get transaction id");
    }
    const txnStatusRaw: unknown = await txnStatusResp.json();
    console.log("txnStatusRaw", txnStatusRaw);
    const txnStatus = parse(
      object({ orderId: string(), status: string() }),
      txnStatusRaw,
    );
    return txnStatus.status;
  }
}
