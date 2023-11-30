declare module "web3/dist/web3.min.js" {
  export default class Web3 {
    constructor();
    constructor(provider: unknown);
    constructor(provider: unknown, net: unknown);
    eth: NonNullable<unknown>;
  }
}
