// @flow
import { Observable, Scheduler } from 'rxjs';
import { container } from './elements';

const mouseMove$ = Observable
  .fromEvent(container, 'mousemove')
  .map(event => ({ x: event.clientX, y: event.clientY }));

const touchMove$ = Observable
  .fromEvent(container, 'touchmove')
  .map(event => ({
    x: event.touches[0].clientX,
    y: event.touches[0].clientY,
  }));

function lerp(start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  return {
    x: start.x + (dx * 0.1),
    y: start.y + (dy * 0.1),
  };
}

const move$ = Observable.merge(mouseMove$, touchMove$);

const animationFrame$ = Observable.interval(0, Scheduler.animationFrame);

export const smoothMove$ = animationFrame$
  .withLatestFrom(move$, (tick, move) => move)
  .scan(lerp);


// /* global window */
// (function iife() {
//   // State Variables
//   let rotation = 0;
//   let currentSection = 0;
//   let moved = 0;
//   let touchStart = {};
//   let animRAF;
//   let scrollTimeout;

//   function trimRotation(degrees) {
//     return Math.max(-1500, Math.min(1200, degrees));
//   }

//   function scrollHandler() {
//     window.requestAnimationFrame(() => {
//       currentSection = Math.min(sectionCount + 2, Math.max(-sectionCount, Math.floor((rotation - 30) / -90)));
//       scrollToItem(currentSection)();
//     });
//   }

//   function animateScroll(targR, startR, speed) {
//     const mySpeed = speed || 0.2;
//     let additionalRotation;
//     if (((targR || Math.abs(targR) === 0) && Math.abs(targR - rotation) > 0.1) || Math.abs(moved) > 1) {
//       if (targR || Math.abs(targR) === 0) {
//         additionalRotation = mySpeed * (targR - rotation);
//       } else {
//         moved *= 0.98;
//         additionalRotation = moved / -10;
//       }
//       rotation = trimRotation(rotation + additionalRotation);
//       scrollHandler();
//       animRAF = window.requestAnimationFrame(() => {
//         animateScroll(targR, startR, speed);
//       });
//     } else if (targR || Math.abs(targR) === 0) {
//       window.cancelAnimationFrame(animRAF);
//       rotation = trimRotation(targR);
//       scrollHandler();
//     }
//   }

//   // if no scrolling happens for 200ms, animate to the closest section
//   function startScrollTimeout() {
//     clearTimeout(scrollTimeout);
//     if (currentSection > -1 && currentSection < sectionCount) {
//       scrollTimeout = setTimeout(() => {
//         window.cancelAnimationFrame(animRAF);
//         animateScroll(currentSection * -90, rotation, 0.15);
//       }, 200);
//     }
//   }

//   function preventDefault(event) {
//     event.preventDefault();
//     return event;
//   }

//   function standardizeTouch(event) {
//     return {
//       x: event.touches[0].clientX,
//       y: event.touches[0].clientY,
//     };
//   }

// // EVENTS
//   const scrolls$ = Rx.Observable.fromEvent(window, 'scroll');
//   const wheels$ = Rx.Observable.fromEvent(window, 'wheel');
//   const touchStarts$ = Rx.Observable
//     .fromEvent(window, 'touchstart')
//     .map(standardizeTouch);
//   const touchMoves$ = Rx.Observable
//     .fromEvent(window, 'touchmove')
//     .map(standardizeTouch);
//   const touchEnds$ = Rx.Observable.fromEvent(window, 'touchend');

//   scrolls$.subscribe(preventDefault);

//   wheels$.subscribe((e) => {
//     let deltaY = -e.deltaY; // WAS originalEvent
//     moved = -deltaY || 0;
//     rotation = trimRotation(rotation + (moved / -10));
//     e.preventDefault();
//     startScrollTimeout();
//     window.cancelAnimationFrame(animRAF);
//     scrollHandler();
//   });

//   touchStarts$.subscribe((position) => {
//     moved = 0;
//     touchStart = position;
//     window.cancelAnimationFrame(animRAF);
//   });

//   touchMoves$.subscribe((position) => {
//     moved = ((touchStart.y - position.y) + (touchStart.x - position.x)) * 3;
//     touchStart = position;
//     rotation = trimRotation(rotation + (moved / -10));
//     startScrollTimeout();
//     window.cancelAnimationFrame(animRAF);
//     scrollHandler();
//   });

//   touchEnds$.subscribe(() => {
//     animateScroll();
//   });
// }());
