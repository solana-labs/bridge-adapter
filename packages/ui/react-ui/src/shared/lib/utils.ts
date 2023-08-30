import type {
  ChainDestType,
  FeeToken,
  SwapInformation,
} from "bridge-adapter-base";
import { PublicKey } from "@solana/web3.js";
import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import type { useConnect } from "wagmi";
import type { BridgeStep, BridgeStepParams } from "../../types/BridgeModal";

const customTwMerge = extendTailwindMerge({
  prefix: "bsa-",
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

export function getEvmAvailableWallets(
  wallets: ReturnType<typeof useConnect>["connectors"],
) {
  const walletNames = wallets.reduce((prev, curr) => {
    prev.add(curr.name.toLocaleLowerCase());
    return prev;
  }, new Set<string>());
  return walletNames.size;
}

export function parseForErrorString(e: unknown) {
  if (e instanceof Error) {
    console.log("e.message", e.message);
    if (
      e.message.includes("User rejected the request") ||
      e.message.includes("user did not approve")
    ) {
      return "";
    } else if (
      e.message.includes("already pending ") ||
      e.message.includes("already handling a request ") ||
      e.message.includes("Already processing eth_requestAccounts")
    ) {
      return "Please check your wallet for confirmation";
    }
  }
  return `Unknown error occurred. ${JSON.stringify(e)}`;
}

export function hasChainDest(
  params: BridgeStepParams<BridgeStep>,
): params is { chainDest: ChainDestType } {
  if (!params) {
    return false;
  }
  return "chainDest" in params;
}

export function formatPublicKey(publicKey: PublicKey | null) {
  if (publicKey) {
    const base58 = publicKey.toBase58();
    return base58.slice(0, 4) + ".." + base58.slice(-4);
  }
  return "";
}

export function formatEvmAddress(address?: string | PublicKey) {
  if (address instanceof PublicKey) {
    const base58 = address.toBase58();
    return base58.slice(0, 4) + ".." + base58.slice(-4);
  }
  if (typeof address === "string") {
    return address.slice(0, 6) + ".." + address.slice(-4);
  }
  return "";
}

export function formatTime(timeInMinutes: number) {
  if (timeInMinutes <= 2) {
    return "< 2 min";
  }
  return `${timeInMinutes} min`;
}

export function formatSwapFee(fees: FeeToken[]) {
  return fees
    .map((fee) => {
      return `${fee.selectedAmountFormatted} ${fee.symbol}`;
    })
    .join(" + ");
}

export function isSwapInfoEqual(
  swapInfo1: SwapInformation,
  swapInfo2: SwapInformation,
) {
  const swapInfo1BridgeName = swapInfo1.bridgeName;
  const swapInfo2BridgeName = swapInfo2.bridgeName;
  const swapInfo1Route = formatRouteInfo(
    swapInfo1.tradeDetails.routeInformation,
  );
  const swapInfo2Route = formatRouteInfo(
    swapInfo2.tradeDetails.routeInformation,
  );
  return (
    `${swapInfo1BridgeName} ${swapInfo1Route}` ===
    `${swapInfo2BridgeName} ${swapInfo2Route}`
  );
}

export function formatRouteInfo(
  routeInfo: SwapInformation["tradeDetails"]["routeInformation"],
) {
  return routeInfo.reduce((prev, currRoute) => {
    if (prev === "") {
      return currRoute?.fromTokenSymbol + " → " + currRoute?.toTokenSymbol;
    } else {
      return prev + " → " + currRoute?.toTokenSymbol;
    }
  }, "");
}
