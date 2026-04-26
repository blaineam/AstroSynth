# AstroSynth

> A neon-drenched, synthwave reimagining of the arcade classic — built with vanilla HTML5 Canvas and zero dependencies.

🌐 **Play it live:** [astrosynth.wemiller.com](https://astrosynth.wemiller.com)

---

## 🎮 About

**AstroSynth** is a browser-based arcade shooter that pairs the timeless gameplay loop of *Asteroids* with an `'80s` synthwave aesthetic — magenta-and-cyan glow, scanlines, parallax starfields, and a procedurally generated chiptune soundtrack. No build tools, no frameworks, just a single `index.html` and a handful of script files.

## ✨ Features

- 🚀 **Classic arcade combat** — thrust, rotate, fire, survive
- 🔫 **Four switchable weapons** — Pulse, Spread, Plasma, and Beam
- 👾 **Alien hunters** that flank you between waves of asteroids
- 🌊 **Endless wave progression** with escalating difficulty
- 🏆 **Local high-score table** with 3-letter initials, persisted in `localStorage`
- 🎵 **Procedural synthwave audio** generated entirely in the browser via Web Audio API
- 📱 **Mobile-friendly** with on-screen touch controls
- 🎮 **Gamepad support** out of the box

## 🕹️ Controls

| Action  | Keyboard                | Gamepad        | Touch           |
| ------- | ----------------------- | -------------- | --------------- |
| Thrust  | `↑` / `W`               | D-pad Up / LS  | ▲ button        |
| Rotate  | `←` `→` / `A` `D`       | D-pad / LS     | ◄ ► buttons     |
| Fire    | `Space`                 | A button       | FIRE button     |
| Pause   | `Esc`                   | —              | —               |
| Start   | `Space` / `Enter`       | A button       | START button    |

## 🛠️ Local Development

There is no build step. Clone the repo and serve the directory with anything that speaks HTTP:

```bash
git clone git@github.com:blaineam/AstroSynth.git
cd AstroSynth

# Pick your favorite static server
python3 -m http.server 8000
# or
npx serve .
```

Then open [http://localhost:8000](http://localhost:8000).

## 📁 Project Structure

```
AstroSynth/
├── index.html              # Entry point
├── src/
│   ├── style.css           # Synthwave styling, HUD, mobile controls
│   ├── audio.js            # Web Audio synth + SFX engine
│   ├── game-core.js        # State, input, spawning, scoring
│   ├── game-render.js      # Update + draw loop
│   └── game-loop.js        # RAF loop + welcome screen
├── CNAME                   # Custom domain for GitHub Pages
└── .github/workflows/
    └── deploy.yml          # CI: deploy to GitHub Pages on push to main
```

## 🚀 Deployment

Every push to `main` triggers a GitHub Actions workflow that publishes the site to GitHub Pages, served from the custom domain **[astrosynth.wemiller.com](https://astrosynth.wemiller.com)**.

To wire this up on a fresh repo:

1. In **Settings → Pages**, set **Source** to *GitHub Actions*.
2. Add a DNS `CNAME` record: `astrosynth` → `blaineam.github.io`.
3. Push to `main` — the workflow in `.github/workflows/deploy.yml` does the rest.

## 📜 License

MIT — do whatever you want, just keep the credit.
