import type {
  Bridges,
  ChainName,
  SwapInformation,
  Token,
} from "@solana/bridge-adapter-core";
import { AbstractBridgeAdapter } from "@solana/bridge-adapter-core";
import { token } from "./token";

export class MockBridgeAdapter extends AbstractBridgeAdapter {
  private tokenList = [];
  name(): Bridges {
    return "mock" as Bridges;
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async getSupportedChains(): Promise<ChainName[]> {
    return ["Ethereum", "Solana"];
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async getSupportedTokens(): Promise<Token[]> {
    return [token({ chain: "Ethereum" })];
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async getSwapDetails(): Promise<SwapInformation> {
    return {} as SwapInformation;
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async bridge(): Promise<boolean> {
    return false;
  }
}
