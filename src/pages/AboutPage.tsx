import { Reveal } from '../components/Reveal'
import workbenchImg from '../assets/story/workbench.svg'
import stonesImg from '../assets/story/stones.svg'
import finishImg from '../assets/story/finish.svg'

export function AboutPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Reveal variant="blur" durationMs={1100}>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Chi siamo</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            AC Creation nasce dalla passione per i dettagli: metallo lavorato a
            mano e pietre naturali scelte una a una.
          </p>
        </div>
      </Reveal>

      <Reveal variant="up">
        <div className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur">
          <h2 className="text-lg font-semibold">La nostra idea</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Creare gioielli essenziali e moderni, con un’identità riconoscibile.
            Ogni pezzo è fatto a mano: niente produzione in serie.
          </p>
        </div>
      </Reveal>

      <Reveal variant="scale">
        <div className="grid gap-4 rounded-2xl border border-border bg-card/80 p-6 backdrop-blur sm:grid-cols-3">
          <div className="glow overflow-hidden rounded-xl border border-border bg-muted">
            <div className="aspect-[4/3]">
              <img
                src={workbenchImg}
                alt="Laboratorio"
                className="h-full w-full object-cover opacity-95"
                loading="lazy"
              />
            </div>
          </div>
          <div className="glow overflow-hidden rounded-xl border border-border bg-muted">
            <div className="aspect-[4/3]">
              <img
                src={stonesImg}
                alt="Pietre naturali"
                className="h-full w-full object-cover opacity-95"
                loading="lazy"
              />
            </div>
          </div>
          <div className="glow overflow-hidden rounded-xl border border-border bg-muted">
            <div className="aspect-[4/3]">
              <img
                src={finishImg}
                alt="Finiture"
                className="h-full w-full object-cover opacity-95"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal variant="left">
        <div className="rounded-2xl border border-border bg-card/80 p-6 text-sm text-muted-foreground backdrop-blur">
          Ogni collezione è un piccolo racconto: partiamo da una forma, troviamo
          la pietra giusta, poi rifiniamo finché il pezzo “suona” bene al polso o
          al collo. Il nostro obiettivo è un design pulito, ma vivo.
        </div>
      </Reveal>

      <Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card/80 p-5 backdrop-blur">
            <div className="text-sm font-semibold">Materiali</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Metallo e pietre naturali: texture reali, carattere autentico.
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card/80 p-5 backdrop-blur">
            <div className="text-sm font-semibold">Finiture</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Controllo qualità e rifinitura manuale prima della spedizione.
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
