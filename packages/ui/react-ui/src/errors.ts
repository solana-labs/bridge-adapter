import { BridgeAdapterError } from "@solana/bridge-adapter-base";

export class AbsentChainError extends BridgeAdapterError {
  name = "AbsentChainError";
  constructor(message?: string) {
    super(message);
  }
}
