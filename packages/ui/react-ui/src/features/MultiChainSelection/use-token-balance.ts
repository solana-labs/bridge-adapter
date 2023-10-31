import type { Token } from "@solana/bridge-adapter-base";
import type { Hash } from "viem";
import Debug from "debug";
import {
  chainNameToViemChain,
  formatTokenBalance,
} from "@solana/bridge-adapter-base";
import { Connection, PublicKey } from "@solana/web3.js";
import { createPublicClient, formatUnits, http, parseAbi } from "viem";
import { NATIVE_MINT } from "@solana/spl-token";
import { object, parse, string } from "valibot";
import { solanaRpcUrl } from "../../env";
import { useQuery } from "@tanstack/react-query";
import {
  useEthereumWallet,
  useSolanaWallet,
} from "@solana/bridge-adapter-react";

const debug = Debug("debug:react-ui:useTokenBalance");

export function useTokenBalance(token: Token) {
  const { data: walletClient } = useEthereumWallet();
  const { publicKey } = useSolanaWallet();
  const {
    data: tokenBalance,
    isInitialLoading: isTokenBalanceLoading,
    error,
  } = useQuery({
    queryFn: async () => {
      // no token selected yet
      if (!token.address) {
        return "0";
      }

      if (token.chain === "Solana") {
        if (!publicKey) {
          // no wallet connected yet on solana
          return "0";
        }

        if (!solanaRpcUrl) {
          debug("Solana RPC node address is absent");
          return "0";
        }

        const connection = new Connection(solanaRpcUrl, "confirmed");

        if (NATIVE_MINT.equals(new PublicKey(token.address))) {
          const balance = await connection.getBalance(publicKey);
          const DECIMALS = 9;
          const amount = balance / Math.pow(10, DECIMALS);

          return amount.toFixed(DECIMALS);
        } else {
          // Get the initial solana token balance
          const results = await connection.getParsedTokenAccountsByOwner(
            publicKey,
            { mint: new PublicKey(token.address) },
          );

          for (const item of results.value) {
            const tokenInfoSchema = object({
              data: object({
                parsed: object({
                  info: object({
                    mint: string(),
                    tokenAmount: object({ uiAmountString: string() }),
                  }),
                }),
              }),
            });
            const tokenInfo = parse(tokenInfoSchema, item.account).data.parsed
              .info;
            const address = tokenInfo.mint;
            const amount = tokenInfo.tokenAmount.uiAmountString;
            if (address === token.address) {
              return amount;
            }
          }
        }
        return "0";
      } else {
        if (!walletClient?.transport || !walletClient?.account.address) {
          // no wallet connected yet on evm
          return "0";
        }
        if (!token.address.startsWith("0x")) {
          throw new Error(`Invalid token address ${token.address}`);
        }
        const publicClient = createPublicClient({
          transport: http(),
          chain: chainNameToViemChain(token.chain),
        });

        const byteCode = await publicClient.getBytecode({
          address: token.address as Hash,
        });
        if (byteCode) {
          const userBalannce = await publicClient.readContract({
            address: token.address as Hash,
            abi: parseAbi([
              "function balanceOf(address owner) view returns (uint256)",
            ]),
            functionName: "balanceOf",
            args: [walletClient?.account.address],
          });
          console.log("userBalannce token", userBalannce);
          return formatTokenBalance(formatUnits(userBalannce, token.decimals));
        } else {
          const userBalannce = await publicClient.getBalance({
            address: walletClient?.account.address,
          });
          console.log("userBalannce coin", userBalannce);
          return formatTokenBalance(formatUnits(userBalannce, token.decimals));
        }
      }
    },
    queryKey: [
      "getTokenBalance",
      token.address,
      token.chain,
      walletClient?.account.address,
    ],
  });

  return { tokenBalance, isTokenBalanceLoading, error };
}
