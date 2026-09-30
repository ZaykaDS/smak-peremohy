const CONTENT = {
  good: { title: 'Хліб добра', text: 'Допоможіть подарувати хліб тому, хто його потребує.', action: 'Подарувати' },
  once: { title: 'Разова допомога', text: 'Кожна допомога — це нові можливості для людей.', action: 'Підтримати разово' },
  sub: { title: 'Підписка', text: 'Регулярна підтримка допомагає планувати розвиток і створювати більше робочих місць.', action: 'Оформити підписку' },
  demo: { title: 'Незабаром', text: 'Ця сторінка ще не готова в демонстраційній версії. У робочому сайті тут буде окрема сторінка або посилання.', action: 'Зрозуміло' },
  cart: { title: 'Кошик', text: 'У демонстраційній версії кошик і оформлення замовлення недоступні.', action: 'Зрозуміло' },
};

let cartCount = 0;

export function initModal() {
  const dialog = document.querySelector('[data-modal]');
  if (!dialog) return;
  const title = dialog.querySelector('[data-modal-title]');
  const text = dialog.querySelector('[data-modal-text]');
  const action = dialog.querySelector('[data-modal-action]');

  document.addEventListener('click', (e) => {
    const demo = e.target.closest('a[data-demo]');
    if (demo) e.preventDefault(); // placeholder links open the shared demo dialog
    const btn = demo || e.target.closest('[data-open-modal]');
    if (!btn) return;
    const key = demo ? 'demo' : btn.dataset.openModal;
    const c = CONTENT[key] || CONTENT.good;
    title.textContent = c.title;
    text.textContent = key === 'cart' && cartCount
      ? `${c.text} Додано позицій: ${cartCount}.` : c.text;
    action.textContent = c.action;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
  });

  // Click on the backdrop closes the dialog; Escape is native.
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.documentElement.style.overflow = ''; });
}

export function initCart() {
  const badge = document.querySelector('[data-cart-count]');
  const cartBtn = document.querySelector('.cart');
  document.querySelectorAll('[data-add]').forEach((btn) => {
    const label = btn.textContent;
    let timer;
    btn.addEventListener('click', () => {
      cartCount += 1;
      badge.textContent = String(cartCount);
      badge.hidden = false;
      badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump');
      cartBtn.setAttribute('aria-label', `Кошик, товарів: ${cartCount}`);
      btn.textContent = 'Додано ✓';
      clearTimeout(timer);
      timer = setTimeout(() => { btn.textContent = label; }, 1600);
    });
  });
}

export function initForm() {
  const form = document.querySelector('[data-form]');
  if (!form) return;
  const err = form.querySelector('[data-form-error]');
  const ok = form.querySelector('[data-form-ok]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    ok.hidden = true;
    let firstBad = null;
    form.querySelectorAll('input, textarea').forEach((f) => {
      const bad = !f.checkValidity() || !f.value.trim();
      f.setAttribute('aria-invalid', String(bad));
      if (bad && !firstBad) firstBad = f;
    });
    if (firstBad) {
      err.textContent = 'Будь ласка, заповніть усі обов’язкові поля коректно.';
      err.hidden = false;
      firstBad.focus();
      return;
    }
    err.hidden = true;
    form.reset(); // demo: nothing is sent anywhere
    ok.hidden = false;
  });
  form.addEventListener('input', (e) => e.target.removeAttribute?.('aria-invalid'));
}
