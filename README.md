# Bridge Adapter

The following is for existing bridge developer or DEX who wish to integrate with the SDK.

## Bridge Developer

The bridge adapter provides information on:

- Supported chains
- Supported tokens
- A way to get a swap route between two asset on similar or different chains
- A way to instantiate the bridging process while having insights on what's happening

Here's a minimal interface that's needed in order to add support for your bridge

```typescript
export abstract class AbstractBridgeAdapter {
  constructor({ sourceChain, targetChain, settings }: BridgeAdapterArgs) {
    this.sourceChain = sourceChain;
    this.targetChain = targetChain;
    this.settings = settings;
  }

  abstract name(): Bridges;

  abstract getSupportedChains(): Promise<ChainName[]>;

  abstract getSupportedTokens(
    interestedTokenList: ChainDestType,
    chains?: Partial<ChainSourceAndTarget>,
    tokens?: { sourceToken: Token; targetToken: Token },
  ): Promise<Token[]>;

  abstract getSwapDetails(
    sourceToken: Token,
    targetToken: Token,
  ): Promise<SwapInformation>;

  abstract bridge({
    onStatusUpdate,
    sourceAccount,
    targetAccount,
    swapInformation,
  }: {
    swapInformation: SwapInformation;
    sourceAccount: SolanaOrEvmAccount;
    targetAccount: SolanaOrEvmAccount;
    onStatusUpdate: (args: BridgeStatus) => void;
  }): Promise<boolean>;
}
```

## Local development

To start developing, you may use these:

- `pnpm demo`. The demo application will be served on a local system.
- `pnpm playground`. It will run a sandbox powered by Storybook and build all the needed packages in the watch mode (see the `playground` script at the root package. Those scripts might be used separately for human-friendly logging).
- `pnpm dev`. It will build all the packages in watch mode.

### Building

Run `pnpm build` to confirm compilation is working correctly. You should see a folder `dist` which contains the compiled output.

```bash
core
└── dist
    ├── index.d.ts  <-- Types
    ├── index.js    <-- CommonJS version
    └── index.mjs   <-- ES Modules version
```

### Versioning & Publishing Packages

This repo uses [Changesets](https://github.com/changesets/changesets) to manage versions, create changelogs, and publish to npm.

<!-- TODO: install the [Changesets bot](https://github.com/apps/changeset-bot) on the repository. -->

#### Generating the Changelog

To generate your changelog, run `pnpm changeset` locally:

1. **Which packages would you like to include?** – This shows which packages and changed and which have remained the same. By default, no packages are included. Press `space` to select the packages you want to include in the `changeset`.
1. **Which packages should have a major bump?** – Press `space` to select the packages you want to bump versions for.
1. If doing the first major version, confirm you want to release.
1. Write a summary for the changes.
1. Confirm the changeset looks as expected.
1. A new Markdown file will be created in the `changeset` folder with the summary and a list of the packages included.

#### Releasing

When you push your code to GitHub, the [GitHub Action](https://github.com/changesets/action) will run the `release` script defined in the root `package.json`:

```bash
turbo run build && changeset publish
```

Turborepo runs the `build` script for all publishable packages (excluding demo and shared packages) and publishes the packages to npm.
