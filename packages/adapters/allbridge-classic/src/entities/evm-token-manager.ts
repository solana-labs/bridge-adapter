import { IEvmHttpClient } from "./evm-http-client";

interface IEvmTokenManager<_A extends IEvmHttpClient> {
  lock(
    lockId: string,
    address: string,
    recipient: string,
    destination: string,
    amount: string,
  ): unknown;
  lockBase(
    lockId: string,
    wrappedAddress: string,
    recipient: string,
    destination: string,
  ): unknown;
}

export class EvmTokenManager implements IEvmTokenManager<IEvmHttpClient> {
  private client: IEvmHttpClient;

  constructor(client: IEvmHttpClient) {
    this.client = client;
  }

  public async lock() {}

  public async lockBase() {}
}
