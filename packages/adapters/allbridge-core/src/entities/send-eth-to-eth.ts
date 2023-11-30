import Debug from "debug";
import type {
  AllbridgeCoreSdk,
  TokenWithChainDetails,
} from "@allbridge/bridge-core-sdk";
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

const debug = Debug("debug:adapters:sendEthToEth");

interface SendEthToEthArgs {
  onStatusUpdate: (a: BridgeStatus) => void;
  sourceAccount: SolanaOrEvmAccount;
  sourceChainToken: TokenWithChainDetails;
  swapInformation: SwapInformation;
  targetAccount: SolanaOrEvmAccount;
  targetChainToken: TokenWithChainDetails;
}

export default async function sendEthToEth<T extends AllbridgeCoreSdk>(
  sdk: T,
  {
    onStatusUpdate,
    sourceAccount,
    sourceChainToken,
    swapInformation,
    targetAccount,
    targetChainToken,
  }: SendEthToEthArgs,
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

  const result = false;

  return result;
}
