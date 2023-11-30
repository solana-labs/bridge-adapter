import type { WalletClient } from "viem";
//import Web3 from "web3/dist/web3.min.js";

/**
 * Create the Web3 client instance for Ethereum
 *
 * @returns {Web3} Ethereum client
 */
export function createWeb3ClientFromWallet(account: WalletClient) {
  const { chain } = account;

  // TODO
  // - [ ] Allow to use not only the default RPC URL
  const currentRpcUrl = chain?.rpcUrls.default.http[0];

  console.log({ currentRpcUrl }, chain?.rpcUrls);

  if (!currentRpcUrl) throw new Error("Can not instantiate a Web3 client");

  return null;

  //return new Web3(currentRpcUrl);
}
