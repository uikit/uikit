(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jQuery"));
	else if(typeof define === 'function' && define.amd)
		define(["jQuery"], factory);
	else if(typeof exports === 'object')
		exports["UIkit"] = factory(require("jQuery"));
	else
		root["UIkit"] = factory(root["jQuery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
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
	
	var _jquery = __webpack_require__(/*! jquery */ 1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _global = __webpack_require__(/*! ./api/global */ 2);
	
	var _global2 = _interopRequireDefault(_global);
	
	var _internal = __webpack_require__(/*! ./api/internal */ 7);
	
	var _internal2 = _interopRequireDefault(_internal);
	
	var _event = __webpack_require__(/*! ./api/event */ 8);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _component = __webpack_require__(/*! ./api/component */ 9);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _webcomponent = __webpack_require__(/*! ./api/webcomponent */ 10);
	
	var _webcomponent2 = _interopRequireDefault(_webcomponent);
	
	var _index = __webpack_require__(/*! ./supports/index */ 12);
	
	var _index2 = _interopRequireDefault(_index);
	
	var _index3 = __webpack_require__(/*! ./util/index */ 3);
	
	var util = _interopRequireWildcard(_index3);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	window.UIkit3 = _global2.default;
	
	_global2.default.version = '3.0.0';
	_global2.default.options = {};
	
	_global2.default.supports = _index2.default;
	_global2.default.util = _index2.default;
	
	_global2.default.$doc = (0, _jquery2.default)(document);
	_global2.default.$win = (0, _jquery2.default)(window);
	_global2.default.$html = (0, _jquery2.default)('html');
	
	// add touch identifier class
	_global2.default.$html.addClass(_global2.default.supports.touch ? 'uk-touch' : 'uk-notouch');
	
	(0, _internal2.default)(_global2.default);
	(0, _event2.default)(_global2.default);
	(0, _component2.default)(_global2.default);
	(0, _webcomponent2.default)(_global2.default);
	
	// core components
	__webpack_require__(/*! ./core/grid */ 13)(_global2.default);
	
	exports.default = _global2.default;
	module.exports = exports['default'];

/***/ },
/* 1 */
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/*!******************************!*\
  !*** ./src/js/api/global.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _jquery = __webpack_require__(/*! jquery */ 1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _index = __webpack_require__(/*! ../util/index */ 3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function createClass(name) {
	    return new Function('return function ' + name + ' (options) { this._init(options); }')();
	}
	
	var UIkit = function UIkit(options) {
	    this._init(options);
	};
	
	UIkit.extend = function (options) {
	
	    options = options || {};
	
	    var Super = this,
	        name = options.name || Super.options.name;
	    var Sub = createClass(name || 'UIkitComponent');
	
	    Sub.prototype = Object.create(Super.prototype);
	    Sub.prototype.constructor = Sub;
	    Sub.options = (0, _index.mergeOptions)(Super.options, options);
	
	    Sub['super'] = Super;
	    Sub.extend = Super.extend;
	
	    return Sub;
	};
	
	exports.default = UIkit;
	module.exports = exports['default'];

/***/ },
/* 3 */
/*!******************************!*\
  !*** ./src/js/util/index.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _lang = __webpack_require__(/*! ./lang */ 4);

	var _loop = function _loop(_key4) {
	  if (_key4 === "default") return 'continue';
	  Object.defineProperty(exports, _key4, {
	    enumerable: true,
	    get: function get() {
	      return _lang[_key4];
	    }
	  });
	};

	for (var _key4 in _lang) {
	  var _ret = _loop(_key4);

	  if (_ret === 'continue') continue;
	}

	var _options = __webpack_require__(/*! ./options */ 5);

	var _loop2 = function _loop2(_key5) {
	  if (_key5 === "default") return 'continue';
	  Object.defineProperty(exports, _key5, {
	    enumerable: true,
	    get: function get() {
	      return _options[_key5];
	    }
	  });
	};

	for (var _key5 in _options) {
	  var _ret2 = _loop2(_key5);

	  if (_ret2 === 'continue') continue;
	}

	var _dom = __webpack_require__(/*! ./dom */ 6);

	var _loop3 = function _loop3(_key6) {
	  if (_key6 === "default") return 'continue';
	  Object.defineProperty(exports, _key6, {
	    enumerable: true,
	    get: function get() {
	      return _dom[_key6];
	    }
	  });
	};

	for (var _key6 in _dom) {
	  var _ret3 = _loop3(_key6);

	  if (_ret3 === 'continue') continue;
	}

/***/ },
/* 4 */
/*!*****************************!*\
  !*** ./src/js/util/lang.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _jquery = __webpack_require__(/*! jquery */ 1);
	
	Object.defineProperty(exports, 'each', {
	    enumerable: true,
	    get: function get() {
	        return _jquery.each;
	    }
	});
	Object.defineProperty(exports, 'extend', {
	    enumerable: true,
	    get: function get() {
	        return _jquery.extend;
	    }
	});
	Object.defineProperty(exports, 'map', {
	    enumerable: true,
	    get: function get() {
	        return _jquery.map;
	    }
	});
	Object.defineProperty(exports, 'merge', {
	    enumerable: true,
	    get: function get() {
	        return _jquery.merge;
	    }
	});
	Object.defineProperty(exports, 'type', {
	    enumerable: true,
	    get: function get() {
	        return _jquery.type;
	    }
	});
	Object.defineProperty(exports, 'isArray', {
	    enumerable: true,
	    get: function get() {
	        return _jquery.isArray;
	    }
	});
	Object.defineProperty(exports, 'isFunction', {
	    enumerable: true,
	    get: function get() {
	        return _jquery.isFunction;
	    }
	});
	exports.bind = bind;
	exports.hasOwn = hasOwn;
	exports.classify = classify;
	exports.uuid = uuid;
	exports.str2json = str2json;
	exports.debounce = debounce;
	function bind(fn, thisArg) {
	    return function (a) {
	        var l = arguments.length;
	        return l ? l > 1 ? fn.apply(thisArg, arguments) : fn.call(thisArg, a) : fn.call(thisArg);
	    };
	}
	
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function hasOwn(obj, key) {
	    return hasOwnProperty.call(obj, key);
	};
	
	var classifyRE = /(?:^|[-_\/])(\w)/g;
	function classify(str) {
	    return str.replace(classifyRE, function (_, c) {
	        return c ? c.toUpperCase() : '';
	    });
	}
	
	function uuid() {
	
	    var rs = function rs() {
	        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	    };
	
	    return [rs(), rs(), rs(), rs(), rs(), rs(), rs(), rs()].join('-');
	}
	
	function str2json(str) {
	    try {
	        return new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));")();
	    } catch (e) {
	        return {};
	    }
	}
	
	function debounce(func, wait, immediate) {
	    var timeout = undefined;
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
	}

