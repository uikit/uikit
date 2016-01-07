(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["UIkit"] = factory();
	else
		root["UIkit"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _util = __webpack_require__(1);

	var _util2 = _interopRequireDefault(_util);

	var _dom = __webpack_require__(2);

	var _dom2 = _interopRequireDefault(_dom);

	var _support = __webpack_require__(3);

	var _support2 = _interopRequireDefault(_support);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var UI = {};

	UI.util = _util2.default;
	UI.dom = _dom2.default;
	UI.support = _support2.default;

	exports.default = UI;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _dom = __webpack_require__(2);

	var _dom2 = _interopRequireDefault(_dom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	    extend: function extend(out) {

	        out = out || {};

	        for (var i = 1; i < arguments.length; i++) {

	            var _obj = arguments[i];

	            if (!_obj) continue;

	            for (var key in _obj) {
	                if (_obj.hasOwnProperty(key)) {
	                    if (_typeof(_obj[key]) === 'object') {
	                        this.extend(out[key], _obj[key]);
	                    } else {
	                        out[key] = _obj[key];
	                    }
	                }
	            }
	        }

	        return out;
	    },
	    type: function type() {
	        return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
	    },
	    isFullscreen: function isFullscreen() {
	        return document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.fullscreenElement || false;
	    },
	    str2json: function str2json(str) {
	        try {
	            return new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));")();
	        } catch (e) {
	            return false;
	        }
	    },
	    debounce: function debounce(func, wait, immediate) {
	        var timeout;
	        return function () {
	            var context = this,
	                args = arguments;
	            var later = function later() {
	                timeout = null;
	                if (!immediate) func.apply(context, args);
	            };
	            var callNow = immediate && !timeout;
	            clearTimeout(timeout);
	            timeout = setTimeout(later, wait);
	            if (callNow) func.apply(context, args);
	        };
	    },
	    isInView: function isInView(element, options) {

	        var $element = (0, _dom2.default)(element),
	            $win = (0, _dom2.default)(window);

	        if (!$element.is(':visible')) {
	            return false;
	        }

	        var window_left = $win.scrollLeft(),
	            window_top = $win.scrollTop(),
	            offset = $element.offset(),
	            left = offset.left,
	            top = offset.top;

	        options = _dom2.default.extend({ topoffset: 0, leftoffset: 0 }, options);

	        if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() && left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
	            return true;
	        } else {
	            return false;
	        }
	    }
	};
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	// small DOM pimping

	NodeList.prototype.forEach = NodeList.prototype.forEach || Array.prototype.forEach;

	var $DOM = window.jQuery;

	$DOM.$doc = $DOM(document);
	$DOM.$win = $DOM(window);
	$DOM.$html = $DOM('html');

	$DOM.watch = function (el, fn, config) {
	    var observer = new MutationObserver(fn);
	    observer.observe(el, config || { attributes: true, childList: true, characterData: true });
	    return observer;
	};

	module.exports = $DOM;

/***/ },
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    mutationobserver: global.MutationObserver || global.WebKitMutationObserver || null,
	    touch: 'ontouchstart' in document || global.DocumentTouch && document instanceof global.DocumentTouch || global.navigator.msPointerEnabled && global.navigator.msMaxTouchPoints > 0 || //IE 10
	    global.navigator.pointerEnabled && global.navigator.maxTouchPoints > 0 || //IE >=11
	    false
	};
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ])
});
;