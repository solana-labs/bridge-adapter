import { Connection, clusterApiUrl } from "@solana/web3.js";
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

export abstract class AbstractBridgeAdapter {
  protected sourceChain: ChainName | undefined;
  protected targetChain: ChainName | undefined;
  protected settings: BridgeAdapterArgs["settings"];

  constructor({ sourceChain, targetChain, settings }: BridgeAdapterArgs) {
    this.sourceChain = sourceChain;
    this.targetChain = targetChain;
    this.settings = settings;
  }

  protected getSolanaConnection() {
    return new Connection(
      this.settings?.solana?.solanaRpcUrl ?? clusterApiUrl("mainnet-beta"),
      "confirmed",
    );
  }

  abstract name(): Bridges;

  abstract getSupportedChains(): Promise<ChainName[]>;

  abstract getSupportedTokens(
    interestedTokenList: ChainDestType,
    chains?: Partial<ChainSourceAndTarget>,
    tokens?: { sourceToken: Token; targetToken: Token },
  ): Promise<Token[]>;

  abstract getSwapDetails(
    sourceToken: TokenWithAmount,
    targetToken: Token,
  ): Promise<SwapInformation>;

  abstract bridge({
    onStatusUpdate,
    sourceAccount,
    targetAccount,
    swapInformation,
  }: {
    swapInformation: SwapInformation;
    sourceAccount: SolanaOrEvmAccount;
    targetAccount: SolanaOrEvmAccount;
    onStatusUpdate: (args: BridgeStatus) => void;
  }): Promise<boolean>;
}
