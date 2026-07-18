export function formatTZS(amount: number): string {
  return `TZS ${new Intl.NumberFormat("en-TZ").format(Math.round(amount))}`;
}
