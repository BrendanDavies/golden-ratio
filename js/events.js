/* global window */
(function iife() {

  // TODO: Undo user agent stuff
  const userAgent = window.navigator.userAgent.toLowerCase();
  const firefox = userAgent.indexOf('firefox') !== -1 || userAgent.indexOf('mozilla') === -1;
  const ios = /iphone|ipod|ipad/.test(userAgent);
  const safari = (userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1) || ios;
  const linux = userAgent.indexOf('linux') !== -1;
  const windows = userAgent.indexOf('windows') !== -1;

  // State Variables
  let rotation = 0;
  let currentSection = 0;
  let moved = 0;
  let touchStart = {};
  let animRAF;
  let scrollTimeout;


  const KEY_CODES = {
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
  };

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

  function preventDefault(event) {
    event.preventDefault();
    return event;
  }

  function standardizeTouch(event) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }

// EVENTS
  const resizes$ = Rx.Observable.fromEvent(window, 'resize');
  const scrolls$ = Rx.Observable.fromEvent(window, 'scroll');
  const wheels$ = Rx.Observable.fromEvent(window, 'wheel');
  const touchStarts$ = Rx.Observable
    .fromEvent(window, 'touchstart')
    .map(standardizeTouch);
  const touchMoves$ = Rx.Observable
    .fromEvent(window, 'touchmove')
    .map(standardizeTouch);
  const touchEnds$ = Rx.Observable.fromEvent(window, 'touchend');
  const keyDowns$ = Rx.Observable.fromEvent(window, 'keydown');

  resizes$.subscribe(() => buildSpiral(getSpiralDimensions()));
  scrolls$.subscribe(preventDefault);

  wheels$.subscribe((e) => {
    let deltaY = -e.deltaY; // WAS originalEvent
    if (windows || linux) {
      deltaY = e.deltaY * 5;
    }
    moved = -deltaY || 0;
    rotation = trimRotation(rotation + (moved / -10));
    e.preventDefault();
    startScrollTimeout();
    window.cancelAnimationFrame(animRAF);
    scrollHandler();
  });

  touchStarts$.subscribe((position) => {
    moved = 0;
    touchStart = position;
    window.cancelAnimationFrame(animRAF);
  });

  touchMoves$.subscribe((position) => {
    moved = ((touchStart.y - position.y) + (touchStart.x - position.x)) * 3;
    touchStart = position;
    rotation = trimRotation(rotation + (moved / -10));
    startScrollTimeout();
    window.cancelAnimationFrame(animRAF);
    scrollHandler();
  });

  touchEnds$.subscribe(() => {
    animateScroll();
  });

  keyDowns$.subscribe((e) => {
    const FORWARD_KEYS = [
      KEY_CODES.DOWN,
      KEY_CODES.RIGHT,
      KEY_CODES.SPACE,
    ];
    const BACK_KEYS = [
      KEY_CODES.LEFT,
      KEY_CODES.UP,
    ];

    if (FORWARD_KEYS.indexOf(e.keyCode) !== -1) {
      window.cancelAnimationFrame(animRAF);
      animateScroll((currentSection + 1) * -90, rotation);
    } else if (BACK_KEYS.indexOf(e.keyCode) !== -1) {
      window.cancelAnimationFrame(animRAF);
      animateScroll((currentSection - 1) * -90, rotation);
    }
    scrollHandler();
  });


}());