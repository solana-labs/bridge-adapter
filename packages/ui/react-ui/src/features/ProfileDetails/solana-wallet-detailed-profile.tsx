import {
  setCurrentBridgeStep,
  useSolanaWallet,
} from "@solana/bridge-adapter-react";
import { UserCircle2 } from "lucide-react";
import { useCallback } from "react";
import { SolanaWalletDetail } from "./solana-wallet-detail";
import { ViewAndCopyWallet } from "./view-and-copy-wallet";
import { SOLANA_BASE_SOLSCAN_URL } from "../../constants/BaseExplorers";
import { cn } from "../../shared/lib/styles";
import { PublicKeyLine } from "../../shared/ui/PublicKeyLine";
import { ChainIcon } from "../../shared/ui/icons/ChainIcon";

export function SolanaWalletDetailedProfile({
  className,
}: {
  className?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { connected, disconnect, publicKey } = useSolanaWallet();

  const switchWallet = useCallback(async () => {
    await disconnect();
    setCurrentBridgeStep({
      step: "WALLET_SELECTION",
      params: {
        chain: "Solana",
        onSuccess() {
          setCurrentBridgeStep({
            step: "MULTI_CHAIN_SELECTION",
          });
        },
      },
    });
  }, [disconnect]);

  if (!connected) {
    return (
      <div
        className={cn(
          "bsa-flex bsa-items-center bsa-rounded-xl bsa-bg-muted bsa-px-5 bsa-py-3",
          className,
        )}
      >
        <UserCircle2 className="bsa-mr-3 bsa-h-8 bsa-w-8" />{" "}
        <div className="bsa-text-lg">Not Connected</div>
      </div>
    );
  }
  return (
    <div className={cn("bsa-flex bsa-flex-col bsa-px-5 bsa-py-3", className)}>
      <SolanaWalletDetail switchWallet={switchWallet} />
      <div className="bsa-text bsa-flex bsa-w-full bsa-items-center bsa-py-5">
        <ChainIcon chainName={"Solana"} size="2xl" />
        <PublicKeyLine
          publicKey={publicKey === null ? undefined : publicKey}
          isName={!publicKey}
          showCopyButton={false}
          textClassName="bsa-text-2xl bsa-font-bold bsa-ml-4"
        />
      </div>
      <ViewAndCopyWallet
        address={publicKey?.toBase58()}
        baseExplorerUrl={SOLANA_BASE_SOLSCAN_URL}
      />
    </div>
  );
}
