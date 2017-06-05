/* global window Rx */
(function iife() {
  const aspect = 0.618033;
  const axis = 0.7237;

  const sections = window.document.querySelectorAll('.js-section');
  const spiral = window.document.querySelector('.spiral');
  const wrapper = window.document.querySelector('.wrapper');
  const sectionCount = sections.length;

  const KEY_CODES = {
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
  };

  // State Variables
  let rotation = 0;
  let currentSection = 0;
  let moved = 0;
  let touchStart = {};
  let animRAF;
  let scrollTimeout;

// FUNCTIONS ////////////
  // keep it from getting too small or too big
  function trimRotation(degrees) {
    return Math.max(-1500, Math.min(1200, degrees));
  }

  function scrollHandler() {
    window.requestAnimationFrame(() => {
      const scale = aspect ** (rotation / 90);
      currentSection = Math.min(sectionCount + 2, Math.max(-sectionCount, Math.floor((rotation - 30) / -90)));
      spiral.style.transform = `rotate(${rotation}deg) scale(${scale})`;
      // TODO: Something better
      sections.forEach((section) => {
        section.classList.remove('active');
      });
      if (sections[currentSection]) {
        sections[currentSection].classList.add('active');
      }
    });
  }

  function animateScroll(targR, startR, speed) {
    const mySpeed = speed || 0.2;
    let additionalRotation;
    if (((targR || Math.abs(targR) === 0) && Math.abs(targR - rotation) > 0.1) || Math.abs(moved) > 1) {
      if (targR || Math.abs(targR) === 0) {
        additionalRotation = mySpeed * (targR - rotation);
      } else {
        moved *= 0.98;
        additionalRotation = moved / -10;
      }
      rotation = trimRotation(rotation + additionalRotation);
      scrollHandler();
      animRAF = window.requestAnimationFrame(() => {
        animateScroll(targR, startR, speed);
      });
    } else if (targR || Math.abs(targR) === 0) {
      window.cancelAnimationFrame(animRAF);
      rotation = trimRotation(targR);
      scrollHandler();
    }
  }

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
    scrollHandler();
  }

  // if no scrolling happens for 200ms, animate to the closest section
  function startScrollTimeout() {
    clearTimeout(scrollTimeout);
    if (currentSection > -1 && currentSection < sectionCount) {
      scrollTimeout = setTimeout(() => {
        window.cancelAnimationFrame(animRAF);
        animateScroll(currentSection * -90, rotation, 0.15);
      }, 200);
    }
  }

// Build Initial Spiral
  buildSpiral(getSpiralDimensions());
}());
