import Debug from "debug";
import type { TokenWithChainDetails } from "../types/token.d";
import type {
  BridgeStatus,
  SolanaOrEvmAccount,
  SwapInformation,
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
  onStatusUpdate: (a: BridgeStatus) => void;
  sourceAccount: SolanaOrEvmAccount;
  sourceChainToken: TokenWithChainDetails,
  swapInformation: SwapInformation;
  targetAccount: SolanaOrEvmAccount;
  targetChainToken: TokenWithChainDetails,
}

export default async function sendEthToSolana(
  sdk: AllBridgeClassicSdk<ITokenService>,
  {
    onStatusUpdate,
    sourceAccount,
    sourceChainToken,
    targetChainToken,
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

  if (!sourceChainToken || !targetChainToken) {
    throw new Error("Could not find on of the tokens to transfer");
  }

  onStatusUpdate({
    information: "Executing transfer",
    name: "Progress",
    status: "IN_PROGRESS",
  });

  const amount = swapInformation.sourceToken.selectedAmountInBaseUnits;

  // console.log({ sourceChainToken, targetChainToken });

  return false;
}
