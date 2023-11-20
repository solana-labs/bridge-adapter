import it from "ava";
import sendEthToSolana from "../entities/send-eth-to-solana";
import { AllBridgeClassicSdk } from "../entities/allBridge-classic-sdk";
import { AllBridgeClassicBridgeAdapter } from "../features/allBridge-classic-bridge-adapter";
import { solanaAccount, evmAccount } from "../__mocks__/accounts";
import { TokenService } from "../entities/token-service";
import {
  ethereumToken,
  solanaToken,
  tokenWithAmount,
} from "../__mocks__/token";

it("should prepare tx", async (t) => {
  const adapter = new AllBridgeClassicBridgeAdapter(
    {
      sourceChain: "Ethereum",
      targetChain: "Solana",
    },
    new TokenService(),
  );

  const swapInformation = await adapter.getSwapDetails(
    tokenWithAmount(ethereumToken({})),
    solanaToken({}),
  );

  console.log({ swapInformation });

  const result = await sendEthToSolana(
    // @ts-expect-error Allow access to the sdk
    adapter.sdk,
    (token) => console.log({ token }) || undefined,
    {
      onStatusUpdate: () => {},
      sourceAccount: evmAccount(),
      swapInformation,
      targetAccount: solanaAccount(),
    },
  );

  console.log({ result });
});
