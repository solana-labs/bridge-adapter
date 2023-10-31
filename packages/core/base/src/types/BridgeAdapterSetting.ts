import type { Bridges } from "./Bridges";

export type BridgeAdapterSetting = { allow: Bridges[] } | { deny: Bridges[] };
