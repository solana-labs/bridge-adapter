import type {
  Commitment,
  Connection,
  SendOptions,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";

export async function submitSolanaTransaction(
  signedTransaction: Transaction | VersionedTransaction,
  connection: Connection,
  sendOptions?: SendOptions,
  commitment?: Commitment,
) {
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();

  const signature = await connection.sendRawTransaction(
    signedTransaction.serialize(),
    sendOptions,
  );
  const response = await connection.confirmTransaction(
    {
      blockhash,
      lastValidBlockHeight,
      signature,
    },
    commitment,
  );
  return { signature, response };
}
