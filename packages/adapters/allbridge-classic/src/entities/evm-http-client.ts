import type { Chain } from "viem/chains";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { sendTransaction } from "viem/actions";

export interface IEvmHttpClient {
  sendTransaction(): void;
}

export class EvmHttpClient implements IEvmHttpClient {
  private client: ReturnType<typeof createPublicClient>;

  constructor(chain: Chain | undefined) {
    this.client = createPublicClient({
      chain: chain || mainnet,
      transport: http(),
    });
  }

  async sendTransaction() {
    const resp = await sendTransaction(this.client, {});
  }
}
