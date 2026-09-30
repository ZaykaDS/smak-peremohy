# Смак Перемоги — Implementation Plan

Source of truth: `Пензева_Анастасія_СМАК_ПЕРЕМОГИ_1 (2).pdf` (14 slides, Taste of Victory).

## 1. Что реально есть в макете

| Слайд | Содержание |
|---|---|
| 2–3 | Концепция, цель сайта |
| 6 | Палитра, Montserrat + Caveat, мягкие формы, line-art выпечка |
| 7 | Главная (hero: зелёный фон, волнистая кремовая форма, пакет-логотип, tagline Caveat, «Магазин» / «Підтримка», полосатый разделитель) |
| 8–9 | Магазин, карточка товара (вне scope демо-лендинга) |
| 11 | Підтримка (3 варианта: разова допомога / підписка / хліб добра), Звіти, Партнери |
| 12–13 | Контакти + карта в волнистой рамке, форма «Зв'язатися з нами» с вырезанными фото по краям |
| 14 | Mobile: hero, Підтримка |

Полная desktop-страница главной: Hero → Про нас → Чим ми відрізняємось (4 карточки) → Бестселери (4 товара) → Підтримка → Партнери → Footer.

### Расхождения ТЗ ↔ PDF (решения)
- В PDF **нет** отдельных секций Impact/People, «Хліб добра» (только карточка поддержки), News. Решение: Impact строится из «Чим ми відрізняємось» + текста «Кожна покупка має значення»; «Хліб добра» — отдельный экран по ТЗ, текст только из PDF («Подаруйте хліб або каву тому, хто цього потребує»), механику не выдумываем; News → «Звіти» (3 пункта из PDF).
- Контакты берём из слайдов PDF (телефон `+38 095 101 73 66`, email, адрес «м. Київ, провулок Червиновського 5а», график). В футере PDF стоит `+38 095 000 00 00` — в демо везде один номер из раздела «Контакти».
- Фото в PDF — растровые скриншоты низкого разрешения (товары ≈135 px, команда ≈320 px). Только фото хлеба (слайд 10) — hi-res. Для продакшена нужны оригиналы.

## 2. Design tokens (сняты с PDF)
`--cream #fff8ee` · `--beige #eadfcd` · `--green #366b57` · `--orange #fdb14f` · текст `#161616`.
Montserrat 400/600 (текст), Caveat 500 (акцент, заголовки секций). Радиусы: pill 999, карточки 16–20, «organic» — SVG-волна.

## 3. Секции
Header → Hero → (stripes) → Про нас → Команда (strip) → Чим ми відрізняємось → Бестселери (horizontal showcase) → Storytelling pause → Хліб добра → Підтримка → Звіти → Партнери → Контакти → Форма → Footer.

## 4. Animation map

| Element | Trigger | Animation | Duration | Mobile | Reduced motion |
|---|---|---|---|---|---|
| Hero blob / bag / tagline / CTA / decor | load | staggered entrance (scale 1.03→1, line reveal, rise) | 0.8–1.4 s total | same | показать сразу |
| Hero layers | pointer | parallax 3 слоя (2–3 / 5–8 / 8–12 px) | continuous | off | off |
| Hero → «Про нас» | scroll | hero scale/translate, следующая секция перекрывает (negative margin + sticky) | scroll-linked | упрощённо | off |
| Stripes | load | — (статичный элемент бренда) | — | — | — |
| «Про нас» headline lines | in-view | line reveal | 700 ms | same | off |
| Baker photo | scroll | organic mask reveal (clip-path inset+radius) | scroll-linked | same | сразу полный кадр |
| Team strip | scroll | лёгкий горизонтальный drift | scroll-linked | off | off |
| Difference cards | in-view | stagger fade+translate | 600 ms | same | off |
| Bestsellers | scroll (desktop) | pinned horizontal track | scroll-linked | вертикальный список | вертикальный список |
| Product hover | hover | photo scale 1.035, title shift, arrow nudge | 300 ms | — | off |
| Storytelling | scroll | word-by-word fill | scroll-linked | same | сразу |
| Хліб добра | scroll | фото parallax + ХЛІБ/ДОБРА reveal + CTA | scroll-linked | reveal без parallax | сразу |
| Modal | click | bottom sheet / dialog | 300 ms | bottom sheet | без анимации |
| Support cards | hover | tilt/lift 4 px | 250 ms | — | off |
| Add to cart | click | label «Додано ✓», badge bump | 250 ms | same | без bump |
| Form | focus/submit | focus ring, success state | 250 ms | same | same |
| Footer wordmark | in-view | slide-up | 700 ms | same | off |

## 5. Performance risks
- Hero LCP: preload `hero-bag`; blob — inline SVG.
- Scroll-linked работа: один rAF-цикл, только `transform`/`clip-path`/CSS vars, `IntersectionObserver` для активации.
- Изображения: AVIF/WebP `<picture>`, lazy кроме hero.
- Шрифты: self-hosted woff2 (cyrillic+latin), `font-display: swap`, 3 начертания.
- Без GSAP: всё делается CSS + IO + rAF.

## 6. Deploy
`npm run build` → `dist/`. Cloudflare Pages: build `npm run build`, output `dist`. Публикация — только по явной команде пользователя.
