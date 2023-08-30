import {
  useAccount,
  useConnect,
  useDisconnect,
  useWalletClient,
  useEnsAvatar,
  useEnsName,
  useNetwork,
} from "wagmi";

export const useEtheriumWallet = useWalletClient;

export {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useNetwork,
};
