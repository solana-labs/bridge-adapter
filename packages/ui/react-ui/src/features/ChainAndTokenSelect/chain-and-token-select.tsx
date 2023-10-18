import type { FC } from "react";
import { ChainSelect } from "./chain-select";
import { TokenSelect } from "./token-select";

export interface ChainAndTokenSelectProps {}

export const ChainAndTokenSelect: FC<ChainAndTokenSelectProps> = () => (
  <div className="bsa-flex bsa-flex-col bsa-space-y-3 ">
    <ChainSelect />
    <TokenSelect />
  </div>
);
