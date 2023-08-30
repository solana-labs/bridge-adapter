import { setCurrentBridgeStep } from "bridge-adapter-react";
import { useWallet as useSolWallet } from "@solana/wallet-adapter-react";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useNetwork,
} from "bridge-adapter-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shared/ui/popover";
import { cn } from "../../shared/lib/styles";
import { Button, buttonVariants } from "../../shared/ui/button";
//TODO: import { EvmWalletProfile } from "../ProfileDisplays/EvmWalletProfile";
import { EvmWalletProfile } from "../../shared/ui/EvmWalletProfile";
//import { SolanaWalletProfile } from "../ProfileDisplays/SolanaWalletProfile";
import { SolanaWalletProfile } from "../../shared/ui/SolanaWalletProfile";
import { useMultiChainWalletInfo } from "./use-multi-chain-wallet-info";

const getNilString = (a: string | null | undefined): string | undefined => {
  if (a === null || a === undefined) {
    return undefined;
  }
  return a;
};

export function MultiChainWalletButton() {
  const { solanaWalletConnected, evmWalletConnected, disconnectChain } =
    useMultiChainWalletInfo();

  console.log({ solanaWalletConnected, evmWalletConnected, disconnectChain });

  const solana = useSolWallet();

  const { address, connector, isConnected } = useAccount();
  const { data: avatar } = useEnsAvatar();
  const { data: ensName } = useEnsName();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();

  const wallet = solana.wallet
    ? {
        adapter: {
          name: solana.wallet.adapter.name,
          icon: solana.wallet.adapter.icon,
        },
      }
    : null;

  return (
    <>
      {solanaWalletConnected || evmWalletConnected ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" aria-label="Show chains">
              View Accounts
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bsa-z-50 bsa-flex bsa-flex-col bsa-gap-y-2 bsa-bg-background bsa-py-2">
            {solanaWalletConnected && (
              <SolanaWalletProfile
                isConnected={solana.connected}
                publicKey={solana.publicKey}
                wallet={wallet}
                onDisconnect={() => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  solana.disconnect().then(() => {
                    disconnectChain("Solana");
                  });
                }}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "bsa-flex bsa-items-center bsa-justify-between bsa-rounded-md bsa-bg-transparent bsa-px-5 bsa-py-3",
                )}
              />
            )}
            {evmWalletConnected && (
              <EvmWalletProfile
                address={address}
                avatar={getNilString(avatar)}
                chainName={chain?.name}
                connectorName={connector?.name}
                ensName={getNilString(ensName)}
                isConnected={isConnected}
                onDisconnect={() => {
                  if (disconnect) {
                    disconnect();
                    disconnectChain("Ethereum");
                  }
                }}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "bsa-flex bsa-items-center bsa-justify-between bsa-rounded-md bsa-bg-transparent bsa-px-5 bsa-py-3",
                )}
              />
            )}
            <Button
              variant={"ghost"}
              onClick={() => {
                setCurrentBridgeStep({
                  step: "PROFILE_DETAILS",
                });
              }}
            >
              Account Profile
            </Button>
          </PopoverContent>
        </Popover>
      ) : (
        <></>
      )}
    </>
  );
}
