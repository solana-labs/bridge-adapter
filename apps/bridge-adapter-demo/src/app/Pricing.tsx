"use client";

import {
  BridgeModal,
  BridgeModalProvider,
  EvmWalletProvider,
  SolanaWalletProvider,
} from "@elasticbottle/react-bridge-adapter-sdk";

import {
  CoinbaseWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useMemo } from "react";

export default function Pricing() {
  const products = [
    {
      prices: "25",
      id: "Hobby",
      name: "Hobby",
      description: "All the basics for starting a new hobby",
    },
    {
      prices: "50",
      id: "Freelancer",
      name: "Freelancer",
      description: "All the basics for starting a new business",
    },
    {
      prices: "60",
      id: "Startup",
      name: "Startup",
      description: "All the basics for starting a new business",
    },
  ];

  const adapters = useMemo(
    () =>
      typeof window === "undefined"
        ? [] // No wallet adapters when server-side rendering.
        : [
            new SolflareWalletAdapter(),
            new PhantomWalletAdapter(),
            new CoinbaseWalletAdapter(),
          ],
    []
  );

  return (
    <section className="bg-black">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Pricing Plans
          </h1>
          <p className="m-auto mt-5 max-w-2xl text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Start building for free, then add a site plan to go live. Account
            plans unlock additional features.
          </p>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-3">
          {products.map((product) => {
            return (
              <div
                key={product.id}
                className={cn(
                  "divide-y divide-zinc-600 rounded-lg bg-zinc-900 shadow-sm",
                  {
                    "border border-pink-500": product.name === "Freelancer",
                  }
                )}
              >
                <div className="flex h-full flex-col justify-between p-6">
                  <div>
                    <h2 className="text-2xl font-semibold leading-6 text-white">
                      {product.name}
                    </h2>
                    <p className="mt-4 text-zinc-300">{product.description}</p>
                  </div>
                  <div>
                    <p className="mt-8">
                      <span className="white text-5xl font-extrabold">
                        {`$${product.prices}`}
                      </span>
                      <span className="text-base font-medium text-zinc-100">
                        /month
                      </span>
                    </p>
                    <SolanaWalletProvider
                      wallets={adapters}
                      autoConnect={false}
                    >
                      <EvmWalletProvider
                        settings={{
                          coinbaseWalletSettings: {
                            appName: "Example Defi Dapp",
                          },
                          walletConnectProjectId:
                            process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ??
                            "",
                        }}
                      >
                        <BridgeModalProvider>
                          <BridgeModal
                            customization={{
                              theme: "dark",
                              modalTitle: "Defi Dapp",
                            }}
                          >
                            <Button
                              size="sm"
                              type="button"
                              className="mt-8 w-full hover:bg-zinc-400"
                            >
                              Subscribe
                            </Button>
                          </BridgeModal>
                        </BridgeModalProvider>
                      </EvmWalletProvider>
                    </SolanaWalletProvider>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <LogoCloud />
      </div>
    </section>
  );
}

function LogoCloud() {
  return (
    <div>
      <p className="mt-24 text-center text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">
        Brought to you by
      </p>
      <div className="my-12 flex flex-col items-center space-y-4 sm:mt-8 sm:grid sm:grid-cols-5 sm:gap-6 sm:space-y-0 md:mx-auto md:max-w-2xl">
        <div className="flex items-center justify-start">
          <a href="https://nextjs.org" aria-label="Next.js Link">
            <Image
              src="/next.svg"
              alt="Next.js Logo"
              className="h-12 text-white"
              width={400}
              height={200}
            />
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://vercel.com" aria-label="Vercel.com Link">
            <Image
              src="/vercel.svg"
              alt="Vercel.com Logo"
              className="h-6 text-white"
              width={400}
              height={200}
            />
          </a>
        </div>

        <div className="flex items-center justify-start">
          <a href="https://supabase.io" aria-label="supabase.io Link">
            <Image
              src="/supabase.svg"
              alt="supabase.io Logo"
              className="h-10 text-white"
              width={400}
              height={200}
            />
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://github.com" aria-label="github.com Link">
            <Image
              src="/github.svg"
              alt="github.com Logo"
              className="h-8 text-white"
              width={400}
              height={200}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
