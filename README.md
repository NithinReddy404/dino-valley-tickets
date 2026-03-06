# Dino Valley Tickets

A responsive website for booking dinosaur park tickets with a cinematic 3D-inspired dinosaur theme.

## Files

- `index.html` — website structure
- `styles.css` — styling and motion
- `script.js` — interactivity, validation, and synthetic dinosaur roar

## Run locally

### Option 1: open directly
Open `index.html` in a browser.

### Option 2: use VS Code Live Server
1. Open the folder in VS Code
2. Install the **Live Server** extension
3. Right-click `index.html`
4. Click **Open with Live Server**

## Deploy with GitHub Pages

1. Create a new GitHub repo
2. Upload all files from this folder to the repo root
3. Push to the `main` branch
4. In GitHub, open **Settings** → **Pages**
5. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
6. Save
7. Wait for GitHub Pages to publish the site

## Notes

- The roar sound is generated in the browser using the Web Audio API, so no external audio file is needed.
- The dinosaur and environment are CSS-built to keep GitHub Pages deployment simple.
- Google Fonts are loaded from the web. If you need a fully offline version, replace them with local/system fonts.
