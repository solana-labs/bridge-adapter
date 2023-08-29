import { useCallback, useEffect, useMemo, useState } from "react";

export const useCopyAddress = (address?: string) => {
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (isCopied) {
      timeout = setTimeout(() => {
        setIsCopied(false);
      }, 1_000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isCopied]);

  const copyAddress = useCallback(() => {
    if (address) {
      setIsCopied(true);
      navigator.clipboard.writeText(address).catch((e) => {
        console.error("ERROR copying value to clipboard", e);
      });
    }
  }, [address]);

  return useMemo(() => ({ copyAddress, isCopied }), [copyAddress, isCopied]);
};
