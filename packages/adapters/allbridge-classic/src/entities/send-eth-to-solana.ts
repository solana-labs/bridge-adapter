import Debug from "debug";
import type { TokenWithChainDetails } from "@allbridge/bridge-core-sdk";
import type {
  SolanaOrEvmAccount,
  SwapInformation,
  Token,
  TokenWithAmount,
} from "@solana/bridge-adapter-core";
import {
  getWalletAddress,
  isEvmAccount,
  isSolanaAccount,
} from "@solana/bridge-adapter-core";
import type { AllBridgeClassicSdk } from "./allBridge-classic-sdk";
import type { ITokenService } from "../types/token-service";

const debug = Debug("debug:AllBridgeClassicAdapter:sendEthToSolana");

interface SendEthToSolanaArgs {
  onStatusUpdate: () => void;
  sourceAccount: SolanaOrEvmAccount;
  swapInformation: SwapInformation;
  targetAccount: SolanaOrEvmAccount;
}

export default async function sendEthToSolana(
  sdk: AllBridgeClassicSdk<ITokenService>,
  findToken: (
    this: void,
    a: Token | TokenWithAmount,
  ) => TokenWithChainDetails | undefined,
  {
    onStatusUpdate,
    sourceAccount,
    swapInformation,
    targetAccount,
  }: SendEthToSolanaArgs,
) {
  if (!isEvmAccount(sourceAccount) || !isSolanaAccount(targetAccount)) {
    throw new Error("Invalid source or target account");
  }

  const sourceAddress = getWalletAddress(sourceAccount);
  const targetAddress = getWalletAddress(targetAccount);

  debug("Exchange between EVM & Solana");
  debug(`From ${sourceAddress} to ${targetAddress}`);

  const sourceChainToken = findToken(swapInformation.sourceToken);
  const targetChainToken = findToken(swapInformation.targetToken);

  if (!sourceChainToken || !targetChainToken) {
    throw new Error("Could not find on of the tokens to transfer");
  }

  const amount = swapInformation.sourceToken.selectedAmountInBaseUnits;

  console.log({ sourceChainToken, targetChainToken });

  return false;
}