/***/ },
/* 5 */
/*!********************************!*\
  !*** ./src/js/util/options.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.mergeOptions = mergeOptions;
	
	var _index = __webpack_require__(/*! ./index */ 3);
	
	var strats = {};
	
	// hook strategy
	strats.init = function (parentVal, childVal) {
	    return childVal ? parentVal ? parentVal.concat(childVal) : (0, _index.isArray)(childVal) ? childVal : [childVal] : parentVal;
	};
	
	// extend strategy
	strats.props = strats.methods = function (parentVal, childVal) {
	
	    if (!childVal) {
	        return parentVal;
	    }
	
	    if (!parentVal) {
	        return childVal;
	    }
	
	    var val = {};
	
	    (0, _index.extend)(val, parentVal);
	    (0, _index.extend)(val, childVal);
	
	    return val;
	};
	
	// default strategy
	var defaultStrat = function defaultStrat(parentVal, childVal) {
	    return childVal === undefined ? parentVal : childVal;
	};
	
	function mergeOptions(parent, child, thisArg) {
	
	    var options = {},
	        key = undefined;
	
	    if (child.mixins) {
	        for (var i = 0, l = child.mixins.length; i < l; i++) {
	            parent = mergeOptions(parent, child.mixins[i], thisArg);
	        }
	    }
	
	    for (key in parent) {
	        mergeKey(key);
	    }
	
	    for (key in child) {
	        if (!(0, _index.hasOwn)(parent, key)) {
	            mergeKey(key);
	        }
	    }
	
	    function mergeKey(key) {
	        options[key] = (strats[key] || defaultStrat)(parent[key], child[key], thisArg, key);
	    }
	
	    return options;
	};

