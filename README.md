# Смак Перемоги — interactive landing demo

Vite + vanilla JS/CSS, no runtime dependencies (fonts are self-hosted via `@fontsource`).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run images   # regenerate AVIF/WebP from src/assets/src (needs Python + Pillow + pillow-avif-plugin + numpy)
```

**Cloudflare Pages:** build command `npm run build`, output directory `dist`.

## Structure
- `index.html` — markup (wavy SVG paths are inlined from `src/assets/blob-*.txt` by `vite.config.js`)
- `src/css/` — tokens, base, layout, components, animations
- `src/js/` — navigation, animations (IntersectionObserver + one rAF scroll loop), parallax, modal/cart/form
- `IMPLEMENTATION_PLAN.md` — sections, animation map, decisions

## Notes
- Demo only: cart, donation modal and contact form send nothing.
- Photos were cropped from raster screenshots inside the PDF (low resolution). Replace files in `src/assets/src/` with originals (same names) and run `npm run images`.
- `motion` class on `<html>` is set only when `prefers-reduced-motion` is not `reduce`; otherwise all content is shown statically.

## Data to confirm before production
- **Phone `+38 095 101 73 66`** (contacts section, footer) — taken from the "Контакти" slide of the PDF; the PDF footer shows a different placeholder (`+38 095 000 00 00`). Needs client confirmation.
- Email, address, working hours, partner logos and the "Звіти" list are also copied from the PDF and should be verified.
- Social links, report links and "Детальніше" links are demo placeholders.
