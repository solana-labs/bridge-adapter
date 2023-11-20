type LockArgs = {
  amount: number;
  destination: string;
  lockId: string;
  recipientAddress: string;
};

type UnlockArgs = {
  lockId: number;
  lockSource: string;
  amount: number;
  tokenSource: string;
  tokenSourceAddress: string;
  secpInstructionIndex?: number;
};

interface ISolanaTokenManager {
  lock(args: LockArgs): unknown;
  unlock(args: UnlockArgs): unknown;
}

export class SolanaTokenManager implements ISolanaTokenManager {
  public async lock(args: LockArgs): Promise<unknown> {
    return;
  }

  public async unlock(args: UnlockArgs): Promise<unknown> {
    return;
  }
}
