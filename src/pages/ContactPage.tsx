import { Reveal } from '../components/Reveal'
import instagramIcon from '../assets/media/images/Instagram_icon.png'
import whatsappIcon from '../assets/media/images/WhatsApp_icon.png'

const DEFAULT_INSTAGRAM_URL = 'https://www.instagram.com/ac_creations_handmade/'
const DEFAULT_WHATSAPP_NUMBERS = ['+39 347 318 5555', '+39 346 020 5522']
const CONTACT_EMAIL = 'ac.creation.handmade@gmail.com'

const instagramUrl =
  ((import.meta.env.VITE_INSTAGRAM_URL as string | undefined) ?? '').trim() ||
  DEFAULT_INSTAGRAM_URL

const whatsappNumbers = DEFAULT_WHATSAPP_NUMBERS

const emailHref = `mailto:${CONTACT_EMAIL}`

function whatsappUrlFromNumber(number: string) {
  const normalized = number.replace(/[^0-9]/g, '')
  if (!normalized) return ''
  return `https://wa.me/${normalized}`
}

export function ContactPage() {
  const waUrls = whatsappNumbers
    .map((n) => ({ number: n, url: whatsappUrlFromNumber(n) }))
    .filter((x) => x.url)

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Reveal variant="blur" durationMs={1100}>
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-6 backdrop-blur sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-metal-sheen opacity-20" />
          <div className="relative">
            <h1 className="text-3xl font-semibold tracking-tight">Contattaci</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Scrivici per disponibilità, personalizzazioni o ordini su misura.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="group glow relative overflow-hidden rounded-2xl border border-border bg-card/80 p-6 no-underline backdrop-blur transition-transform duration-200 hover:-translate-y-1 active:translate-y-0"
          >
            <div className="pointer-events-none absolute inset-0 bg-metal-sheen opacity-10 transition-opacity duration-300 group-hover:opacity-20" />
            <div className="relative flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background/10 transition-transform duration-200 group-hover:scale-[1.04]">
                <img
                  src={instagramIcon}
                  alt="Instagram"
                  className="h-7 w-7 object-contain"
                  loading="lazy"
                />
              </div>

              <div className="flex-1">
                <div className="text-sm font-semibold">Instagram</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  @ac_creations_handmade
                </div>
                <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
                  Apri profilo
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </div>
            </div>
          </a>

          <div className="group glow relative overflow-hidden rounded-2xl border border-border bg-card/80 p-6 backdrop-blur transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
            <div className="pointer-events-none absolute inset-0 bg-metal-sheen opacity-10 transition-opacity duration-300 group-hover:opacity-20" />
            <div className="relative flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background/10 transition-transform duration-200 group-hover:scale-[1.04]">
                <img
                  src={whatsappIcon}
                  alt="WhatsApp"
                  className="h-7 w-7 object-contain"
                  loading="lazy"
                />
              </div>

              <div className="flex-1">
                <div className="text-sm font-semibold">WhatsApp</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Scegli un numero e scrivici.
                </div>

                <div className="mt-4 grid gap-2">
                  {waUrls.map(({ number, url }) => (
                    <a
                      key={number}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-border bg-background/10 px-4 py-2 text-sm font-semibold text-foreground no-underline transition-transform duration-200 hover:-translate-y-0.5 hover:bg-muted"
                    >
                      {number}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <a
            href={emailHref}
            className="group glow relative overflow-hidden rounded-2xl border border-border bg-card/80 p-6 no-underline backdrop-blur transition-transform duration-200 hover:-translate-y-1 active:translate-y-0 md:col-span-2"
          >
            <div className="pointer-events-none absolute inset-0 bg-metal-sheen opacity-10 transition-opacity duration-300 group-hover:opacity-20" />
            <div className="relative flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background/10 transition-transform duration-200 group-hover:scale-[1.04]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-foreground/90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6h16v12H4z" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </div>

              <div className="flex-1">
                <div className="text-sm font-semibold">Email</div>
                <div className="mt-1 break-words text-sm text-muted-foreground">{CONTACT_EMAIL}</div>
                <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
                  Invia un messaggio
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </Reveal>
    </div>
  )
}
