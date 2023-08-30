import type {
  ChainId,
  Contracts,
  ChainName as WormHoleChainName,
} from "@certusone/wormhole-sdk";
import {
  CONTRACTS,
  approveEth,
  coalesceChainName,
  getAllowanceEth,
  getEmitterAddressEth,
  getForeignAssetSolana,
  getIsTransferCompletedSolana,
  getSignedVAAWithRetry,
  parseSequenceFromLogEth,
  redeemOnSolana,
  toChainId,
  transferFromEth,
  tryNativeToUint8Array,
} from "@certusone/wormhole-sdk";
import { postVaaWithRetry } from "@certusone/wormhole-sdk/lib/cjs/solana/sendAndConfirmPostVaa";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { PublicKey, Transaction as SolanaTransaction } from "@solana/web3.js";
import { csv2json, parseValue } from "csv42";
import { CHAIN_NAMES } from "../../constants/ChainNames";
import type {
  BridgeAdapterArgs,
  BridgeStatus,
  Bridges,
  EvmAccount,
  SolanaAccount,
  SolanaOrEvmAccount,
} from "../../types/Bridges";
import type { ChainName, ChainSourceAndTarget } from "../../types/Chain";
import type { ChainDestType } from "../../types/ChainDest";
import type { SwapInformation } from "../../types/SwapInformation";
import type {
  BridgeToken,
  Token,
  Token as TokenType,
  TokenWithAmount,
  TokenWithExpectedOutput,
} from "../../types/Token";
import { isEvmAccount, isSolanaAccount } from "../../utils/bridge";
import { getSourceAndTargetChain } from "../../utils/getSourceAndTargetChain";
import { submitSolanaTransaction } from "../../utils/solana";
import { walletClientToSigner } from "../../utils/viem/ethers";
import { AbstractBridgeAdapter } from "./AbstractBridgeAdapter";

export class WormholeBridgeAdapter extends AbstractBridgeAdapter {
  private tokenList: BridgeToken[] = [];
  WORMHOLE_RPC_HOSTS = [
    "https://wormhole-v2-mainnet-api.certus.one",
    "https://wormhole.inotel.ro",
    "https://wormhole-v2-mainnet-api.mcf.rocks",
    "https://wormhole-v2-mainnet-api.chainlayer.network",
    "https://wormhole-v2-mainnet-api.staking.fund",
    "https://wormhole-v2-mainnet.01node.com",
  ];
  constructor(args: BridgeAdapterArgs) {
    super(args);
  }
  name(): Bridges {
    return "wormhole";
  }
  getSupportedChains(): Promise<ChainName[]> {
    return Promise.resolve([
      "Ethereum",
      "Solana",
      "Polygon",
      "Optimism",
      "BSC",
      "Arbitrum",
      "Avalanche",
    ]);
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
    if (this.tokenList.length === 0) {
      const tokenList = await fetch(
        "https://raw.githubusercontent.com/certusone/wormhole-token-list/main/content/by_dest.csv",
      );
      if (!tokenList.ok) {
        throw new Error("Failed to fetch token list");
      }
      const csv = await tokenList.text();
      const token: BridgeToken[] = csv2json(csv, {
        fields: [
          {
            name: "address",
            setValue(item, value) {
              item.targetAddress = value;
            },
          },
          {
            name: "sourceAddress",
            setValue(item, value) {
              item.sourceAddress = value;
            },
          },
          {
            name: "name",
            setValue(item, value) {
              item.name = value;
            },
          },
          {
            name: "symbol",
            setValue(item, value) {
              item.symbol = value;
            },
          },
          {
            name: "logo",
            setValue(item, value) {
              item.logoUri = value;
            },
          },
          {
            name: "decimals",
            setValue(item, value) {
              if (typeof value === "string") {
                item.targetDecimals = parseInt(value);
              } else if (typeof value === "number") {
                item.targetDecimals = value;
              } else {
                item.targetDecimals = 0;
              }
            },
          },
          {
            name: "sourceDecimals",
            setValue(item, value) {
              if (typeof value === "string") {
                item.sourceDecimals = parseInt(value);
              } else if (typeof value === "number") {
                item.sourceDecimals = value;
              } else {
                item.sourceDecimals = 0;
              }
            },
          },
          {
            name: "origin",
            setValue(item, value) {
              if (value === "sol") {
                item.sourceChain = "Solana";
              } else if (value === "eth") {
                item.sourceChain = "Ethereum";
              } else if (value === "matic") {
                item.sourceChain = "Polygon";
              } else if (value === "avax") {
                item.sourceChain = "Avalanche";
              } else if (value === "arbitrum") {
                item.sourceChain = "Arbitrum";
              } else if (value === "bsc") {
                item.sourceChain = "BSC";
              } else {
                console.log("value", value);
                item.sourceChain = value;
              }
            },
          },
          {
            name: "dest",
            setValue(item, value) {
              if (value === "sol") {
                item.targetChain = "Solana";
              } else if (value === "eth") {
                item.targetChain = "Ethereum";
              } else if (value === "matic") {
                item.targetChain = "Polygon";
              } else if (value === "avax") {
                item.targetChain = "Avalanche";
              } else if (value === "arbitrum") {
                item.targetChain = "Arbitrum";
              } else if (value === "bsc") {
                item.targetChain = "BSC";
              } else {
                console.log("value", value);
                item.targetChain = value;
              }
            },
          },
        ],
        parseValue: (value) => {
          if (value.startsWith("0x")) {
            return value;
          }
          return parseValue(value);
        },
      });
      this.tokenList = token;
    }

    let filteredToken = this.tokenList;
    if (source) {
      filteredToken = filteredToken.filter(
        (token) =>
          token.sourceChain.toLowerCase() === source.toLowerCase() &&
          CHAIN_NAMES.includes(token.targetChain),
      );
    }
    if (target) {
      filteredToken = filteredToken.filter(
        (token) =>
          token.targetChain.toLowerCase() === target.toLowerCase() &&
          CHAIN_NAMES.includes(token.sourceChain),
      );
    }

    if (interestedTokenList === "source") {
      if (!source) {
        throw new Error("Invalid source chain");
      }
      return filteredToken.map((token) => {
        return {
          address: token.sourceAddress,
          chain: token.sourceChain,
          decimals: token.sourceDecimals,
          logoUri: token.logoUri,
          symbol: token.symbol,
          name: token.name,
          bridgeNames: ["wormhole"],
        };
      });
    } else if (interestedTokenList === "target") {
      if (!target) {
        throw new Error("Invalid target chain");
      }
      return filteredToken.map((token) => {
        return {
          address: token.targetAddress,
          chain: token.targetChain,
          decimals: token.targetDecimals,
          logoUri: token.logoUri,
          symbol: token.symbol,
          name: token.name,
          bridgeNames: ["wormhole"],
        };
      });
    }
    throw new Error("Invalid interestedTokenList value");
  }

