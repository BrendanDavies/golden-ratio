(function() {
  // TODO: Undo user agent stuff
  const userAgent = window.navigator.userAgent.toLowerCase();
  const firefox = userAgent.indexOf('firefox') !== -1 || userAgent.indexOf('mozilla') === -1;
  const ios = /iphone|ipod|ipad/.test(userAgent);
  const safari = (userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1) || ios;
  const linux = userAgent.indexOf('linux') !== -1;
  const windows = userAgent.indexOf('windows') !== -1;

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

  // TODO: USE DELEGATE LISTENER
  sections.forEach((section, index) => {
    section.addEventListener('click', () => {
      window.cancelAnimationFrame(animRAF);
      animateScroll(index * -90, rotation);
    });
  });
}());