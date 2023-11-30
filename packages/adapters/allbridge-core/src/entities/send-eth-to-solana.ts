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
import { Messenger } from "@allbridge/bridge-core-sdk";
import {
  getWalletAddress,
  isEvmAccount,
  isSolanaAccount,
} from "@solana/bridge-adapter-core";
import { handleApiError } from "./error-handler";
import { sendRawTransaction } from "./send-raw-transaction";
import Web3 from "web3/dist/web3.min.js";

const debug = Debug("debug:adapters:sendEthToSolana");
const error = Debug("error:adapters:sendEthToSolana");

const USDT_TOKEN_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";

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
  web3: Web3,
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

  const params = {
    amount,
    destinationToken: targetChainToken,
    fromAccountAddress: sourceAddress,
    sourceToken: sourceChainToken,
    toAccountAddress: targetAddress,
    messenger: Messenger.ALLBRIDGE,
    //minimumReceiveAmount
  };

  let sendResp;
  try {
    sendResp = await sdk.bridge.rawTxBuilder.send(params);
  } catch (e: unknown) {
    const message = handleApiError(e);
    error(`Tx builder error: ${message}`);

    onStatusUpdate({
      information: message,
      name: "Error",
      status: "FAILED",
    });

    return false;
  }

  const sourceTokenAddress = swapInformation.sourceToken.address;

  /// Check allowance for the USDT token
  if (isUSDT(sourceTokenAddress)) {
    onStatusUpdate({
      information: "Checking the token allowance",
      name: "Progress",
      status: "IN_PROGRESS",
    });

    const isAllowed = await sdk.bridge.checkAllowance({
      amount,
      owner: sourceAddress,
      token: sourceChainToken,
      messenger: Messenger.ALLBRIDGE,
    });

    /// Perform allowance request
    if (!isAllowed) {
      onStatusUpdate({
        information: "Request the allowance",
        name: "Progress",
        status: "IN_PROGRESS",
      });

      const allowance = await sdk.bridge.getAllowance({
        token: sourceChainToken,
        owner: sourceAddress,
        messenger: Messenger.ALLBRIDGE,
      });

      if (allowance !== "0") {
        onStatusUpdate({
          information: "Failed to get allowance",
          name: "Error",
          status: "FAILED",
        });
        return false;
      }
      // else proceed with transfer
    }
  } else {
    /// checking allowance for other tokens
    onStatusUpdate({
      information: "Checking the token allowance",
      name: "Progress",
      status: "IN_PROGRESS",
    });

    const isAllowed = await sdk.bridge.checkAllowance({
      amount,
      owner: sourceAddress,
      token: sourceChainToken,
      messenger: Messenger.ALLBRIDGE,
    });

    if (!isAllowed) {
      /// Authorize the transfer
      const approveTx = await sdk.bridge.rawTxBuilder.approve(web3, {
        ...params,
        token: sourceChainToken,
        owner: sourceAddress,
      });
      // @ts-expect-error allow
      const approveTxRes = await sendRawTransaction(web3, approveTx)
      console.log({ approveTxRes })
    }
  }

  onStatusUpdate({
    information: "Preform transfer",
    name: "Progress",
    status: "IN_PROGRESS",
  });

  try {
    // @ts-expect-error web3
    const txResult = await sendRawTransaction(web3, sendResp);
    console.log({ txResult });
  } catch (e: unknown) {
    const message = handleApiError(e);
    onStatusUpdate({
      information: message,
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

function isUSDT(address: string) {
  return address.toLowerCase() === USDT_TOKEN_ADDRESS;
}
