import { getActiveSectionIndex, scrollToItem } from './spiral';

// Directional Keys
const KEY_CODES = {
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

export default function (event) {
  const FORWARD_KEYS = [
    KEY_CODES.DOWN,
    KEY_CODES.RIGHT,
    KEY_CODES.SPACE,
  ];
  const BACK_KEYS = [
    KEY_CODES.LEFT,
    KEY_CODES.UP,
  ];
  const currentActiveSection = getActiveSectionIndex();
  let indexToSelect;

  if (FORWARD_KEYS.indexOf(event.keyCode) !== -1) {
    indexToSelect = currentActiveSection + 1;
  } else if (BACK_KEYS.indexOf(event.keyCode) !== -1) {
    indexToSelect = currentActiveSection - 1;
  }

  scrollToItem(indexToSelect)();
}
