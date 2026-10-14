export const CURRENCY = {
  code: "PKR",
  symbol: "Rs",
} as const;

export function formatPrice(amount: number): string {
  return `${CURRENCY.symbol} ${amount}`;
}
