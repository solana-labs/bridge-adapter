import { ChainSelect } from "./ChainSelect";
import { TokenSelect } from "./TokenSelect";

export function ChainAndTokenSelect() {
  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-3 ">
      <ChainSelect />
      <TokenSelect />
    </div>
  );
}
