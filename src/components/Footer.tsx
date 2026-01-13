const DEFAULT_INSTAGRAM_URL = 'https://www.instagram.com/ac_creations_handmade/'
const DEFAULT_WHATSAPP_NUMBERS = ['+39 347 318 5555', '+39 346 020 5522']

const instagramUrl =
  ((import.meta.env.VITE_INSTAGRAM_URL as string | undefined) ?? '').trim() ||
  DEFAULT_INSTAGRAM_URL

const whatsappNumbers = DEFAULT_WHATSAPP_NUMBERS

function whatsappUrlFromNumber(number: string) {
  const normalized = number.replace(/[^0-9]/g, '')
  if (!normalized) return ''
  return `https://wa.me/${normalized}`
}

export function Footer() {
  const waUrls = whatsappNumbers
    .map((n) => ({ number: n, url: whatsappUrlFromNumber(n) }))
    .filter((x) => x.url)

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-8 sm:px-5 sm:py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold">AC Creation</div>
          <div className="text-xs text-muted-foreground">
            Gioielli handmade ispirati alla natura: pietre e metalli.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <a href={instagramUrl} target="_blank" rel="noreferrer">
            Instagram
          </a>

          {waUrls.map(({ number, url }) => (
            <a key={number} href={url} target="_blank" rel="noreferrer">
              {number}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
