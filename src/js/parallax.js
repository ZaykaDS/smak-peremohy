const root = document.documentElement;

// Pointer parallax for the hero: 3 layers via [data-depth] (px of max travel). Desktop with a mouse only.
export function initParallax() {
  if (!root.classList.contains('motion')) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const layers = [...hero.querySelectorAll('[data-depth]')].map((el) => ({ el, depth: +el.dataset.depth }));

  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
  const tick = () => {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    layers.forEach(({ el, depth }) => {
      el.style.setProperty('--px', (cx * depth).toFixed(2) + 'px');
      el.style.setProperty('--py', (cy * depth).toFixed(2) + 'px');
    });
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(tick) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    kick();
  });
  hero.addEventListener('pointerleave', () => { tx = ty = 0; kick(); });
}
