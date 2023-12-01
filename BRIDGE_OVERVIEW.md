# Bridge Adapter Design Document

## Overview

The unified bridge adapter SDK solves the challenge of having an increasing number of chains and growing liquidity fragmentation in two ways. By leveraging existing bridge infrastructure to go cross-chain, and by leveraging existing DEXes to increase the total pool of tokens that can be used with these bridge infrastructure.

### Unifying Existing Bridges

The unified bridge adapter SDK provides a unified framework for interacting with all the various bridges out there. Instead of having to integrate each bridge 1 by 1, a developer simply needs to integrate this sdk to get the benefit of integrating multiple bridges.

### Leveraging Existing Decentralzed Exchanges (DEXes)

While leveraging various existing bridges allows us to move more seamlessly between chains, we also leverage existing DEXes to increase the total pool of tokens that can be taken cross chain.
Developers simply integrate a single SDK and get the combined benefits of the existing bridges and DEXes that exists today.

## Features

This section covers the existing bridges available and how this package attempts to unify the various bridges out there into a unified interface that is easily extensible while still providing a great developer experience.

### Chains

As of today, this bridge supports swapping and bridging tokens between 7 chains. Your Mileage might vary depending on which bridges you want to use.

- Ethereum
- Polygon
- Solana
- Arbitrum
- Optimism
- Binance Smart Chain
- Avalanche

### Bridges

The SDK supports 3 bridges out of the box. You can choose any of them.

- Wormhole
- DeBridge
- Mayan Finance
- Allbridge Core (WIP)

#### Limitations

Currently only on Avax and Eth.

### Supported DEXes

The SDK supports 4 DEXes out of the box that is integrated with the various bridges.

Unfortunately, there is no way to select speicifc DEXes to use right now. The SDK will automatically select the best DEX to use based on the token pair and the amount being swapped.

- Paraswap (EVM)
- 1inch (EVM)
- Jupiter (Solana)
- Prism (Solana)

## Terminology

This section goes over some quick basic terminology that might be usefull.

### Source and Target

Source refers to what the user starts on. We use terms like source token, source chain etc. freely
Target refers to where the user wants to end up in. We use terms like target token, target chain etc. freely
Note that Source and Target might well be the same chain or token.

### Accounts and Wallets and Signers

All these refers to an owner who has the ability to sign for a transaction. For the most part we use terms like source account, target account etc. freely.
Due to the proliferation of various packages in the space, we might inevitably refer to these accounts as wallets or signers, but know that they are referring to the same thing unless explicitly stated otherwise.

## API overview

Developers interact directly with a high level BridgeSdk that abstracts away the underlying implementation for the various bridge implementation.

### Goals

- Developer can allow users to easily bridge assets from one chain to another within their app
- Developers can easily get users to pay them from tokens on other chain while still receiving the expected assets on the target chain
- Great DX for developers. Interruptions should be handled. Errors should be graceful and human readable.

### React SDK

The react package allows you to easily integrate the core BridgeAdapterSdk into your React application with a UI.

#### Installation

```bash
pnpm add @solana/bridge-adapter-debridge-adapter
pnpm add @solana/bridge-adapter-wormhole-adapter
pnpm add @solana/bridge-adapter-react
pnpm add @solana/bridge-adapter-react-ui
```

#### Initializing the SDK

Once you install the SDK, you can integrate it into your code like so:

```typescript
"use client";
import "@solana/bridge-adapter-react-ui/index.css";
import {
  BridgeAdapterProvider,
  EvmWalletProvider,
  SolanaWalletProvider,
} from "@solana/bridge-adapter-react";
import { BridgeAdapter } from "@solana/bridge-adapter-react-ui";
import { DeBridgeBridgeAdapter } from "@solana/bridge-adapter-debridge-adapter/esm";
import { WormholeBridgeAdapter } from "@solana/bridge-adapter-wormhole-adapter/esm";

export function HomePage() {
  return (
    <SolanaWalletProvider wallets={[/* list of desired wallets */]}>
      <EvmWalletProvider
        coinbaseWalletSettings={/* settings */}
        walletConnectProjectId={/* walletConnect id */}
      >
        <BridgeAdapterProvider
          adapters={[/* needed bridges, for ex.: */ DeBridgeBridgeAdapter, WormholeBridgeAdapter]}
        >
          <BridgeAdapter title="Bridge Adapter" />
        </BridgeAdapterProvider>
      </EvmWalletProvider>
    </SolanaWalletProvider>
  );
}
```

For more details on the respective components, see theirs sources or try the demo application at `/apps`.

#### Integrating with `wagmi`

