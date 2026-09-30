"""Optimise sources in src/assets/src -> AVIF/WebP (multiple widths) in src/assets/img."""
from pathlib import Path
from PIL import Image
try:
    import pillow_avif  # noqa: F401
    AVIF = True
except ImportError:
    AVIF = False

SRC, OUT = Path('src/assets/src'), Path('src/assets/img')
WIDTHS = {'bread-hero': [640, 1200, 1800]}  # default: native width only
OUT.mkdir(parents=True, exist_ok=True)
for f in sorted(SRC.glob('*.png')):
    im = Image.open(f).convert('RGB')
    for w in WIDTHS.get(f.stem, [im.width]):
        w = min(w, im.width)
        r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS) if w != im.width else im
        r.save(OUT / f'{f.stem}-{w}.webp', quality=82, method=6)
        if AVIF:
            r.save(OUT / f'{f.stem}-{w}.avif', quality=55)
        print(f.stem, w, r.height)
print('avif' if AVIF else 'webp only')
