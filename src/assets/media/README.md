# Media assets

Metti qui i file multimediali del progetto.

Struttura consigliata:
- `images/` — foto (jpg/png/webp/svg)
- `video/` — video (mp4/webm)

## Uso in Vite + React (import)

Esempi:

```ts
import heroImg from "../assets/media/images/hero.jpg";
import introVideo from "../assets/media/video/intro.mp4";
```

Poi:

```tsx
<img src={heroImg} alt="Hero" />
<video src={introVideo} controls />
```

Nota: per file molto grandi (video pesanti), può essere più comodo metterli in `public/` e referenziarli come `/media/...`.
