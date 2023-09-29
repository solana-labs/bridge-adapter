import type { SignerWalletAdapterProps } from "@solana/wallet-adapter-base";
import type { PublicKey } from "@solana/web3.js";
import type { WalletClient } from "viem";
import type { ChainSourceAndTarget } from "./Chain";

export type BridgeAdapterArgs = Partial<ChainSourceAndTarget> & {
  settings?: {
    evm?: {
      alchemyApiKey?: string;
      infuraApiKey?: string;
    };
    solana?: {
      solanaRpcUrl?: string;
    };
  };
};

export type Bridges = "wormhole" | "mayan" | "deBridge";

export type SolanaAccount = {
  signTransaction: SignerWalletAdapterProps["signTransaction"];
  publicKey: PublicKey;
};
export type EvmAccount = WalletClient;

export type SolanaOrEvmAccount = SolanaAccount | EvmAccount;

export type BridgeStatus = {
  name: string;
  status: "PENDING" | "IN_PROGRESS" | "SKIPPED" | "COMPLETED" | "FAILED";
  information: string;
};
