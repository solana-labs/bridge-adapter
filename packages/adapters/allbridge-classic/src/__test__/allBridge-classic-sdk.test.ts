import it from "ava";
import { AllBridgeClassicSdk } from "../entities/allBridge-classic-sdk";
import * as Services from "../__mocks__/token-service";
import type { ChainDetailsMap } from "../types/token.d";

it("should return chain details", async (t) => {
  const tokenService = new Services.TokenService();
  const sdk = new AllBridgeClassicSdk(undefined, tokenService);

  const chainDetails = await sdk.chainDetailsMap();
  t.is(Object.keys(chainDetails).length, 3); // ETH, SOL, XRPL
});

it("should calculate the gas fee", async (t) => {
  const tokenService = new Services.TokenService();
  const sdk = new AllBridgeClassicSdk(undefined, tokenService);
  const details = await sdk.chainDetailsMap();

  let sourceToken = getChainTokenBySymbolAndIndex(details, "ETH");
  if (!sourceToken) throw new Error("No ETH token found");
  t.deepEqual(
    {
      stablecoin: {
        int: "1000000000000000",
      },
    },
    await sdk.getGasFeeOptions("1", sourceToken),
  );

  sourceToken = getChainTokenBySymbolAndIndex(details, "SOL");
  if (!sourceToken) throw new Error("No SOL token found");
  t.deepEqual(
    {
      stablecoin: {
        int: "3000",
      },
    },
    await sdk.getGasFeeOptions(String(1_000_000), sourceToken),
  );

  sourceToken = getChainTokenBySymbolAndIndex(details, "XRPL");
  if (!sourceToken) throw new Error("No XRPL token found");
  t.deepEqual(
    {
      stablecoin: {
        int: "1000000",
      },
    },
    await sdk.getGasFeeOptions(String(1_000_000), sourceToken),
  );

  sourceToken = getChainTokenBySymbolAndIndex(details, "XRPL");
  if (!sourceToken) throw new Error("No XRPL token found");
  t.deepEqual(
    {
      stablecoin: {
        int: "2000000",
      },
    },
    await sdk.getGasFeeOptions(String(2_000_000_000), sourceToken),
  );
});

function getChainTokenBySymbolAndIndex(
  details: ChainDetailsMap,
  symbol: string,
  index: number | undefined = 0,
) {
  return details[symbol].tokens[index];
}
