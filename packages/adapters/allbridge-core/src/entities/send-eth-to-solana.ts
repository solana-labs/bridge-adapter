import Debug from "debug";
import type {
  AllbridgeCoreSdk,
  TokenWithChainDetails,
} from "@allbridge/bridge-core-sdk";
//import { EvmBridgeService } from "@allbridge/bridge-core-sdk/dist/esm/bridge";
import type {
  BridgeStatus,
  SolanaOrEvmAccount,
  SwapInformation,
} from "@solana/bridge-adapter-core";
import { Messenger } from "@allbridge/bridge-core-sdk";
import {
  getWalletAddress,
  isEvmAccount,
  isSolanaAccount,
} from "@solana/bridge-adapter-core";
import { createWeb3ClientFromWallet } from ".";

const debug = Debug("debug:adapters:sendEthToSolana");

interface SendEthToSolanaArgs {
  onStatusUpdate: (a: BridgeStatus) => void;
  sourceAccount: SolanaOrEvmAccount;
  sourceAddress: string;
  sourceChainToken: TokenWithChainDetails;
  swapInformation: SwapInformation;
  targetAccount: SolanaOrEvmAccount;
  targetAddress: string;
  targetChainToken: TokenWithChainDetails;
}

export default async function sendEthToSolana<T extends AllbridgeCoreSdk>(
  sdk: T,
  {
    onStatusUpdate,
    sourceAccount,
    sourceChainToken,
    swapInformation,
    targetAccount,
    targetChainToken,
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

  try {
    const response = await sdk.bridge.rawTxBuilder.send({
      amount,
      destinationToken: targetChainToken,
      fromAccountAddress: sourceAddress,
      sourceToken: sourceChainToken,
      toAccountAddress: targetAddress,
      //minimumReceiveAmount
    });
    console.log({ data: response });
  } catch (e: unknown) {
    console.log(e);
    let error;
    if (e instanceof Error) {
      console.log(e.message);
      error = e;
    } else {
      error = new Error("Can not fetch transaction data");
    }
    onStatusUpdate({
      information: error.message,
      name: "Error",
      status: "FAILED",
    });
    return false;
  }
  /*
  const ethWeb3Client = createWeb3ClientFromWallet(sourceAccount);

  /// Checking allowance
  const checkAllowanceParams = {
    amount,
    owner: sourceAddress,
    token: sourceChainToken,
  };
  const isSendAllowed = await sdk.bridge.checkAllowance(
    ethWeb3Client,
    checkAllowanceParams,
  );
  console.log({ sourceChainToken, targetChainToken }, isSendAllowed);

  //const evmBridge = new EvmBridgeService(ethWeb3Client);

  if (!isSendAllowed) {
    /// Authorize the transfer
    const d = await sdk.bridge.approve(ethWeb3Client, {
      token: sourceChainToken,
      owner: sourceAddress,
    });
  }

  /// Check the allowance again as it might not be approved
  const isAllowedFinally = await sdk.bridge.checkAllowance(
    ethWeb3Client,
    checkAllowanceParams,
  );

  //console.log({ isAllowedFinally });

  if (!isAllowedFinally) {
    throw new Error("Transfer is not allowed. Please check the requirements");
  }

  /// Making the transfer
  const resp = await sdk.bridge.send(ethWeb3Client, {
    amount,
    fromAccountAddress: sourceAddress,
    toAccountAddress: targetAddress,
    sourceToken: sourceChainToken,
    destinationToken: targetChainToken,
    messenger: Messenger.ALLBRIDGE,
  });
  */

  const resp = false;

  return resp;
}