The only thing you have to do when integrating with `wagmi` is to omit the `EvmWalletProvider`. This is because in using `wagmi`, you already wrap your app in a wagmi client which is what `EvmWalletProvider` uses under the hood.

#### Inegrating with @solana/wallet-adapter-react

Similarly, for integrating with `@solana/wallet-adapter-react`, you have to omit the `SolanaWalletProvider`. This is because in using `@solana/wallet-adapter-react` you already wrap your app in a `WalletProvider` which is what `SolanaWalletProvider` uses under the hood.

#### API

##### Bridge Adapter Dialog

The `BridgeAdapterDialog` forms the core of the React SDK. It attaches an `onClick` handler to a child element that is responsible for opening the modal when clicked.

Note: You might also integrate the SDK to you app without the dialog component. See the example at `react-ui` stories.

```tsx
import { BridgeAdapterDialog } from "@solana/bridge-adapter-react-ui";
// Note that you have to import this wherever you import your global css stylesheet
// put this before your own stylesheet in case you want to override certain variables
import "@solana/bridge-adapter-react-ui/index.css";

<BridgeAdapterDialog theme="dark">
  <Button>Open</Button>
</BridgeAdapterDialog>;
```

###### Advance styling

If you want more than the light and dark theme included, you can easilyl override the given style with your own.

Below are the following variables that you can override. The values in HSL format are the current default for `light` mode.

To override the dark mode theme, simply wrap the variables in the `bsa-dark` selector.

```css
--bsa-background: 224 71% 4%;
--bsa-foreground: 213 31% 91%;

--bsa-muted: 223 47% 11%;
--bsa-muted-foreground: 215.4 16.3% 56.9%;

--bsa-accent: 216 34% 17%;
--bsa-accent-foreground: 210 40% 98%;

--bsa-popover: 224 71% 4%;
--bsa-popover-foreground: 215 20.2% 65.1%;

--bsa-border: 216 34% 17%;
--bsa-input: 216 34% 17%;

--bsa-card: 224 71% 4%;
--bsa-card-foreground: 213 31% 91%;

--bsa-primary: 210 40% 98%;
--bsa-primary-foreground: 222.2 47.4% 1.2%;

--bsa-secondary: 222.2 47.4% 11.2%;
--bsa-secondary-foreground: 210 40% 98%;

--bsa-destructive: 0 63% 31%;
--bsa-destructive-foreground: 210 40% 98%;

--bsa-ring: 216 34% 17%;
```


##### `BridgeAdapterProvider`

The `BridgeAdapterProvider` is used to hold the values that would be used to instantiate the underlying `BridgeSdk`.

###### Usage

```tsx
import { BridgeAdapterProvider } from "@solana/bridge-adapter-react";

<BridgeAdapterProvider
  adapters=[/* desired bridge adapters */]
  settings={{
    evm: {
      alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "",
      infuraApiKey: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID ?? "",
    },
    solana: {
      solanaRpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "",
    },
  }}
  sourceChain="Ethereum"
  targetChain="Solana"
>
  <BridgeAdapterDialog>
    <Button>Open</Button>
  </BridgeAdapterDialog>
</BridgeAdapterProvider;
```

##### `EvmWalletProvider`

