import type { PublicKey } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import { SolanaOrEvmAccount, EvmAccount } from "@solana/bridge-adapter-core";

export const solanaAccount = (
  pubkey: PublicKey | undefined = Keypair.generate().publicKey,
) => {
  const solanaAccount = {
    async signTransaction() {},
    publicKey: pubkey,
  } as SolanaOrEvmAccount;

  return solanaAccount;
};

export const ethereumAccount = (
  address: string | undefined = "0x9D76d5113b9a2F0A26D7AB7BAE299745E4905CdD",
) => {
  const evmAccount: unknown = {
    /// https://vanity-eth.tk
    address: address,
  };
  const account = evmAccount as EvmAccount["account"];
  const ethereumAccount = { account } as SolanaOrEvmAccount;

  return ethereumAccount;
};