  getSwapDetails(
    sourceToken: TokenWithAmount,
    targetToken: Token,
  ): Promise<SwapInformation> {
    if (sourceToken.name !== targetToken.name) {
      throw new Error("Cannot bridge to another token with wormhole");
    }
    return Promise.resolve({
      sourceToken: sourceToken,
      bridgeName: this.name(),
      targetToken: {
        ...targetToken,
        expectedOutputFormatted: sourceToken.selectedAmountFormatted,
        expectedOutputInBaseUnits: sourceToken.selectedAmountInBaseUnits,
        minOutputFormatted: sourceToken.selectedAmountFormatted,
        minOutputInBaseUnits: sourceToken.selectedAmountInBaseUnits,
      },
      tradeDetails: {
        estimatedTimeMinutes: 10,
        fee: [],
        priceImpact: 0,
        routeInformation: [],
      },
    });
  }

  private chainNameToWormholeChainName(
    chainName: ChainName,
  ): WormHoleChainName {
    switch (chainName) {
      case "Ethereum":
        return "ethereum";
      case "Solana":
        return "solana";
      case "Polygon":
        return "polygon";
      case "Arbitrum":
        return "arbitrum";
      case "Optimism":
        return "optimism";
      case "Avalanche":
        return "avalanche";
      case "BSC":
        return "bsc";
      default:
        throw new Error("Invalid chain name");
    }
  }

  private getBridgeAddressForChain(
    chainNameOrId: ChainId | WormHoleChainName,
    contract: keyof Contracts = "token_bridge",
  ) {
    return CONTRACTS.MAINNET[coalesceChainName(chainNameOrId)][contract] || "";
  }

