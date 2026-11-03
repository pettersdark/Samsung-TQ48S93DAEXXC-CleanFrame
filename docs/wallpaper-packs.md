# Paquetes de fondos / Wallpaper packs

Actualización de fondos y reloj; se conserva la configuración nativa de este televisor.
Wallpaper and clock update; this TV retains its existing native Home/startup configuration.

## Uso / Usage

Personalizar → Fondo permite elegir Paquete, Escena, Día y noche, Rotación y
Horario automático. Cada elección se aplica con OK; Volver e Inicio son visibles
en la cabecera. En el selector de escenas el foco muestra una vista previa, y OK
guarda. Salir sin aplicar descarta esa vista previa.

Personalize → Background provides Package, Scene, Day/night, Rotation and
Automatic schedule. OK applies choices; Back and Home are visible in the header.
Scene focus previews without saving; OK commits and Back cancels the preview.

| Paquete / Package | Escenas / Scenes | Imágenes / Images |
| --- | ---: | ---: |
| Videojuegos Invierno | 3 | 6 |
| Videojuegos Verano | 3 | 6 |
| Videojuegos Sistemas | 3 | 6 |
| Videojuegos OLED | 6 | 12 |
| Cine y series Invierno | 4 | 8 |
| Cine y series Verano | 4 | 8 |
| Cine y series OLED | 3 | 6 |

Los siete paquetes van incluidos en esta compilación y funcionan sin PC ni red.
Los ZIP de diseño son archivos de los originales; esta versión no importa ZIP
desde USB ni descarga paquetes. Añadir otros paquetes requiere preparar y
actualizar la compilación. Los fondos anteriores ya no están en sus recursos de
ejecución; existe una copia de recuperación local fuera del repositorio.

All seven packages are bundled and work offline. Design ZIPs archive the original
artwork; this version does not import USB ZIPs or download packs. Additional packs
require an updated build. Previous runtime wallpapers were removed from the app;
a private recovery copy is retained outside this repository.

## Rotación y horario / Rotation and schedule

- Fija conserva la escena. Al abrir Inicio avanza una escena al cargar la app,
  sin avanzar al regresar de otra aplicación. Los intervalos de 5, 15 y 60 minutos
  cuentan solo tiempo visible en Inicio; los paneles y apps externas los pausan.
- La rotación recorre únicamente las escenas del paquete activo.
- Automático usa la hora local de la TV: Día 08:00, Noche 20:00 inicialmente.
  Las horas se ajustan con OK en pasos de 30 minutos y deben ser distintas.
  También se admiten intervalos diurnos que crucen medianoche.
- Día y Noche fuerzan esa variante. Un cambio de horario conserva la escena;
  se comprueba al abrir, cada minuto visible y al volver a la app. La vista previa
  de una escena conserva su variante hasta salir para evitar cambios inesperados.
- Se guarda paquete, escena, aspecto, horario e intervalo. Una actualización
  desde un fondo retirado usa Cine y series OLED y mantiene accesos y orden.
- Fallar al cargar o guardar conserva la selección anterior y ofrece Reintentar.

Fixed retains one scene. On opening advances once on app load; timed rotation
counts only visible Home time. Rotation stays within the selected package. Auto
uses TV-local time with configurable half-hour boundaries (08:00/20:00 defaults).
Day/Night force one variant. Schedule changes preserve the selected scene.
Preferences survive reopening; loading/storage failures retain committed values.
The migration retains Home shortcuts/order and replaces removed wallpaper with
Cine y series OLED. No background service, native Home or startup changes.

La hora de 24 horas y el día de la semana aparecen juntos en una sola línea,
con una única superficie de contraste. No hay rebordes separados superpuestos.
The 24-hour time and weekday share one line and a single contrast surface.

## Development and validation

Runtime: ES5 `app/wallpaper-engine.js`, package catalogue in
`app/assets/wallpapers/catalog.js`, existing atomic image/material loader in
`app/main.js`. JPEGs, thumbnails and registered materials are prepared offline.
Original generated artwork is 1672×941; runtime JPEGs use a centered 1920×1080
crop. This is not a claim of native 4K artwork.

