import { customAlphabet } from "nanoid";

export function padIdWithAddressByte(
  length: number | undefined = 15,
  byte: number | undefined = 0x01,
) {
  const nanoid = customAlphabet("1234567890", length);
  const str = `${byte}${nanoid()}`;
  return str;
}

export function padIdWithZero(blockchainId: string) {
  return blockchainId.length === 4 ? blockchainId : `${blockchainId}0`;
}
