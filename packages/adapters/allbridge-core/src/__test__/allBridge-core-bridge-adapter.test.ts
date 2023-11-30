import it from "ava";
import { AllBridgeCoreBridgeAdapter } from "../features/allBridge-core-bridge-adapter";
import { Messenger, TokenWithChainDetails } from "@allbridge/bridge-core-sdk";
import {
  mockAmountToBeReceived,
  mockGasFeeOptions,
  stubAllBridgeCoreSdkForEthToSolTransfer,
} from "../__mocks__/sdk";
import {
  solanaToken,
  solanaTokenWithAmount,
  ethereumToken,
  ethereumTokenWithAmount,
} from "../__mocks__/token";
import { solanaAccount, ethereumAccount } from "../__mocks__/account";

it("should be initialized", async (t) => {
  const adapter = new AllBridgeCoreBridgeAdapter({
    sourceChain: "Ethereum",
    targetChain: "Solana",
  });

  stubAllBridgeCoreSdkForEthToSolTransfer(adapter);

  t.deepEqual(["Ethereum", "Solana"], await adapter.getSupportedChains());

  const supportedTokens = await adapter.getSupportedTokens("source", {
    sourceChain: "Ethereum",
    targetChain: "Solana",
  });

  t.deepEqual(
    [
      {
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        bridgeNames: ["allBridgeCore"],
        chain: "Ethereum",
        decimals: 6,
        logoUri: "",
        name: "USD Coin",
        symbol: "USDC",
      },
      {
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        bridgeNames: ["allBridgeCore"],
        chain: "Ethereum",
        decimals: 6,
        logoUri: "",
        name: "Tether USD",
        symbol: "USDT",
      },
    ],
    supportedTokens,
  );
});

it.skip("should fetch SwapInformation", async (t) => {
  const adapter = new AllBridgeCoreBridgeAdapter({
    sourceChain: "Ethereum",
    targetChain: "Solana",
  });

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
        int: String(1e18),
        float: "0.000000000000000001", // 1e-18
      },
      stablecoin: {
        int: String(Math.pow(10, -1 * sourceDecimals)),
        float: String(Math.pow(10, -1 * sourceDecimals)),
      },
    };
  };

  /// patch sdk to work with stub data
  // @ts-expect-error intentionally patch the private property
  adapter.sdk.getAmountToBeReceived = function getAmountToBeReceived(
    amountToSendFloat,
    _sourceChainToken,
    _destinationChainToken,
  ) {
    const amountIn = amountToSendFloat as string;
    const amountToReceive = String(parseInt(amountIn) * 0.989898);

    return amountToReceive;
  };

  const swapInformation = await adapter.getSwapDetails(
    ethereumTokenWithAmount({
      address: "USDC_ADDRESS",
      decimals: 6,
      name: "USD Coin",
      selectedAmountFormatted: "1",
      selectedAmountInBaseUnits: "1000000",
      symbol: "USDC",
    }),
    solanaToken({
      address: "USDC_ADDRESS",
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin",
    }),
  );

  t.deepEqual(
    {
      bridgeName: "allBridgeCore",
      sourceToken: {
        address: "USDC_ADDRESS",
        bridgeNames: [],
        chain: "Ethereum",
        decimals: 6,
        logoUri: "",
        name: "USD Coin",
        selectedAmountFormatted: "1",
        selectedAmountInBaseUnits: "1000000",
        symbol: "USDC",
      },
      targetToken: {
        address: "USDC_ADDRESS",
        bridgeNames: [],
        chain: "Solana",
        decimals: 6,
        expectedOutputFormatted: "0.98989",
        expectedOutputInBaseUnits: "0.989898",
        logoUri: "",
        minOutputFormatted: "0.98989",
        minOutputInBaseUnits: "0.989898",
        name: "USD Coin",
        symbol: "USDC",
      },
      tradeDetails: {
        estimatedTimeMinutes: 0,
        fee: [
          {
            address: "USDC_ADDRESS",
            amount: "0.000001",
            bridgeNames: [],
            chain: "Ethereum",
            decimals: 6,
            details: "",
            logoUri: "",
            name: "USD Coin",
            selectedAmountFormatted: "1",
            selectedAmountInBaseUnits: "1000000",
            symbol: "USDC",
          },
        ],
        priceImpact: 0,
        routeInformation: [
          {
            fromTokenSymbol: "USDC",
            toTokenSymbol: "USDC",
          },
        ],
      },
    },
    swapInformation,
  );
});

it.skip("should perform Solana -> EVM swap", async (t) => {
  const adapter = new AllBridgeCoreBridgeAdapter({
    sourceChain: "Solana",
    targetChain: "Ethereum",
  });

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
        int: String(1e18),
        float: "0.000000000000000001", // 1e-18
      },
      stablecoin: {
        int: String(Math.pow(10, -1 * sourceDecimals)),
        float: String(Math.pow(10, -1 * sourceDecimals)),
      },
    };
  };

  /// patch sdk to work with stub data
  // @ts-expect-error intentionally patch the private property
  adapter.sdk.getAmountToBeReceived = function getAmountToBeReceived(
    amountToSendFloat,
    _sourceChainToken,
    _destinationChainToken,
  ) {
    const amountIn = amountToSendFloat as string;
    const amountToReceive = String(parseInt(amountIn) * 0.989898);

    return amountToReceive;
  };

  const swapInformation = await adapter.getSwapDetails(
    solanaTokenWithAmount({
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      decimals: 6,
      name: "USD Coin",
      selectedAmountFormatted: "1",
      selectedAmountInBaseUnits: "1000000",
      symbol: "USDC",
    }),
    ethereumToken({
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
      name: "USD Coin",
      symbol: "USDC",
    }),
  );

  // @ts-expect-error allow to test protected method
  const result = await adapter.constructTransaction({
    sourceAccount: solanaAccount(),
    swapInformation,
    targetAccount: ethereumAccount(),
  });

  t.truthy(result);
});

it("should bridge from Ethereum to Solana", async (t) => {
  const adapter = new AllBridgeCoreBridgeAdapter({
    sourceChain: "Ethereum",
    targetChain: "Solana",
  });

  stubAllBridgeCoreSdkForEthToSolTransfer(adapter);

  mockAmountToBeReceived(adapter, "0.989898");
  mockGasFeeOptions(adapter, {
    int: String(1e18),
    float: "0.000000000000000001",
  });

  const swapInformation = await adapter.getSwapDetails(
    ethereumTokenWithAmount({
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
      name: "USD Coin",
      selectedAmountFormatted: "1",
      selectedAmountInBaseUnits: "1000000",
      symbol: "USDC",
    }),
    solanaToken({
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      decimals: 6,
      name: "USD Coin",
      symbol: "USDC",
    }),
  );

  const result = await adapter.bridge({
    onStatusUpdate: console.info,
    sourceAccount: ethereumAccount(),
    swapInformation,
    targetAccount: solanaAccount(),
  });

  // TODO: finish test
  t.is(false, result);
});
