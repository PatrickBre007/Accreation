export function formatEurFromCents(cents: number) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format((cents ?? 0) / 100)
}
