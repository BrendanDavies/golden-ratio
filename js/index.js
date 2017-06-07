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

      section.style.width = dimensions.sectionSize;
      section.style.height = dimensions.sectionSize;
      section.style.transformOrigin = spiralOrigin;
      section.style.backgroundColor = `rgb(${dimmedColor},50,50)`;
      section.style.transform = `rotate(${sectionRotation}deg) scale(${scale}) translate3d(0,0,0)`;
    });
  }

  buildSpiral(getSpiralDimensions());

// Click Handler
// TODO: USE DELEGATE LISTENER
  sections.forEach((section, index) => {
    section.addEventListener('click', () => {
      const rotation = -90 * index;
      const scale = aspect ** (rotation / 90);
      spiral.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    });
  });
}());
