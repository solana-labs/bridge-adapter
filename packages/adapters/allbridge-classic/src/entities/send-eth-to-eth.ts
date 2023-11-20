import Debug from "debug";
import { isEvmAccount } from "@solana/bridge-adapter-core";

const debug = Debug("debug:AllBridgeClassicAdapter:sendEthToEth");

export default async function sendEthToEth<T = unknown>(
  sdk,
  { sourceAccount, targetAccount },
) {
  if (!isEvmAccount(sourceAccount) || !isEvmAccount(targetAccount)) {
    throw new Error("Invalid source or target account");
  }

  debug("Exchange between EVM & EVM");
  debug(`From ${sourceAddress} to ${targetAddress}`);
}
