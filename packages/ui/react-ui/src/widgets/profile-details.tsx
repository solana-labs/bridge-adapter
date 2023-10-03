import { cn } from "../shared/lib/styles";
import { useMultiChainWalletInfo } from "../features/MultiChainWalletButton";
import {
  SolanaWalletDetailedProfile,
  EvmWalletDetailedProfile,
} from "../features/ProfileDetails";

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
