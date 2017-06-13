/* global window */
import { buildSpiral, scrollToItem } from './spiral';
import { sections } from './elements';
import keyHandler from './key-handler';

// Build Spiral
buildSpiral();

// Resize Handler
window.addEventListener('resize', () => buildSpiral());

// Click Handler
// TODO: USE DELEGATE LISTENER
sections.forEach((section, index) => {
  section.addEventListener('click', scrollToItem(index));
});

// Key Down
window.addEventListener('keydown', keyHandler);
