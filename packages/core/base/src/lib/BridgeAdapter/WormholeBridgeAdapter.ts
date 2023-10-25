import type {
  ChainId,
  Contracts,
  ChainName as WormHoleChainName,
} from "@certusone/wormhole-sdk";
import Debug from "debug";
import {
  approveEth,
  coalesceChainName,
  CONTRACTS,
  getAllowanceEth,
  getEmitterAddressEth,
  getEmitterAddressSolana,
  getForeignAssetSolana,
  getIsTransferCompletedSolana,
  getSignedVAAWithRetry,
  parseSequenceFromLogEth,
  parseSequenceFromLogSolana,
  redeemOnEth,
  redeemOnSolana,
  toChainId,
  toChainName,
  transferFromEth,
  transferFromSolana,
  tryNativeToUint8Array,
} from "@certusone/wormhole-sdk";
import { postVaaWithRetry } from "@certusone/wormhole-sdk/lib/cjs/solana/sendAndConfirmPostVaa";
import {
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  getAssociatedTokenAddress,
  NATIVE_MINT,
} from "@solana/spl-token";
import {
  PublicKey,
  SystemProgram,
  Transaction as SolanaTransaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  BRIDGE_ALIASES,
  CHAIN_ALIASES,
  CHAIN_NAMES,
} from "../../constants/ChainNames";
import type {
  BridgeAdapterArgs,
  BridgeStatus,
  Bridges,
  EvmAccount,
  SolanaAccount,
  SolanaOrEvmAccount,
} from "../../types/Bridges";
import { BridgeStatusNames } from "../../types/Bridges";
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
import { getTokenList } from "../../entities/wormhole/get-token-list";
import { getWalletAddress } from "../../utils/getWalletAddress";

