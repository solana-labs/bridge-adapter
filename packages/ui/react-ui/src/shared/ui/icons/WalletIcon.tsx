import type { FC, SVGProps } from "react";

export enum WalletName {
  "MetaMask" = "MetaMask",
  "Coinbase Wallet" = "Coinbase Wallet",
  "walletConnect" = "walletConnect",
}

export function WalletIcon({
  walletName,
  ...props
}: {
  walletName: WalletName;
  [key: string]: unknown;
}) {
  switch (walletName.toLowerCase()) {
    case "MetaMask".toLowerCase(): {
      return <MetaMask {...props} />;
    }
    case "Coinbase Wallet".toLowerCase(): {
      return <Coinbase {...props} />;
    }
    case "walletConnect".toLowerCase(): {
      return <WalletConnect {...props} />;
    }
    default:
      return null;
  }
}

// creds to connectKit
export const MetaMask: FC<
  SVGProps<SVGSVGElement> & {
    background?: boolean;
  }
> = ({ background = false, ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    style={
      background
        ? {
            background:
              "linear-gradient(0deg, var(--ck-brand-metamask-12), var(--ck-brand-metamask-11))",
            borderRadius: "27.5%",
          }
        : undefined
    }
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m27.2684 4.03027-9.7666 7.25383 1.8061-4.27968z"
      fill="var(--ck-brand-metamask-02)"
      stroke="var(--ck-brand-metamask-02)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m4.7218 4.03027 9.6881 7.32253-1.7178-4.34838z"
      fill="var(--ck-brand-metamask-08)"
      stroke="var(--ck-brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m23.7544 20.8438-2.6012 3.9851 5.5655 1.5313 1.6-5.4281z"
      fill="var(--ck-brand-metamask-08)"
      stroke="var(--ck-brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m3.69104 20.9321 1.59013 5.4281 5.56553-1.5313-2.60119-3.9851z"
      fill="var(--ck-brand-metamask-08)"
      stroke="var(--ck-brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m10.5327 14.1108-1.55089 2.346 5.52629.2454-.1964-5.9385z"
      fill="var(--ck-brand-metamask-08)"
      stroke="var(--ck-brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m21.4576 14.1111-3.8281-3.4158-.1277 6.0072 5.5164-.2454z"
      fill="var(--ck-brand-metamask-08)"
      stroke="var(--ck-brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m10.8469 24.8292 3.3178-1.6196-2.8663-2.2379z"
      fill="var(--ck-brand-metamask-08)"
      stroke="var(--ck-brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m17.8257 23.2096 3.3274 1.6196-.4613-3.8575z"
      fill="var(--ck-brand-metamask-08)"
      stroke="var(--ck-brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m21.1531 24.8296-3.3274-1.6196.2649 2.1693-.0294.9128z"
      fill="var(--ck-brand-metamask-06)"
      stroke="var(--ck-brand-metamask-06)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m10.8469 24.8296 3.0919 1.4625-.0196-.9128.2455-2.1693z"
      fill="var(--ck-brand-metamask-06)"
      stroke="var(--ck-brand-metamask-06)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m13.9877 19.5389-2.7681-.8147 1.9533-.8931z"
      fill="var(--ck-brand-metamask-09)"
      stroke="var(--ck-brand-metamask-09)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m18.0023 19.5389.8148-1.7078 1.9631.8931z"
      fill="var(--ck-brand-metamask-09)"
      stroke="var(--ck-brand-metamask-09)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m10.8468 24.8289.4711-3.9851-3.07229.0883z"
      fill="var(--ck-brand-metamask-03)"
      stroke="var(--ck-brand-metamask-03)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m20.6821 20.8438.4711 3.9851 2.6012-3.8968z"
      fill="var(--ck-brand-metamask-03)"
      stroke="var(--ck-brand-metamask-03)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m23.0182 16.4565-5.5164.2454.5104 2.8368.8148-1.7079 1.9632.8931z"
      fill="var(--ck-brand-metamask-03)"
      stroke="var(--ck-brand-metamask-03)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m11.2198 18.7239 1.9631-.8931.8049 1.7079.5203-2.8368-5.52629-.2454z"
      fill="var(--ck-brand-metamask-03)"
      stroke="var(--ck-brand-metamask-03)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m8.98181 16.4565 2.31649 4.5153-.0785-2.2479z"
      fill="var(--ck-brand-metamask-10)"
      stroke="var(--ck-brand-metamask-10)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m20.7901 18.7239-.0982 2.2479 2.3262-4.5153z"
      fill="var(--ck-brand-metamask-10)"
      stroke="var(--ck-brand-metamask-10)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m14.508 16.7021-.5202 2.8368.6478 3.3471.1472-4.4072z"
      fill="var(--ck-brand-metamask-10)"
      stroke="var(--ck-brand-metamask-10)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m17.5017 16.7021-.265 1.7668.1178 4.4171.6576-3.3471z"
      fill="var(--ck-brand-metamask-10)"
      stroke="var(--ck-brand-metamask-10)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m18.0121 19.5388-.6576 3.3472.4712.3239 2.8661-2.2379.0982-2.2479z"
      fill="var(--ck-brand-metamask-01)"
      stroke="var(--ck-brand-metamask-01)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m11.2196 18.7241.0785 2.2479 2.8663 2.2379.4711-.3239-.6478-3.3472z"
      fill="var(--ck-brand-metamask-01)"
      stroke="var(--ck-brand-metamask-01)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m18.0615 26.2917.0293-.9129-.2453-.216h-3.7005l-.2258.216.0196.9129-3.0919-1.4626 1.0798.8835 2.1888 1.5214h3.7595l2.1986-1.5214 1.0797-.8835z"
      fill="var(--ck-brand-metamask-07)"
      stroke="var(--ck-brand-metamask-07)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m17.8258 23.2096-.4712-.3239h-2.7189l-.4711.3239-.2455 2.1694.2258-.216h3.7005l.2453.216z"
      fill="var(--ck-brand-metamask-04)"
      stroke="var(--ck-brand-metamask-04)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m27.6806 11.7552.8343-4.00479-1.2466-3.72014-9.4426 7.00843 3.6318 3.0722 5.1335 1.5019 1.1386-1.3252-.4907-.3534.7852-.7164-.6085-.4713.7851-.5987z"
      fill="var(--ck-brand-metamask-05)"
      stroke="var(--ck-brand-metamask-05)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m3.48486 7.75041.83434 4.00479-.53004.3926.78525.5987-.59875.4713.78524.7164-.49078.3534 1.1288 1.3252 5.13358-1.5019 3.6319-3.0722-9.44276-7.00843z"
      fill="var(--ck-brand-metamask-05)"
      stroke="var(--ck-brand-metamask-05)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m26.591 15.6122-5.1335-1.5018 1.5606 2.346-2.3262 4.5152 3.0625-.0393h4.5642z"
      fill="var(--ck-brand-metamask-01)"
      stroke="var(--ck-brand-metamask-01)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m10.5326 14.1104-5.13363 1.5018-1.70793 5.3201h4.55447l3.05269.0393-2.31652-4.5152z"
      fill="var(--ck-brand-metamask-01)"
      stroke="var(--ck-brand-metamask-01)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m17.5018 16.7018.324-5.6637 1.4919-4.03419h-6.6256l1.4724 4.03419.3436 5.6637.1177 1.7865.0098 4.3973h2.719l.0196-4.3973z"
      fill="var(--ck-brand-metamask-01)"
      stroke="var(--ck-brand-metamask-01)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// creds to connectKit
export const Coinbase: FC<
  SVGProps<SVGSVGElement> & {
    background?: boolean;
  }
> = ({ background = false, ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="32"
    height="32"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="10" fill="var(--ck-brand-coinbaseWallet)" />
    {background && (
      <rect
        rx="27%"
        width="20"
        height="20"
        fill="var(--ck-brand-coinbaseWallet)"
      />
    )}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m10.0001 17c3.866 0 7-3.134 7-7 0-3.86599-3.134-7-7-7-3.86597 0-6.99998 3.13401-6.99998 7 0 3.866 3.13401 7 6.99998 7zm-1.74998-9.28571c-.29585 0-.53571.23985-.53571.53571v3.5c0 .2959.23986.5357.53571.5357h3.49998c.2959 0 .5357-.2398.5357-.5357v-3.5c0-.29586-.2398-.53571-.5357-.53571z"
      fill="#fff"
    />
  </svg>
);

// creds to connectKit
export const WalletConnect: FC<
  SVGProps<SVGSVGElement> & {
    background?: boolean;
  }
> = ({ background = false, ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={
      background ? { background: "var(--ck-brand-walletConnect)" } : undefined
    }
  >
    <path
      d="m9.58818 11.8556c3.54112-3.54118 9.28242-3.54118 12.82352 0l.4262.4262c.1771.177.1771.4641 0 .6411l-1.4578 1.4579c-.0886.0885-.2321.0885-.3206 0l-.5865-.5865c-2.4704-2.4704-6.4757-2.4704-8.9461 0l-.628.628c-.0885.0886-.2321.0886-.3206 0l-1.45789-1.4578c-.17705-.177-.17705-.4641 0-.6411zm15.83862 3.015 1.2975 1.2976c.177.177.177.4641 0 .6411l-5.8506 5.8506c-.1771.1772-.4641.1772-.6412 0l-4.1523-4.1523c-.0443-.0442-.1161-.0442-.1603 0l-4.1524 4.1523c-.177.1772-.4641.1772-.6411.0001v-.0001l-5.85079-5.8507c-.17705-.177-.17705-.4641 0-.6412l1.29752-1.2974c.17706-.1772.46413-.1772.64118 0l4.15249 4.1524c.0442.0442.116.0442.1603 0l4.1522-4.1524c.177-.1772.4641-.1772.6412 0l4.1525 4.1524c.0442.0442.116.0442.1602 0l4.1524-4.1524c.1771-.1771.4642-.1771.6412 0z"
      fill={background ? "#fff" : "var(--ck-brand-walletConnect)"}
    />
  </svg>
);
