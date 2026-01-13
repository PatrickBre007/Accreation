# Sanity (catalogo prodotti)

Questo repo include gli schema Sanity per i prodotti (cartella `schemaTypes`).

## Setup rapido
1. Crea un progetto su Sanity e prendi `projectId` e `dataset`.
2. Lo Studio è già configurato in questa repo:
   - `sanity/sanity.cli.ts`
   - `sanity/sanity.config.ts`
   - schema in `sanity/schemaTypes`
3. Imposta le variabili in `.env` (vedi `.env.example`):
   - `SANITY_PROJECT_ID`, `SANITY_DATASET` (il backend espone `/api/products*` e legge da Sanity)

> Nota: se il dataset è privato, aggiungi `SANITY_READ_TOKEN` sul backend.

## Avvio Studio (locale)
Dalla root del progetto:
```bash
npm run studio:dev
```
Studio su `http://localhost:3333`.

## Deploy Studio (produzione / responsabile che inserisce prodotti)
1) Login:
```bash
cd sanity
npx sanity login
```

2) Deploy:
```bash
cd ..
npm run studio:deploy
```

3) Invita il responsabile da Sanity Manage → Members (ruolo Editor/Admin).
Lo Studio deployato richiede login, quindi i contenuti sono modificabili solo dagli utenti autorizzati.

## Schema prodotto
Lo schema attuale usa:
- `name` (string) — nome prodotto
- `description` (text)
- `price` (number) — prezzo in **EUR** (es. `19.9`)
- `image` (image)
- `category` (string) — bracciale/collana/orecchini/anello
