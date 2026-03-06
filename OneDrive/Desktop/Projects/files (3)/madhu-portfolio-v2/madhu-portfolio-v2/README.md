# ✈ Madhu Krishna Teja Janaswamy — Aerospace Portfolio

Sky-themed, 3D aviation portfolio website built with pure HTML, CSS, and Three.js (no build step required).

---

## 🗂 Project Structure

```
madhu-portfolio/
├── index.html       ← Single-page HTML (all content)
├── styles.css       ← Sky theme, glassmorphism, animations
├── main.js          ← Three.js 3D scene + UX logic
└── README.md        ← This file
```

---

## 🚀 Run Locally

No build step or server required for basic viewing.

**Option A — Open directly:**
```bash
open index.html
```

> ⚠️ Google Fonts require an internet connection. For offline use, download and inline the fonts.

**Option B — Local server (recommended to avoid CORS quirks):**
```bash
# Python 3
python3 -m http.server 8080
# then open http://localhost:8080
```

Or with Node.js:
```bash
npx serve .
```

---

## 🌐 Deploy to GitHub Pages

1. Create a GitHub repository (e.g., `aerospace-portfolio`).
2. Push all three files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio deploy"
   git remote add origin https://github.com/YOUR_USERNAME/aerospace-portfolio.git
   git push -u origin main
   ```
3. In GitHub → Settings → Pages → Source: **Deploy from branch → `main` / `/ (root)`**.
4. Wait ~60 seconds. Your site will be live at:
   `https://YOUR_USERNAME.github.io/aerospace-portfolio/`

---

## 🎨 Customization Notes

### Personal Details
- **Contact info**: Edit the `#contact` section in `index.html`
- **Publication link**: Find `.pub-link` href in the Publications section and replace with your actual DOI/journal URL
- **LinkedIn URL**: Update the `href` in the Contact section

### Colors
All colors are CSS custom properties in `styles.css` under `:root`:
- `--accent` — orange highlight (#f5a623)
- `--sky-zenith` / `--sky-mid` / `--sky-horizon` — sky gradient stops
- Change any of these to retheme the entire site instantly.

### 3D Aircraft
In `main.js`, the `fleetConfigs` array controls each aircraft:
```js
{ x: -300, y: 60, z: -60, speed: 0.28, scale: 0.8, ry: 0.08, color: 0xdce8f5 }
```
- `x/y/z` — starting position
- `speed` — horizontal flight speed (units/frame)
- `scale` — aircraft size
- `ry` — yaw rotation (0 = flying right, Math.PI = flying left)
- `color` — fuselage color (hex)

Add or remove entries from `fleetConfigs` to change the number of aircraft.

### Sections
Each section follows the same pattern — copy an existing `<section>` block in `index.html` and update the `id`, label, and content.

### Fonts
Currently using:
- **Bebas Neue** — display/headings (Google Fonts)
- **DM Sans** — body text (Google Fonts)
- **Space Mono** — labels/monospace (Google Fonts)

Replace the `<link>` in `<head>` and update `--font-display`, `--font-body`, `--font-mono` variables to change fonts.

---

## 📦 Dependencies

| Library | Version | Source | License |
|---------|---------|--------|---------|
| Three.js | r128 | cdnjs.cloudflare.com | MIT |
| Google Fonts (Bebas Neue, DM Sans, Space Mono) | latest | fonts.googleapis.com | OFL/Apache 2 |

No npm packages or build tools required.

---

## 🛡 Asset Attribution

- **Three.js** © mrdoob and contributors — [MIT License](https://github.com/mrdoob/three.js/blob/dev/LICENSE)
- All aircraft models are **procedurally generated** in JavaScript using Three.js geometry primitives — no external 3D assets, no licensing concerns.
- Sky GLSL shader is original code written for this project.
- All fonts served via Google Fonts under their respective open licenses.

---

## ♿ Accessibility

- ARIA labels on nav, sections, and interactive elements
- `prefers-reduced-motion` media query disables all animations
- Focus-visible outline on all interactive elements
- Semantic HTML5 structure (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)

---

## 📱 Browser Support

Tested on: Chrome 120+, Firefox 121+, Safari 17+, Edge 120+  
Mobile: iOS Safari 16+, Chrome for Android

---

*Built with ☁️ and Three.js. Cleared for takeoff.*
