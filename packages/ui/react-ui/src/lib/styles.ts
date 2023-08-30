import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const TAILWIND_CLASS_PREFIX = "bsa-";

export function cn(...inputs: ClassValue[]) {
  const mergeWithPrefix = extendTailwindMerge({
    prefix: TAILWIND_CLASS_PREFIX,
  });

  return mergeWithPrefix(clsx(inputs));
}
