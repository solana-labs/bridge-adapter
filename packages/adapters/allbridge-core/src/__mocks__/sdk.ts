import type { AllBridgeCoreBridgeAdapter } from "../features/allBridge-core-bridge-adapter";
import { Messenger, TokenWithChainDetails } from "@allbridge/bridge-core-sdk";

export function mockGasFeeOptions(
  adapter: AllBridgeCoreBridgeAdapter,
  native: { int: string; float: string },
) {
  /// patch sdk to work with stub data
  // @ts-expect-error intentionally patch the private property
  adapter.sdk.getGasFeeOptions = function getGasFeeOptions(
    sourceToken: TokenWithChainDetails,
    _targetToken: TokenWithChainDetails,
    _messenger: Messenger,
  ) {
    const { decimals: sourceDecimals } = sourceToken;

    return {
      native: {
        int: native.int,
        float: native.float, // 1e-18
      },
      stablecoin: {
        int: String(Math.pow(10, -1 * sourceDecimals)),
        float: String(Math.pow(10, -1 * sourceDecimals)),
      },
    };
  };
}

export function mockAmountToBeReceived(
  adapter: AllBridgeCoreBridgeAdapter,
  amountToReceive: string,
) {
  /// patch sdk to work with stub data
  // @ts-expect-error intentionally patch the private property
  adapter.sdk.getAmountToBeReceived = function getAmountToBeReceived(
    _amountToSendFloat,
    _sourceChainToken,
    _destinationChainToken,
  ) {
    return amountToReceive;
  };
}

export function stubAllBridgeCoreSdkForEthToSolTransfer(
  adapter: AllBridgeCoreBridgeAdapter,
) {
  // @ts-expect-error allow to patch
  adapter.sdk.chainDetailsMap = () => {
    return {
      ETH: {
        chainSymbol: "ETH",
        chainId: "0x1",
        name: "Ethereum",
        chainType: "EVM",
        allbridgeChainId: 1,
        bridgeAddress: "0x609c690e8F7D68a59885c9132e812eEbDaAf0c9e",
        tokens: [
          {
            name: "USD Coin",
            poolAddress: "0xa7062bbA94c91d565Ae33B893Ab5dFAF1Fc57C4d",
            tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            decimals: 6,
            symbol: "USDC",
            feeShare: "0.0015",
            apr: "0.33051583105404814793",
            lpRate: "0.50006100042961491709",
            cctpAddress: "0x965A5Ea29186A4eE65B1F1D9BDBf6260dC5f31D1",
            cctpFeeShare: "0.001",
            chainSymbol: "ETH",
            chainId: "0x1",
            chainType: "EVM",
            allbridgeChainId: 1,
            bridgeAddress: "0x609c690e8F7D68a59885c9132e812eEbDaAf0c9e",
            transferTime: [Object],
            txCostAmount: [Object],
            confirmations: 80,
            chainName: "Ethereum",
          },
          {
            name: "Tether USD",
            poolAddress: "0x7DBF07Ad92Ed4e26D5511b4F285508eBF174135D",
            tokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            decimals: 6,
            symbol: "USDT",
            feeShare: "0.0015",
            apr: "0.11468863608536727922",
            lpRate: "0.50003362137159853319",
            chainSymbol: "ETH",
            chainId: "0x1",
            chainType: "EVM",
            allbridgeChainId: 1,
            bridgeAddress: "0x609c690e8F7D68a59885c9132e812eEbDaAf0c9e",
            transferTime: [Object],
            txCostAmount: [Object],
            confirmations: 80,
            chainName: "Ethereum",
          },
        ],
      },
      SOL: {
        chainSymbol: "SOL",
        name: "Solana",
        chainType: "SOLANA",
        allbridgeChainId: 4,
        bridgeAddress: "BrdgN2RPzEMWF96ZbnnJaUtQDQx7VRXYaHHbYCBvceWB",
        tokens: [
          {
            name: "USD Coin",
            poolAddress: "5NQbhSDg4TKVvq7z3PTbqSzAiHwB7amxmxqkViQnyVnZ",
            tokenAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            decimals: 6,
            symbol: "USDC",
            feeShare: "0.0015",
            apr: "0.41975679058835557199",
            lpRate: "0.49936623909204792664",
            chainSymbol: "SOL",
            chainType: "SOLANA",
            allbridgeChainId: 4,
            bridgeAddress: "BrdgN2RPzEMWF96ZbnnJaUtQDQx7VRXYaHHbYCBvceWB",
            transferTime: [Object],
            txCostAmount: [Object],
            confirmations: 32,
            chainName: "Solana",
          },
        ],
      },
    };
  };
}
