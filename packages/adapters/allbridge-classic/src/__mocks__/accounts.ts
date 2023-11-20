import { SolanaOrEvmAccount, EvmAccount } from "@solana/bridge-adapter-core";
import { Keypair, PublicKey } from "@solana/web3.js";

export const solanaAccount = (pubkey?: string) => {
  return {
    async signTransaction() {},
    publicKey: pubkey ? new PublicKey(pubkey) : Keypair.generate().publicKey,
  } as SolanaOrEvmAccount;
};

export const evmAccount = (address?: string) => {
  const evmAccount: unknown = {
    /// https://vanity-eth.tk
    address: address || "0x9D76d5113b9a2F0A26D7AB7BAE299745E4905CdD",
  };
  const account = evmAccount as EvmAccount["account"];
  const ethereumAccount = { account } as SolanaOrEvmAccount;

  return ethereumAccount;
};
