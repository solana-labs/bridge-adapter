import Debug from "debug";
import { isSolanaAccount, isEvmAccount } from "@solana/bridge-adapter-core";

const debug = Debug("debug:AllBridgeClassicAdapter:sendSolanaToEth");

export default async function sendSolanaToEth<T = unknown>(
  sdk: unknown,
  { sourceAccount, targetAccount },
) {
  if (!isSolanaAccount(sourceAccount) || !isEvmAccount(targetAccount)) {
    throw new Error("Invalid source or target account");
  }

  debug("Exchange between Solana & EVM");
  debug(`From ${sourceAddress} to ${targetAddress}`);

  return false;
}
