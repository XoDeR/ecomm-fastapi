/** Prices are stored in cents everywhere; this is the single place that formats them. */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