This provider is only needed if your app does not currently use [`wagmi`](https://wagmi.sh/) already.

###### Usage

```tsx
import { EvmWalletProvider } from "@solana/bridge-adapter-react";

<EvmWalletProvider
  coinbaseWalletSettings={{
    appName: "Example Defi Dapp",
  }}
  walletConnectProjectId={process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? ""}
>
  <BridgeAdapterProvider>
    <BridgeAdapterDialog>
      <Button>Open</Button>
    </BridgeAdapterDialog>
  </BridgeAdapterProvider>
</EvmWalletProvider>;
```

##### `SolanaWalletProvider`

This provider is only needed if your app does not currently use [`@solana/wallet-adapter-react`](https://github.com/solana-labs/wallet-adapter) already.

###### Usage

```tsx
import { SolanaWalletProvider } from "@solana/bridge-adapter-react";

<SolanaWalletProvider wallets={adapters} autoConnect={false}>
  <BridgeAdapterProvider>
    <BridgeAdapterDialog>
      <Button>Open</Button>
    </BridgeAdapterDialog>
  </BridgeAdapterProvider>
</SolanaWalletProvider>;
```

###### Configurations

See more details about the props to the `SolanaWalletProvider`. See the props pass into the `WalletProvider` [here](https://github.com/solana-labs/wallet-adapter/blob/master/APP.md).

For convinience, here is the interface:

```typescript
interface SolanaWalletProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
  localStorageKey?: string;
  onError?: (error: WalletError, adapter?: Adapter) => void;
  wallets?: Adapter[];
  rpcUrl?: string;
}
```

### End User vanilla JS SDK usage details

#### Get Started

To get started, grab the vanilla Javascript NPM package
```bash
pnpm add @solana/bridge-adapter-base
```

Once you install the SDK, you can instantiate the SDK and begin using it like so:

```typescript
import { BridgeAdapterSdk } from "@solana/bridge-adapter-base";
 
const sdk = new BridgeAdapterSdk({
  sourceChain: "",
  targetChain: "",
});
 
const chains = await sdk.getSupportedChains(); // ['Ethereum', 'Avalanche', 'Solana', ...]
 
// contrived for the example
const sourceChain = 'Ethereum';
const targetChain = 'Solana';
 
const supportedSourceTokens = await sdk.getSupportedTokens("source", {
  sourceChain,
});
const supportedTargetTokens = await sdk.getSupportedTokens("target", {
  targetChain,
});
 
// contrived for the example
const tokenToSwapFrom = supportedSourceTokens[0];
const tokenToSwapTo = supportedTargetTokens[0];
 
const swapRoutes = await sdk.getSwapInformation({
    ...tokenToSwapFrom,
    // contrived
    selectedAmountInBaseUnits: "1000000";
    selectedAmountFormatted: "1";
  },
  tokenToSwapTo
);
 
const isSuccess = sdk.bridge({
  sourceAccount: walletClientFromViemSomehow,
  targetAccount: {
    signTransaction(transaction) => {
      // sign the transaction and return the signed transaction
    },
    publicKey: new PublicKey("") // public key of the account that signed the transaction
  },
  swapRoutes[0],
  onStatusUpdate(update) {
    console.log(update)
  },
});
```

#### Bridge Adapter SDK usage

##### Getting supported chains

This function returns the list of chains supported by all the bridges that is being used under the hood.

###### Usage

```typescript
const chains = await sdk.getSupportedChains(); // ['Ethereum', 'Avalanche', 'Solana', ...]
```

###### Currently supported chains

The `chains` variable returned is of type `ChainName[]`, which correspond to one of the following chain names:

```typescript
export const CHAIN_NAMES = [
    "Ethereum",
    "Solana",
    "Polygon",
    "Avalanche",
    "Arbitrum",
    "Optimism",
"BSC",
] as const;

export type ChainName = typeof CHAIN_NAMES[number];
```

##### Getting supported tokens

This function returns the list of tokens that is available for swapping and bridging across all the bridges and DEXes.

###### Usage

```typescript
// getting tokens to swap from
const sourceTokens = await sdk.getSupportedTokens(
  "source",
  {
    sourceChain,
    targetChain, //optional
  },
  // this is optional
  {
    sourceToken,
    targetToken,
  }
);
console.log("sourceTokens", sourceTokens);

// getting tokens to swap to
const targetTokens = await sdk.getSupportedTokens(
  "target",
  {
    sourceChain, //optional
    targetChain,
  },
  // this is optional
  {
    sourceToken,
    targetToken,
  }
);
console.log("targetTokens", targetTokens);
```

###### Return Type

The return type is an array of `Token` objects. The `Token` object is defined as follows:

```typescript
export type Token = {
  logoUri: string;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  chain: ChainName;
  bridgeNames: Bridges[];
};
```

##### Getting the routes for a source-target token pair

###### Usage

```typescript
const swapRoutes = await sdk.getSwapInformation({
    ...sourceToken,
    // contrived
    selectedAmountInBaseUnits: "1000000";
    selectedAmountFormatted: "1";
  },
  targetToken
);

console.log("swapRoutes", swapRoutes);
```

###### Return Type

```typescript
// Note the various token types all have the expected info, such as decimals, symbol, names etc.
// They vary only in the extra params that is specific to the token type.
export type SwapInformation = {
  sourceToken: TokenWithAmount;
  targetToken: TokenWithExpectedOutput;
  bridgeName: string;
  tradeDetails: {
    fee: FeeToken[];
    priceImpact: number;
    estimatedTimeMinutes: number;
    routeInformation: {
      fromTokenSymbol: string;
      toTokenSymbol: string;
    }[];
  };
};
```

##### Bridging or Swapping the Assets

This function will take in a `SwapInformation` after you chose the route and initiate the bridging of the assets. It will return `true` if the bridging was successful. If it was not successful, this function _will throw_ and you can see the error in the console.

###### Usage

```typescript
const isSuccess = sdk.bridge({
  sourceAccount,
  targetAccount,
  swapsInformation[0], // this is from sdk.getSwapInformation above
  onStatusUpdate,
});

console.log("isSuccess", isSuccess);
```
