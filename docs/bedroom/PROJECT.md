> Release 1.1 (version metadata 1.1.0): [changes / cambios](../releases/1.1.md). Owner-confirmed menus, spacing and materials; native Home/startup preserved.

> Wallpaper update 2026-11-03: seven packages / 52 images replace the previous
> gallery. Time and weekday now share one line. The owner confirmed the app and
> seven packages on this TV. ES5/resources, 27 unit/synthetic tests and full-pack
> browser checks passed. Model-specific device adapter, identity, author, fonts
> and native Home/startup behavior are preserved. [Details](../wallpaper-packs.md).
>
> Actualización 2026-11-03: siete paquetes / 52 fondos sustituyen la galería anterior.
> Hora y día en una línea; app y siete paquetes confirmados por el propietario.
> Versión publicada como release 1.1; consultar docs/releases/1.1.md.

# Project record / Registro del proyecto

Saved baseline: **Bedroom v14**, 2 November 2026. Based on upstream CleanFrame 0.7.0, commit `845f332`. This label records the adaptation; the inherited manifest version is not a separate published release.

Versión de referencia: **Dormitorio v14**, 2 de noviembre de 2026. Basada en CleanFrame 0.7.0, commit `845f332`. La etiqueta identifica esta adaptación; la versión heredada del manifiesto no constituye una publicación nueva.

## Target / Destino

- Samsung TQ48S93DAEXXC · S93D OLED 48 inches / pulgadas.
- Tizen 9, ARMv7; firmware T-PTMDDEUC-0090-2130.0.
- Spanish interface / Interfaz en español.
- No TV IP address, serial number, DUID, private app identity or credentials are required in this record. / No se incluyen IP, número de serie, DUID, identidad privada ni credenciales.

## Implementation map / Mapa para modificar

| Area / Área | Files / Archivos |
| --- | --- |
| UI, navigation, preferences / Interfaz, navegación, preferencias | `app/main.js`, `app/style.css`, `app/index.html` |
| Tizen calls, installed apps, HDMI, tuning / API de TV, apps, HDMI, canales | `app/device.js` |
| Runtime assets / Recursos del televisor | `app/assets/` |
| Background catalogue and provenance / Catálogo y procedencia | `app/assets/wallpapers/catalog.js`, `SOURCES.json` |
| Selected design masters and prompts / Originales seleccionados y descripciones | `design/backgrounds/` |
| Brand sources / Fuentes de marcas | `app/assets/icons/ADDITIONAL-SOURCES.json`, `THIRD_PARTY_NOTICES.md` |
| Current browser regression checks / Pruebas actuales de navegador | `scripts/bedroom-tests/` |

## Evidence and limits / Evidencia y límites

The owner confirmed live TV opening, channel tuning from the left list, Samsung quick settings, and general operation. Browser checks cover preferences, HDMI name/icon editing, ordering, focus, geometry and the 22-background gallery. Preview screenshots use simulated TV APIs; they do not prove physical-TV behavior. The final six series backgrounds and optional Live TV card were installed; a separate final physical verification of every new option was not recorded.

El propietario confirmó la apertura de TDT, el cambio de canal desde la lista izquierda, los ajustes rápidos de Samsung y el funcionamiento general. Las pruebas de navegador cubren preferencias, editor de nombres/iconos HDMI, ordenación, foco, geometría y los 22 fondos. Las capturas usan API simuladas y no prueban por sí mismas el funcionamiento físico. Los seis últimos fondos de series y el acceso opcional a TV en directo se instalaron; no quedó registrada una comprobación física final de cada opción nueva.

Pending limitations: reliable fixed startup after warm standby; live synchronization of Samsung HDMI aliases; Samsung store opening needs owner verification. / Limitaciones pendientes: arranque fijo tras espera, sincronización en tiempo real de nombres HDMI de Samsung y verificación de la apertura de la tienda.

## Private recovery / Recuperación privada

Git intentionally excludes `.local/`, `dist/`, certificates, passwords and recovery state. The existing installation's stable identity, certificates and original native Home baseline remain local. Do not overwrite them when making future updates. Original TV recovery backups and unused design drafts also remain outside this repository.

Git excluye `.local/`, `dist/`, certificados, contraseñas y recuperación. La identidad estable, los certificados y los valores originales de Inicio permanecen en el equipo del propietario. No los sobrescribas al actualizar. Las copias de recuperación y los borradores gráficos descartados también quedan fuera del repositorio.

## Archive validation / Validación del archivo

On 2 November 2026, ESLint, widget/resource validation, all 22 simulated device-adapter tests, the current bedroom browser regression suite (Edge), public-source scanning and the unsigned public-font export passed. The browser checks use mocked Tizen APIs. Native Windows cannot run the inherited POSIX tooling tests; the Linux GitHub workflow includes them. Hosted workflow results must be checked separately after pushing.

