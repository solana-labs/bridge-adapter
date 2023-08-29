import type {
  EvmAccount,
  SolanaAccount,
  SolanaOrEvmAccount,
} from "../types/Bridges";

export function isSolanaAccount(
  account: SolanaOrEvmAccount
): account is SolanaAccount {
  return "signTransaction" in account && "publicKey" in account;
}

export function isEvmAccount(
  account: SolanaOrEvmAccount
): account is EvmAccount {
  return "account" in account;
}
