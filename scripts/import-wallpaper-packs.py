"""Prepare the owner's selected artwork packs for the RU8005 build.

Run before build-materials.mjs. Source PNGs remain outside the app. Previous
runtime wallpapers/materials are backed up before removal, never the masters.
"""
import hashlib
import json
from pathlib import Path
import shutil
from datetime import datetime
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'design/packs'
APP = ROOT / 'app'


def main():
    index = json.loads((SOURCE / 'index.json').read_text(encoding='utf-8'))
    plans = []
    for entry in index['packages']:
        folder = SOURCE / 'paquetes' / entry['id']
        data = json.loads((folder / 'pack.json').read_text(encoding='utf-8'))
        for scene in data['scenes']:
            for key in ['day', 'night']:
                if not (folder / scene[key]).is_file():
                    raise ValueError('Missing artwork: ' + scene[key])
        plans.append((folder, data))
    backup = ROOT / '.local/backups' / ('ru8005-before-packs-' + datetime.now().strftime('%Y%m%d-%H%M%S'))
    for sub in ['wallpapers', 'materials']:
        original = APP / 'assets' / sub
        shutil.copytree(original, backup / sub)
        # Only regular JPEG assets in these exact app folders are removed.
        for image in original.glob('*.jpg'):
            image.unlink()
    walls, packs, sources = [], [], []
    for folder, data in plans:
        pack = dict(id=data['id'], name=data['title'], scenes=[])
        for scene in data['scenes']:
            out = dict(id=scene['id'], name=scene['name'])
            for key, suffix in [('day', 'dia'), ('night', 'noche')]:
                ident = data['id'] + '-' + scene['id'] + '-' + suffix
                out[key] = ident
                source = folder / scene[key]
                with Image.open(source) as original:
                    image = ImageOps.fit(original.convert('RGB'), (1920, 1080), Image.Resampling.LANCZOS)
                for tag, size, quality in [('', (1920, 1080), 88), ('-thumb', (320, 180), 83)]:
                    image.resize(size, Image.Resampling.LANCZOS).save(APP / 'assets/wallpapers' / (ident + tag + '.jpg'), quality=quality, subsampling=0 if not tag else 2, optimize=True, progressive=False)
                day = key == 'day'
                metadata = dict(id=ident, name=scene['name'] + (' Día' if day else ' Noche'), src='assets/wallpapers/' + ident + '.jpg', thumb='assets/wallpapers/' + ident + '-thumb.jpg', pack=data['id'], scene=scene['id'], variant=key, tone='light' if day else 'dark', ut=dict(tr='dark' if day else 'light', br='dark' if day else 'light'), frostVeil=.12, listColumn=0, dockQuiet=False, clockMist=False, daylight=day)
                walls.append(metadata)
                sources.append(dict(metadata, credit='Created with OpenAI image generation for CleanFrame', source='design/packs/' + data['id'] + '/' + scene[key], originalSha256=hashlib.sha256(source.read_bytes()).hexdigest()))
            pack['scenes'].append(out)
        packs.append(pack)
    dest = APP / 'assets/wallpapers'
    (dest / 'catalog.js').write_text('/* Selected wallpaper packs. Generated offline. */\nwindow.CleanFrameWallpapers = ' + json.dumps(walls, ensure_ascii=False, indent=2) + ';\nwindow.CleanFrameWallpaperPacks = ' + json.dumps(packs, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    (dest / 'SOURCES.json').write_text(json.dumps(sources, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('Prepared', len(packs), 'packs and', len(walls), 'wallpapers. Recovery copy:', backup)


if __name__ == '__main__':
    main()