/***/ },
/* 6 */
/*!****************************!*\
  !*** ./src/js/util/dom.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.attributes = attributes;
	exports.isFullscreen = isFullscreen;
	exports.isInView = isInView;
	exports.matchHeights = matchHeights;
	exports.stackMargin = stackMargin;
	exports.checkDisplay = checkDisplay;
	
	var _jquery = __webpack_require__(/*! jquery */ 1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _lang = __webpack_require__(/*! ./lang */ 4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function attributes(element) {
	
	    element = element[0] || element;
	
	    var attributes = {};
	
	    for (var val, i = 0; i < element.attributes.length; i++) {
	
	        val = (0, _lang.str2json)(element.attributes[i].value);
	        attributes[element.attributes[i].name] = val === false && element.attributes[i].value != 'false' ? element.attributes[i].value : val;
	    }
	
	    return attributes;
	}
	
	function isFullscreen() {
	    return document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.fullscreenElement || false;
	}
	
	function isInView(element, options) {
	
	    var $element = (0, _jquery2.default)(element),
	        $win = (0, _jquery2.default)(window);
	
	    if (!$element.is(':visible')) {
	        return false;
	    }
	
	    var window_left = $win.scrollLeft(),
	        window_top = $win.scrollTop(),
	        offset = $element.offset(),
	        left = offset.left,
	        top = offset.top;
	
	    options = (0, _lang.extend)({ topoffset: 0, leftoffset: 0 }, options);
	
	    if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() && left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
	        return true;
	    } else {
	        return false;
	    }
	}
	
	function matchHeights(elements, options) {
	
	    elements = (0, _jquery2.default)(elements).css('min-height', '');
	    options = (0, _lang.extend)({ row: true }, options);
	
	    var matchHeights = function matchHeights(group) {
	
	        if (group.length < 2) return;
	
	        var max = 0;
	
	        group.each(function () {
	            max = Math.max(max, (0, _jquery2.default)(this).outerHeight());
	        }).each(function () {
	
	            var element = (0, _jquery2.default)(this),
	                height = max - (element.css('box-sizing') == 'border-box' ? 0 : element.outerHeight() - element.height());
	
	            element.css('min-height', height + 'px');
	        });
	    };
	
	    if (options.row) {
	
	        elements.first().width(); // force redraw
	
	        setTimeout(function () {
	
	            var lastoffset = false,
	                group = [];
	
	            elements.each(function () {
	
	                var ele = (0, _jquery2.default)(this),
	                    offset = ele.offset().top;
	
	                if (offset != lastoffset && group.length) {
	
	                    matchHeights((0, _jquery2.default)(group));
	                    group = [];
	                    offset = ele.offset().top;
	                }
	
	                group.push(ele);
	                lastoffset = offset;
	            });
	
	            if (group.length) {
	                matchHeights((0, _jquery2.default)(group));
	            }
	        }, 0);
	    } else {
	        matchHeights(elements);
	    }
	}
	
	function stackMargin(elements, options) {
	
	    options = (0, _lang.extend)({
	        margin: 'uk-margin-small-top'
	    }, options);
	
	    options.margin = options.margin;
	
	    elements = (0, _jquery2.default)(elements).removeClass(options.margin);
	
	    var skip = false,
	        firstvisible = elements.filter(":visible:first"),
	        offset = firstvisible.length ? firstvisible.position().top + firstvisible.outerHeight() - 1 : false; // (-1): weird firefox bug when parent container is display:flex
	
	    if (offset === false || elements.length == 1) return;
	
	    elements.each(function () {
	
	        var column = (0, _jquery2.default)(this);
	
	        if (column.is(":visible")) {
	
	            if (skip) {
	                column.addClass(options.margin);
	            } else {
	
	                if (column.position().top >= offset) {
	                    skip = column.addClass(options.margin);
	                }
	            }
	        }
	    });
	}
	
	function checkDisplay(context, initanimation) {
	
	    var elements = (0, _jquery2.default)('[data-uk-margin], [data-uk-grid-match], [data-uk-grid-margin], [data-uk-check-display]', context || document),
	        animated = undefined;
	
	    if (context && !elements.length) {
	        elements = (0, _jquery2.default)(context);
	    }
	
	    elements.trigger('display.uk.check');
	
	    // fix firefox / IE animations
	    if (initanimation) {
	
	        if (typeof initanimation != 'string') {
	            initanimation = '[class*="uk-animation-"]';
	        }
	
	        elements.find(initanimation).each(function () {
	
	            var ele = (0, _jquery2.default)(this),
	                cls = ele.attr('class'),
	                anim = cls.match(/uk\-animation\-(.+)/);
	
	            ele.removeClass(anim[0]).width();
	
	            ele.addClass(anim[0]);
	        });
	    }
	
	    return elements;
	}

