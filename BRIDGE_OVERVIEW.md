# Bridge Adapter Design Document

This document covers the existing bridges available and how this package attempts to unify the various bridges out there into a unified interface that is easily extensible while still providing a great developer experience.

## Bridges

### Limitations

- Currently only on Avax and Eth.
- Stable bridges: DeBridge, Wormhole.

- TODO:
  - [x] Mayan
  - [] CCTP
  - [] AllBridge

## API overview

Developers interact directly with a high level BridgeSdk that abstracts away the underlying implementation for the various bridge implementation.

### Goals

- Developer can allow users to easily bridge assets from one chain to another within their app
- Developers can easily get users to pay them from tokens on other chain while still receiving the expected assets on the target chain
- Great DX for developers. Interruptions should be handled. Errors should be graceful and human readable.

### End User vanilla JS SDK usage details

```typescript
const sdk = new BridgeAdapterSdk({
  sourceChain: "",
  targetChain: "",
});
```

### End User React SDK Usage

This will render a component that will provide all the bridging functionality that users would need to bridge funds natively within the developers dApp.

```typescript
export function Page() {
  return (
    <SolanaWalletProvider wallets={[/* desired wallets */]}>
      <EvmWalletProvider coinbaseWalletSettings={{}} walletConnectProjectId="">
        <BridgeAdapterProvider settings={{/* adapter settings */}}>
          <BridgeAdapter title="" theme=""/>
        <BridgeAdapterProvider>
      <EvmWalletProvider>
    <SolanaWalletProvider>
  );
}

// OR

export function Page() {
  return (
    <SolanaWalletProvider wallets={[/* desired wallets */]}>
      <EvmWalletProvider coinbaseWalletSettings={{}} walletConnectProjectId="">
        <BridgeAdapterProvider settings={{/* adapter settings */}}>
          <BridgeAdapterDialog title="" theme="">
            <button>Open Dialog</button>
          </BridgeAdapterDialog>
        <BridgeAdapterProvider>
      <EvmWalletProvider>
    <SolanaWalletProvider>
  );
}
```
