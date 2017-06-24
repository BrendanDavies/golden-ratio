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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* global window */
var container = exports.container = window;
var sections = exports.sections = container.document.querySelectorAll('.section');
var spiral = exports.spiral = container.document.querySelector('.spiral');
var wrapper = exports.wrapper = container.document.querySelector('.wrapper');

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildSpiral = buildSpiral;
exports.clearActiveSections = clearActiveSections;
exports.getActiveSectionIndex = getActiveSectionIndex;
exports.scrollToItem = scrollToItem;

var _elements = __webpack_require__(0);

var aspect = 0.618033;
/* global window */

var axis = 0.7237;
var sectionCount = _elements.sections.length;

/**
 * Returns largest golden ratio rectangle that will fit in viewport
 */
function getSpiralDimensions() {
  var windowHeight = window.innerHeight;
  var windowWidth = window.innerWidth;
  var isSmallScreen = windowWidth < 960;
  var isLandscape = windowHeight < windowWidth;
  var xOrigin = void 0;
  var yOrigin = void 0;
  var sectionSize = void 0;
  var rectHeight = void 0;
  var rectWidth = void 0;

  if (isSmallScreen && !isLandscape) {
    // flip it 90deg if it's a portrait phone
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
    xOrigin: xOrigin,
    yOrigin: yOrigin,
    sectionSize: sectionSize,
    rectHeight: rectHeight,
    rectWidth: rectWidth
  };
}

/**
 * Builds spiral element and sections
 * @param {Object} dimensions Object with dimensions of spiral
 */
function buildSpiral() {
  var dimensions = getSpiralDimensions();
  var spiralOrigin = dimensions.xOrigin + 'px ' + dimensions.yOrigin + 'px';

  // Set height and width of wrapper Rectangle (for centering)
  _elements.wrapper.style.width = dimensions.rectWidth;
  _elements.wrapper.style.height = dimensions.rectHeight;
  // Set transform origin for spiral
  _elements.spiral.style.transformOrigin = spiralOrigin;
  // Style each section
  _elements.sections.forEach(function (section, index) {
    var sectionRotation = Math.floor(90 * index);
    var scale = Math.pow(aspect, index);
    var alpha = 1 - index / sectionCount;

    if (index === 0) {
      section.classList.add('active');
    }

    section.style.width = dimensions.sectionSize;
    section.style.height = dimensions.sectionSize;
    section.style.transformOrigin = spiralOrigin;
    section.style.backgroundColor = 'rgba(129, 52, 5, ' + alpha + ')';
    section.style.transform = 'rotate(' + sectionRotation + 'deg) scale(' + scale + ') translate3d(0,0,0)';
  });
}

/**
 * Clear active flag from any sections
 */
function clearActiveSections() {
  window.document.querySelectorAll('.section.active').forEach(function (activeSection) {
    activeSection.classList.remove('active');
  });
}

/**
 * Returns the index of the first active solution
 */
function getActiveSectionIndex() {
  var activeIndex = void 0;
  _elements.sections.forEach(function (section, index) {
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
  return function () {
    var rotation = -90 * index;
    var scale = Math.pow(aspect, -index);

    if (index >= 0 && index < _elements.sections.length) {
      clearActiveSections();
      _elements.sections[index].classList.add('active');
      _elements.spiral.style.transform = 'rotate(' + rotation + 'deg) scale(' + scale + ')';
    }
  };
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (event) {
  var FORWARD_KEYS = [KEY_CODES.DOWN, KEY_CODES.RIGHT, KEY_CODES.SPACE];
  var BACK_KEYS = [KEY_CODES.LEFT, KEY_CODES.UP];
  var currentActiveSection = (0, _spiral.getActiveSectionIndex)();
  var indexToSelect = void 0;

  if (FORWARD_KEYS.indexOf(event.keyCode) !== -1) {
    indexToSelect = currentActiveSection + 1;
  } else if (BACK_KEYS.indexOf(event.keyCode) !== -1) {
    indexToSelect = currentActiveSection - 1;
  }

  (0, _spiral.scrollToItem)(indexToSelect)();
};

var _spiral = __webpack_require__(1);

// Directional Keys
var KEY_CODES = {
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _spiral = __webpack_require__(1);

var _elements = __webpack_require__(0);

var _keyHandler = __webpack_require__(2);

var _keyHandler2 = _interopRequireDefault(_keyHandler);

__webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Build Spiral
/* global window */
(0, _spiral.buildSpiral)();

// Resize Handler


// Require CSS
window.addEventListener('resize', function () {
  return (0, _spiral.buildSpiral)();
});

// Click Handler
// TODO: USE DELEGATE LISTENER
_elements.sections.forEach(function (section, index) {
  section.addEventListener('click', (0, _spiral.scrollToItem)(index));
});

// Key Down
window.addEventListener('keydown', _keyHandler2.default);

/***/ })
/******/ ]);