/***/ },
/* 7 */
/*!********************************!*\
  !*** ./src/js/api/internal.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function (UIkit) {
	
	    UIkit.prototype.props = {};
	
	    UIkit.prototype._init = function (options) {
	
	        options = options || {};
	        options = this.$options = (0, _index.mergeOptions)(this.constructor.options, options, this);
	
	        this.$el = options.el ? (0, _jquery2.default)(options.el) : null;
	
	        (0, _index.extend)(this, options.props);
	
	        //
	        // Object.keys(this.props).forEach(prop => {
	        //     if (this.$options[prop]) this[prop] = this.$options[prop];
	        // });
	
	        this._initMethods();
	        this._callHook('init');
	    };
	
	    UIkit.prototype._initMethods = function () {
	
	        var methods = this.$options.methods;
	
	        if (methods) {
	            for (var key in methods) {
	                this[key] = (0, _index.bind)(methods[key], this);
	            }
	        }
	    };
	
	    UIkit.prototype._callHook = function (hook) {
	
	        var handlers = this.$options[hook];
	
	        if (handlers) {
	            for (var i = 0, j = handlers.length; i < j; i++) {
	                handlers[i].call(this);
	            }
	        }
	    };
	};
	
	var _jquery = __webpack_require__(/*! jquery */ 1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _index = __webpack_require__(/*! ../util/index */ 3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	;
	module.exports = exports['default'];

/***/ },
/* 8 */
/*!*****************************!*\
  !*** ./src/js/api/event.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function (UIkit) {
	
	    var $doc = (0, _jquery2.default)(document);
	    var ready = [];
	
	    UIkit.ready = function (fn) {
	
	        ready.push(fn);
	
	        if (UIkit.domready) {
	            fn(document);
	        }
	
	        return UIkit;
	    };
	
	    UIkit.on = function (a1, a2, a3) {
	
	        if (a1 && a1.indexOf('ready.uk.dom') > -1 && UI.domready) {
	            a2.apply($doc);
	        }
	
	        $doc.on(a1, a2, a3);
	
	        return UIkit;
	    };
	
	    UIkit.one = function (a1, a2, a3) {
	
	        if (a1 && a1.indexOf('ready.uk.dom') > -1 && UIkit.domready) {
	            a2.apply($doc);
	        } else {
	            $doc.one(a1, a2, a3);
	        }
	
	        return UIkit;
	    };
	
	    UIkit.trigger = function (evt, params) {
	        $doc.trigger(evt, params);
	        return UIkit;
	    };
	
	    document.addEventListener('DOMContentLoaded', function () {
	
	        var domReady = function domReady() {
	
	            UIkit.trigger('beforeready.uk.dom');
	
	            ready.forEach(function (fn) {
	                fn(document);
	            });
	
	            UIkit.trigger('domready.uk.dom');
	
	            UIkit.trigger('afterready.uk.dom');
	
	            // mark that domready is left behind
	            UIkit.domready = true;
	        };
	
	        if (document.readyState == 'complete' || document.readyState == 'interactive') {
	            setTimeout(domReady);
	        }
	
	        return domReady;
	    }());
	};
	
	var _jquery = __webpack_require__(/*! jquery */ 1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	;
	module.exports = exports['default'];

