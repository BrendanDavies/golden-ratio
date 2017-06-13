/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* global window */
const container = window;
/* unused harmony export container */

const sections = container.document.querySelectorAll('.js-section');
/* harmony export (immutable) */ __webpack_exports__["a"] = sections;

const spiral = container.document.querySelector('.spiral');
/* harmony export (immutable) */ __webpack_exports__["c"] = spiral;

const wrapper = container.document.querySelector('.wrapper');
/* harmony export (immutable) */ __webpack_exports__["b"] = wrapper;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = buildSpiral;
/* unused harmony export clearActiveSections */
/* harmony export (immutable) */ __webpack_exports__["c"] = getActiveSectionIndex;
/* harmony export (immutable) */ __webpack_exports__["b"] = scrollToItem;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__elements__ = __webpack_require__(0);
/* global window */


const aspect = 0.618033;
const axis = 0.7237;
const sectionCount = __WEBPACK_IMPORTED_MODULE_0__elements__["a" /* sections */].length;

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
function buildSpiral() {
  const dimensions = getSpiralDimensions();
  const spiralOrigin = `${dimensions.xOrigin}px ${dimensions.yOrigin}px`;

  // Set height and width of wrapper Rectangle (for centering)
  __WEBPACK_IMPORTED_MODULE_0__elements__["b" /* wrapper */].style.width = dimensions.rectWidth;
  __WEBPACK_IMPORTED_MODULE_0__elements__["b" /* wrapper */].style.height = dimensions.rectHeight;
  __WEBPACK_IMPORTED_MODULE_0__elements__["c" /* spiral */].style.transformOrigin = spiralOrigin;
  __WEBPACK_IMPORTED_MODULE_0__elements__["a" /* sections */].forEach((section, index) => {
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
  __WEBPACK_IMPORTED_MODULE_0__elements__["a" /* sections */].forEach((section, index) => {
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

    if (index >= 0 && index < __WEBPACK_IMPORTED_MODULE_0__elements__["a" /* sections */].length) {
      clearActiveSections();
      __WEBPACK_IMPORTED_MODULE_0__elements__["a" /* sections */][index].classList.add('active');
      __WEBPACK_IMPORTED_MODULE_0__elements__["c" /* spiral */].style.transform = `rotate(${rotation}deg) scale(${scale})`;
    }
  };
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__spiral__ = __webpack_require__(1);


// Directional Keys
const KEY_CODES = {
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

/* harmony default export */ __webpack_exports__["a"] = (function (event) {
  const FORWARD_KEYS = [
    KEY_CODES.DOWN,
    KEY_CODES.RIGHT,
    KEY_CODES.SPACE,
  ];
  const BACK_KEYS = [
    KEY_CODES.LEFT,
    KEY_CODES.UP,
  ];
  const currentActiveSection = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__spiral__["c" /* getActiveSectionIndex */])();
  let indexToSelect;

  if (FORWARD_KEYS.indexOf(event.keyCode) !== -1) {
    indexToSelect = currentActiveSection + 1;
  } else if (BACK_KEYS.indexOf(event.keyCode) !== -1) {
    indexToSelect = currentActiveSection - 1;
  }

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__spiral__["b" /* scrollToItem */])(indexToSelect)();
});


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__spiral__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__elements__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__key__ = __webpack_require__(2);
/* global window */




// Build Spiral
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__spiral__["a" /* buildSpiral */])();

// Resize Handler
window.addEventListener('resize', () => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__spiral__["a" /* buildSpiral */])());

// Click Handler
// TODO: USE DELEGATE LISTENER
__WEBPACK_IMPORTED_MODULE_1__elements__["a" /* sections */].forEach((section, index) => {
  section.addEventListener('click', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__spiral__["b" /* scrollToItem */])(index));
});

// Key Down
window.addEventListener('keydown', __WEBPACK_IMPORTED_MODULE_2__key__["a" /* default */]);


/***/ })
/******/ ]);