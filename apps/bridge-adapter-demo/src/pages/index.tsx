"use client";
import "@solana/bridge-adapter-react-ui/index.css";
import {
  BridgeAdapterProvider,
  EvmWalletProvider,
  SolanaWalletProvider,
} from "@solana/bridge-adapter-react";
import * as React from "react";
import {
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { BridgeAdapter } from "@solana/bridge-adapter-react-ui";
import { DeBridgeBridgeAdapter } from "@solana/bridge-adapter-debridge-adapter/esm";
import { WormholeBridgeAdapter } from "@solana/bridge-adapter-wormhole-adapter/esm";

const solanaRpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

export default function Home({
  title = "Bridge Adapter Demo",
}: {
  title: string;
}) {
  if (!walletConnectProjectId || walletConnectProjectId.length === 0) {
    throw new Error("Define `walletConnectProjectId`");
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const wallets = React.useMemo(
    () =>
      typeof globalThis.window === "undefined"
        ? []
        : [new SolflareWalletAdapter(), new CoinbaseWalletAdapter()],
    [],
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const evmSettings = React.useMemo(
    () => ({
      coinbaseWalletSettings: {
        appName: title ?? "",
      },
      walletConnectProjectId,
    }),
    [title],
  );

  const adapters = React.useMemo(
    () => [DeBridgeBridgeAdapter, WormholeBridgeAdapter],
    [],
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error, setError] = React.useState<Error | undefined>();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        </style>
      </Head>
      <main className={`${styles.main}`}>
        <SolanaWalletProvider
          autoConnect={false}
          onError={(e: Error) => setError(e)}
          wallets={wallets}
        >
          <EvmWalletProvider
            coinbaseWalletSettings={evmSettings.coinbaseWalletSettings}
            walletConnectProjectId={evmSettings.walletConnectProjectId}
          >
            <BridgeAdapterProvider
              adapters={adapters}
              error={error}
              settings={{
                solana: { solanaRpcUrl },
              }}
            >
              <BridgeAdapter className={styles.inner} title={title} />
            </BridgeAdapterProvider>
          </EvmWalletProvider>
        </SolanaWalletProvider>
      </main>
    </>
  );
}
