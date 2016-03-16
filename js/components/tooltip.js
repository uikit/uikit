/******/ (function(modules) { // webpackBootstrap
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

/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { throw err; };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _jquery = __webpack_require__(0);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	UIkit.component('tooltip', {

	    mixins: [UIkit.mixin.toggle, UIkit.mixin.position],

	    props: {
	        delay: Number,
	        clsCustom: String
	    },

	    defaults: {
	        pos: 'top',
	        offset: 5,
	        delay: 0,
	        cls: 'uk-active',
	        clsPos: 'uk-tooltip'
	    },

	    ready: function ready() {

	        this.content = this.$el.attr('title');
	        this.$el.removeAttr('title');
	        this.tooltip = (0, _jquery2.default)('<div class="uk-tooltip" aria-hidden="true"><div class="uk-tooltip-inner">' + this.content + '</div></div>').appendTo('body');

	        this.$el.on('focus mouseenter', this.show.bind(this));
	        this.$el.on('blur mouseleave', this.hide.bind(this));
	    },

	    methods: {
	        show: function show() {
	            var _this = this;

	            clearTimeout(this.showTimer);

	            this.showTimer = setTimeout(function () {
	                _this.positionAt(_this.tooltip, _this.$el);
	                _this.toggleState(_this.tooltip, true, true);
	            }, this.delay);
	        },
	        hide: function hide() {
	            clearTimeout(this.showTimer);
	            this.toggleState(this.tooltip, true, false);
	        }
	    }

	});

/***/ }
/******/ ]);