import Debug from "debug";
import type {
  AllbridgeCoreSdk,
  SendParams,
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
import { Messenger } from "@allbridge/bridge-core-sdk";

const debug = Debug("debug:adapters:sendSolanaToEth");

interface SendSolanaToEthArgs {
  onStatusUpdate: (a: BridgeStatus) => void;
  sourceAccount: SolanaOrEvmAccount;
  sourceChainToken: TokenWithChainDetails;
  swapInformation: SwapInformation;
  targetAccount: SolanaOrEvmAccount;
  targetChainToken: TokenWithChainDetails;
}

export default async function sendSolanaToEth<T extends AllbridgeCoreSdk>(
  sdk: T,
  {
    onStatusUpdate,
    sourceAccount,
    sourceChainToken,
    swapInformation,
    targetAccount,
    targetChainToken,
  }: SendSolanaToEthArgs,
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

  const fee = await sdk.getGasFeeOptions(
    sourceChainToken,
    targetChainToken,
    Messenger.ALLBRIDGE,
  );

  const params: SendParams = {
    amount,
    destinationToken: targetChainToken,
    fee: fee.native.int,
    fromAccountAddress: sourceAddress,
    messenger: Messenger.WORMHOLE,
    sourceToken: sourceChainToken,
    toAccountAddress: targetAddress,
  };

  debug("Params", params);

  //await this.createAssociatedTokenAccount({
  //sourceToken,
  //targetAccount,
  //wormholeSourceChainId: toChainId(
  //this.chainNameToWormholeChainName(sourceToken.chain),
  //),
  //wormholeTargetChain: this.chainNameToWormholeChainName(
  //targetToken.chain,
  //),
  //onNeedToCreateTokenAccount() {
  //// Empty for now
  //},
  //});

  throw new Error("Not implemented yet");
}
