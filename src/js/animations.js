const root = document.documentElement;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

export function initAnimations() {
  const motion = root.classList.contains('motion');
  prepareLines();
  if (!motion) return; // reduced motion / no JS: everything is already visible

  hero();
  reveals();
  scrollScenes();
}

/* Index every .line so CSS can stagger them. */
function prepareLines() {
  document.querySelectorAll('[data-lines], .hero__title').forEach((box) => {
    box.querySelectorAll('.line').forEach((l, i) => l.style.setProperty('--i', i));
  });
}

/* ---------------- hero intro + scroll-out ---------------- */
function hero() {
  const start = () => {
    root.classList.add('hero-in');
    setTimeout(() => root.classList.add('hero-done'), 1700);
  };
  requestAnimationFrame(() => requestAnimationFrame(start));
}

/* ---------------- IntersectionObserver reveals ---------------- */
function reveals() {
  const targets = document.querySelectorAll('[data-reveal], [data-lines]');
  // stagger siblings that reveal together
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal'));
    el.style.setProperty('--i', Math.min(sibs.indexOf(el), 4));
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
  targets.forEach((t) => io.observe(t));
}

/* ---------------- scroll-driven scenes (single rAF loop) ---------------- */
function scrollScenes() {
  const vh = () => window.innerHeight;
  const scenes = [];
  const add = (el, fn) => el && scenes.push({ el, fn, visible: true });

  /* hero scale/fade while the next section slides over it */
  const heroEl = document.querySelector('[data-hero]');
  add(heroEl, () => {
    const p = clamp(window.scrollY / vh());
    root.style.setProperty('--hs', (1 + 0.07 * p).toFixed(4));
    root.style.setProperty('--hy', `${(-p * 40).toFixed(1)}px`);
    root.style.setProperty('--ho', (1 - 0.55 * p).toFixed(3));
    heroEl.style.visibility = window.scrollY > vh() * 1.15 ? 'hidden' : '';
  });

  /* about: organic mask reveal */
  const photo = document.querySelector('[data-mask] .about__img');
  const photoBox = document.querySelector('[data-mask]');
  add(photoBox, () => {
    const r = photoBox.getBoundingClientRect();
    const p = smooth(0, 1, (vh() * 0.95 - r.top) / (vh() * 0.62));
    photo.style.setProperty('--mask-in', `${((1 - p) * 26).toFixed(2)}%`);
    photo.style.setProperty('--mask-r', `${(3 + (1 - p) * 44).toFixed(2)}%`);
  });

  /* team strip drift */
  const strip = document.querySelector('[data-drift]');
  add(strip?.parentElement, () => {
    const r = strip.parentElement.getBoundingClientRect();
    const p = clamp((vh() - r.top) / (vh() + r.height));
    strip.style.setProperty('--drift', `${((0.5 - p) * 0.09 * window.innerWidth).toFixed(1)}px`);
  });

  /* story: words light up */
  const story = document.querySelector('[data-words]');
  if (story) {
    const words = story.textContent.trim().split(/\s+/);
    story.textContent = '';
    const spans = words.map((w) => {
      const s = document.createElement('span');
      s.className = 'w'; s.textContent = w;
      story.append(s, ' ');
      return s;
    });
    let last = -1;
    add(story.parentElement, () => {
      const r = story.parentElement.getBoundingClientRect();
      const p = clamp((vh() * 0.72 - r.top) / (r.height * 0.62));
      const n = Math.round(p * spans.length);
      if (n === last) return;
      last = n;
      spans.forEach((s, i) => s.classList.toggle('on', i < n));
    });
  }

  /* bread of good */
  const good = document.querySelector('[data-good]');
  add(good, () => {
    const r = good.getBoundingClientRect();
    const p = clamp((-r.top + vh() * 0.3) / (r.height - vh() + vh() * 0.3));
    good.style.setProperty('--g', smooth(0.04, 0.3, p).toFixed(3));
    good.style.setProperty('--g2', smooth(0.2, 0.46, p).toFixed(3));
    good.style.setProperty('--g3', smooth(0.5, 0.74, p).toFixed(3));
    good.style.setProperty('--gy', `${((0.5 - p) * 80).toFixed(1)}px`);
    good.style.setProperty('--gs', (1.05 + p * 0.07).toFixed(3));
  });

  /* form section: cut-out photos float at different speeds */
  document.querySelectorAll('[data-drift-y]').forEach((el) => {
    const k = parseFloat(el.dataset.driftY);
    add(el, () => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--dy', `${((r.top + r.height / 2 - vh() / 2) * k).toFixed(1)}px`);
    });
  });

  /* products: pinned horizontal scroll on large screens */
  const showcase = document.querySelector('[data-showcase]');
  const track = showcase?.querySelector('[data-track]');
  const sticky = showcase?.querySelector('.showcase__sticky');
  const mq = window.matchMedia('(min-width: 1024px) and (min-height: 560px)');
  let dist = 0;
  const measure = () => {
    const on = mq.matches;
    showcase.classList.toggle('is-h', on);
    showcase.style.height = '';
    track.style.removeProperty('--tx');
    if (!on) return;
    dist = Math.max(0, sticky.scrollWidth - window.innerWidth);
    showcase.style.height = `${vh() + dist}px`;
  };
  if (showcase) {
    measure();
    mq.addEventListener('change', measure);
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    document.fonts?.ready.then(measure);
    add(showcase, () => {
      if (!showcase.classList.contains('is-h')) return;
      const r = showcase.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - vh()));
      track.style.setProperty('--tx', `${(-dist * p).toFixed(1)}px`);
    });
  }

  /* run only for scenes near the viewport */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { scenes.find((s) => s.el === en.target).visible = en.isIntersecting; });
  }, { rootMargin: '25% 0px 25% 0px' });
  scenes.forEach((s) => io.observe(s.el));

  let queued = false;
  const frame = () => { queued = false; scenes.forEach((s) => s.visible && s.fn()); };
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  frame();
}
