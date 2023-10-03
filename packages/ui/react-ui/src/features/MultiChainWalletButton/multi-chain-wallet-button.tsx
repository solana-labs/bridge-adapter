import type { FC } from "react";
import Debug from "debug";
import {
  setCurrentBridgeStep,
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useNetwork,
  useSolanaWallet,
} from "@solana/bridge-adapter-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shared/ui/popover";
import { cn } from "../../shared/lib/styles";
import { Button, buttonVariants } from "../../shared/ui/button";
import { EvmWalletProfile } from "../../shared/ui/EvmWalletProfile";
import { SolanaWalletProfile } from "../../shared/ui/SolanaWalletProfile";
import { useMultiChainWalletInfo } from "./use-multi-chain-wallet-info";

const debug = Debug("debug:react-ui:MultiChainWalletButton");

interface MultiChainWalletButtonProps {
  labels?: {
    [key: string]: string;
    showChains: string;
    accountProfile: string;
  };
}

const LABELS = {
  accountProfile: "Account Profile",
  showChains: "View Accounts",
};

export const MultiChainWalletButton: FC<MultiChainWalletButtonProps> = ({
  labels = LABELS,
}) => {
  const { solanaWalletConnected, evmWalletConnected, disconnectChain } =
    useMultiChainWalletInfo();

  console.log({ solanaWalletConnected, evmWalletConnected, disconnectChain });

  const solana = useSolanaWallet();

  debug("Solana Wallet Info", solana.wallet);

  const { address, connector, isConnected } = useAccount();
  const { data: avatar } = useEnsAvatar();
  const { data: ensName } = useEnsName();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();

  const ethereum = {
    address,
    connector,
    isConnected,
    avatar,
    ensName,
    chain,
    disconnect,
  };

  const wallet = solana.wallet
    ? {
        adapter: {
          name: solana.wallet.adapter.name,
          icon: solana.wallet.adapter.icon,
        },
      }
    : null;

  console.log({ solanaWalletConnected, evmWalletConnected });

  return (
    <>
      {solanaWalletConnected || evmWalletConnected ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" aria-label="Show chains">
              {labels.showChains}
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
                address={ethereum.address}
                avatar={getNilString(ethereum.avatar)}
                chainName={ethereum.chain?.name}
                connectorName={ethereum.connector?.name}
                ensName={getNilString(ethereum.ensName)}
                isConnected={ethereum.isConnected}
                onDisconnect={() => {
                  if (ethereum.disconnect) {
                    ethereum.disconnect();
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
              variant="ghost"
              onClick={() => {
                setCurrentBridgeStep({
                  step: "PROFILE_DETAILS",
                });
              }}
            >
              {labels.accountProfile}
            </Button>
          </PopoverContent>
        </Popover>
      ) : (
        <></>
      )}
    </>
  );
};

function getNilString(a: string | null | undefined): string | undefined {
  if (a === null || a === undefined) {
    return undefined;
  }
  return a;
}