/***/ },
/* 9 */
/*!*********************************!*\
  !*** ./src/js/api/component.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function (UIkit) {
	
	    var Component = UIkit.extend({
	        init: function init() {
	
	            this.uuid = (0, _index.uuid)();
	            this.component = this.constructor.name;
	
	            if (this.$el && this.$el.length) {
	                this.$el[0]['$' + this.component] = this;
	            }
	        },
	
	        methods: {
	            $on: function $on(a1, a2, a3) {
	                return (0, _jquery2.default)(this.$el || this).on(a1, a2, a3);
	            },
	            $one: function $one(a1, a2, a3) {
	                return (0, _jquery2.default)(this.$el || this).one(a1, a2, a3);
	            },
	            $off: function $off(evt) {
	                return (0, _jquery2.default)(this.$el || this).off(evt);
	            },
	            $trigger: function $trigger(evt, params) {
	                return (0, _jquery2.default)(this.$el || this).trigger(evt, params);
	            },
	            $find: function $find(selector) {
	                return (0, _jquery2.default)(this.$el ? this.$el : []).find(selector);
	            }
	        }
	    });
	
	    UIkit.components = {
	        base: Component
	    };
	
	    UIkit.component = function (name, def) {
	
	        def.name = name;
	
	        UIkit.components[name] = Component.extend(def);
	
	        UIkit[name] = function (element, options) {
	
	            var key = '$' + name;
	
	            element = (0, _jquery2.default)(element);
	            options = options || {};
	
	            element.each(function () {
	                if (!this[key]) {
	                    return new UIkit.components[name]({ el: this, props: options });
	                }
	            });
	
	            return element[0][key];
	        };
	
	        return UIkit.components[name];
	    };
	};
	
	var _jquery = __webpack_require__(/*! jquery */ 1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(/*! ../util/index */ 3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = exports['default'];

/***/ },
/* 10 */
/*!************************************!*\
  !*** ./src/js/api/webcomponent.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function (UIkit) {
	
	    var Component = UIkit.components.base.extend({});
	
	    UIkit.components.webcomponent = Component;
	
	    UIkit.webcomponent = function (name, def) {
	
	        registerElement(name, def.webcomponent || {});
	
	        def.methods = (0, _index.extend)({
	            $created: function $created() {},
	            $attached: function $attached() {},
	            $detached: function $detached() {},
	            $attributeChanged: function $attributeChanged() {}
	        }, def.methods);
	
	        return UIkit.component(name, def);
	    };
	};
	
	var _jquery = __webpack_require__(/*! jquery */ 1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	__webpack_require__(/*! document-register-element */ 11);
	
	var _index = __webpack_require__(/*! ../util/index */ 3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function registerElement(name, def) {
	
	    def = (0, _index.extend)({
	        prototype: Object.create(HTMLElement.prototype)
	    }, def);
	
	    if (typeof def.prototype == 'string') {
	        def.prototype = Object.create(window[def.prototype]);
	    }
	
	    (0, _index.extend)(true, def.prototype, {
	
	        createdCallback: function createdCallback() {
	            var component = UIkit[name](this, (0, _index.attributes)(this));
	            component.$created.apply(component, arguments);
	        },
	        attachedCallback: function attachedCallback() {
	            var component = UIkit[name](this);
	            component.$attached.apply(component, arguments);
	        },
	        detachedCallback: function detachedCallback() {
	            var component = UIkit[name](this);
	            component.$detached.apply(component, arguments);
	        },
	        attributeChangedCallback: function attributeChangedCallback() {
	            var component = UIkit[name](this);
	            component.onAttributeChanged.apply(component, arguments);
	        }
	    });
	
	    var opts = { prototype: def.prototype };
	
	    opts.prototype.ukcomponent = true;
	
	    if (def.extends) {
	        opts.extends = def.extends;
	    }
	
	    document.registerElement('uk-' + name, opts);
	};
	
	// support <element is="uk-*"></element>
	(function (MO) {
	
	    if (!MO) return;
	
	    function init(nodes) {
	        var _loop = function _loop(i, length, _node, _name, _obj, _init) {
	
	            _node = nodes[i];
	            _name = (_node.getAttribute && _node.getAttribute('is') || '').replace(/uk\-/g, '');
	
	            _name.split(' ').forEach(function (component) {
	
	                component = component.trim();
	
	                if (component && UIkit.components[component] && !_node['$' + component]) {
	
	                    _obj = UIkit[component](_node, (0, _index.attributes)(_node));
	
	                    _obj.$created();
	                    _obj.$attached();
	                }
	            });
	            node = _node;
	            name = _name;
	            obj = _obj;
	        };
	
	        for (var i = 0, length = nodes.length, node, name, _init, obj; i < length; i++) {
	            _loop(i, length, node, name, obj, _init);
	        }
	    }
	
	    return new MO(function (records) {
	
	        for (var current, _node2, newValue, i = 0, length = records.length; i < length; i++) {
	            current = records[i];
	            if (current.type === 'childList') {
	                init(current.addedNodes, 'created attached');
	            }
	        }
	    });
	})(window.MutationObserver || window.WebKitMutationObserver).observe(document, {
	    childList: true,
	    subtree: true
	});
	
	module.exports = exports['default'];

/***/ },
/* 11 */
/*!************************************************************************!*\
  !*** ./~/document-register-element/build/document-register-element.js ***!
  \************************************************************************/
