import Debug from "debug";
import type { BridgeAdapterSdkArgs } from "@solana/bridge-adapter-base";
import type {
  ChainDestType,
  SwapInformation,
  TokenWithAmount,
} from "@solana/bridge-adapter-core";
import { BridgeAdapterSdk } from "@solana/bridge-adapter-base";
import { parseUnits } from "viem";
import type { StoreApi, UseBoundStore } from "zustand";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  BridgeStep,
  BridgeStepParams,
  ChainSelectionType,
  RelayerFeeType,
  SetCurrentBridgeStepType,
  SlippageToleranceType,
} from "../types/bridge-adapter";

const debug = Debug("debug:react:context");

export const DEFAULT_TOKEN_WITH_AMOUNT: TokenWithAmount = {
  address: "",
  selectedAmountFormatted: "",
  selectedAmountInBaseUnits: "",
  chain: "Ethereum",
  decimals: 18,
  logoUri: "",
  name: "",
  symbol: "",
  bridgeNames: [],
};

type BridgeModalState = {
  sdk: BridgeAdapterSdk;
  previousBridgeStep: BridgeStep[];
  previousBridgeStepParams: BridgeStepParams<BridgeStep>[];
  currentBridgeStep: BridgeStep;
  currentBridgeStepParams: BridgeStepParams<BridgeStep>;
  chain: {
    sourceChain: ChainSelectionType;
    targetChain: ChainSelectionType;
  };
  token: { sourceToken: TokenWithAmount; targetToken: TokenWithAmount };
  swapInformation: SwapInformation | undefined;
  relayerFee: RelayerFeeType;
  slippageTolerance: SlippageToleranceType;
};

type SetChain = {
  newChain: ChainSelectionType;
  chainDestination: ChainDestType;
};

type BridgeModalActions = {
  setSdkSettings: (args: BridgeAdapterSdkArgs) => void;
  setCurrentBridgeStep: <T extends BridgeStep>(
    args: SetCurrentBridgeStepType<T>,
  ) => void;
  setChain: (args: SetChain) => Promise<void>;
  setToken: (token: TokenWithAmount, chainDest: ChainDestType) => Promise<void>;
  setTokenAmount: (amount: string, chainDest: ChainDestType) => void;
  setSwapInformation: (swapInformation: SwapInformation) => void;
  goBackOneStep: () => void;
  setSlippageTolerance: (slippageTolerance: SlippageToleranceType) => void;
  setRelayerFee: (relayerFee: RelayerFeeType) => void;
  resetBridgeModalStore: () => void;
};

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

function createSelectors<S extends UseBoundStore<StoreApi<object>>>(_store: S) {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
}

const DEFAULT_BRIDGE_ADAPTER_STATE = {
  sdk: new BridgeAdapterSdk(),
  previousBridgeStep: [],
  currentBridgeStep: "MULTI_CHAIN_SELECTION",
  previousBridgeStepParams: [],
  currentBridgeStepParams: undefined,
  chain: {
    sourceChain: "Select a chain",
    targetChain: "Select a chain",
  },
  token: {
    sourceToken: DEFAULT_TOKEN_WITH_AMOUNT,
    targetToken: { ...DEFAULT_TOKEN_WITH_AMOUNT, chain: "Solana" },
  },
  swapInformation: undefined,
  relayerFee: {
    active: false,
    sourceFee: 0,
    targetFee: 0,
  },
  slippageTolerance: "auto",
} satisfies BridgeModalState;

const useBridgeModalStoreBase = create<BridgeModalState>()(
  devtools(
    immer<BridgeModalState>(() => {
      return DEFAULT_BRIDGE_ADAPTER_STATE;
    }),
  ),
);

export const useBridgeModalStore = createSelectors(useBridgeModalStoreBase);

/** ACTIONS */
export const setCurrentBridgeStep: BridgeModalActions["setCurrentBridgeStep"] =
  (args) => {
    useBridgeModalStore.setState((state) => {
      debug("%O Step;", state.currentBridgeStep, "Params:", {
        ...state.currentBridgeStepParams,
      });
      state.previousBridgeStep.push(state.currentBridgeStep);
      state.previousBridgeStepParams.push(state.currentBridgeStepParams);
      debug("%O Prevoius Step;", { ...state.previousBridgeStep }, "Params:", {
        ...state.previousBridgeStepParams,
      });

      /**
       *  Change the original logic as there are couple of problems:
       *  [] 1. Pushing parameters to the previous step leads to the memory leaking
       *  [x] 2. `WALLET_SELECTION` screen do not allow to return to the first screen
       *    as it "redirects" to itself with different parameters
       */
      if (state.currentBridgeStep === args.step) {
        state.previousBridgeStep.pop();
        state.previousBridgeStepParams.pop();
      }
      state.currentBridgeStep = args.step;

      if ("params" in args) {
        state.currentBridgeStepParams = args.params;
      }
      debug("%O Next Step:", state.currentBridgeStep, "; Params:", {
        ...state.currentBridgeStepParams,
      });
    });
  };

