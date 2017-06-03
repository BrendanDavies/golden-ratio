/* global window Rx */
(function iife() {
  const aspect = 0.618033;
  const axis = 0.7237;

  const sections = window.document.querySelectorAll('.js-section');
  const spiral = window.document.querySelector('.js-spiral');
  let _winW;
  let _winH;
  let smallScreen;
  let landscape;
  let spiralOrigin;

  let rotation = 0;
  const sectionCount = sections.length;
  let currentSection = 0;
  let touchStartY = 0;
  let touchStartX = 0;
  let moved = 0;
  let animRAF;
  let scrollTimeout;

  // TODO: Undo user agent stuff
  const userAgent = window.navigator.userAgent.toLowerCase();
  const firefox = userAgent.indexOf('firefox') !== -1 || userAgent.indexOf('mozilla') === -1;
  const ios = /iphone|ipod|ipad/.test(userAgent);
  const safari = (userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1) || ios;
  const linux = userAgent.indexOf('linux') !== -1;
  const windows = userAgent.indexOf('windows') !== -1;


// FUNCTIONS ////////////
  // keep it from getting too small or too big
  function trimRotation() {
    return Math.max(-1500, Math.min(1200, rotation));
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
    // const distance = startR - targR;
    const mySpeed = speed || 0.2;
    if (((targR || Math.abs(targR) === 0) && Math.abs(targR - rotation) > 0.1) || Math.abs(moved) > 1) {
      if (targR || Math.abs(targR) === 0) {
        rotation += mySpeed * (targR - rotation);
      } else {
        moved *= 0.98;
        rotation += moved / -10;
      }
      rotation = trimRotation();
      scrollHandler();
      animRAF = window.requestAnimationFrame(() => {
        animateScroll(targR, startR, speed);
      });
    } else if (targR || Math.abs(targR) === 0) {
      window.cancelAnimationFrame(animRAF);
      rotation = targR;
      rotation = trimRotation();
      scrollHandler();
    }
  }

  function buildSpiral() {
    // rotate around this point
    const xPixels = Math.floor(_winW * axis);
    const yPixels = Math.floor(_winW * aspect * axis);

    spiralOrigin = `${xPixels}px ${yPixels}px`;
    let w = _winW * aspect;
    let h = w; // they're squares
    if (smallScreen && !landscape) { // flip it 90deg if it's a portrait phone
      spiralOrigin = Math.floor((_winW / aspect) * aspect * (1 - axis)) + 'px ' + Math.floor((_winW / aspect) * axis) + 'px ';
      w = _winW;
      h = _winW;
    }
    // HACK to smooth out Chrome vs Safari/Firefox
    let translate = '';
    if (safari || firefox) {
      translate = 'translate3d(0,0,0)';
    }
    // END HACK

    spiral.style.transformOrigin = spiralOrigin;
    spiral.style.backfaceVisiblity = 'hidden';
    sections.forEach((section, index) => {
      const myRot = Math.floor(90 * index);
      const scale = aspect ** index;
      const dimmedColor = Math.floor(255 - (index * (255 / sectionCount)));

      section.style.width = w;
      section.style.height = h;
      section.style.transformOrigin = spiralOrigin;
      section.style.backfaceVisiblity = 'hidden';
      section.style.backgroundColor = `rgb(${dimmedColor},50,50)`;
      section.style.transform = `rotate(${myRot}deg) scale(${scale}) ${translate}`;
    });
    scrollHandler();
  }

  function resizeHandler() { // Set the size of images and preload them
    _winW = window.innerWidth / (1000 / window.innerHeight);
    _winH = window.innerHeight;
    smallScreen = _winW < 960;
    landscape = _winH < _winW;
    buildSpiral();
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

  resizeHandler();

// EVENTS //////
  function standardizeTouch(event) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }

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

  resizes$.subscribe(resizeHandler);
  scrolls$.subscribe((e) => {
    e.preventDefault();
  });

  wheels$.subscribe((e) => {
    let deltaY = -e.deltaY; // WAS originalEvent
    if (windows || linux) {
      deltaY = e.deltaY * 5;
    }
    moved = -deltaY || 0;
    rotation += moved / -10;
    rotation = trimRotation();
    e.preventDefault();
    startScrollTimeout();
    window.cancelAnimationFrame(animRAF);
    scrollHandler();
  });

  touchStarts$.subscribe((position) => {
    moved = 0;
    touchStartX = position.x;
    touchStartY = position.y;
    window.cancelAnimationFrame(animRAF);
  });

  touchMoves$.subscribe((position) => {
    moved = ((touchStartY - position.y) + (touchStartX - position.x)) * 3;
    touchStartX = position.x;
    touchStartY = position.y;
    rotation += moved / -10;
    rotation = trimRotation();
    startScrollTimeout();
    window.cancelAnimationFrame(animRAF);
    scrollHandler();
  });

  touchEnds$.subscribe(() => {
    animateScroll();
  });

  keyDowns$.subscribe((e) => {
    if (e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 32) {
      window.cancelAnimationFrame(animRAF);
      animateScroll((currentSection + 1) * -90, rotation);
    } else if (e.keyCode === 37 || e.keyCode === 38) {
      window.cancelAnimationFrame(animRAF);
      animateScroll((currentSection - 1) * -90, rotation);
    }
    scrollHandler();
  });

  // TODO: USE DELEGATE LISTENER
  sections.forEach((section, index) => {
    section.addEventListener('click', () => {
      window.cancelAnimationFrame(animRAF);
      animateScroll(index * -90, rotation);
    });
  });
}());
