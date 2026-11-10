# Simba Cement website

This is a static website. The homepage is `index.html`; no build step or package installation is required.

## Folder layout

```text
.
├── index.html                 # Homepage
├── about.html                 # Other website pages
├── products.html
├── contact.html
├── styles.css                 # Shared styles
├── home.css                   # Homepage styles
├── site.js                    # Shared page behavior
├── home.js                    # Homepage behavior
└── assets/
    ├── hero.jpg
    ├── simba-mark.png
    ├── simba-cement-32-5r.png
    ├── simba-power-42-5n.png
    ├── gallery/                # Homepage and plant photos
    └── images/catalog/         # Additional product photos
```

Keep the `assets` folder beside the HTML files. Image and stylesheet links use relative paths, which work both locally and on a GitHub Pages project site. The 43 images in `assets/images/catalog/` are included in the repository, but are not currently displayed on the Simba Cement pages.

## Preview

Open `index.html` in a browser, or start a local server from this folder:

```powershell
py -m http.server 8000
```

Then visit `http://localhost:8000`.

## Add to a GitHub repository

1. Add the **contents of this complete folder**, not just `index.html`. Include `assets/`, the CSS files, and the JavaScript files.
2. Commit and push the files. The `.gitignore` excludes local virtual environments and operating-system files; it does not exclude photos.
3. In GitHub, open **Settings → Pages** and publish from the branch and folder containing `index.html` (usually the repository root).
4. Visit the published URL and check the home, product, and gallery photos.

GitHub Pages is case-sensitive. Keep image filenames and their letter case unchanged when editing paths.
