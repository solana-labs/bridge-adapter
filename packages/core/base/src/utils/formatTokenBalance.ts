export function formatTokenBalance(balance: string) {
  const [ones, decimals] = balance.split(".");

  if (!decimals) {
    if (parseInt(ones) === 0) {
      return "0.00";
    }
    return `${ones}.00`;
  }

  if (ones === "0" && "00000".includes(decimals.slice(0, 5))) {
    return "< 0.00001";
  }
  return `${ones}.${decimals.slice(0, 5)}`;
}
