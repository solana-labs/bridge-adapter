import type {
  AbstractBridgeAdapter,
  BridgeAdapterArgs,
} from "@solana/bridge-adapter-core";
import type { BridgeAdapterSdkArgs } from "../lib/BridgeAdapterSdk";

type AdapterClass = typeof AbstractBridgeAdapter;
/// Disable the rule as we intentionally want to use the constructor to satisfy the type checking
interface AdapterDerived extends AdapterClass {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  constructor(args: BridgeAdapterArgs): void;
}
type BridgeAdapterDerived = new (
  a: Parameters<AdapterDerived["constructor"]>[0],
) => AdapterDerived;

export function getBridgeAdapters({
  adapters = [],
  settings,
  sourceChain,
  targetChain,
}: BridgeAdapterSdkArgs) {
  const _adapters: unknown = adapters;
  const providedAdapters = _adapters as BridgeAdapterDerived[];

  return providedAdapters.map(
    (Adapter) =>
      new Adapter({
        sourceChain,
        targetChain,
        settings,
      }),
  ) as unknown as AbstractBridgeAdapter[];
}