  private async createAssociatedTokenAccount({
    sourceToken,
    targetAccount,
    wormholeSourceChainId,
    wormholeTargetChain,
    onNeedToCreateTokenAccount,
  }: {
    wormholeTargetChain: WormHoleChainName;
    wormholeSourceChainId: ChainId;
    sourceToken: TokenWithAmount;
    targetAccount: SolanaAccount;
    onNeedToCreateTokenAccount?: (associatedAccountNeeded: boolean) => void;
  }) {
    const connection = this.getSolanaConnection();

    const solanaMintKey = new PublicKey(
      (await getForeignAssetSolana(
        connection,
        this.getBridgeAddressForChain(wormholeTargetChain, "token_bridge"),
        wormholeSourceChainId,
        tryNativeToUint8Array(sourceToken.address, wormholeSourceChainId),
      )) || "",
    );
    const recipientAta = await getAssociatedTokenAddress(
      solanaMintKey,
      targetAccount.publicKey,
    );
    // create the associated token account if it doesn't exist
    const associatedAddressInfo = await connection.getAccountInfo(recipientAta);
    const associatedAccountNeeded = !associatedAddressInfo;
    onNeedToCreateTokenAccount?.(associatedAccountNeeded);

    if (!associatedAddressInfo) {
      const transaction = new SolanaTransaction().add(
        createAssociatedTokenAccountInstruction(
          targetAccount.publicKey,
          recipientAta,
          targetAccount.publicKey,
          solanaMintKey,
        ),
      );
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = targetAccount.publicKey;

      // sign, send, and confirm transaction
      const signedTransaction =
        await targetAccount.signTransaction(transaction);
      await submitSolanaTransaction(signedTransaction, connection);
    }
  }

  private async lockEthToken({
    sourceAccount,
    wormholeSourceChain,
    wormholeTargetChainId,
    targetAddress,
    sourceToken,
  }: {
    sourceAccount: EvmAccount;
    wormholeSourceChain: WormHoleChainName;
    wormholeTargetChainId: ChainId;
    targetAddress: string;
    sourceToken: TokenWithAmount;
  }) {
    const ethersSigner = walletClientToSigner(sourceAccount);

    const allowance = await getAllowanceEth(
      this.getBridgeAddressForChain(wormholeSourceChain, "token_bridge"),
      sourceToken.address,
      ethersSigner,
    );
    if (allowance.lt(sourceToken.selectedAmountInBaseUnits)) {
      // approve the bridge to spend tokens
      await approveEth(
        this.getBridgeAddressForChain(wormholeSourceChain, "token_bridge"),
        sourceToken.address,
        ethersSigner,
        sourceToken.selectedAmountInBaseUnits,
      );
    }

    // transfer tokens
    const receipt = await transferFromEth(
      this.getBridgeAddressForChain(wormholeSourceChain, "token_bridge"),
      ethersSigner,
      sourceToken.address,
      sourceToken.selectedAmountInBaseUnits,
      wormholeTargetChainId,
      tryNativeToUint8Array(targetAddress, wormholeTargetChainId),
    );

    // get the sequence from the logs (needed to fetch the vaa)
    const sequence = parseSequenceFromLogEth(
      receipt,
      this.getBridgeAddressForChain(wormholeSourceChain, "core"),
    );
    return { sequence };
  }

