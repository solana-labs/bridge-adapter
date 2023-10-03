import type { PublicKey } from "@solana/web3.js";
import type { Wallet } from "@solana/wallet-adapter-react";
import type { WalletName } from "@solana/wallet-adapter-base";
import { useCallback } from "react";
import { useSolanaWallet } from "@solana/bridge-adapter-react";

type ButtonState = {
  buttonState:
    | "connecting"
    | "connected"
    | "disconnecting"
    | "has-wallet"
    | "no-wallet";
  onConnect?: () => void;
  onDisconnect?: () => void;
  onSelectWallet: (walletName: WalletName | null) => void;
  wallets: Wallet[];
  publicKey?: PublicKey;
  walletIcon?: Wallet["adapter"]["icon"];
  walletName?: Wallet["adapter"]["name"];
};

export function useSolanaWalletMultiButton(): ButtonState {
  const {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    connect,
    connected,
    connecting,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    disconnect,
    disconnecting,
    publicKey,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    select,
    wallet,
    wallets,
  } = useSolanaWallet();

  let buttonState: ButtonState["buttonState"];
  if (connecting) {
    buttonState = "connecting";
  } else if (connected) {
    buttonState = "connected";
  } else if (disconnecting) {
    buttonState = "disconnecting";
  } else if (wallet) {
    buttonState = "has-wallet";
  } else {
    buttonState = "no-wallet";
  }
  const handleConnect = useCallback(() => {
    connect().catch(() => {
      // Silently catch because any errors are caught by the context `onError` handler
    });
  }, [connect]);

  const handleDisconnect = useCallback(() => {
    disconnect().catch(() => {
      // Silently catch because any errors are caught by the context `onError` handler
    });
  }, [disconnect]);

  return {
    buttonState,
    onConnect: buttonState === "has-wallet" ? handleConnect : undefined,
    onDisconnect:
      buttonState !== "disconnecting" && buttonState !== "no-wallet"
        ? handleDisconnect
        : undefined,
    onSelectWallet: select,
    wallets,
    publicKey: publicKey ?? undefined,
    walletIcon: wallet?.adapter.icon,
    walletName: wallet?.adapter.name,
  };
}
