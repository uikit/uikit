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
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*************************!*\
  !*** ./src/js/uikit.js ***!
  \*************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _util = __webpack_require__(/*! ./core/util */ 1);
	
	var _util2 = _interopRequireDefault(_util);
	
	var _dom = __webpack_require__(/*! ./core/dom */ 2);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var UI = {};
	
	UI.util = _util2.default;
	UI.dom = _dom2.default;
	
	exports.default = UI;
	module.exports = exports['default'];

/***/ },
/* 1 */
/*!*****************************!*\
  !*** ./src/js/core/util.js ***!
  \*****************************/
/***/ function(module, exports) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
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
	    }
	};
	module.exports = exports['default'];

/***/ },
/* 2 */
/*!****************************!*\
  !*** ./src/js/core/dom.js ***!
  \****************************/
/***/ function(module, exports) {

	"use strict";
	
	// small DOM pimping
	NodeList.prototype.forEach = NodeList.prototype.forEach || Array.prototype.forEach;
	
	var $DOM = window.jQuery;
	
	$DOM.watch = function (el, fn, config) {
	    var observer = new MutationObserver(fn);
	    observer.observe(el, config || { attributes: true, childList: true, characterData: true });
	    return observer;
	};
	
	module.exports = $DOM;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=uikit.js.map