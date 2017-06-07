/* global window */
(function iife() {
  const aspect = 0.618033;
  const axis = 0.7237;

  const sections = window.document.querySelectorAll('.js-section');
  const spiral = window.document.querySelector('.spiral');
  const wrapper = window.document.querySelector('.wrapper');
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
  function buildSpiral(dimensions = {}) {
    const spiralOrigin = `${dimensions.xOrigin}px ${dimensions.yOrigin}px`;

    // Set height and width of wrapper Rectangle (for centering)
    wrapper.style.width = dimensions.rectWidth;
    wrapper.style.height = dimensions.rectHeight;
    spiral.style.transformOrigin = spiralOrigin;
    sections.forEach((section, index) => {
      const sectionRotation = Math.floor(90 * index);
      const scale = aspect ** index;
      const dimmedColor = Math.floor(255 - (index * (255 / sectionCount)));

      if (index === 0) {
        section.classList.add('active');
      }

      section.style.width = dimensions.sectionSize;
      section.style.height = dimensions.sectionSize;
      section.style.transformOrigin = spiralOrigin;
      section.style.backgroundColor = `rgb(${dimmedColor},50,50)`;
      section.style.transform = `rotate(${sectionRotation}deg) scale(${scale}) translate3d(0,0,0)`;
    });
  }

  /**
   * Clear active flag from any sections
   */
  function clearActiveSections() {
    window.document.querySelectorAll('.js-section.active').forEach((activeSection) => {
      activeSection.classList.remove('active');
    });
  }

  /**
   * Returns the index of the first active solution
   */
  function getActiveSectionIndex() {
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
  function scrollToItem(index) {
    return () => {
      const rotation = -90 * index;
      const scale = aspect ** (rotation / 90);

      if (index >= 0 && index < sections.length) {
        clearActiveSections();
        sections[index].classList.add('active');
        spiral.style.transform = `rotate(${rotation}deg) scale(${scale})`;
      }
    };
  }

  buildSpiral(getSpiralDimensions());

// Resize Handler
  window.addEventListener('resize', () => buildSpiral(getSpiralDimensions()));

// Click Handler
// TODO: USE DELEGATE LISTENER
  sections.forEach((section, index) => {
    section.addEventListener('click', scrollToItem(index));
  });

// Directional Keys
  const KEY_CODES = {
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
  };

  window.addEventListener('keydown', (e) => {
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

    if (FORWARD_KEYS.indexOf(e.keyCode) !== -1) {
      indexToSelect = currentActiveSection + 1;
    } else if (BACK_KEYS.indexOf(e.keyCode) !== -1) {
      indexToSelect = currentActiveSection - 1;
    }

    scrollToItem(indexToSelect)();
  });
}());
