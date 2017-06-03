
(function() {

  var WIN = window;
  var sections = document.querySelectorAll('.js-section');
  var spiral = document.querySelector('.js-spiral');

  var _winW;
  var _winH;
  var smallScreen;
  var landscape;
  var aspect = .618033;
  var axis = .7237;
  var spiralOrigin;

  var rotation = 0;
  var sectionCount = sections.length;
  var currentSection = 0;
  var touchStartY = 0;
  var touchStartX = 0;
  var moved = 0;
  var animRAF;
  var animating = false;
  var scrollTimeout;

  var userAgent = window.navigator.userAgent.toLowerCase(),
      firefox = userAgent.indexOf('firefox') != -1 || userAgent.indexOf('mozilla') == -1,
      ios = /iphone|ipod|ipad/.test( userAgent ),
      safari = (userAgent.indexOf('safari') != -1 && userAgent.indexOf('chrome') == -1) || ios,
      linux = userAgent.indexOf('linux') != -1,
      windows = userAgent.indexOf('windows') != -1;

  resizeHandler();

// EVENTS
///////
  var resizes$ = Rx.Observable.fromEvent(window, 'resize');
  var scrolls$ = Rx.Observable.fromEvent(window, 'scroll');
  var wheels$ = Rx.Observable.fromEvent(window, 'wheel');
  var touchStarts$ = Rx.Observable.fromEvent(window, 'touchstart');
  var touchMoves$ = Rx.Observable.fromEvent(window, 'touchmove');
  var touchEnds$ = Rx.Observable.fromEvent(window, 'touchend');
  var keyDowns$ = Rx.Observable.fromEvent(window, 'keydown');
  

  resizes$.subscribe(resizeHandler);
  scrolls$.subscribe(e => {
    e.preventDefault();
  });

  wheels$.subscribe(function(e) {
    var deltaY = -e.deltaY; // WAS originalEvent
    if (windows || linux) {
      deltaY = e.deltaY * 5;
    }
    moved = -deltaY || 0;
    rotation += moved/-10;
    rotation = trimRotation();
    e.preventDefault();
    startScrollTimeout()
    cancelAnimationFrame(animRAF);
    scrollHandler();
  });

  touchStarts$.subscribe(function(e) {
    e.preventDefault()
    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    moved = 0;
    touchStartX = touch.pageX;
    touchStartY = touch.pageY;
    cancelAnimationFrame(animRAF);
  });

  touchMoves$.subscribe(function(e) {
    e.preventDefault()
    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    moved = ((touchStartY - touch.pageY)+(touchStartX - touch.pageX)) * 3;
    touchStartX = touch.pageX;
    touchStartY = touch.pageY;
    rotation += moved/-10;
    rotation = trimRotation();
    startScrollTimeout();
    cancelAnimationFrame(animRAF);
    scrollHandler()
  });

  touchEnds$.subscribe(function() {
    animateScroll()
  });

  keyDowns$.subscribe(function(e) {
    if (e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 32) {
      cancelAnimationFrame(animRAF);
      animateScroll((currentSection + 1) * -90,rotation)
    } else if (e.keyCode === 37 || e.keyCode === 38) {
      cancelAnimationFrame(animRAF);
      animateScroll((currentSection - 1) * -90,rotation)
    }
    scrollHandler()
  });

  // TODO: USE DELEGATE LISTENER
  sections.forEach(function(section, index) {
    section.addEventListener('click',function() {
        cancelAnimationFrame(animRAF)
        animateScroll(index * -90,rotation);
    });
  });

// FUNCTIONS
////////////
  function scrollHandler() {
    requestAnimationFrame(function(){
      var scale = Math.pow(aspect,rotation/90);
      currentSection = Math.min(sectionCount + 2,Math.max(-sectionCount,Math.floor((rotation-30)/-90)));
      spiral.style.transform = 'rotate(' + rotation + 'deg) scale(' + scale + ')';
      // TODO: Something better
      sections.forEach(function(section) {
        section.classList.remove['active']
      });
      if (sections[currentSection]) {
          sections[currentSection].classList.add('active');
      }
    })
  }
  function animateScroll(targR,startR,speed) {
    var distance = startR - targR;
    var mySpeed = speed || .2;
    if (((targR || Math.abs(targR) === 0) && Math.abs(targR - rotation) > .1) || Math.abs(moved) > 1) {
      if (targR || Math.abs(targR) === 0) {
        rotation += mySpeed * (targR - rotation);
      } else {
        moved *= .98;
        rotation += moved/-10;
      }
      rotation = trimRotation();
      scrollHandler();
      animRAF = requestAnimationFrame(function(){
        animateScroll(targR,startR,speed)
      });
    } else if (targR || Math.abs(targR) === 0) {
      cancelAnimationFrame(animRAF)
      rotation = targR;
      rotation = trimRotation();
      scrollHandler();
    }
  }

  function buildSpiral() {
    // rotate around this point
    spiralOrigin = Math.floor(_winW * axis) + 'px ' + Math.floor(_winW * aspect * axis) +'px';
    var w = _winW * aspect;
    var h = w; // they're squares
    if (smallScreen && !landscape) { // flip it 90deg if it's a portrait phone
      spiralOrigin = Math.floor((_winW/aspect) * aspect * (1 - axis)) +'px ' + Math.floor((_winW/aspect) * axis) + 'px ';
      w = _winW;
      h = _winW;
    }
    // HACK to smooth out Chrome vs Safari/Firefox
    var translate = '';
    if (safari || firefox) {
      translate = 'translate3d(0,0,0)'
    }
    // END HACK

    spiral.style.transformOrigin= spiralOrigin;
    spiral.style.backfaceVisiblity= 'hidden';
    sections.forEach(function(section, index){
      var myRot = Math.floor(90*index);
      var scale = Math.pow(aspect, index);
      section.style.width= w;
      section.style.height= h;
      section.style.transformOrigin= spiralOrigin;
      section.style.backfaceVisiblity= 'hidden';
      section.style.backgroundColor= 'rgb(' + Math.floor(255-index*(255/sectionCount)) + ',50,50)';
      section.style.transform= 'rotate(' + myRot + 'deg) scale(' + Math.pow(aspect, index) + ') ' + translate;
    })
    scrollHandler();
  }

  function resizeHandler () { // Set the size of images and preload them
    _winW = window.innerWidth/(1000/window.innerHeight);
    _winH = window.innerHeight;
    smallScreen = _winW < 960;
    landscape = _winH < _winW;
    buildSpiral()
  }

  // keep it from getting too small or too big
  function trimRotation() {
    return Math.max(-1500, Math.min(1200, rotation))
  }

  // if no scrolling happens for 200ms, animate to the closest section
  function startScrollTimeout () {
    clearTimeout(scrollTimeout)
    if (currentSection > -1 && currentSection < sectionCount) {
      scrollTimeout = setTimeout(function(){
        cancelAnimationFrame(animRAF);
        animateScroll(currentSection * -90,rotation,.15);
      },200);
    }
  }
})();