const debug = Debug("debug:base:WormholeBridgeAdapter");

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
    return BRIDGE_ALIASES.Wormhole;
  }
  getSupportedChains(): Promise<ChainName[]> {
    const supportedChains: ChainName[] = [
      CHAIN_ALIASES.Arbitrum,
      CHAIN_ALIASES.Avalanche,
      CHAIN_ALIASES.BSC,
      CHAIN_ALIASES.Ethereum,
      CHAIN_ALIASES.Optimism,
      CHAIN_ALIASES.Polygon,
      CHAIN_ALIASES.Solana,
    ];
    return Promise.resolve(supportedChains);
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
      this.tokenList = await getTokenList();
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
      case CHAIN_ALIASES.Ethereum:
        return "ethereum";
      case CHAIN_ALIASES.Solana:
        return "solana";
      case CHAIN_ALIASES.Polygon:
        return "polygon";
      case CHAIN_ALIASES.Arbitrum:
        return "arbitrum";
      case CHAIN_ALIASES.Optimism:
        return "optimism";
      case CHAIN_ALIASES.Avalanche:
        return "avalanche";
      case CHAIN_ALIASES.BSC:
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

      await this.signAndSendSolanaTransaction(transaction, {
        ownerAccount: targetAccount,
      });
    }
  }

  private async signAndSendSolanaTransaction(
    transaction: SolanaTransaction,
    {
      ownerAccount,
    }: {
      ownerAccount: SolanaAccount;
    },
    updateBlockhash: boolean = true,
  ) {
    const connection = this.getSolanaConnection();

    if (updateBlockhash) {
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = ownerAccount.publicKey;
    }

    // sign, send, and confirm transaction
    const signedTransaction = await ownerAccount.signTransaction(transaction);
    const result = await submitSolanaTransaction(signedTransaction, connection);

    return result;
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

  private async lockSolToken({
    sourceAccount,
    wormholeSourceChain,
    wormholeTargetChainId,
    targetAddress,
    sourceToken,
  }: {
    sourceAccount: SolanaAccount;
    wormholeSourceChain: WormHoleChainName;
    wormholeTargetChainId: ChainId;
    targetAddress: string;
    sourceToken: TokenWithAmount;
  }) {
    const connection = this.getSolanaConnection();
    const bridgeAddress = this.getBridgeAddressForChain(
      this.chainNameToWormholeChainName(CHAIN_ALIASES.Solana),
      "core",
    );
    const tokenBridgeAddress = this.getBridgeAddressForChain(
      wormholeSourceChain,
      "token_bridge",
    );
    const payerAddress = getWalletAddress(sourceAccount);
    const payerAccountKey = new PublicKey(payerAddress);
    const mintAddress = sourceToken.address;
    const mintAccountKey = new PublicKey(mintAddress);

    const fromAddress = await getAssociatedTokenAddress(
      mintAccountKey,
      payerAccountKey,
    );

    const amount = BigInt(sourceToken.selectedAmountInBaseUnits);
    const targetChain = wormholeTargetChainId;
    const targetAddressBytes = tryNativeToUint8Array(
      targetAddress,
      targetChain,
    );

    debug("Transfer Sol -> EVM", {
      amount,
      bridgeAddress,
      connection,
      fromAddress,
      mintAddress,
      payerAddress,
      targetAddressBytes,
      targetChain,
      tokenBridgeAddress,
      wormholeSourceChain,
    });

    const transaction = await transferFromSolana(
      connection,
      bridgeAddress,
      tokenBridgeAddress,
      payerAddress,
      fromAddress,
      mintAddress,
      amount,
      targetAddressBytes,
      targetChain,
    );

    if (mintAccountKey.equals(NATIVE_MINT)) {
      const mintAccountInfo = await connection.getAccountInfo(mintAccountKey);

      let wrapNativeTokenTransactionInstructions: TransactionInstruction[] = [];

      if (!mintAccountInfo) {
        wrapNativeTokenTransactionInstructions.push(
          createAssociatedTokenAccountInstruction(
            payerAccountKey,
            fromAddress,
            payerAccountKey,
            mintAccountKey,
          ),
        );
      }

      // TODO: check the wrappedSol balance. Transfer might not be needed;
      wrapNativeTokenTransactionInstructions =
        wrapNativeTokenTransactionInstructions.concat([
          SystemProgram.transfer({
            fromPubkey: payerAccountKey,
            toPubkey: fromAddress,
            lamports: amount,
          }),
          createSyncNativeInstruction(fromAddress),
        ]);

      const wrapNativeTokenTransaction = new SolanaTransaction().add(
        ...wrapNativeTokenTransactionInstructions,
      );

      await this.signAndSendSolanaTransaction(wrapNativeTokenTransaction, {
        ownerAccount: sourceAccount,
      });
    }

    // sign, send, and confirm transaction
    const { signature } = await this.signAndSendSolanaTransaction(
      transaction,
      { ownerAccount: sourceAccount },
      false,
    );

    const info = await connection.getTransaction(signature);

    if (!info) {
      throw new Error("Can not fetch transaction info");
    }

    const sequence = parseSequenceFromLogSolana(info);

    if (!sequence) {
      throw new Error("Can not parse a sequence");
    }

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

  async waitSolana({
    sequence,
    wormholeSourceChain,
  }: {
    sequence: string;
    wormholeSourceChain: WormHoleChainName;
  }) {
    const emitterAddress = getEmitterAddressSolana(
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

    console.log("Source", sourceToken);
    console.log("Target", targetToken);

    debug("Transfer", sourceToken, "for", targetToken);

    if (sourceToken.chain === "Solana") {
      // Solana -> EVM
      if (!isSolanaAccount(sourceAccount) || !isEvmAccount(targetAccount)) {
        throw new Error("Invalid source or target account");
      }

      debug("Exchange between Solana & EVM");

      onStatusUpdate({
        information: `Approving ${sourceToken.selectedAmountFormatted} ${sourceToken.symbol}`,
        name: "Approval",
        status: "IN_PROGRESS",
      });

      const { sequence } = await this.lockSolToken({
        sourceAccount,
        sourceToken,
        targetAddress: (await targetAccount.getAddresses())[0],
        wormholeSourceChain,
        wormholeTargetChainId,
      });

      debug("Executing sequence", sequence);

      onStatusUpdate({
        information: "Waiting for confirmation on Solana",
        name: "Approval",
        status: "IN_PROGRESS",
      });

      const { signedVAA } = await this.waitSolana({
        sequence,
        wormholeSourceChain,
      });

      const ethersSigner = walletClientToSigner(targetAccount);

      const redeemChainAddress = this.getBridgeAddressForChain(
        wormholeTargetChainId,
        "token_bridge",
      );

      onStatusUpdate({
        information: `Redeeming tokens on ${toChainName(
          wormholeTargetChainId,
        )}`,
        name: "Redeeming",
        status: "IN_PROGRESS",
      });

      await redeemOnEth(redeemChainAddress, ethersSigner, signedVAA);

      debug("Got receipt from EVM");

      onStatusUpdate({
        information: "Transfer Completed",
        name: BridgeStatusNames.Completed,
        status: "COMPLETED",
      });

      return true;
    } else if (targetToken.chain === "Solana") {
      // EVM -> Solana
      if (!isEvmAccount(sourceAccount) || !isSolanaAccount(targetAccount)) {
        throw new Error("Invalid source or target account");
      }

      debug("Exchange between EVM & Solana");

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
      //  EVM -> EVM
      if (!isEvmAccount(sourceAccount) || !isEvmAccount(targetAccount)) {
        throw new Error("Invalid source or target account");
      }

      debug("Exchange between EVM & EVM");

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
