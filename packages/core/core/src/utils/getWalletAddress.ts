import type { SolanaOrEvmAccount } from "../types/Bridges";
import { isEvmAccount, isSolanaAccount } from "./bridge";

export function getWalletAddress(account: SolanaOrEvmAccount) {
  if (isEvmAccount(account)) {
    if (!account.account?.address) {
      throw new Error("EVM account address is undefined");
    }
    return account.account.address;
  } else if (isSolanaAccount(account)) {
    return account.publicKey.toBase58();
  }
  throw new Error("Account is not an EVM or Solana account");
}
