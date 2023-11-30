import Web3 from "web3";
import { Account, TransactionConfig, Transaction } from "web3-core";

export async function sendRawTransaction(
  web3: Web3,
  rawTransaction: TransactionConfig,
) {
  if (rawTransaction.from === undefined) {
    throw Error("rawTransaction.from is undefined");
  }
  // @ts-expect-error allow to cast Tx
  const gasLimit = await web3.eth.estimateGas(rawTransaction as Transaction);
  // @ts-expect-error allow
  const account: Account = web3.eth.accounts.wallet[rawTransaction.from];
  console.log(web3, { account }, rawTransaction)
  if (!account) throw new Error("Wallet not found");
  const signedTx = await account.signTransaction({
    ...rawTransaction,
    // @ts-expect-error allow
    gas: gasLimit,
  });
  if (signedTx.rawTransaction === undefined) {
    throw Error("signedTx.rawTransaction is undefined");
  }
  console.log("Sending transaction", signedTx.transactionHash);
  return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}
