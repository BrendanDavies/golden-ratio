// @flow
/* global window */
import { sections, spiral, wrapper } from './elements';

const aspect = 0.618033;
const axis = 0.7237;
const sectionCount = sections.length;

/**
 * Returns largest golden ratio rectangle that will fit in viewport
 */
function getSpiralDimensions() {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const isSmallScreen = windowWidth < 960;
  const isLandscape = windowHeight < windowWidth;
  let xOrigin;
  let yOrigin;
  let sectionSize;
  let rectHeight;
  let rectWidth;

  if (isSmallScreen && !isLandscape) { // flip it 90deg if it's a portrait phone
    sectionSize = windowWidth;
    rectHeight = sectionSize / aspect;
    rectWidth = sectionSize;
    xOrigin = Math.floor(rectWidth * (1 - axis));
    yOrigin = Math.floor(rectHeight * axis);
  } else {
    sectionSize = Math.min(windowWidth * aspect, windowHeight);
    rectHeight = sectionSize;
    rectWidth = sectionSize / aspect;
    xOrigin = Math.floor(rectWidth * axis);
    yOrigin = Math.floor(rectHeight * axis);
  }

  return {
    xOrigin,
    yOrigin,
    sectionSize,
    rectHeight,
    rectWidth,
  };
}

/**
 * Builds spiral element and sections
 * @param {Object} dimensions Object with dimensions of spiral
 */
export function buildSpiral() {
  const dimensions = getSpiralDimensions();
  const spiralOrigin = `${dimensions.xOrigin}px ${dimensions.yOrigin}px`;

  // Set height and width of wrapper Rectangle (for centering)
  wrapper.style.width = dimensions.rectWidth;
  wrapper.style.height = dimensions.rectHeight;
  // Set transform origin for spiral
  spiral.style.transformOrigin = spiralOrigin;
  // Style each section
  sections.forEach((section, index) => {
    const sectionRotation = Math.floor(90 * index);
    const scale = aspect ** index;
    const alpha = 1 - (index / sectionCount);

    if (index === 0) {
      section.classList.add('active');
    }

    section.style.width = dimensions.sectionSize;
    section.style.height = dimensions.sectionSize;
    section.style.transformOrigin = spiralOrigin;
    section.style.backgroundColor = `rgba(129, 52, 5, ${alpha})`;
    section.style.transform = `rotate(${sectionRotation}deg) scale(${scale}) translate3d(0,0,0)`;
  });
}

/**
 * Clear active flag from any sections
 */
export function clearActiveSections() {
  window.document.querySelectorAll('.section.active').forEach((activeSection) => {
    activeSection.classList.remove('active');
  });
}

/**
 * Returns the index of the first active solution
 */
export function getActiveSectionIndex(): Number {
  let activeIndex;
  sections.forEach((section, index) => {
    if (section.classList.contains('active')) {
      activeIndex = index;
    }
  });
  return activeIndex;
}

/**
 * Handles selecting an section
 * @param {Number} index - index of item to select
 */
export function scrollToItem(index: Number): Function {
  return () => {
    const rotation = -90 * index;
    const scale = aspect ** -index;

    if (index >= 0 && index < sections.length) {
      clearActiveSections();
      sections[index].classList.add('active');
      spiral.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    }
  };
}
