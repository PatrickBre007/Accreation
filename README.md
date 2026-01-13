# AC Creation — eCommerce (Vite + React) + Stripe + Sanity

Sito e-commerce per **AC Creation** (gioielli fatti a mano in metallo e pietre naturali).

## Funzioni incluse
- Pagine: Portfolio (home), Prodotti, Chi siamo, Contattaci (Instagram + WhatsApp)
- Lista prodotti da **Sanity** (nome/descrizione/immagine/prezzo)
- Carrello in alto con riepilogo su pagina dedicata
- Pagamento con **Stripe Checkout**
- Pagina **Ricevuta** post-acquisto con articoli, nome cliente, indirizzo e totale

## Setup
1) Crea un file `.env` copiando `.env.example` e compila:
- (opzionale) `VITE_API_BASE_URL` se frontend e backend non condividono lo stesso dominio
- `STRIPE_SECRET_KEY` (usa una key di test)
- `SANITY_PROJECT_ID` / `SANITY_DATASET` (per il backend checkout)
- `SANITY_READ_TOKEN` se dataset privato
- `VITE_INSTAGRAM_URL`, `VITE_WHATSAPP_NUMBER`

> Importante: non committare mai `.env` e non condividere mai una Stripe Secret Key (`sk_...`).
> Se una key è stata incollata in chat o finita in una repo, ruotala subito dalla Dashboard Stripe.

2) Avvio in sviluppo (frontend + backend insieme):
```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8787/api/health`

> Nota: il frontend carica i prodotti passando dal backend `/api`, che a sua volta legge il catalogo da Sanity.

## Sanity
Gli schema sono in `sanity/schemaTypes`.
Vedi `sanity/README.md` per collegare lo schema al tuo Studio Sanity.

### Sanity Studio (per aggiungere prodotti)
- Avvio Studio in locale:
```bash
npm run studio:dev
```
	- Studio: `http://localhost:3333`

- Deploy Studio (consigliato per far lavorare un responsabile mentre il sito è online):
```bash
npm run studio:deploy
```
Poi inviti l’utente da Sanity Manage (Members) e lui/lei accede con login allo Studio deployato.

## Stripe
Il backend crea una Checkout Session usando i dati dal catalogo Sanity (evita manomissioni del prezzo lato client).
La ricevuta viene generata chiamando `/api/receipt?session_id=...` e leggendo i dettagli da Stripe.

## Deploy su Vercel
Questo repo è pronto per Vercel con:
- Frontend statico in `dist/` (Vite)
- API serverless sotto `api/*` (Vercel Functions): `api/health.ts`, `api/products.ts`, `api/checkout.ts`, `api/receipt.ts`

### 1) Importa il progetto
- Carica il repo su GitHub (o GitLab/Bitbucket)
- In Vercel: **New Project** → Importa il repo
- Build Command: `npm run build`
- Output Directory: `dist`

### 2) Imposta le Environment Variables (Vercel → Project → Settings → Environment Variables)
Minime per far funzionare catalogo + checkout:
- `STRIPE_SECRET_KEY`
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION`
- (solo se dataset privato) `SANITY_READ_TOKEN`

Per i redirect di Stripe è consigliato anche:
- `FRONTEND_URL` = `https://<tuo-progetto>.vercel.app` (o il tuo dominio custom)

Variabili frontend (facoltative, ma utili):
- `VITE_INSTAGRAM_URL`
- `VITE_WHATSAPP_NUMBER`

> Nota: in Vercel di solito NON serve `VITE_API_BASE_URL` perché frontend e API sono sulla stessa origin (`/api/...`).

### 3) Verifica veloce dopo il deploy
- Apri `https://<tuo-progetto>.vercel.app/api/health`
- Apri `https://<tuo-progetto>.vercel.app/api/products`
- Fai un acquisto di test → controlla la pagina `/success?session_id=...`
