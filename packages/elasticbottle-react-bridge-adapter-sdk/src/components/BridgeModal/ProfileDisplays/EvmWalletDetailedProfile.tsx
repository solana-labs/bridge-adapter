import { UserCircle2 } from "lucide-react";
import { useCallback } from "react";
import { useAccount, useDisconnect, useEnsName } from "wagmi";
import { ETHEREUM_BASE_EXPLORER_URL } from "../../../constants/BaseExplorers";
import { cn } from "../../../lib/utils";
import { setCurrentBridgeStep } from "../../../providers/BridgeModalContext";
import { AddressLine } from "../../ui/AddressLine";
import { ChainIcon } from "../../ui/icons/ChainIcon";
import { EvmWalletDetail } from "../ProfileDetails/EvmWalletDetail";
import { ViewAndCopyWallet } from "./ViewAndCopyWallet";

export function EvmWalletDetailedProfile({
  className,
}: {
  className?: string;
}) {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName();
  const { disconnect } = useDisconnect({
    onSuccess: () =>
      setCurrentBridgeStep({
        step: "WALLET_SELECTION",
        params: {
          chain: "Ethereum",
        },
      }),
  });

  const switchWallet = useCallback(() => {
    disconnect();
  }, [disconnect]);

  if (!isConnected) {
    return (
      <div
        className={cn(
          "bsa-flex bsa-items-center bsa-rounded-xl bsa-bg-muted bsa-px-5 bsa-py-3",
          className
        )}
      >
        <UserCircle2 className="bsa-mr-3 bsa-h-8 bsa-w-8" />{" "}
        <div className="bsa-text-lg">Not Connected</div>
      </div>
    );
  }
  return (
    <div className={cn("bsa-flex bsa-flex-col bsa-px-5 bsa-py-3", className)}>
      <EvmWalletDetail switchWallet={switchWallet} />
      <div className="bsa-text bsa-flex bsa-w-full bsa-items-center bsa-py-5">
        <ChainIcon chainName={"Ethereum"} size="2xl" />
        <AddressLine
          address={address}
          isName={!!ensName}
          moreDetails={true}
          showCopyButton={false}
          textClassName="bsa-text-2xl bsa-font-bold bsa-ml-4"
        />
      </div>
      <ViewAndCopyWallet
        address={address}
        baseExplorerUrl={ETHEREUM_BASE_EXPLORER_URL}
      />
    </div>
  );
}
// 0x62D05C8e8f98C99aBD61a5A58d107db64faBE077