  async wait({
    sequence,
    wormholeSourceChain,
  }: {
    sequence: string;
    wormholeSourceChain: WormHoleChainName;
  }) {
    const emitterAddress = getEmitterAddressEth(
      this.getBridgeAddressForChain(wormholeSourceChain, "token_bridge"),
    );
    // poll until the guardian(s) witness and sign the vaa
    const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
      this.WORMHOLE_RPC_HOSTS,
      toChainId(wormholeSourceChain),
      emitterAddress,
      sequence,
    );
    return { signedVAA };
  }

  async receiveSolanaToken({
    signedVAA,
    token,
    targetAccount,
  }: {
    signedVAA: Uint8Array;
    token: TokenWithExpectedOutput;
    targetAccount: SolanaAccount;
  }) {
    const connection = this.getSolanaConnection();
    const payerAddress = targetAccount.publicKey?.toString() ?? "";
    const wormholeChainName = this.chainNameToWormholeChainName(token.chain);

    const maxFailures = 0;
    const postPromise = await postVaaWithRetry(
      connection,
      async (transaction) => {
        await new Promise(function (resolve) {
          //We delay here so the connection has time to get wrecked. See https://github.com/wormhole-foundation/wormhole/blob/main/sdk/js/src/token_bridge/__tests__/eth-integration.ts#L413
          setTimeout(function () {
            resolve(500);
          });
        });
        return targetAccount.signTransaction?.(transaction) ?? transaction;
      },
      this.getBridgeAddressForChain(wormholeChainName, "core"),
      payerAddress,
      Buffer.from(signedVAA),
      maxFailures,
    );
    console.log("postPromise", postPromise);
    const isCompleted = await getIsTransferCompletedSolana(
      this.getBridgeAddressForChain(wormholeChainName, "token_bridge"),
      signedVAA,
      connection,
    );
    console.log("isCompleted", isCompleted);

    // redeem tokens on solana
    const transaction = await redeemOnSolana(
      connection,
      this.getBridgeAddressForChain(wormholeChainName, "core"),
      this.getBridgeAddressForChain(wormholeChainName, "token_bridge"),
      payerAddress,
      signedVAA,
    );

    // sign, send, and confirm transaction
    const signedTransaction = await targetAccount.signTransaction(transaction);
    await submitSolanaTransaction(signedTransaction, connection);

    const isCompletedAfterRedeem = await getIsTransferCompletedSolana(
      this.getBridgeAddressForChain(wormholeChainName, "token_bridge"),
      signedVAA,
      connection,
    );
    console.log("isCompletedAfterRedeem ", isCompletedAfterRedeem);
  }

  getBridgeSteps(
    sourceChain: ChainName,
    targetChain: ChainName,
  ): BridgeStatus[] {
    //const steps = [
    //{
    //name: "approve",
    //status: "PENDING",
    //},
    //{
    //name: "transfer",
    //status: "PENDING",
    //},
    //{
    //name: "wait",
    //status: "PENDING",
    //},
    //{
    //name: "receive",
    //status: "PENDING",
    //},
    //];
    if (sourceChain === "Solana") {
      // From Solana to EVM
      return [];
    } else if (targetChain === "Solana") {
      // From EVM to Solana
      return [];
    } else {
      // From EVM to EVM
      return [];
    }
  }

  async bridge({
    // onStatusUpdate,
    sourceAccount,
    targetAccount,
    swapInformation,
  }: {
    swapInformation: SwapInformation;
    sourceAccount: SolanaOrEvmAccount;
    targetAccount: SolanaOrEvmAccount;
    onStatusUpdate: (args: BridgeStatus) => void;
  }): Promise<boolean> {
    const { sourceToken, targetToken } = swapInformation;

    if (sourceToken.chain === targetToken.chain) {
      throw new Error(
        "Cannot use wormhole to bridge between two tokens on the same chain",
      );
    }
    const wormholeSourceChain = this.chainNameToWormholeChainName(
      sourceToken.chain,
    );
    const wormholeTargetChain = this.chainNameToWormholeChainName(
      targetToken.chain,
    );
    const wormholeTargetChainId = toChainId(wormholeTargetChain);

    if (sourceToken.chain === "Solana") {
      // From Solana to EVM
    } else if (targetToken.chain === "Solana") {
      // From EVM to Solana
      if (!isEvmAccount(sourceAccount) || !isSolanaAccount(targetAccount)) {
        throw new Error("Invalid source or target account");
      }

      await this.createAssociatedTokenAccount({
        sourceToken,
        targetAccount,
        wormholeSourceChainId: toChainId(
          this.chainNameToWormholeChainName(sourceToken.chain),
        ),
        wormholeTargetChain: this.chainNameToWormholeChainName(
          targetToken.chain,
        ),
        onNeedToCreateTokenAccount() {
          // Empty for now
        },
      });

      const { sequence } = await this.lockEthToken({
        sourceAccount,
        sourceToken,
        targetAddress: targetAccount.publicKey.toString(),
        wormholeSourceChain,
        wormholeTargetChainId,
      });

      const { signedVAA } = await this.wait({
        sequence,
        wormholeSourceChain,
      });

      await this.receiveSolanaToken({
        signedVAA,
        targetAccount,
        token: targetToken,
      });
    } else {
      //  From EVM to EVM
      if (!isEvmAccount(sourceAccount) || !isEvmAccount(targetAccount)) {
        throw new Error("Invalid source or target account");
      }

      const { sequence } = await this.lockEthToken({
        sourceAccount,
        sourceToken,
        targetAddress: (await targetAccount.getAddresses())[0],
        wormholeSourceChain,
        wormholeTargetChainId,
      });

      await this.wait({
        sequence,
        wormholeSourceChain,
      });
    }
    return true;
  }
}
