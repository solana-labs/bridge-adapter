import { cn } from "../../../lib/utils";
import { useMultiChainWalletInfo } from "../MultiChainWalletButton/useMultiChainWalletInfo";
import { SolanaWalletDetailedProfile } from "../ProfileDisplays/SolanaWalletDetailedProfile";
import { EvmWalletDetailedProfile } from "../ProfileDisplays/EvmWalletDetailedProfile";

export function ProfileDetails() {
  const { solanaWalletConnected, evmWalletConnected } =
    useMultiChainWalletInfo();

  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-4">
      {solanaWalletConnected && (
        <SolanaWalletDetailedProfile
          className={cn(
            "bsa-flex bsa-items-center bsa-justify-between bsa-rounded-md bsa-bg-transparent bsa-px-5 bsa-py-3",
          )}
        />
      )}
      {evmWalletConnected && (
        <EvmWalletDetailedProfile
          className={cn(
            "bsa-flex bsa-items-center bsa-justify-between bsa-rounded-md bsa-bg-transparent bsa-px-5 bsa-py-3",
          )}
        />
      )}
    </div>
  );
}
