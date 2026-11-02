# Bedroom browser checks / Pruebas del dormitorio

Run from the repository root. Install dependencies with `npm ci`, then `npx playwright install chromium`. Start `python scripts/preview.py --public-fonts` in another terminal. Each check uses isolated browser storage and simulated Tizen APIs; no TV is contacted.

Ejecuta desde la raíz. Instala dependencias con `npm ci` y Chromium con `npx playwright install chromium`. Arranca `python scripts/preview.py --public-fonts` en otra terminal. Las pruebas usan almacenamiento aislado y API simuladas; no se conectan a la TV.

```sh
node scripts/bedroom-tests/menu-review.cjs
node scripts/bedroom-tests/hdmi-name-review.cjs
node scripts/bedroom-tests/v12-focus-review.cjs
node scripts/bedroom-tests/v13-review.cjs
node scripts/bedroom-tests/live-card-review.cjs
node scripts/bedroom-tests/live-channel-fullscreen.cjs
node scripts/bedroom-tests/unlimited-carousel.cjs
node scripts/bedroom-tests/series-gallery.cjs
```

Screenshots are written to ignored `.local/qa/`. Create that directory first. For installed Microsoft Edge on Windows, set `$env:CLEANFRAME_BROWSER_CHANNEL='msedge'` in PowerShell. Otherwise the default is Playwright Chromium.

Las capturas se guardan en `.local/qa/`, excluida de Git; crea antes esa carpeta. En Windows puedes seleccionar Edge con la variable anterior; por defecto se usa Chromium.

These are the current regression checks for this adaptation. Historical upstream `check:browser` uses older UI expectations. / Estas son las pruebas actuales de esta variante; el `check:browser` original usa expectativas de la interfaz antigua.
