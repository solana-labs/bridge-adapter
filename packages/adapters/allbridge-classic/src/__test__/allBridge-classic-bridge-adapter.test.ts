import it from "ava";
import { AllBridgeClassicBridgeAdapter } from "../features/allBridge-classic-bridge-adapter";
import * as Services from "../__mocks__/token-service";
import { solanaToken, ethereumTokenWithAmount } from "../__mocks__/token";
import { solanaAccount, evmAccount } from "../__mocks__/accounts";

it("should be initialized", async (t) => {
  const adapter = new AllBridgeClassicBridgeAdapter(
    {
      sourceChain: "Ethereum",
      targetChain: "Solana",
    },
    new Services.TokenService(),
  );

  t.deepEqual(["Ethereum", "Solana"], await adapter.getSupportedChains());
});

it("should return supported tokens", async (t) => {
  let adapter = new AllBridgeClassicBridgeAdapter(
    {
      sourceChain: "Ethereum",
      targetChain: "Solana",
    },
    new Services.TokenService(),
  );

  const supportedTokens = await adapter.getSupportedTokens("source", {
    sourceChain: "Ethereum",
    targetChain: "Solana",
  });

  t.deepEqual(
    [
      {
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        decimals: 18,
        logoUri:
          "https://allbridge-assets.web.app/logo/ETH/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2.png",
        name: "ETH",
        symbol: "ETH",
        bridgeNames: ["allBridgeClassic"],
        chain: "Ethereum",
      },
      {
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: 6,
        logoUri:
          "https://allbridge-assets.web.app/logo/ETH/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.png",
        name: "USDC",
        symbol: "USDC",
        bridgeNames: ["allBridgeClassic"],
        chain: "Ethereum",
      },
    ],
    supportedTokens,
  );
});

it("should fetch SwapInformation", async (t) => {
  const adapter = new AllBridgeClassicBridgeAdapter({
    sourceChain: "Ethereum",
    targetChain: "Solana",
  });

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
      bridgeName: "allBridgeClassic",
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
        expectedOutputFormatted: "0.997",
        expectedOutputInBaseUnits: "997000",
        logoUri: "",
        minOutputFormatted: "0.997",
        minOutputInBaseUnits: "997000",
        name: "USD Coin",
        symbol: "USDC",
      },
      tradeDetails: {
        estimatedTimeMinutes: 0,
        fee: [
          {
            address: "USDC_ADDRESS",
            amount: "3000",
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

it("should bridge from Ethereum to Solana", async (t) => {
  const adapter = new AllBridgeClassicBridgeAdapter(
    {
      sourceChain: "Ethereum",
      targetChain: "Solana",
    },
    new Services.TokenService(),
  );

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

  await adapter.bridge({
    onStatusUpdate: console.info,
    sourceAccount: evmAccount(),
    targetAccount: solanaAccount(),
    swapInformation,
  });
});