El 2 de noviembre de 2026 pasaron ESLint, validación de recursos, los 22 tests del adaptador simulado, las pruebas actuales de navegador en Edge, el escaneo de publicación y la exportación sin firmar con fuentes públicas. Windows no puede ejecutar directamente los tests POSIX heredados; están incluidos en el flujo Linux de GitHub. Su resultado remoto debe comprobarse después de subir.

## Channel activation update / Actualización de selección de canales · 2026-11-02

Pressing OK or clicking a channel now tunes it and opens the native full-screen TV viewer after successful tuning. Moving remote focus retains preview tuning; hover never opens full-screen. The separate full-screen button remains available. Failed tuning stays in the list, and stale/cancelled requests cannot trigger a later handoff. The owner confirmed the update after installation on both TVs and authorized publication.

Pulsar OK o hacer clic en un canal lo sintoniza y abre el visor a pantalla completa tras confirmar la sintonización. Mover el foco conserva la vista previa; pasar el puntero no abre pantalla completa. Se conserva el botón independiente. Los errores dejan la lista abierta y las peticiones canceladas o sustituidas no abren el visor después. El propietario confirmó el funcionamiento tras instalar en ambas TVs y autorizó la publicación.

Validation: ES5 lint, resource checks, simulated adapter tests, and browser checks at 1080p/720p covering focus versus activation, explicit full-screen button, tune errors, superseded requests, Back and delayed preview cleanup. Personal signing, device identities and recovery records remain excluded from Git.

Validación: sintaxis ES5, recursos, adaptador simulado y navegador a 1080p/720p, incluyendo foco frente a pulsación, botón independiente, errores de sintonización, peticiones sustituidas, Volver y limpieza tardía de la vista previa. Firma personal, identidades y recuperación quedan fuera de Git.

## Bedroom startup follow-up / Seguimiento del arranque del dormitorio · 2026-11-02

The earlier power-on limitation was resolved in the owner's controlled test by enabling **Start with Smart Hub** and disabling **Autorun Last App**, while preserving the custom native Home and home-app assignment. The two options are distinct. The owner confirmed that our launcher appeared on power-on with tuned broadcast channels retained. This supersedes the earlier pending/failed startup observations for that configuration; it does not guarantee every power state or future firmware. Original and repair-state recovery snapshots remain private and unchanged.

La prueba controlada del propietario resolvió el arranque activando **Iniciar con Smart Hub** y desactivando **Iniciar última aplicación**, conservando la asignación nativa de Inicio y nuestra app de inicio. Son opciones distintas. El propietario confirmó que apareció nuestro menú al encender, manteniendo los canales sintonizados. Este resultado actualiza las observaciones anteriores de fallo o prueba pendiente para esa configuración; no garantiza todos los estados ni futuros firmwares. Los originales de recuperación y reparación siguen privados y sin sobrescribir.

## Unlimited carousel and monochrome apps / Carrusel sin límite y apps monocromas · 2026-11-02

Removed the nine-shortcut Home limit and the 256-record restore truncation. Existing Home order is preserved, with the same initial default selection size. Users can add installed apps and available HDMI/Live TV shortcuts without an application-imposed maximum. The order editor scrolls independently, preserves focus, and supports moving/removing/undoing entries beyond the old limit. Storage failures retain the previous saved state.

Se elimina el límite de nueve accesos y el recorte de restauración a 256 registros. Se conservan el orden guardado y el tamaño de la selección inicial. Se pueden añadir apps instaladas y accesos HDMI/TDT disponibles sin máximo impuesto por la app. El editor desplaza su columna de orden y mantiene foco, mover/quitar/deshacer más allá del límite anterior. Los fallos de almacenamiento conservan el estado guardado anterior.

Added bundled theme-aware Crunchyroll and SmartTV Club marks, using their installed IDs or exact normalized names. Sources/licences are recorded in ADDITIONAL-SOURCES.json and third-party notices. Browser validation covers 49 interactively added/reordered shortcuts, a 310-entry saved catalogue with discovery unavailable, reload, long-list navigation, editor visibility, and both icons in light/dark at 1080p/720p. Physical confirmation is pending after installation.

Se añaden marcas monocromas de Crunchyroll y SmartTV Club a partir de IDs/nombres reales. Fuentes y condiciones constan en los registros de recursos. Las pruebas de navegador cubren 49 accesos añadidos/ordenados, 310 guardados sin consulta disponible, recarga, navegación, visibilidad del editor e iconos claros/oscuros a 1080p/720p. La comprobación física queda pendiente después de instalar.

Owner validation / Validación del propietario · 2026-11-02: the owner accepted the unlimited-carousel and two monochrome-icon update for the bedroom and games TVs and authorized publication. El propietario da por válida la actualización del carrusel sin límite y los dos iconos en dormitorio y juegos, y autoriza su publicación.