/***/ function(module, exports) {

	/*! (C) WebReflection Mit Style License */
	(function(e,t,n,r){"use strict";function rt(e,t){for(var n=0,r=e.length;n<r;n++)vt(e[n],t)}function it(e){for(var t=0,n=e.length,r;t<n;t++)r=e[t],nt(r,b[ot(r)])}function st(e){return function(t){j(t)&&(vt(t,e),rt(t.querySelectorAll(w),e))}}function ot(e){var t=e.getAttribute("is"),n=e.nodeName.toUpperCase(),r=S.call(y,t?v+t.toUpperCase():d+n);return t&&-1<r&&!ut(n,t)?-1:r}function ut(e,t){return-1<w.indexOf(e+'[is="'+t+'"]')}function at(e){var t=e.currentTarget,n=e.attrChange,r=e.attrName,i=e.target;Q&&(!i||i===t)&&t.attributeChangedCallback&&r!=="style"&e.prevValue!==e.newValue&&t.attributeChangedCallback(r,n===e[a]?null:e.prevValue,n===e[l]?null:e.newValue)}function ft(e){var t=st(e);return function(e){X.push(t,e.target)}}function lt(e){K&&(K=!1,e.currentTarget.removeEventListener(h,lt)),rt((e.target||t).querySelectorAll(w),e.detail===o?o:s),B&&pt()}function ct(e,t){var n=this;q.call(n,e,t),G.call(n,{target:n})}function ht(e,t){D(e,t),et?et.observe(e,z):(J&&(e.setAttribute=ct,e[i]=Z(e),e.addEventListener(p,G)),e.addEventListener(c,at)),e.createdCallback&&Q&&(e.created=!0,e.createdCallback(),e.created=!1)}function pt(){for(var e,t=0,n=F.length;t<n;t++)e=F[t],E.contains(e)||(n--,F.splice(t--,1),vt(e,o))}function dt(e){throw new Error("A "+e+" type is already registered")}function vt(e,t){var n,r=ot(e);-1<r&&(tt(e,b[r]),r=0,t===s&&!e[s]?(e[o]=!1,e[s]=!0,r=1,B&&S.call(F,e)<0&&F.push(e)):t===o&&!e[o]&&(e[s]=!1,e[o]=!0,r=1),r&&(n=e[t+"Callback"])&&n.call(e))}if(r in t)return;var i="__"+r+(Math.random()*1e5>>0),s="attached",o="detached",u="extends",a="ADDITION",f="MODIFICATION",l="REMOVAL",c="DOMAttrModified",h="DOMContentLoaded",p="DOMSubtreeModified",d="<",v="=",m=/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,g=["ANNOTATION-XML","COLOR-PROFILE","FONT-FACE","FONT-FACE-SRC","FONT-FACE-URI","FONT-FACE-FORMAT","FONT-FACE-NAME","MISSING-GLYPH"],y=[],b=[],w="",E=t.documentElement,S=y.indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},x=n.prototype,T=x.hasOwnProperty,N=x.isPrototypeOf,C=n.defineProperty,k=n.getOwnPropertyDescriptor,L=n.getOwnPropertyNames,A=n.getPrototypeOf,O=n.setPrototypeOf,M=!!n.__proto__,_=n.create||function mt(e){return e?(mt.prototype=e,new mt):this},D=O||(M?function(e,t){return e.__proto__=t,e}:L&&k?function(){function e(e,t){for(var n,r=L(t),i=0,s=r.length;i<s;i++)n=r[i],T.call(e,n)||C(e,n,k(t,n))}return function(t,n){do e(t,n);while((n=A(n))&&!N.call(n,t));return t}}():function(e,t){for(var n in t)e[n]=t[n];return e}),P=e.MutationObserver||e.WebKitMutationObserver,H=(e.HTMLElement||e.Element||e.Node).prototype,B=!N.call(H,E),j=B?function(e){return e.nodeType===1}:function(e){return N.call(H,e)},F=B&&[],I=H.cloneNode,q=H.setAttribute,R=H.removeAttribute,U=t.createElement,z=P&&{attributes:!0,characterData:!0,attributeOldValue:!0},W=P||function(e){J=!1,E.removeEventListener(c,W)},X,V=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.msRequestAnimationFrame||function(e){setTimeout(e,10)},$=!1,J=!0,K=!0,Q=!0,G,Y,Z,et,tt,nt;O||M?(tt=function(e,t){N.call(t,e)||ht(e,t)},nt=ht):(tt=function(e,t){e[i]||(e[i]=n(!0),ht(e,t))},nt=tt),B?(J=!1,function(){var e=k(H,"addEventListener"),t=e.value,n=function(e){var t=new CustomEvent(c,{bubbles:!0});t.attrName=e,t.prevValue=this.getAttribute(e),t.newValue=null,t[l]=t.attrChange=2,R.call(this,e),this.dispatchEvent(t)},r=function(e,t){var n=this.hasAttribute(e),r=n&&this.getAttribute(e),i=new CustomEvent(c,{bubbles:!0});q.call(this,e,t),i.attrName=e,i.prevValue=n?r:null,i.newValue=t,n?i[f]=i.attrChange=1:i[a]=i.attrChange=0,this.dispatchEvent(i)},s=function(e){var t=e.currentTarget,n=t[i],r=e.propertyName,s;n.hasOwnProperty(r)&&(n=n[r],s=new CustomEvent(c,{bubbles:!0}),s.attrName=n.name,s.prevValue=n.value||null,s.newValue=n.value=t[r]||null,s.prevValue==null?s[a]=s.attrChange=0:s[f]=s.attrChange=1,t.dispatchEvent(s))};e.value=function(e,o,u){e===c&&this.attributeChangedCallback&&this.setAttribute!==r&&(this[i]={className:{name:"class",value:this.className}},this.setAttribute=r,this.removeAttribute=n,t.call(this,"propertychange",s)),t.call(this,e,o,u)},C(H,"addEventListener",e)}()):P||(E.addEventListener(c,W),E.setAttribute(i,1),E.removeAttribute(i),J&&(G=function(e){var t=this,n,r,s;if(t===e.target){n=t[i],t[i]=r=Z(t);for(s in r){if(!(s in n))return Y(0,t,s,n[s],r[s],a);if(r[s]!==n[s])return Y(1,t,s,n[s],r[s],f)}for(s in n)if(!(s in r))return Y(2,t,s,n[s],r[s],l)}},Y=function(e,t,n,r,i,s){var o={attrChange:e,currentTarget:t,attrName:n,prevValue:r,newValue:i};o[s]=e,at(o)},Z=function(e){for(var t,n,r={},i=e.attributes,s=0,o=i.length;s<o;s++)t=i[s],n=t.name,n!=="setAttribute"&&(r[n]=t.value);return r})),t[r]=function(n,r){c=n.toUpperCase(),$||($=!0,P?(et=function(e,t){function n(e,t){for(var n=0,r=e.length;n<r;t(e[n++]));}return new P(function(r){for(var i,s,o,u=0,a=r.length;u<a;u++)i=r[u],i.type==="childList"?(n(i.addedNodes,e),n(i.removedNodes,t)):(s=i.target,Q&&s.attributeChangedCallback&&i.attributeName!=="style"&&(o=s.getAttribute(i.attributeName),o!==i.oldValue&&s.attributeChangedCallback(i.attributeName,i.oldValue,o)))})}(st(s),st(o)),et.observe(t,{childList:!0,subtree:!0})):(X=[],V(function E(){while(X.length)X.shift().call(null,X.shift());V(E)}),t.addEventListener("DOMNodeInserted",ft(s)),t.addEventListener("DOMNodeRemoved",ft(o))),t.addEventListener(h,lt),t.addEventListener("readystatechange",lt),t.createElement=function(e,n){var r=U.apply(t,arguments),i=""+e,s=S.call(y,(n?v:d)+(n||i).toUpperCase()),o=-1<s;return n&&(r.setAttribute("is",n=n.toLowerCase()),o&&(o=ut(i.toUpperCase(),n))),Q=!t.createElement.innerHTMLHelper,o&&nt(r,b[s]),r},H.cloneNode=function(e){var t=I.call(this,!!e),n=ot(t);return-1<n&&nt(t,b[n]),e&&it(t.querySelectorAll(w)),t}),-2<S.call(y,v+c)+S.call(y,d+c)&&dt(n);if(!m.test(c)||-1<S.call(g,c))throw new Error("The type "+n+" is invalid");var i=function(){return f?t.createElement(l,c):t.createElement(l)},a=r||x,f=T.call(a,u),l=f?r[u].toUpperCase():c,c,p;return f&&-1<S.call(y,d+l)&&dt(l),p=y.push((f?v:d)+c)-1,w=w.concat(w.length?",":"",f?l+'[is="'+n.toLowerCase()+'"]':l),i.prototype=b[p]=T.call(a,"prototype")?a.prototype:_(H),rt(t.querySelectorAll(w),s),i}})(window,document,Object,"registerElement");

