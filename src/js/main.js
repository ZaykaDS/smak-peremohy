import '../css/tokens.css';
import '../css/base.css';
import '../css/layout.css';
import '../css/components.css';
import '../css/animations.css';

import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initParallax } from './parallax.js';
import { initModal, initForm, initCart } from './modal.js';

const run = () => {
  initNavigation();
  initAnimations();
  initParallax();
  initModal();
  initCart();
  initForm();
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
else run();
