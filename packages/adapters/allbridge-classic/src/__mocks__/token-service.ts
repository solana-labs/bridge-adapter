import type { ITokenService } from "../types/token-service.d";
import type { TokenInfo } from "../types/token-service.d";

export class TokenService implements ITokenService {
  readonly endpoint = "https://allbridgeapi.net/token-info";
  async getTokensInfo(): Promise<TokenInfo> {
    return {
      ETH: {
        confirmations: 80,
        tokens: [
          {
            address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            minFee: "1000000000000000",
            tokenSource: "ETH",
            tokenSourceAddress:
              "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000",
            isBase: true,
            isWrapped: false,
            precision: 18,
            symbol: "ETH",
            swapInfo: null,
            logo: "https://allbridge-assets.web.app/logo/ETH/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2.png",
          },
          {
            address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            minFee: "1000000",
            tokenSource: "ETH",
            tokenSourceAddress:
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000",
            isBase: false,
            isWrapped: false,
            precision: 6,
            symbol: "USDC",
            swapInfo: null,
            logo: "https://allbridge-assets.web.app/logo/ETH/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.png",
          },
        ],
      },
      SOL: {
        confirmations: 32,
        tokens: [
          {
            symbol: "SOL",
            tokenSource: "SOL",
            tokenSourceAddress:
              "0x069b8857feab8184fb687f634618c035dac439dc1aeb3b5598a0f00000000001",
            isWrapped: false,
            minFee: "100000000",
            address: "So11111111111111111111111111111111111111112",
            precision: 9,
            isBase: true,
            swapInfo: null,
            logo: "https://allbridge-assets.web.app/logo/SOL/So11111111111111111111111111111111111111112.png",
          },
          {
            symbol: "ABR",
            tokenSource: "ETH",
            tokenSourceAddress:
              "0xa11bd36801d8fa4448f0ac4ea7a62e3634ce8c7c000000000000000000000000",
            isWrapped: true,
            minFee: "10000000000",
            address: "a11bdAAuV8iB2fu7X6AxAvDTo1QZ8FXB3kk5eecdasp",
            precision: 9,
            isBase: false,
            swapInfo: null,
            logo: "https://allbridge-assets.web.app/logo/SOL/a11bdAAuV8iB2fu7X6AxAvDTo1QZ8FXB3kk5eecdasp.png",
          },
          {
            symbol: "USDC",
            tokenSource: "SOL",
            tokenSourceAddress:
              "0xc6fa7af3bedbad3a3d65f36aabc97431b1bbe4c2d2f6e0e47ca60203452f5d61",
            isWrapped: false,
            minFee: "1000000",
            address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            precision: 6,
            isBase: false,
            swapInfo: null,
            logo: "https://allbridge-assets.web.app/logo/SOL/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v.png",
          },
        ],
      },
      XRPL: {
        confirmations: 5,
        tokens: [
          {
            address: "rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz",
            minFee: "1000000",
            tokenSource: "XRPL",
            tokenSourceAddress:
              "0x7bf3cf6c79c49f43a97761af62842f65b27fc20916b47ba52d000000534f4c4f",
            isBase: false,
            isWrapped: false,
            precision: 6,
            symbol: "SOLO",
            swapInfo: null,
            logo: "https://allbridge-assets.web.app/logo/XRPL/rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz_SOLO.png",
          },
        ],
      },
    };
  }
}