/***/ },
/* 12 */
/*!**********************************!*\
  !*** ./src/js/supports/index.js ***!
  \**********************************/
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
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

/***/ },
/* 13 */
/*!*****************************!*\
  !*** ./src/js/core/grid.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function (UI) {
	
	    UI.webcomponent('grid', {
	
	        props: {
	            margin: 'uk-grid-margin',
	            match: false,
	            rowfirst: 'uk-grid-first'
	        },
	
	        methods: {
	            $attached: function $attached() {
	                this.check();
	                grids.push(this);
	            },
	            check: function check() {
	                var _this = this;
	
	                this.columns = this.$el.children();
	
	                if (this.match) this.matcher();
	                if (this.margin) this.margins();
	
	                if (!this.rowfirst) {
	                    return this;
	                }
	
	                // Mark first column elements
	                var pos_cache = this.columns.removeClass(this.rowfirst).filter(':visible').first().position();
	
	                if (pos_cache) {
	                    (function () {
	
	                        var $this = _this;
	
	                        _this.columns.each(function () {
	                            (0, _jquery2.default)(this)[(0, _jquery2.default)(this).position().left == pos_cache.left ? 'addClass' : 'removeClass']($this.rowfirst);
	                        });
	                    })();
	                }
	            },
	            matcher: function matcher() {
	
	                if (this.match) {
	
	                    var children = this.columns;
	                    var firstvisible = children.filter(":visible:first");
	
	                    if (!firstvisible.length) return;
	
	                    var elements = this.match === true ? children : this.$find(this.match);
	                    var stacked = Math.ceil(100 * parseFloat(firstvisible.css('width')) / parseFloat(firstvisible.parent().css('width'))) >= 100;
	
	                    if (stacked && !this.ignorestacked) {
	                        elements.css('min-height', '');
	                    } else {
	                        (0, _index.matchHeights)(elements, this.options);
	                    }
	                }
	
	                return this;
	            },
	            margins: function margins() {
	
	                if (this.margin) {
	                    (0, _index.stackMargin)(this.columns, { margin: this.margin });
	                }
	
	                return this;
	            }
	        }
	
	    });
	};
	
	var _jquery = __webpack_require__(/*! jquery */ 1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _index = __webpack_require__(/*! ../util/index */ 3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var grids = [];
	
	(0, _jquery2.default)(window).on('load resize orientationchange', function (e) {
	    grids.forEach(function (grid) {
	        grid.check();
	    });
	});
	
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=uikit.js.map