Owner preparation: `python scripts/import-wallpaper-packs.py`, then
`node scripts/build-materials.mjs` and promote the staged registered materials
as described in assets.md. The importer needs Pillow and the bundled design/packs
master images; ordinary preview/package use only bundled app assets.

`check:device` includes the adapter and pure wallpaper-engine tests.
`check:browser` uses `scripts/check-wallpaper-packs.mjs`: seven-pack navigation,
legacy migration, same-scene day/night changes, explicit modes, schedule, atomic
storage failures/retry, preview cancellation, within-pack timed rotation,
persistence and 1080p/720p views. It loads all 52 images in all three materials
and both layouts, checking missing resources and script errors. Captures are
private under `.local/qa/packs/`. `CLEANFRAME_BROWSER_CHANNEL=msedge` can select
installed Edge; default remains bundled Chromium. `PYTHON` overrides the preview
interpreter; Windows defaults to python, other hosts to python3.

The upstream browser harness remains available as historical tooling; the
seven-package suite is the acceptance check for this update. Native Home/startup
and model-specific device adapters are unchanged. POSIX signing-tool tests require
macOS/Linux; the owner's Windows SDK runner remains private. Browser evidence does
not establish physical TV results.

## Home spacing / Separación de Inicio (2026-11-03)

En Carrusel, la cabecera y el bloque inferior comparten un margen de 48 px en la
escena lógica de 1920×1080 (4,44 % de la altura). Hora y día en una sola línea,
alineados con el borde izquierdo del carrusel. La barra superior tiene margen
interior real, sin reborde exterior que altere la distancia. Los días largos
crecen hacia la derecha; en carruseles muy cortos la barra se adapta al espacio
restante sin reducir el reloj. Iconos mantiene una franja para su etiqueta bajo
el carrusel, dentro del mismo límite inferior. Lista conserva su disposición.

Dock Home uses equal 48px top/bottom group margins in the 1920×1080 logical stage.
The single-line clock aligns with the carousel's left border. Header padding is
inside the measured frame. Short carousels adapt header scale to avoid collisions;
icon-only mode reserves the existing app-name footer within the bottom margin.
Registered material crops continue using the actual carousel coordinates.

`node scripts/check-home-spacing.mjs` verifies 108 cases: 0/1/2/5/9/30 shortcuts,
all app/control presentation modes, a long Wednesday label, 1080p/720p, symmetric
margins, focused controls in bounds and cleanup when switching back to List.
The standard browser check runs this suite after wallpaper package acceptance.

## Shared materials / Materiales compartidos (2026-11-03)

Suave, Esmerilado y Translúcido afectan al carrusel, la barra de controles y el
reloj. Las superficies de cabecera reutilizan las dos imágenes de material antes
reservadas para lentes de foco ocultas; no añaden imágenes decodificadas ni
calculan desenfoque en la TV. Se recortan en sus coordenadas reales, también en
vistas previas y cabeceras adaptadas a carruseles cortos. La opción Material está
activa con cualquier fondo fotográfico, porque también se usa en la cabecera.

Translúcido deja más fondo visible: carrusel diurno con velo blanco .38, nocturno
con velo oscuro .10 y campo claro al .18; cabecera con campo claro al .12 y velo
.38 para conservar contraste. Suave y Esmerilado mantienen su receta del carrusel;
la cabecera usa sus campos de desenfoque preparados y un velo de contraste.

Soft, Frost and Clear apply to carousel, header controls and clock. Header surfaces
reuse the two existing cached utility material images, preserving atomic bundle
loading with no extra decoded full-stage images and no runtime blur. Exact crop
registration follows the actual surface rectangles. Clear is more transparent;
soft/frost carousel recipes and the owner-confirmed spacing remain unchanged.

`node scripts/check-header-materials.mjs` verifies both header surfaces against
cached material files, crop registration, day/night translucency, List/type and
flat-background cleanup. The standard browser check includes this suite.