export const goBackOneStep: BridgeModalActions["goBackOneStep"] = () => {
  useBridgeModalStore.setState((state) => {
    const previousBridgeStep = state.previousBridgeStep.pop();
    const previousBridgeStepParams = state.previousBridgeStepParams.pop();

    if (
      previousBridgeStep === undefined ||
      typeof previousBridgeStep === "undefined"
    ) {
      throw new Error("No previous step");
    }
    state.currentBridgeStep = previousBridgeStep;
    state.currentBridgeStepParams = previousBridgeStepParams;
  });
};

export const clearChain = (chainDest: ChainDestType) => {
  useBridgeModalStore.setState((state) => {
    if (chainDest === "source") {
      state.token.sourceToken = DEFAULT_TOKEN_WITH_AMOUNT;
    } else if (chainDest === "target") {
      state.token.targetToken = DEFAULT_TOKEN_WITH_AMOUNT;
    }
  });
};

export const setChain: BridgeModalActions["setChain"] = async ({
  newChain,
  chainDestination,
}) => {
  const chainParam =
    chainDestination === "source" ? "sourceChain" : "targetChain";
  useBridgeModalStore.setState((state) => {
    state.chain[chainParam] = newChain;
  });
  clearChain(chainDestination);
  return Promise.resolve();
};

export const setBridgeAdapterSdkSettings: BridgeModalActions["setSdkSettings"] =
  (args) => {
    useBridgeModalStore.setState((state) => {
      state.sdk = new BridgeAdapterSdk(args);
    });
  };

export const setToken: BridgeModalActions["setToken"] = async (
  token,
  chainDest,
) => {
  useBridgeModalStore.setState((state) => {
    if (chainDest === "source") {
      state.token.sourceToken = token;
    } else if (chainDest === "target") {
      state.token.targetToken = token;
    }
  });
  setCurrentBridgeStep({
    step: "MULTI_CHAIN_SELECTION",
  });

  return Promise.resolve();
};

export const TOKEN_AMOUNT_ERROR_INDICATOR = "-1";

export const setTokenAmount: BridgeModalActions["setTokenAmount"] = (
  amount,
  chainDest,
) => {
  const tokenOfInterest =
    chainDest === "source" ? "sourceToken" : "targetToken";
  const otherToken = chainDest === "source" ? "targetToken" : "sourceToken";
  const tokens = useBridgeModalStore.getState().token;

  let amountToTransfer = amount;
  let amountToTransferInBaseUnits: string;
  let error = undefined;
  try {
    amountToTransferInBaseUnits = parseUnits(
      amount,
      tokens[tokenOfInterest].decimals,
    ).toString();
  } catch (e) {
    amountToTransferInBaseUnits = "0";
    amountToTransfer = TOKEN_AMOUNT_ERROR_INDICATOR;
    error = e;
  }
  useBridgeModalStore.setState((state) => {
    state.token[tokenOfInterest].selectedAmountFormatted = amountToTransfer;
    state.token[tokenOfInterest].selectedAmountInBaseUnits =
      amountToTransferInBaseUnits;

    if (state.token[tokenOfInterest].name === state.token[otherToken].name) {
      state.token[otherToken].selectedAmountFormatted = amountToTransfer;
      state.token[otherToken].selectedAmountInBaseUnits =
        amountToTransferInBaseUnits;
    }
  });
  if (error) {
    throw error;
  }
};

export const setSwapInformation: BridgeModalActions["setSwapInformation"] = (
  swapInformation,
) => {
  useBridgeModalStore.setState((state) => {
    state.swapInformation = swapInformation;
  });
};

export const resetBridgeModalStore: BridgeModalActions["resetBridgeModalStore"] =
  () => {
    useBridgeModalStore.setState((state) => {
      return { ...DEFAULT_BRIDGE_ADAPTER_STATE, sdk: state.sdk };
    });
  };

export const SLIPPING_TOLERANCE_AUTO: SlippageToleranceType = "auto";

export const setSlippageTolerance: BridgeModalActions["setSlippageTolerance"] =
  (slippageTolerance) => {
    useBridgeModalStore.setState((state) => {
      state.slippageTolerance = slippageTolerance;
    });
  };

export const setRelayerFee: BridgeModalActions["setRelayerFee"] = (
  relayerFee,
) => {
  useBridgeModalStore.setState((state) => {
    state.relayerFee = {
      ...state.relayerFee,
      ...relayerFee,
    };
  });
};
