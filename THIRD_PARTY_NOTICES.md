# Third-party notices

The root MIT licence covers CleanFrame's original code and documentation. Third-party material retains the terms below. Keep these notices and the adjacent licence texts when sharing source or a build.

## Fonts

| Material | Terms and source record |
| --- | --- |
| Manrope | SIL Open Font License 1.1; `app/assets/manrope-OFL.txt` |
| Geist and Newsreader | SIL Open Font License 1.1; licences beside the files in `app/assets/fonts/`, with exact sources and hashes in `app/assets/fonts/SOURCES.json` |
| Optional PP Neue Montreal, PP Mori and PP Pangram Sans | Proprietary. Binaries stay in ignored `.local/` storage and are excluded from Git and public exports. The optional local overlay requires the user's own permission to use and embed those files. |

The public app uses Manrope, Geist and Newsreader. A personal widget containing proprietary fonts must stay private. See [Pangram's licensing information](https://pangrampangram.com/pages/eula).

## Icons and trademarks

| Material | Provenance and terms |
| --- | --- |
| Simple Icons service marks | CC0; exact revisions and adaptations in `app/assets/icons/SOURCES.json` and `ADDITIONAL-SOURCES.json`. The CC0 text is retained beside the icons. |
| Disney+, ABC and SBS marks | [Custom Brand Icons](https://github.com/elax46/custom-brand-icons), MIT. The retained licence is `app/assets/icons/CUSTOM-BRAND-ICONS-LICENSE.txt`. ABC and SBS sources were replaced during the public-source review. Exact revisions, source files and extraction/recolour notes are in `SOURCES.json`. |
| Art, apps, settings and home outlines | Original CleanFrame drawings, covered by the project's MIT licence. |

Brand marks identify services. Their owners retain trademark rights; this project claims no endorsement or affiliation. The older Australian TV icon archive's GPL text is retained for historical provenance only; no current icon uses that archive.

## Wallpapers and derived materials in this adaptation

The current application bundles 22 AI-generated backgrounds (11 day/night pairs), created with OpenAI ImageGen for this project. Selected full-resolution masters and generation prompts are in `design/backgrounds/`; runtime files and provenance are recorded in `app/assets/wallpapers/SOURCES.json`. Runtime JPEGs, thumbnails, panels and pre-rendered materials derive from those masters. Generated scenes may depict recognizable product shapes; no platform or manufacturer endorsement is claimed. Distribution does not grant rights to third-party trademarks.

The upstream Unsplash photographs were removed from the current app. Their historical source register and notices remain in Git history and upstream documentation; do not describe those photographs as the active gallery.

## Development dependencies and exports

Development dependencies retain the licences in their npm packages. They are not copied into the TV JavaScript runtime.

`npm run export:public` excludes private fonts and includes this notice and the root MIT licence. Preserve the included font and icon licence texts. Review [public release preparation](docs/public-release.md) before publishing a repository or download.

## Additional identifying brand marks in the bedroom variant

3Cat, SkyShowtime and atresplayer SVG artwork comes from the owners' official sites; monochrome adaptations retain the identifying geometry. Copyright and trademark rights remain with the respective owners; these marks are not relicensed under the repository's MIT licence. Sources are recorded in app/assets/icons/ADDITIONAL-SOURCES.json. Steam, original Nintendo Switch and PlayStation 5 marks use Simple Icons artwork under the included CC0 licence; trademark rights remain with their owners.

Crunchyroll identifying artwork uses Simple Icons 11.0.0 under its included CC0 licence; trademark rights remain with its owner. SmartTV Club artwork is a monochrome adaptation of the official website logo, retaining its owner's copyright/trademark rights; it is not relicensed under the code's MIT licence. Exact sources and adaptation notes are in app/assets/icons/ADDITIONAL-SOURCES.json.
