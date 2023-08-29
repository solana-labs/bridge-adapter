import { LogOut, UserCircle2 } from "lucide-react";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useNetwork,
} from "wagmi";
import { AddressLine } from "../../ui/AddressLine";
import { Button } from "../../ui/button";
import { WalletIcon } from "../../ui/icons/WalletIcon";
import { cn } from "../../../lib/utils";

export function EvmWalletProfile({
  onDisconnect,
  className,
}: {
  onDisconnect?: () => void;
  className?: string;
}) {
  const { address, connector, isConnected } = useAccount();
  const { data: avatar } = useEnsAvatar();
  const { data: ensName } = useEnsName();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();

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
    <div
      className={cn(
        "bsa-flex bsa-items-center bsa-justify-between bsa-rounded-xl bsa-bg-muted bsa-px-5 bsa-py-3 ",
        className
      )}
    >
      <div className="bsa-flex bsa-items-center">
        {avatar ? (
          <img
            className="bsa-mr-3 bsa-h-8 bsa-w-8 bsa-rounded-full"
            src={avatar}
            alt="Ens Avatar"
          />
        ) : (
          <WalletIcon
            walletName={connector?.name.toLowerCase() || ""}
            className="bsa-mr-3 bsa-h-10 bsa-w-10"
          />
        )}
        <div>
          <AddressLine
            address={ensName ?? (address || "")}
            isName={!!ensName}
          />
          <div className="bsa-text-sm bsa-text-muted-foreground">
            {chain?.name}
          </div>
        </div>
      </div>
      <Button
        size={"icon"}
        variant={"ghost"}
        onClick={() => (onDisconnect ? onDisconnect() : disconnect())}
      >
        <LogOut />
      </Button>
    </div>
  );
}
