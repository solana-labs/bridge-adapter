import type { ChainName } from "../types/Chain";

export function getSourceAndTargetChain({
  overrideSourceChain,
  overrideTargetChain,
  sdkSourceChain,
  sdkTargetChain,
  chainChecks: {
    needEitherChain = true,
    needSourceChain = false,
    needTargetChain = false,
  } = {
    needEitherChain: true,
    needSourceChain: false,
    needTargetChain: false,
  },
}: {
  sdkSourceChain?: ChainName;
  sdkTargetChain?: ChainName;
  overrideSourceChain?: ChainName;
  overrideTargetChain?: ChainName;
  chainChecks?: {
    needEitherChain?: boolean;
    needSourceChain?: boolean;
    needTargetChain?: boolean;
  };
}) {
  if (needSourceChain && !sdkSourceChain && !overrideSourceChain) {
    throw new Error("Missing sourceChain");
  }
  if (needTargetChain && !sdkTargetChain && !overrideTargetChain) {
    throw new Error("Missing targetChain");
  }

  const source = overrideSourceChain ?? sdkSourceChain;
  const target = overrideTargetChain ?? sdkTargetChain;

  if (needEitherChain && !source && !target) {
    throw new Error("Missing sourceChain or targetChain");
  }

  return { source, target };
}
