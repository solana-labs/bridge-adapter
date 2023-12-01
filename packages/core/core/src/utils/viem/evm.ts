import type { PublicClient } from "viem";
import type { Hash } from "viem";

export async function getBalanceForToken(
  tokenAddress: string,
  userAddress: string,
  client: PublicClient,
) {
  const data = await client.readContract({
    abi: [
      {
        inputs: [{ name: "owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    address: tokenAddress as Hash,
    functionName: "balanceOf",
    args: [userAddress as Hash],
  });
  return data;
}

export async function getAllowanceForToken(
  tokenAddress: string,
  userAddress: string,
  spenderAddress: string,
  client: PublicClient,
) {
  const data = await client.readContract({
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: "_owner",
            type: "address",
          },
          {
            name: "_spender",
            type: "address",
          },
        ],
        name: "allowance",
        outputs: [
          {
            name: "",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    address: tokenAddress as Hash,
    functionName: "allowance",
    args: [userAddress as Hash, spenderAddress as Hash],
  });
  return data;
}

export function isNativeEvmCoin(address: string) {
  return (
    address === "0x0000000000000000000000000000000000000000" ||
    address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  );
}
