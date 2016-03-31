(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jQuery"));
	else if(typeof define === 'function' && define.amd)
		define(["jQuery"], factory);
	else if(typeof exports === 'object')
		exports["UIkit"] = factory(require("jQuery"));
	else
		root["UIkit"] = factory(root["jQuery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
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

	var _index = __webpack_require__(1);

	var _index2 = _interopRequireDefault(_index);

	var _index3 = __webpack_require__(15);

	var _index4 = _interopRequireDefault(_index3);

	var _index5 = __webpack_require__(20);

	var _index6 = _interopRequireDefault(_index5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_index2.default.version = '3.0.0';

	(0, _index4.default)(_index2.default, _index2.default.util);
	(0, _index6.default)(_index2.default, _index2.default.util);

	exports.default = _index2.default;

	module.exports = _index2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _boot = __webpack_require__(2);

	var _boot2 = _interopRequireDefault(_boot);

	var _global = __webpack_require__(11);

	var _global2 = _interopRequireDefault(_global);

	var _internal = __webpack_require__(12);

	var _internal2 = _interopRequireDefault(_internal);

	var _instance = __webpack_require__(13);

	var _instance2 = _interopRequireDefault(_instance);

	var _component = __webpack_require__(14);

	var _component2 = _interopRequireDefault(_component);

	var _index = __webpack_require__(4);

	var util = _interopRequireWildcard(_index);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var UIkit = function UIkit(options) {
	    this._init(options);
	};

	UIkit.util = util;
	UIkit.data = '__uikit__';
	UIkit.options = {};
	UIkit.instances = {};
	UIkit.elements = [];

	(0, _global2.default)(UIkit);
	(0, _internal2.default)(UIkit);
	(0, _instance2.default)(UIkit);
	(0, _component2.default)(UIkit);
	(0, _boot2.default)(UIkit);

	exports.default = UIkit;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    var DATA = UIkit.data;

	    if (!_index.Observer) {
	        (0, _index.ready)(function () {
	            return (0, _jquery2.default)(UIkit.component.selector).each(function (i, node) {
	                return attachComponents(node);
	            });
	        });
	        return;
	    }

	    new _index.Observer(function (mutations) {

	        mutations.forEach(function (mutation) {

	            if (mutation.type === 'childList') {

	                for (var i = 0; i < mutation.addedNodes.length; ++i) {

	                    var node = mutation.addedNodes[i];

	                    if ((0, _index.matches)(node, UIkit.component.selector)) {
	                        attachComponents(node);
	                    }
	                }

	                for (var _i = 0; _i < mutation.removedNodes.length; ++_i) {

	                    var components = mutation.removedNodes[_i][DATA];

	                    if (components) {
	                        for (var name in components) {
	                            components[name].$destroy();
	                        }
	                    }
	                }
	            }
	        });
	    }).observe(document, { childList: true, subtree: true });

	    function attachComponents(node) {

	        for (var i = 0; i < node.attributes.length; i++) {

	            var name = node.attributes[i].name;

	            if (name.lastIndexOf('uk-', 0) === 0) {
	                name = (0, _index.camelize)(name.replace('uk-', ''));

	                if (UIkit[name]) {
	                    UIkit[name](node);
	                }
	            }
	        }
	    }
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _dom = __webpack_require__(5);

	Object.keys(_dom).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _dom[key];
	    }
	  });
	});

	var _env = __webpack_require__(6);

	Object.keys(_env).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _env[key];
	    }
	  });
	});

	var _lang = __webpack_require__(7);

	Object.keys(_lang).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _lang[key];
	    }
	  });
	});

	var _options = __webpack_require__(8);

	Object.keys(_options).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _options[key];
	    }
	  });
	});

	var _position = __webpack_require__(9);

	Object.keys(_position).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _position[key];
	    }
	  });
	});

	var _touch = __webpack_require__(10);

	Object.keys(_touch).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _touch[key];
	    }
	  });
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Animation = exports.Transition = exports.langDirection = undefined;
	exports.ready = ready;
	exports.transition = transition;
	exports.animate = animate;
	exports.isWithin = isWithin;
	exports.attrFilter = attrFilter;
	exports.removeClass = removeClass;
	exports.createEvent = createEvent;
	exports.isInView = isInView;

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _env = __webpack_require__(6);

	var _lang = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var langDirection = exports.langDirection = (0, _jquery2.default)('html').attr('dir') == 'rtl' ? 'right' : 'left';

	function ready(fn) {

	    var handle = function handle() {
	        document.removeEventListener('DOMContentLoaded', handle);
	        window.removeEventListener('load', handle);
	        fn();
	    };

	    if (document.readyState === 'complete') {
	        fn();
	    } else {
	        document.addEventListener('DOMContentLoaded', handle);
	        window.addEventListener('load', handle);
	    }
	}

	function transition(element, props, duration, transition) {

	    var d = _jquery2.default.Deferred();

	    element = (0, _jquery2.default)(element);

	    for (var name in props) {
	        element.css(name, element.css(name));
	    }

	    var timer = setTimeout(function () {
	        return element.trigger(_env.transitionend || 'transitionend');
	    }, duration);

	    element.one(_env.transitionend || 'transitionend', function () {
	        d.resolve();
	        clearTimeout(timer);
	        element.removeClass('uk-transition').css('transition', '');
	    }).addClass('uk-transition').css('transition', 'all ' + duration + 'ms ' + (transition || 'linear')).css(props);

	    return d.promise();
	}

	var Transition = exports.Transition = {

	    start: transition,

	    stop: function stop(element) {

	        element = (0, _jquery2.default)(element);

	        (0, _jquery2.default)(element).trigger(_env.transitionend || 'transitionend');

	        return this;
	    },
	    inProgress: function inProgress(element) {
	        return (0, _jquery2.default)(element).hasClass('uk-transition');
	    }
	};

	function animate(element, animation, duration, out) {

	    var d = _jquery2.default.Deferred(),
	        cls = out ? 'uk-animation-leave' : 'uk-animation-enter';

	    element = (0, _jquery2.default)(element);

	    if (out && animation.indexOf('uk-animation-') === 0) {
	        animation += ' uk-animation-reverse';
	    }

	    reset();

	    element.one(_env.animationend || 'animationend', function () {
	        reset();
	        d.resolve();
	    }).css('animation-duration', duration + 'ms').addClass(animation);

	    (0, _env.requestAnimationFrame)(function () {
	        return element.addClass(cls);
	    });

	    if (!_env.animationend) {
	        (0, _env.requestAnimationFrame)(function () {
	            return Animation.cancel(element);
	        });
	    }

	    return d.promise();

	    function reset() {
	        element.css('animation-duration', '').removeClass(cls + ' ' + animation);
	    }
	}

	var Animation = exports.Animation = {
	    in: function _in(element, animation, duration) {
	        return animate(element, animation, duration, false);
	    },
	    out: function out(element, animation, duration) {
	        return animate(element, animation, duration, true);
	    },
	    inProgress: function inProgress(element) {
	        return (0, _jquery2.default)(element).hasClass('uk-animation-enter') || (0, _jquery2.default)(element).hasClass('uk-animation-leave');
	    },
	    cancel: function cancel(element) {
	        (0, _jquery2.default)(element).trigger(_env.animationend || 'animationend');
	        return this;
	    }
	};

	function isWithin(element, selector) {
	    element = (0, _jquery2.default)(element);
	    return element.is(selector) || !!(typeof selector === 'string' ? element.parents(selector).length : _jquery2.default.contains(selector instanceof _jquery2.default ? selector[0] : selector, element[0]));
	}

	function attrFilter(element, attr, pattern, replacement) {
	    element = (0, _jquery2.default)(element);
	    element.attr(attr, function (i, value) {
	        return value ? value.replace(pattern, replacement) : value;
	    });
	    return element;
	}

	function removeClass(element, cls) {
	    return attrFilter(element, 'class', new RegExp('(^|\\s)' + cls + '(?!\\S)', 'g'), '');
	}

	function createEvent(e) {
	    if ((0, _lang.isString)(e)) {
	        var ev = document.createEvent('Event');
	        ev.initEvent(e, true, false);
	        return ev;
	    }
	    return e;
	}

	function isInView(element, offsetTop, offsetLeft) {

	    element = (0, _jquery2.default)(element);

	    if (!element.is(':visible')) {
	        return false;
	    }

	    var win = (0, _jquery2.default)(window),
	        scrollLeft = win.scrollLeft(),
	        scrollTop = win.scrollTop(),
	        offset = element.offset();

	    return offset.top + element.height() >= scrollTop && offset.top - offsetTop <= scrollTop + win.height() && offset.left + element.width() >= scrollLeft && offset.left - offsetLeft <= scrollLeft + win.width();
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.matches = matches;
	var Observer = exports.Observer = window.MutationObserver || window.WebKitMutationObserver;
	var requestAnimationFrame = exports.requestAnimationFrame = window.requestAnimationFrame || function (fn) {
	    return setTimeout(fn, 1000 / 60);
	};
	var cancelAnimationFrame = exports.cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;

	var hasTouch = exports.hasTouch = 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch || navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 || //IE 10
	navigator.pointerEnabled && navigator.maxTouchPoints > 0; //IE >=11

	var transitionend = exports.transitionend = function () {

	    var element = document.body || document.documentElement,
	        names = {
	        WebkitTransition: 'webkitTransitionEnd',
	        MozTransition: 'transitionend',
	        OTransition: 'oTransitionEnd otransitionend',
	        transition: 'transitionend'
	    },
	        name;

	    for (name in names) {
	        if (element.style[name] !== undefined) {
	            return names[name];
	        }
	    }
	}();

	var animationend = exports.animationend = function () {

	    var element = document.body || document.documentElement,
	        names = {
	        WebkitAnimation: 'webkitAnimationEnd',
	        MozAnimation: 'animationend',
	        OAnimation: 'oAnimationEnd oanimationend',
	        animation: 'animationend'
	    },
	        name;

	    for (name in names) {
	        if (element.style[name] !== undefined) {
	            return names[name];
	        }
	    }
	}();

	var matchesFn = Element.prototype.matches ? 'matches' : Element.prototype.msMatchesSelector ? 'msMatchesSelector' : Element.prototype.webkitMatchesSelector ? 'webkitMatchesSelector' : false;
	function matches(element, selector) {
	    return element[matchesFn] ? element[matchesFn](selector) : false;
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.isPlainObject = exports.isFunction = exports.isArray = exports.merge = exports.map = exports.extend = exports.each = exports.$ = undefined;

	var _jquery = __webpack_require__(3);

	Object.defineProperty(exports, '$', {
	    enumerable: true,
	    get: function get() {
	        return _jquery.$;
	    }
	});
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
	Object.defineProperty(exports, 'isPlainObject', {
	    enumerable: true,
	    get: function get() {
	        return _jquery.isPlainObject;
	    }
	});
	exports.bind = bind;
	exports.hasOwn = hasOwn;
	exports.classify = classify;
	exports.hyphenate = hyphenate;
	exports.camelize = camelize;
	exports.isString = isString;
	exports.toBoolean = toBoolean;
	exports.toNumber = toNumber;
	exports.toJQuery = toJQuery;
	exports.coerce = coerce;

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function bind(fn, context) {
	    return function (a) {
	        var l = arguments.length;
	        return l ? l > 1 ? fn.apply(context, arguments) : fn.call(context, a) : fn.call(context);
	    };
	}

	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function hasOwn(obj, key) {
	    return hasOwnProperty.call(obj, key);
	}

	var classifyRE = /(?:^|[-_\/])(\w)/g;
	function classify(str) {
	    return str.replace(classifyRE, function (_, c) {
	        return c ? c.toUpperCase() : '';
	    });
	}

	var hyphenateRE = /([a-z\d])([A-Z])/g;
	function hyphenate(str) {
	    return str.replace(hyphenateRE, '$1-$2').toLowerCase();
	}

	var camelizeRE = /-(\w)/g;
	function camelize(str) {
	    return str.replace(camelizeRE, toUpper);
	}

	function toUpper(_, c) {
	    return c ? c.toUpperCase() : '';
	}

	function isString(value) {
	    return typeof value === 'string';
	}

	function toBoolean(value) {
	    return typeof value === 'boolean' ? value : value === 'true' || value == '1' || value === '' ? true : value === 'false' || value == '0' ? false : value;
	}

	function toNumber(value) {
	    var number = Number(value);
	    return !isNaN(number) ? number : false;
	}

	function toJQuery(element, context) {
	    if (element === true) {
	        return null;
	    }

	    element = (0, _jquery2.default)(element, context);
	    return element.length ? element : null;
	}

	function coerce(type, value) {

	    if (type === Boolean) {
	        return toBoolean(value);
	    } else if (type === Number) {
	        return toNumber(value);
	    } else if (type === 'jQuery') {
	        return toJQuery(value);
	    }

	    return type ? type(value) : value;
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.mergeOptions = mergeOptions;

	var _index = __webpack_require__(4);

	var strats = {};

	// concat strategy
	strats.init = strats.ready = strats.destroy = function (parentVal, childVal) {
	    return childVal ? parentVal ? parentVal.concat(childVal) : (0, _index.isArray)(childVal) ? childVal : [childVal] : parentVal;
	};

	// property strategy
	strats.props = function (parentVal, childVal) {

	    if ((0, _index.isArray)(childVal)) {
	        var ret = {};
	        childVal.forEach(function (val) {
	            ret[val] = String;
	        });
	        childVal = ret;
	    }

	    return strats.methods(parentVal, childVal);
	};

	// extend strategy
	strats.defaults = strats.methods = function (parentVal, childVal) {
	    return childVal ? parentVal ? (0, _index.extend)({}, parentVal, childVal) : childVal : parentVal;
	};

	// default strategy
	var defaultStrat = function defaultStrat(parentVal, childVal) {
	    return childVal === undefined ? parentVal : childVal;
	};

	function mergeOptions(parent, child, thisArg) {

	    var options = {},
	        key;

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
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.position = position;
	exports.getDimensions = getDimensions;

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var dirs = {
	    x: ['width', 'left', 'right'],
	    y: ['height', 'top', 'bottom']
	};

	function position(element, target, attach, targetAttach, offset, targetOffset, flip, boundary) {

	    element = (0, _jquery2.default)(element);
	    target = (0, _jquery2.default)(target);
	    boundary = boundary && (0, _jquery2.default)(boundary);
	    attach = getPos(attach);
	    targetAttach = getPos(targetAttach);

	    var dim = getDimensions(element),
	        targetDim = getDimensions(target),
	        position = targetDim;

	    moveTo(position, attach, dim, -1);
	    moveTo(position, targetAttach, targetDim, 1);

	    offset = getOffsets(offset, dim.width, dim.height);
	    targetOffset = getOffsets(targetOffset, targetDim.width, targetDim.height);

	    offset['x'] += targetOffset['x'];
	    offset['y'] += targetOffset['y'];

	    position.left += offset['x'];
	    position.top += offset['y'];

	    boundary = getDimensions(boundary || window);

	    var flipped = { element: attach, target: targetAttach };

	    if (flip) {
	        _jquery2.default.each(dirs, function (dir, _ref) {
	            var _ref2 = _slicedToArray(_ref, 3);

	            var prop = _ref2[0];
	            var align = _ref2[1];
	            var alignFlip = _ref2[2];


	            if (!(flip === true || flip.indexOf(dir) !== -1)) {
	                return;
	            }

	            var elemOffset = attach[dir] === align ? -dim[prop] : attach[dir] === alignFlip ? dim[prop] : 0,
	                targetOffset = targetAttach[dir] === align ? targetDim[prop] : targetAttach[dir] === alignFlip ? -targetDim[prop] : 0;

	            if (position[align] < boundary[align] || position[align] + dim[prop] > boundary[alignFlip]) {

	                var newVal = position[align] + elemOffset + targetOffset - offset[dir] * 2;

	                if (newVal >= boundary[align] && newVal + dim[prop] <= boundary[alignFlip]) {
	                    position[align] = newVal;

	                    ['element', 'target'].forEach(function (el) {
	                        flipped[el][dir] = !elemOffset ? flipped[el][dir] : flipped[el][dir] === dirs[dir][1] ? dirs[dir][2] : dirs[dir][1];
	                    });
	                }
	            }
	        });
	    }

	    element.offset({ left: position.left, top: position.top });

	    return flipped;
	}

	function getDimensions(elem) {

	    elem = (0, _jquery2.default)(elem);

	    var width = elem.outerWidth(),
	        height = elem.outerHeight(),
	        offset = elem.offset(),
	        left = offset ? offset.left : elem.scrollLeft(),
	        top = offset ? offset.top : elem.scrollTop();

	    return { width: width, height: height, left: left, top: top, right: left + width, bottom: top + height };
	}

	function moveTo(position, attach, dim, factor) {
	    _jquery2.default.each(dirs, function (dir, _ref3) {
	        var _ref4 = _slicedToArray(_ref3, 3);

	        var prop = _ref4[0];
	        var align = _ref4[1];
	        var alignFlip = _ref4[2];

	        if (attach[dir] === alignFlip) {
	            position[align] += dim[prop] * factor;
	        } else if (attach[dir] === 'center') {
	            position[align] += dim[prop] * factor / 2;
	        }
	    });
	}

	function getPos(pos) {

	    var x = /left|center|right/,
	        y = /top|center|bottom/;

	    pos = (pos || '').split(' ');

	    if (pos.length === 1) {
	        pos = x.test(pos[0]) ? pos.concat(['center']) : y.test(pos[0]) ? ['center'].concat(pos) : ['center', 'center'];
	    }

	    return {
	        x: x.test(pos[0]) ? pos[0] : 'center',
	        y: y.test(pos[1]) ? pos[1] : 'center'
	    };
	}

	function getOffsets(offsets, width, height) {

	    offsets = (offsets || '').split(' ');

	    return {
	        x: offsets[0] ? parseFloat(offsets[0]) * (offsets[0][offsets[0].length - 1] === '%' ? width / 100 : 1) : 0,
	        y: offsets[1] ? parseFloat(offsets[1]) * (offsets[1][offsets[1].length - 1] === '%' ? height / 100 : 1) : 0
	    };
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Copyright (c) 2010-2016 Thomas Fuchs
	// http://zeptojs.com/

	var touch = {},
	    touchTimeout,
	    tapTimeout,
	    swipeTimeout,
	    longTapTimeout,
	    longTapDelay = 750,
	    gesture;

	function swipeDirection(x1, x2, y1, y2) {
	    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? 'Left' : 'Right' : y1 - y2 > 0 ? 'Up' : 'Down';
	}

	function longTap() {
	    longTapTimeout = null;
	    if (touch.last) {
	        if (touch.el !== undefined) touch.el.trigger('longTap');
	        touch = {};
	    }
	}

	function cancelLongTap() {
	    if (longTapTimeout) clearTimeout(longTapTimeout);
	    longTapTimeout = null;
	}

	function cancelAll() {
	    if (touchTimeout) clearTimeout(touchTimeout);
	    if (tapTimeout) clearTimeout(tapTimeout);
	    if (swipeTimeout) clearTimeout(swipeTimeout);
	    if (longTapTimeout) clearTimeout(longTapTimeout);
	    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
	    touch = {};
	}

	function isPrimaryTouch(event) {
	    return event.pointerType == event.MSPOINTER_TYPE_TOUCH && event.isPrimary;
	}

	(0, _index.ready)(function () {
	    var now,
	        delta,
	        deltaX = 0,
	        deltaY = 0,
	        firstTouch;

	    if ('MSGesture' in window) {
	        gesture = new MSGesture();
	        gesture.target = document.body;
	    }

	    (0, _jquery2.default)(document).on('MSGestureEnd gestureend', function (e) {

	        var swipeDirectionFromVelocity = e.originalEvent.velocityX > 1 ? 'Right' : e.originalEvent.velocityX < -1 ? 'Left' : e.originalEvent.velocityY > 1 ? 'Down' : e.originalEvent.velocityY < -1 ? 'Up' : null;

	        if (swipeDirectionFromVelocity && touch.el !== undefined) {
	            touch.el.trigger('swipe');
	            touch.el.trigger('swipe' + swipeDirectionFromVelocity);
	        }
	    })
	    // MSPointerDown: for IE10
	    // pointerdown: for IE11
	    .on('touchstart MSPointerDown pointerdown', function (e) {

	        if (e.type == 'MSPointerDown' && !isPrimaryTouch(e.originalEvent)) return;

	        firstTouch = e.type == 'MSPointerDown' || e.type == 'pointerdown' ? e : e.originalEvent.touches[0];

	        now = Date.now();
	        delta = now - (touch.last || now);
	        touch.el = (0, _jquery2.default)('tagName' in firstTouch.target ? firstTouch.target : firstTouch.target.parentNode);

	        if (touchTimeout) clearTimeout(touchTimeout);

	        touch.x1 = firstTouch.pageX;
	        touch.y1 = firstTouch.pageY;

	        if (delta > 0 && delta <= 250) touch.isDoubleTap = true;

	        touch.last = now;
	        longTapTimeout = setTimeout(longTap, longTapDelay);

	        // adds the current touch contact for IE gesture recognition
	        if (gesture && (e.type == 'MSPointerDown' || e.type == 'pointerdown' || e.type == 'touchstart')) {
	            gesture.addPointer(e.originalEvent.pointerId);
	        }
	    })
	    // MSPointerMove: for IE10
	    // pointermove: for IE11
	    .on('touchmove MSPointerMove pointermove', function (e) {

	        if (e.type == 'MSPointerMove' && !isPrimaryTouch(e.originalEvent)) return;

	        firstTouch = e.type == 'MSPointerMove' || e.type == 'pointermove' ? e : e.originalEvent.touches[0];

	        cancelLongTap();
	        touch.x2 = firstTouch.pageX;
	        touch.y2 = firstTouch.pageY;

	        deltaX += Math.abs(touch.x1 - touch.x2);
	        deltaY += Math.abs(touch.y1 - touch.y2);
	    })
	    // MSPointerUp: for IE10
	    // pointerup: for IE11
	    .on('touchend MSPointerUp pointerup', function (e) {

	        if (e.type == 'MSPointerUp' && !isPrimaryTouch(e.originalEvent)) return;

	        cancelLongTap();

	        // swipe
	        if (touch.x2 && Math.abs(touch.x1 - touch.x2) > 30 || touch.y2 && Math.abs(touch.y1 - touch.y2) > 30) {

	            swipeTimeout = setTimeout(function () {
	                if (touch.el !== undefined) {
	                    touch.el.trigger('swipe');
	                    touch.el.trigger('swipe' + swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2));
	                }
	                touch = {};
	            }, 0);

	            // normal tap
	        } else if ('last' in touch) {

	                // don't fire tap when delta position changed by more than 30 pixels,
	                // for instance when moving to a point and back to origin
	                if (isNaN(deltaX) || deltaX < 30 && deltaY < 30) {
	                    // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
	                    // ('tap' fires before 'scroll')
	                    tapTimeout = setTimeout(function () {

	                        // trigger universal 'tap' with the option to cancelTouch()
	                        // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
	                        var event = _jquery2.default.Event('tap');
	                        event.cancelTouch = cancelAll;
	                        if (touch.el !== undefined) touch.el.trigger(event);

	                        // trigger double tap immediately
	                        if (touch.isDoubleTap) {
	                            if (touch.el !== undefined) touch.el.trigger('doubleTap');
	                            touch = {};
	                        }

	                        // trigger single tap after 250ms of inactivity
	                        else {
	                                touchTimeout = setTimeout(function () {
	                                    touchTimeout = null;
	                                    if (touch.el !== undefined) touch.el.trigger('singleTap');
	                                    touch = {};
	                                }, 250);
	                            }
	                    }, 0);
	                } else {
	                    touch = {};
	                }
	                deltaX = deltaY = 0;
	            }
	    })
	    // when the browser window loses focus,
	    // for example when a modal dialog is shown,
	    // cancel all ongoing events
	    .on('touchcancel MSPointerCancel', cancelAll);

	    // scrolling the window indicates intention of the user
	    // to scroll, not tap or swipe, so cancel all ongoing events
	    (0, _jquery2.default)(window).on('scroll', cancelAll);
	});

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.use = function (plugin) {

	        if (plugin.installed) {
	            return;
	        }

	        plugin.call(null, this);
	        plugin.installed = true;

	        return this;
	    };

	    UIkit.mixin = function (mixin) {
	        this.options = (0, _index.mergeOptions)(this.options, mixin);
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

	    UIkit.update = function (e) {
	        for (var id in UIkit.instances) {
	            if (UIkit.instances[id]._isReady) {
	                UIkit.instances[id]._callUpdate(e);
	            }
	        }
	    };
	};

	var _index = __webpack_require__(4);

	function createClass(name) {
	    return new Function('return function ' + (0, _index.classify)(name) + ' (options) { this._init(options); }')();
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.default = function (UIkit) {

	    var uid = 0;

	    UIkit.prototype.props = {};

	    UIkit.prototype._init = function (options) {

	        options = options || {};
	        options = this.$options = (0, _index.mergeOptions)(this.constructor.options, options, this);

	        UIkit.instances[uid] = this;

	        this.$el = null;
	        this._uid = uid++;
	        this._initData();
	        this._initMethods();

	        if (options.el) {
	            this.$mount(options.el);
	        }
	    };

	    UIkit.prototype._initData = function () {

	        var defaults = this.$options.defaults,
	            data = this.$options.data || {},
	            props = this.$options.props;

	        if (defaults) {
	            for (var key in defaults) {
	                this[key] = (0, _index.hasOwn)(data, key) ? (0, _index.coerce)(props[key], data[key]) : defaults[key];
	            }
	        }
	    };

	    UIkit.prototype._initProps = function () {

	        var el = this.$options.el,
	            props = this.$options.props,
	            options = el.getAttribute('uk-' + (0, _index.hyphenate)(this.$options.name));

	        if (props) {
	            for (var key in props) {
	                var prop = (0, _index.hyphenate)(key);
	                if (el.hasAttribute(prop)) {
	                    this[key] = (0, _index.coerce)(props[key], el.getAttribute(prop));
	                }
	            }

	            if (options) {
	                if (options[0] === '{') {
	                    try {
	                        options = JSON.parse(options);
	                    } catch (e) {
	                        console.warn('Invalid JSON.');
	                        options = {};
	                    }
	                } else {
	                    var tmp = {};
	                    options.split(';').forEach(function (option) {
	                        var _option$split = option.split(/:(.+)/);

	                        var _option$split2 = _slicedToArray(_option$split, 2);

	                        var key = _option$split2[0];
	                        var value = _option$split2[1];

	                        if (key && value) {
	                            tmp[key.trim()] = value.trim();
	                        }
	                    });
	                    options = tmp;
	                }

	                for (var key in options || {}) {
	                    var prop = (0, _index.camelize)(key);
	                    if (props[prop] !== undefined) {
	                        this[prop] = (0, _index.coerce)(props[prop], options[key]);
	                    }
	                }
	            }
	        }
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
	        var _this = this;

	        var handlers = this.$options[hook];

	        if (handlers) {
	            handlers.forEach(function (handler) {
	                return handler.call(_this);
	            });
	        }
	    };

	    UIkit.prototype._callUpdate = function (e) {

	        e = (0, _index.createEvent)(e || 'update');

	        var update = this.$options.update;

	        if (!update) {
	            return;
	        }

	        if ((0, _index.isPlainObject)(update)) {

	            if (e.type !== 'update' && update.events && update.events.indexOf(e.type) === -1) {
	                return;
	            }

	            update = update.handler;
	        }

	        update.call(this, e);
	    };
	};

	var _index = __webpack_require__(4);

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    var DATA = UIkit.data;

	    UIkit.prototype.$mount = function (el) {
	        var _this = this;

	        var name = this.$options.name;

	        if (!el[DATA]) {
	            el[DATA] = {};
	            UIkit.elements.push(el);
	        }

	        if (el[DATA][name]) {
	            console.warn('Component "' + name + '" is already mounted on element: ' + el);
	        }

	        el[DATA][name] = this;

	        this.$el = (0, _jquery2.default)(el);

	        this._initProps();

	        this._callHook('init');

	        (0, _index.requestAnimationFrame)(function () {
	            _this._isReady = true;
	            _this._callHook('ready');
	            _this._callUpdate();
	        });
	    };

	    UIkit.prototype.$update = function (e, element) {

	        element = element ? (0, _jquery2.default)(element)[0] : this.$el[0];

	        UIkit.elements.forEach(function (el) {
	            if (el[DATA] && el === element || _jquery2.default.contains(element, el)) {
	                for (var name in el[DATA]) {
	                    el[DATA][name]._callUpdate(e);
	                }
	            }
	        });
	    };

	    UIkit.prototype.$updateParents = function (e, element) {

	        element = element ? (0, _jquery2.default)(element)[0] : this.$el[0];

	        UIkit.elements.forEach(function (el) {
	            if (el[DATA] && _jquery2.default.contains(el, element)) {
	                for (var name in el[DATA]) {
	                    el[DATA][name]._callUpdate(e);
	                }
	            }
	        });
	    };

	    UIkit.prototype.$replace = function (el) {

	        var $el = (0, _jquery2.default)(el),
	            prev = this.$options.el,
	            name = this.$options.name;

	        el = $el[0];

	        delete prev[DATA][name];

	        if (!el[DATA]) {
	            el[DATA] = {};
	        }

	        el[DATA][name] = this;

	        UIkit.elements.splice(UIkit.elements.indexOf(prev), 1, el);
	        this.$el.replaceWith($el);
	        this.$options.el = el;
	        this.$el = $el;

	        this.__preventDestroy = true;
	    };

	    UIkit.prototype.$destroy = function () {

	        if (this.__preventDestroy) {
	            this.__preventDestroy = false;
	            return;
	        }

	        this._callHook('destroy');

	        delete UIkit.instances[this._uid];

	        var el = this.$options.el;

	        if (!el || !el[DATA]) {
	            return;
	        }

	        delete el[DATA][this.$options.name];

	        if (!Object.keys(el[DATA]).length) {
	            delete el[DATA];
	            delete UIkit.elements[UIkit.elements.indexOf(el)];
	        }

	        this.$el.remove();
	    };
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    var DATA = UIkit.data;

	    UIkit.components = {};

	    UIkit.component = function (name, options) {

	        if ((0, _index.isPlainObject)(options)) {
	            options.name = name;
	            options = UIkit.extend(options);
	        }

	        UIkit.component.selector = (UIkit.component.selector + ',' || '') + ('[uk-' + name + ']');

	        name = (0, _index.camelize)(name);

	        UIkit.components[name] = options;

	        UIkit[name] = function (element, data) {

	            var result = [];

	            data = data || {};

	            (0, _jquery2.default)(element).each(function (i, el) {
	                return result.push(el[DATA] && el[DATA][name] || new UIkit.components[name]({ el: el, data: data }));
	            });

	            return result;
	        };

	        return UIkit.components[name];
	    };

	    UIkit.getComponents = function (element) {
	        return element && element[DATA] || {};
	    };

	    UIkit.getComponent = function (element, name) {
	        return element && element[DATA] && element[DATA][name];
	    };
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit, _) {

	    UIkit.use(_modal2.default);
	    UIkit.use(_mouse2.default);
	    UIkit.use(_position2.default);
	    UIkit.use(_svg2.default);
	    UIkit.use(_toggable2.default);
	};

	var _modal = __webpack_require__(45);

	var _modal2 = _interopRequireDefault(_modal);

	var _mouse = __webpack_require__(16);

	var _mouse2 = _interopRequireDefault(_mouse);

	var _position = __webpack_require__(17);

	var _position2 = _interopRequireDefault(_position);

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	var _toggable = __webpack_require__(19);

	var _toggable2 = _interopRequireDefault(_toggable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.mixin.mouse = {

	        defaults: {

	            positions: [],
	            position: null

	        },

	        methods: {
	            initMouseTracker: function initMouseTracker() {
	                var _this = this;

	                this.positions = [];
	                this.position = null;

	                this.mouseHandler = function (e) {
	                    _this.positions.push({ x: e.pageX, y: e.pageY });

	                    if (_this.positions.length > 5) {
	                        _this.positions.shift();
	                    }
	                };

	                (0, _jquery2.default)(document).on('mousemove', this.mouseHandler);
	            },
	            cancelMouseTracker: function cancelMouseTracker() {
	                if (this.mouseHandler) {
	                    (0, _jquery2.default)(document).off('mousemove', this.mouseHandler);
	                }
	            },
	            movesTo: function movesTo(target) {

	                var p = (0, _index.getDimensions)(target),
	                    points = [[{ x: p.left, y: p.top }, { x: p.right, y: p.bottom }], [{ x: p.right, y: p.top }, { x: p.left, y: p.bottom }]],
	                    position = this.positions[this.positions.length - 1],
	                    prevPos = this.positions[0] || position;

	                if (!position) {
	                    return false;
	                }

	                if (p.right <= position.x) {} else if (p.left >= position.x) {
	                    points[0].reverse();
	                    points[1].reverse();
	                } else if (p.bottom <= position.y) {
	                    points[0].reverse();
	                } else if (p.top >= position.y) {
	                    points[1].reverse();
	                }

	                var delay = position && !(this.position && position.x === this.position.x && position.y === this.position.y) && points.reduce(function (result, point) {
	                    return result + (slope(prevPos, point[0]) < slope(position, point[0]) && slope(prevPos, point[1]) > slope(position, point[1]));
	                }, 0);

	                this.position = delay ? position : null;
	                return delay;
	            }
	        }

	    };

	    function slope(a, b) {
	        return (b.y - a.y) / (b.x - a.x);
	    }
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.mixin.position = {

	        props: {
	            pos: String,
	            offset: Number,
	            flip: Boolean,
	            clsPos: String
	        },

	        defaults: {
	            pos: 'bottom-left',
	            flip: true,
	            offset: 0,
	            clsPos: ''
	        },

	        ready: function ready() {
	            this.pos = (this.pos + (this.pos.indexOf('-') === -1 ? '-center' : '')).split('-');
	            this.dir = this.pos[0];
	            this.align = this.pos[1];
	        },


	        methods: {
	            positionAt: function positionAt(element, target, boundary) {

	                (0, _index.removeClass)(element, this.clsPos + '-(top|bottom|left|right)(-[a-z]+)?').css({ top: '', left: '' });

	                this.dir = this.pos[0];
	                this.align = this.pos[1];

	                var axis = this.getAxis(),
	                    flipped = (0, _index.position)(element, target, axis === 'x' ? flipPosition(this.dir) + ' ' + this.align : this.align + ' ' + flipPosition(this.dir), axis === 'x' ? this.dir + ' ' + this.align : this.align + ' ' + this.dir, axis === 'x' ? '' + (this.dir === 'left' ? -1 * this.offset : this.offset) : ' ' + (this.dir === 'top' ? -1 * this.offset : this.offset), null, this.flip, boundary);

	                this.dir = axis === 'x' ? flipped.target.x : flipped.target.y;
	                this.align = axis === 'x' ? flipped.target.y : flipped.target.x;

	                element.css('display', '').addClass(this.clsPos + '-' + this.dir + '-' + this.align);
	            },
	            getAxis: function getAxis() {
	                return this.pos[0] === 'top' || this.pos[0] === 'bottom' ? 'y' : 'x';
	            }
	        }

	    };
	};

	var _index = __webpack_require__(4);

	;

	function flipPosition(pos) {
	    switch (pos) {
	        case 'left':
	            return 'right';
	        case 'right':
	            return 'left';
	        case 'top':
	            return 'bottom';
	        case 'bottom':
	            return 'top';
	        default:
	            return pos;
	    }
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.mixin.svg = {

	        props: { id: String, class: String, style: String, width: Number, height: Number, ratio: Number },

	        defaults: { ratio: 1, id: false, class: '', exclude: [] },

	        methods: {
	            get: function get(src) {

	                if (svgs[src]) {
	                    return svgs[src];
	                }

	                var key = 'uikit_' + UIkit.version + '_' + src;
	                svgs[src] = _jquery2.default.Deferred();

	                if (!storage[key]) {
	                    _jquery2.default.get(src, 'text').then(function (doc, status, res) {
	                        storage[key] = res.responseText;
	                        svgs[src].resolve(storage[key]);
	                    });
	                } else {
	                    svgs[src].resolve(storage[key]);
	                }

	                return svgs[src];
	            },
	            getIcon: function getIcon(src, icon) {
	                var _this = this;

	                return this.get(src).then(function (doc) {

	                    var el = (0, _jquery2.default)('#' + icon, doc);

	                    if (!el || !el.length) {
	                        return _jquery2.default.Deferred().reject('Icon not found.');
	                    }

	                    el = (0, _jquery2.default)((0, _jquery2.default)('<div>').append(el.clone()).html().replace(/symbol/g, 'svg')); // IE workaround, el[0].outerHTML

	                    return _this.addProps(el);
	                });
	            },
	            addProps: function addProps(el) {
	                var dimensions = el[0].getAttribute('viewBox'); // jQuery workaround, el.attr('viewBox')
	                if (dimensions) {
	                    dimensions = dimensions.split(' ');
	                    this.width = this.width || dimensions[2];
	                    this.height = this.height || dimensions[3];
	                }

	                this.width *= this.ratio;
	                this.height *= this.ratio;

	                for (var prop in this.$options.props) {
	                    if (this[prop] && this.exclude.indexOf(prop) === -1) {
	                        el.attr(prop, this[prop]);
	                    }
	                }

	                if (!this.id) {
	                    el.removeAttr('id');
	                }

	                if (this.width && !this.height) {
	                    el.removeAttr('height');
	                }

	                if (this.height && !this.width) {
	                    el.removeAttr('width');
	                }

	                return el;
	            }
	        }

	    };
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var storage = window.sessionStorage || {},
	    svgs = {};

	;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.mixin.toggable = {

	        props: {
	            cls: Boolean,
	            animation: Boolean,
	            duration: Number,
	            transition: String
	        },

	        defaults: {
	            cls: false,
	            animation: false,
	            duration: 200,
	            transition: 'linear',
	            aria: true
	        },

	        ready: function ready() {

	            if (typeof this.animation === 'string') {

	                this.animation = this.animation.split(',');

	                if (this.animation.length == 1) {
	                    this.animation[1] = this.animation[0];
	                }

	                this.animation[0] = this.animation[0].trim();
	                this.animation[1] = this.animation[1].trim();
	            }
	        },


	        methods: {
	            toggleElement: function toggleElement(targets, animate, show) {
	                var _this = this;

	                var deferreds = [],
	                    toggled;

	                (0, _jquery2.default)(targets).each(function (i, el) {

	                    el = (0, _jquery2.default)(el);

	                    toggled = _this.isToggled(el);

	                    el.trigger('before' + (toggled ? 'hide' : 'show'), [_this]);

	                    if (_this.animation === true && animate !== false) {

	                        deferreds.push(_this.toggleTransition(el, show));
	                    } else if (_this.animation && animate !== false) {

	                        deferreds.push(_this.toggleAnimation(el, show));
	                    } else {

	                        _this._toggle(el, typeof show === 'boolean' ? show : !toggled);
	                        deferreds.push(_jquery2.default.Deferred().resolve());
	                    }

	                    el.trigger(toggled ? 'hide' : 'show', [_this]);
	                });

	                return _jquery2.default.when.apply(null, deferreds);
	            },
	            toggleTransition: function toggleTransition(el, show) {
	                var _this2 = this;

	                el = (0, _jquery2.default)(el);

	                var transition,
	                    height = el[0].offsetHeight ? el.height() : 0,
	                    hideProps = {
	                    overflow: 'hidden',
	                    height: 0,
	                    'padding-top': 0,
	                    'padding-bottom': 0,
	                    'margin-top': 0,
	                    'margin-bottom': 0
	                },
	                    inProgress = _index.Transition.inProgress(el);

	                _index.Transition.stop(el);

	                var toggled = this.isToggled(el);

	                if (!toggled) {
	                    this._toggle(el, true);
	                }

	                el.css('height', '');
	                var endHeight = el.height();

	                el.height(height);

	                if (!toggled && show !== false || show === true) {

	                    if (!inProgress) {
	                        el.css(hideProps);
	                    }

	                    transition = _index.Transition.start(el, {
	                        overflow: 'hidden',
	                        height: endHeight,
	                        'padding-top': '',
	                        'padding-bottom': '',
	                        'margin-top': '',
	                        'margin-bottom': ''
	                    }, Math.round(this.duration * (1 - height / endHeight)), this.transition);
	                } else {
	                    transition = _index.Transition.start(el, hideProps, Math.round(this.duration * (height / endHeight)), this.transition).then(function () {
	                        return _this2._toggle(el, false);
	                    });
	                }

	                return transition;
	            },
	            toggleAnimation: function toggleAnimation(el, show) {
	                var _this3 = this;

	                el = (0, _jquery2.default)(el);

	                _index.Animation.cancel(el);

	                var animation,
	                    toggled = this.isToggled(el);

	                if (!toggled && show !== false || show === true) {

	                    this._toggle(el, true);
	                    animation = _index.Animation.in(el, this.animation[0], this.duration);
	                } else {
	                    animation = _index.Animation.out(el, this.animation[1], this.duration).then(function () {
	                        return _this3._toggle(el, false);
	                    });
	                }

	                return animation;
	            },
	            _toggle: function _toggle(el, toggled) {
	                el = (0, _jquery2.default)(el);

	                if (this.cls) {
	                    el.toggleClass(this.cls, toggled);
	                } else {
	                    el.attr('hidden', !toggled);
	                }

	                this.updateAria(el);
	                this.$update(null, el);
	            },
	            isToggled: function isToggled(el) {
	                el = (0, _jquery2.default)(el);
	                return this.cls ? el.hasClass(this.cls) : !el.attr('hidden');
	            },
	            updateAria: function updateAria(el) {
	                if (this.aria) {
	                    el.attr('aria-hidden', !this.isToggled(el));
	                }
	            }
	        }

	    };
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit, _) {

	    // add touch identifier class
	    (0, _jquery2.default)('html').addClass(_.hasTouch ? 'uk-touch' : 'uk-notouch');

	    var scroll = window.pageYOffset,
	        dir,
	        ticking,
	        resizing;

	    (0, _jquery2.default)(window).on('load', UIkit.update).on('resize orientationchange', function (e) {
	        if (!resizing) {
	            (0, _index.requestAnimationFrame)(function () {
	                UIkit.update(e);
	                resizing = false;
	            });
	            resizing = true;
	        }
	    }).on('scroll', function (e) {
	        dir = scroll < window.pageYOffset;
	        scroll = window.pageYOffset;
	        if (!ticking) {
	            (0, _index.requestAnimationFrame)(function () {
	                e.dir = dir ? 'down' : 'up';
	                UIkit.update(e);
	                ticking = false;
	            });
	            ticking = true;
	        }
	    });

	    // core components
	    UIkit.use(_accordion2.default);
	    UIkit.use(_alert2.default);
	    UIkit.use(_cover2.default);
	    UIkit.use(_drop2.default);
	    UIkit.use(_dropdown2.default);
	    UIkit.use(_marginWrap2.default);
	    UIkit.use(_grid2.default);
	    UIkit.use(_heightViewport2.default);
	    UIkit.use(_icon2.default);
	    UIkit.use(_close2.default);
	    UIkit.use(_matchHeight2.default);
	    UIkit.use(_modal2.default);
	    UIkit.use(_nav2.default);
	    UIkit.use(_navbar2.default);
	    UIkit.use(_offcanvas2.default);
	    UIkit.use(_responsive2.default);
	    UIkit.use(_scrollspy2.default);
	    UIkit.use(_scrollspyNav2.default);
	    UIkit.use(_smoothScroll2.default);
	    UIkit.use(_sticky2.default);
	    UIkit.use(_svg2.default);
	    UIkit.use(_switcher2.default);
	    UIkit.use(_tab2.default);
	    UIkit.use(_toggle2.default);
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _accordion = __webpack_require__(21);

	var _accordion2 = _interopRequireDefault(_accordion);

	var _alert = __webpack_require__(22);

	var _alert2 = _interopRequireDefault(_alert);

	var _close = __webpack_require__(23);

	var _close2 = _interopRequireDefault(_close);

	var _cover = __webpack_require__(24);

	var _cover2 = _interopRequireDefault(_cover);

	var _drop = __webpack_require__(25);

	var _drop2 = _interopRequireDefault(_drop);

	var _dropdown = __webpack_require__(26);

	var _dropdown2 = _interopRequireDefault(_dropdown);

	var _grid = __webpack_require__(27);

	var _grid2 = _interopRequireDefault(_grid);

	var _heightViewport = __webpack_require__(28);

	var _heightViewport2 = _interopRequireDefault(_heightViewport);

	var _icon = __webpack_require__(29);

	var _icon2 = _interopRequireDefault(_icon);

	var _marginWrap = __webpack_require__(30);

	var _marginWrap2 = _interopRequireDefault(_marginWrap);

	var _matchHeight = __webpack_require__(31);

	var _matchHeight2 = _interopRequireDefault(_matchHeight);

	var _modal = __webpack_require__(32);

	var _modal2 = _interopRequireDefault(_modal);

	var _nav = __webpack_require__(33);

	var _nav2 = _interopRequireDefault(_nav);

	var _navbar = __webpack_require__(34);

	var _navbar2 = _interopRequireDefault(_navbar);

	var _offcanvas = __webpack_require__(35);

	var _offcanvas2 = _interopRequireDefault(_offcanvas);

	var _responsive = __webpack_require__(36);

	var _responsive2 = _interopRequireDefault(_responsive);

	var _scrollspy = __webpack_require__(37);

	var _scrollspy2 = _interopRequireDefault(_scrollspy);

	var _scrollspyNav = __webpack_require__(38);

	var _scrollspyNav2 = _interopRequireDefault(_scrollspyNav);

	var _smoothScroll = __webpack_require__(39);

	var _smoothScroll2 = _interopRequireDefault(_smoothScroll);

	var _sticky = __webpack_require__(40);

	var _sticky2 = _interopRequireDefault(_sticky);

	var _svg = __webpack_require__(41);

	var _svg2 = _interopRequireDefault(_svg);

	var _switcher = __webpack_require__(42);

	var _switcher2 = _interopRequireDefault(_switcher);

	var _tab = __webpack_require__(43);

	var _tab2 = _interopRequireDefault(_tab);

	var _toggle = __webpack_require__(44);

	var _toggle2 = _interopRequireDefault(_toggle);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('accordion', {

	        mixins: [UIkit.mixin.toggable],

	        props: {
	            targets: String,
	            active: null,
	            collapsible: Boolean,
	            multiple: Boolean,
	            toggle: String,
	            content: String,
	            transition: String
	        },

	        defaults: {
	            targets: '> *',
	            active: false,
	            animation: true,
	            collapsible: true,
	            multiple: false,
	            clsOpen: 'uk-open',
	            toggle: '.uk-accordion-title',
	            content: '.uk-accordion-content',
	            transition: 'ease'
	        },

	        ready: function ready() {
	            var _this = this;

	            this.items = (0, _index.toJQuery)(this.targets, this.$el);

	            if (!this.items) {
	                return;
	            }

	            var self = this;
	            this.$el.on('click', this.targets + ' ' + this.toggle, function (e) {
	                e.preventDefault();
	                self.show(self.items.find(self.toggle).index(this));
	            });

	            this.items.each(function (i, el) {
	                el = $(el);
	                _this.toggleElement(el.find(_this.content), false, el.hasClass(_this.clsOpen));
	            });

	            var active = this.active !== false && (0, _index.toJQuery)(this.items.eq(Number(this.active))) || !this.collapsible && (0, _index.toJQuery)(this.items.eq(0));

	            if (active && !active.hasClass(this.clsOpen)) {
	                this.show(active, false);
	            }
	        },


	        methods: {
	            show: function show(item, animate) {
	                var _this2 = this;

	                var index = typeof item === 'number' ? item : typeof item === 'string' ? parseInt(item, 10) : this.items.index(item),
	                    active = this.items.filter('.' + this.clsOpen);

	                item = this.items.eq(index);

	                item.add(!this.multiple && active).each(function (i, el) {

	                    el = $(el);

	                    var content = el.find(_this2.content),
	                        isItem = el.is(item),
	                        state = isItem && !el.hasClass(_this2.clsOpen);

	                    if (!state && isItem && !_this2.collapsible && active.length < 2) {
	                        return;
	                    }

	                    el.toggleClass(_this2.clsOpen, state);

	                    if (!_index.Transition.inProgress(content.parent())) {
	                        content.wrap('<div>');
	                        content.parent().attr('hidden', state);
	                    }

	                    _this2.toggleElement(content, false, true);

	                    _this2.toggleElement(content.parent(), animate, state).then(function () {
	                        (0, _index.requestAnimationFrame)(function () {
	                            if (!_index.Transition.inProgress(content.parent())) {

	                                if (!el.hasClass(_this2.clsOpen)) {
	                                    _this2.toggleElement(content, false, false);
	                                }

	                                content.unwrap();
	                            }
	                        });
	                    });
	                });
	            }
	        }

	    });
	};

	var _index = __webpack_require__(4);

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('alert', {

	        mixins: [UIkit.mixin.toggable],

	        props: {
	            animation: Boolean,
	            close: String
	        },

	        defaults: {
	            animation: true,
	            close: '.uk-alert-close'
	        },

	        ready: function ready() {
	            var _this = this;

	            this.$el.on('click', this.close, function (e) {
	                e.preventDefault();
	                _this.closeAlert();
	            });
	        },


	        methods: {
	            closeAlert: function closeAlert() {
	                var _this2 = this;

	                this.$el.trigger('close');
	                this.toggleElement(this.$el).then(function () {
	                    return _this2.$destroy();
	                });
	                requestAnimationFrame(function () {
	                    return _this2.$el.css('opacity', 0);
	                });
	            }
	        },

	        destroy: function destroy() {
	            this.$el.off('click');
	            this.$el.trigger('closed');
	        }
	    });
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('close', UIkit.components.icon.extend({

	        name: 'close',

	        defaults: { icon: 'close', exclude: ['id', 'style', 'class'] },

	        methods: {
	            handleIcon: function handleIcon(icon) {
	                this.$el.append(icon);
	            }
	        }

	    }));
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('cover', {

	        props: {
	            automute: Boolean,
	            width: Number,
	            height: Number
	        },

	        defaults: { automute: true },

	        ready: function ready() {
	            if (this.$el.is('iframe') && this.automute) {

	                var src = this.$el.attr('src');

	                this.$el.attr('src', '').on('load', function () {

	                    this.contentWindow.postMessage('{"event": "command", "func": "mute", "method":"setVolume", "value":0}', '*');
	                }).attr('src', [src, src.indexOf('?') > -1 ? '&' : '?', 'enablejsapi=1&api=1'].join(''));
	            }
	        },


	        update: {
	            handler: function handler() {

	                if (!this.$el.is(':visible')) {
	                    return this;
	                }

	                var dimensions = { width: '', height: '' };

	                this.$el.css(dimensions);

	                var width = this.$el.parent().width(),
	                    height = this.$el.parent().height(),
	                    ratio = (this.width || this.$el.width()) / (this.height || this.$el.height());

	                // if element height < parent height (gap underneath)
	                if (width / ratio < height) {

	                    dimensions.width = Math.ceil(height * ratio);
	                    dimensions.height = height;

	                    // element width < parent width (gap to right)
	                } else {

	                        dimensions.width = width;
	                        dimensions.height = Math.ceil(width / ratio);
	                    }

	                this.$el.css(dimensions);
	            },


	            events: ['load', 'resize', 'orientationchange']

	        }

	    });
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    var active;

	    (0, _jquery2.default)(document).on('click', function (e) {
	        if (active && !(0, _index.isWithin)(e.target, active.$el) && !e.isDefaultPrevented()) {
	            active.hide(null, false);
	        }
	    });

	    UIkit.component('drop', {

	        mixins: [UIkit.mixin.position, UIkit.mixin.toggable, UIkit.mixin.mouse],

	        props: {
	            mode: String,
	            toggle: Boolean,
	            boundary: 'jQuery',
	            boundaryAlign: Boolean,
	            delayShow: Number,
	            delayHide: Number,
	            clsDrop: String
	        },

	        defaults: {
	            mode: 'hover',
	            toggle: true,
	            boundary: window,
	            boundaryAlign: false,
	            delayShow: 0,
	            delayHide: 800,
	            clsDrop: false,
	            hoverIdle: 200,
	            animation: 'uk-animation-fade',
	            cls: 'uk-open'
	        },

	        ready: function ready() {
	            var _this = this;

	            this.clsDrop = this.clsDrop || 'uk-' + this.$options.name;
	            this.clsPos = this.clsDrop;

	            this.updateAria(this.$el);

	            this.$el.on('click', '.' + this.clsDrop + '-close', function (e) {
	                e.preventDefault();
	                _this.hide(null, false);
	            });

	            if (this.toggle) {
	                this.toggle = typeof this.toggle === 'string' ? (0, _index.toJQuery)(this.toggle) : this.$el.prev();

	                if (this.toggle) {
	                    UIkit.toggle(this.toggle, { target: this.$el });
	                }
	            }
	        },


	        update: {
	            handler: function handler() {

	                (0, _index.removeClass)(this.$el, this.clsDrop + '-(stack|boundary)').css({ top: '', left: '', width: '', height: '' });

	                this.$el.toggleClass(this.clsDrop + '-boundary', this.boundaryAlign);

	                this.dir = this.pos[0];
	                this.align = this.pos[1];

	                var boundary = (0, _index.getDimensions)(this.boundary),
	                    alignTo = this.boundaryAlign ? boundary : (0, _index.getDimensions)(this.toggle);

	                if (this.align === 'justify') {
	                    var prop = this.getAxis() === 'y' ? 'width' : 'height';
	                    this.$el.css(prop, alignTo[prop]);
	                } else if (this.$el.outerWidth() > Math.max(boundary.right - alignTo.left, alignTo.right - boundary.left)) {
	                    this.$el.addClass(this.clsDrop + '-stack');
	                    this.$el.trigger('stack', [this]);
	                }

	                this.positionAt(this.$el, this.boundaryAlign ? this.boundary : this.toggle, this.boundary);
	            },


	            events: ['resize', 'orientationchange']

	        },

	        methods: {
	            doToggle: function doToggle(toggle) {
	                this[this.isToggled(this.$el) ? 'hide' : 'show'](toggle, false);
	            },
	            show: function show(toggle) {
	                var _this2 = this;

	                var delay = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];


	                if (this.toggle && !this.toggle.is(toggle)) {
	                    this.hide(null, false);
	                }

	                this.toggle = toggle || this.toggle;

	                this.clearTimers();

	                if (this.isActive()) {
	                    return;
	                } else if (delay && active && active !== this && active.isDelaying) {
	                    this.showTimer = setTimeout(this.show.bind(this), 75);
	                    return;
	                } else if (active) {
	                    active.hide(null, false);
	                }

	                var show = function show() {
	                    _this2.toggleElement(_this2.$el, true, true);
	                    _this2.initMouseTracker();
	                };

	                if (delay && this.delayShow) {
	                    this.showTimer = setTimeout(show, this.delayShow);
	                } else {
	                    show();
	                }

	                active = this;
	            },
	            hide: function hide(toggle) {
	                var _this3 = this;

	                var delay = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];


	                this.clearTimers();

	                var hide = function hide() {

	                    if (!_this3.isActive()) {
	                        return;
	                    }

	                    active = null;

	                    _this3.cancelMouseTracker();
	                    _this3.toggleElement(_this3.$el, false, false);
	                };

	                this.isDelaying = this.movesTo(this.$el);

	                if (delay && this.isDelaying) {
	                    this.hideTimer = setTimeout(this.hide.bind(this), this.hoverIdle);
	                } else if (delay && this.delayHide) {
	                    this.hideTimer = setTimeout(hide, this.delayHide);
	                } else {
	                    hide();
	                }
	            },
	            clearTimers: function clearTimers() {
	                clearTimeout(this.showTimer);
	                clearTimeout(this.hideTimer);
	            },
	            isActive: function isActive() {
	                return active === this;
	            }
	        }

	    });

	    UIkit.drop.getActive = function () {
	        return active;
	    };
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('dropdown', UIkit.components.drop.extend({ name: 'dropdown' }));
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('grid', UIkit.components.marginWrap.extend({

	        name: 'grid',

	        defaults: { margin: 'uk-grid-margin' }

	    }));
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('height-viewport', {

	        props: {
	            offset: Boolean,
	            expand: Boolean
	        },

	        defaults: {
	            offset: false,
	            expand: false
	        },

	        init: function init() {
	            if (!this.expand) {
	                this.$el.css('min-height', this.getHeight());
	            }
	        },
	        ready: function ready() {
	            this.borderBox = this.$el.css('box-sizing') === 'border-box';
	        },


	        update: {
	            handler: function handler() {

	                if (this.expand) {

	                    this.$el.css('min-height', '');
	                    if (document.documentElement.offsetHeight < window.innerHeight) {
	                        this.$el.css('min-height', this.$el.outerHeight() + window.innerHeight - document.documentElement.offsetHeight - (this.borderBox ? 0 : this.$el.outerHeight() - this.$el.height()));
	                    }
	                    return;
	                }

	                // IE 10-11 fix (min-height on a flex container won't apply to its flex items)
	                this.$el.css('height', '');
	                if (this.getHeight() >= this.$el.height()) {
	                    this.$el.css('height', this.getHeight());
	                }

	                this.$el.css('min-height', this.getHeight());
	            },


	            events: ['load', 'resize', 'orientationchange']

	        },

	        methods: {
	            getHeight: function getHeight() {

	                var height = window.innerHeight;

	                if (this.offset && this.$el.offset().top < height) {
	                    height -= this.$el.offset().top + (this.borderBox ? 0 : this.$el.outerHeight() - this.$el.height());
	                }

	                return height;
	            }
	        }

	    });
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('icon', {

	        mixins: [UIkit.mixin.svg],

	        props: ['icon'],

	        defaults: { cls: 'uk-icon' },

	        ready: function ready() {

	            if (!this.icon) {
	                return;
	            }

	            this.class += (this.class ? ' ' : '') + this.cls;

	            this.getIcon(this.$el.css('background-image').slice(4, -1).replace(/"/g, ''), this.icon).then(this.handleIcon);
	        },


	        methods: {
	            handleIcon: function handleIcon(icon) {
	                this.$replace(icon);
	            }
	        }

	    });
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('margin-wrap', {

	        props: {
	            margin: String,
	            rowFirst: Boolean
	        },

	        defaults: {
	            margin: 'uk-margin-small-top',
	            rowFirst: 'uk-row-first'
	        },

	        update: {
	            handler: function handler() {
	                var _this = this;

	                if (this.$el[0].offsetHeight === 0) {
	                    return;
	                }

	                var left = Number.MAX_VALUE,
	                    top = Number.MAX_VALUE,
	                    offset,
	                    columns = this.$el.children().filter(function (i, el) {
	                    return el.offsetHeight > 0;
	                }).removeClass(this.margin).removeClass(this.rowFirst);

	                columns.each(function (i, el) {
	                    el = (0, _jquery2.default)(el);
	                    offset = el.offset();
	                    top = Math.min(top, offset.top + el.outerHeight(true) - 1); // (-1): weird firefox bug when parent container is display:flex
	                    left = Math.min(left, offset.left + el.outerWidth(true));
	                }).each(function (i, el) {
	                    el = (0, _jquery2.default)(el);
	                    offset = el.offset();
	                    el.toggleClass(_this.margin, offset.top >= top);
	                    el.toggleClass(_this.rowFirst, _this.rowFirst && offset.left < left);
	                });
	            },


	            events: ['load', 'resize', 'orientationchange']

	        }

	    });
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('match-height', {

	        props: {
	            target: String,
	            row: Boolean
	        },

	        defaults: {
	            target: false,
	            row: true
	        },

	        update: {
	            handler: function handler() {
	                var _this = this;

	                var elements = (this.target ? (0, _jquery2.default)(this.target, this.$el) : this.$el.children()).css('min-height', '');

	                if (!this.row) {
	                    this.match(elements);
	                    return this;
	                }

	                (0, _index.requestAnimationFrame)(function () {

	                    var lastOffset = false,
	                        group = [];

	                    elements.each(function (i, el) {

	                        el = (0, _jquery2.default)(el);

	                        var offset = el.offset().top;

	                        if (offset != lastOffset && group.length) {
	                            _this.match((0, _jquery2.default)(group));
	                            group = [];
	                            offset = el.offset().top;
	                        }

	                        group.push(el);
	                        lastOffset = offset;
	                    });

	                    if (group.length) {
	                        _this.match((0, _jquery2.default)(group));
	                    }
	                });
	            },


	            events: ['resize', 'orientationchange']

	        },

	        methods: {
	            match: function match(elements) {

	                if (elements.length < 2) {
	                    return;
	                }

	                var max = 0;

	                elements.each(function () {
	                    max = Math.max(max, (0, _jquery2.default)(this).outerHeight());
	                }).each(function () {
	                    var el = (0, _jquery2.default)(this);
	                    el.css('min-height', max - (el.css('box-sizing') == 'border-box' ? 0 : el.outerHeight() - el.height()) + 'px');
	                });
	            }
	        }

	    });
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('modal', {

	        mixins: [UIkit.mixin.modal],

	        props: {
	            center: Boolean
	        },

	        defaults: {
	            center: false,
	            clsPage: 'uk-modal-page',
	            clsPanel: 'uk-modal-dialog',
	            clsClose: 'uk-modal-close',
	            clsOverflow: 'uk-overflow-container'
	        },

	        ready: function ready() {
	            var _this = this;

	            this.$el.on('show', function () {
	                _this.page.addClass(_this.clsPage);
	                _this.$el.css('display', 'block');
	                _this._callUpdate();
	                _this.$el.height();
	                _this.$el.addClass(_this.clsOpen);
	            });

	            this.$el.on('hide', function () {

	                _this.panel.one(_index.transitionend, function () {
	                    _this.page.removeClass(_this.clsPage);
	                    _this.$el.css('display', '').removeClass('uk-flex uk-flex-center uk-flex-middle');
	                });

	                _this.$el.removeClass(_this.clsOpen);
	            });
	        },


	        update: {
	            handler: function handler() {

	                if (this.$el.css('display') === 'block' && this.center) {
	                    this.$el.removeClass('uk-flex uk-flex-center').css('display', 'block');
	                    this.$el.toggleClass('uk-flex-middle', window.innerHeight > this.panel.outerHeight(true));
	                    this.$el.addClass('uk-flex uk-flex-center').css('display', '');
	                }
	            },


	            events: ['resize', 'orientationchange']

	        }

	    });

	    UIkit.component('overflow-auto', {
	        ready: function ready() {
	            this.panel = (0, _index.toJQuery)(this.$el.closest('.uk-modal-dialog'));
	            this.$el.css('min-height', 150);
	        },


	        update: {
	            handler: function handler() {
	                var current = this.$el.css('max-height');
	                this.$el.css('max-height', '').css('max-height', this.$el.height() - (this.panel.outerHeight(true) - window.innerHeight));
	                if (current !== this.$el.css('max-height')) {
	                    UIkit.update();
	                }
	            },


	            events: ['load', 'resize', 'orientationchange']

	        }

	    });
	};

	var _index = __webpack_require__(4);

/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('nav', UIkit.components.accordion.extend({

	        name: 'nav',

	        defaults: {
	            targets: '> .uk-parent',
	            toggle: '> a',
	            content: 'ul:first'
	        }

	    }));
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('navbar', {

	        props: {
	            dropdown: String,
	            mode: String,
	            pos: String,
	            offset: Number,
	            boundary: Boolean,
	            boundaryAlign: Boolean,
	            clsDrop: String,
	            delayShow: Number,
	            delayHide: Number,
	            dropbar: Boolean,
	            duration: Number,
	            dropbarMode: String
	        },

	        defaults: {
	            dropdown: '.uk-navbar-nav > li',
	            mode: 'hover',
	            pos: 'bottom-left',
	            offset: 0,
	            boundary: true,
	            boundaryAlign: false,
	            clsDrop: 'uk-navbar-dropdown',
	            delayShow: 75,
	            delayHide: 800,
	            dropbar: false,
	            duration: 200,
	            dropbarMode: 'overlay'
	        },

	        ready: function ready() {
	            var _this = this;

	            var drop;

	            this.$el.find(this.dropdown + ':not([uk-drop], [uk-dropdown])').each(function (i, el) {

	                drop = (0, _index.toJQuery)('.' + _this.clsDrop, el);

	                if (!drop) {
	                    return;
	                }

	                UIkit.drop(drop, {
	                    mode: _this.mode,
	                    pos: _this.pos,
	                    offset: _this.offset,
	                    boundary: _this.boundary === true || _this.boundaryAlign ? _this.$el : _this.boundary,
	                    boundaryAlign: _this.boundaryAlign,
	                    clsDrop: _this.clsDrop,
	                    flip: 'x',
	                    delayShow: _this.delayShow,
	                    delayHide: _this.delayHide,
	                    duration: _this.duration
	                });
	            });

	            this.$el.on('mouseenter', this.dropdown, function (_ref) {
	                var target = _ref.target;

	                var active = _this.getActive();
	                if (active && active.mode !== 'click' && !(0, _index.isWithin)(target, active.toggle) && !active.isDelaying) {
	                    active.hide(null, false);
	                }
	            });

	            if (!this.dropbar) {
	                return;
	            }

	            this.dropbar = (0, _index.toJQuery)(this.dropbar);

	            if (!this.dropbar) {
	                this.dropbar = (0, _jquery2.default)('<div class="uk-navbar-dropbar"></div>').insertAfter(this.$el);
	            }

	            if (this.dropbarMode === 'overlay') {
	                this.dropbar.addClass('uk-navbar-dropbar-overlay');
	            }

	            this.$el.on({

	                beforeshow: function beforeshow(e, _ref2) {
	                    var $el = _ref2.$el;

	                    $el.addClass(_this.clsDrop + '-dropbar');

	                    var height = _this.dropbar[0].offsetHeight ? _this.dropbar.height() : 0;
	                    _index.Transition.stop(_this.dropbar);
	                    _this.dropbar.height(height);
	                    _index.Transition.start(_this.dropbar, { height: $el.outerHeight(true) }, _this.duration);
	                },

	                hide: function hide() {
	                    (0, _index.requestAnimationFrame)(function () {
	                        if (!_this.getActive()) {
	                            var height = _this.dropbar[0].offsetHeight ? _this.dropbar.height() : 0;
	                            _index.Transition.stop(_this.dropbar);
	                            _this.dropbar.height(height);
	                            _index.Transition.start(_this.dropbar, { height: 0 }, _this.duration);
	                        }
	                    });
	                }

	            });

	            this.dropbar.on({

	                mouseenter: function mouseenter() {
	                    var active = _this.getActive();
	                    if (active) {
	                        active.clearTimers();
	                    }
	                },

	                mouseleave: function mouseleave(_ref3) {
	                    var relatedTarget = _ref3.relatedTarget;

	                    var active = _this.getActive();
	                    if (active && !(0, _index.isWithin)(relatedTarget, active.toggle)) {
	                        active.hide();
	                    }
	                }

	            });
	        },


	        methods: {
	            getActive: function getActive() {
	                var active = UIkit.drop.getActive();
	                if (active && (0, _index.isWithin)(active.toggle, this.$el)) {
	                    return active;
	                }
	            }
	        }

	    });
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('offcanvas', {

	        mixins: [UIkit.mixin.modal],

	        props: {
	            mode: String,
	            flip: Boolean,
	            overlay: Boolean
	        },

	        defaults: {
	            mode: 'overlay',
	            flip: false,
	            overlay: false,
	            clsPage: 'uk-offcanvas-page',
	            clsPanel: 'uk-offcanvas-bar',
	            clsFlip: 'uk-offcanvas-flip',
	            clsPageAnimation: 'uk-offcanvas-page-animation',
	            clsSidebarAnimation: 'uk-offcanvas-bar-animation',
	            clsMode: 'uk-offcanvas',
	            clsOverlay: 'uk-offcanvas-overlay',
	            clsClose: 'uk-offcanvas-close'
	        },

	        ready: function ready() {
	            var _this = this;

	            this.clsFlip = this.flip ? this.clsFlip : '';
	            this.clsOverlay = this.overlay ? this.clsOverlay : '';
	            this.clsMode = this.clsMode + '-' + this.mode;

	            if (this.mode === 'noeffect' || this.mode === 'reveal') {
	                this.clsSidebarAnimation = '';
	            }

	            if (this.mode !== 'push' && this.mode !== 'reveal') {
	                this.clsPageAnimation = '';
	            }

	            this.$el.on('show', function () {

	                _this.scrollbarWidth = window.innerWidth - _this.page.width();

	                if (_this.scrollbarWidth && _this.overlay) {
	                    _this.body.css('overflow-y', 'scroll');
	                    _this.scrollbarWidth = 0;
	                }

	                _this.page.width(window.innerWidth - _this.scrollbarWidth).addClass(_this.clsPage + ' ' + _this.clsFlip + ' ' + _this.clsPageAnimation + ' ' + _this.clsOverlay);
	                _this.panel.addClass(_this.clsSidebarAnimation + ' ' + _this.clsMode);
	                _this.$el.css('display', 'block').height();
	                _this.$el.addClass(_this.clsOpen);
	            });

	            this.$el.on('hide', function () {

	                _this.panel.one(_index.transitionend, function () {
	                    _this.page.removeClass(_this.clsPage + ' ' + _this.clsFlip + ' ' + _this.clsOverlay).width('');
	                    _this.panel.removeClass(_this.clsSidebarAnimation + ' ' + _this.clsMode);
	                    _this.$el.css('display', '');
	                    _this.body.css('overflow-y', '');
	                });

	                if (_this.mode === 'noeffect' || _this.getActive() && _this.getActive() !== _this) {
	                    _this.panel.trigger(_index.transitionend);
	                }

	                _this.$el.removeClass(_this.clsOpen);
	                _this.page.removeClass(_this.clsPageAnimation).css('margin-left', '');
	            });
	        },


	        update: {
	            handler: function handler() {

	                if (this.isActive()) {
	                    this.page.width(window.innerWidth - this.scrollbarWidth);
	                }
	            },


	            events: ['resize', 'orientationchange']

	        }

	    });
	};

	var _index = __webpack_require__(4);

/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('responsive', {

	        props: ['width', 'height'],

	        update: {
	            handler: function handler() {

	                if (!this.$el.is(':visible') || !this.width || !this.height) {
	                    return;
	                }

	                var width = this.$el.parent().width();

	                this.$el.css({ height: width < this.width ? Math.floor(width / this.width * this.height) : this.height });
	            },


	            events: ['load', 'resize', 'orientationchange']

	        }

	    });
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('scrollspy', {

	        props: {
	            cls: String,
	            target: String,
	            hidden: Boolean,
	            offsetTop: Number,
	            offsetLeft: Number,
	            repeat: Boolean,
	            delay: Number
	        },

	        defaults: {
	            cls: 'uk-scrollspy-inview',
	            target: false,
	            hidden: true,
	            offsetTop: 0,
	            offsetLeft: 0,
	            repeat: false,
	            delay: 0,
	            inViewClass: 'uk-scrollspy-inview'
	        },

	        ready: function ready() {
	            this.elements = this.target && (0, _index.toJQuery)(this.target, this.$el) || this.$el;

	            if (this.hidden) {
	                this.elements.css('visibility', 'hidden');
	            }
	        },


	        update: {
	            handler: function handler() {
	                var _this = this;

	                var index = this.elements.length === 1 ? 1 : 0;

	                this.elements.each(function (i, el) {

	                    var $el = (0, _jquery2.default)(el);

	                    if (!el.__uk_scrollspy) {
	                        el.__uk_scrollspy = { toggles: ($el.attr('cls') ? $el.attr('cls') : _this.cls).split(',') };
	                    }

	                    var data = el.__uk_scrollspy;

	                    if ((0, _index.isInView)(el, _this.offsetTop, _this.offsetLeft)) {

	                        if (!data.inview && !data.timer) {

	                            data.timer = setTimeout(function () {

	                                $el.css('visibility', '').addClass(_this.inViewClass).toggleClass(data.toggles[0]).trigger('inview'); // TODO rename event?

	                                data.inview = true;
	                                delete data.timer;
	                            }, _this.delay * index);

	                            index++;
	                        }
	                    } else {

	                        if (data.inview && _this.repeat) {

	                            if (data.timer) {
	                                clearTimeout(data.timer);
	                                delete data.timer;
	                            }

	                            $el.removeClass(_this.inViewClass).toggleClass(data.toggles[0]).css('visibility', _this.hidden ? 'hidden' : '').trigger('outview'); // TODO rename event?
	                            data.inview = false;
	                        }
	                    }

	                    data.toggles.reverse();
	                });
	            },


	            events: ['scroll', 'load', 'resize', 'orientationchange']

	        }

	    });
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('scrollspy-nav', {

	        props: {
	            cls: String,
	            closest: String,
	            smoothScroll: Boolean,
	            overflow: Boolean
	        },

	        defaults: {
	            cls: 'uk-active',
	            closest: false,
	            smoothScroll: false,
	            overflow: true
	        },

	        ready: function ready() {
	            this.links = this.$el.find('a[href^="#"]').filter(function (i, el) {
	                return el.hash;
	            });
	            this.elements = this.closest ? this.links.closest(this.closest) : this.links;
	            this.targets = (0, _jquery2.default)(_jquery2.default.map(this.links, function (el) {
	                return el.hash;
	            }).join(','));

	            if (this.smoothScroll) {
	                this.links.each(function () {
	                    UIkit.smoothScroll(this);
	                });
	            }
	        },


	        update: {
	            handler: function handler() {
	                var _this = this;

	                var scrollTop = (0, _jquery2.default)(window).scrollTop();

	                this.links.blur();
	                this.elements.removeClass(this.cls);

	                this.targets.each(function (i, el) {

	                    el = (0, _jquery2.default)(el);

	                    var offset = el.offset(),
	                        last = i + 1 === _this.targets.length;
	                    if (!_this.overflow && (i === 0 && offset.top > scrollTop || last && offset.top + el.outerHeight() < scrollTop)) {
	                        return false;
	                    }

	                    if (!last && _this.targets.eq(i + 1).offset().top <= scrollTop) {
	                        return;
	                    }

	                    var active = _this.links.filter('[href="#' + el.attr('id') + '"]');

	                    if (active.length) {
	                        active = (_this.closest ? active.closest(_this.closest) : active).addClass(_this.cls);
	                        _this.$el.trigger('active', [el, active]);

	                        return false;
	                    }
	                });
	            },


	            events: ['scroll', 'load', 'resize', 'orientationchange']

	        }

	    });
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('smooth-scroll', {

	        props: {
	            duration: Number,
	            transition: String,
	            offset: Number
	        },

	        defaults: {
	            duration: 1000,
	            transition: 'easeOutExpo',
	            offset: 0,
	            complete: null
	        },

	        ready: function ready() {
	            var _this = this;

	            this.$el.on('click', function (e) {
	                e.preventDefault();
	                _this.scrollToElement((0, _jquery2.default)(_this.$el[0].hash).length ? _this.$el[0].hash : 'body');
	            });
	        },


	        methods: {
	            scrollToElement: function scrollToElement(el) {

	                el = (0, _jquery2.default)(el);

	                // get / set parameters
	                var target = el.offset().top - this.offset,
	                    docHeight = (0, _jquery2.default)(document).height(),
	                    winHeight = window.innerHeight;

	                if (target + winHeight > docHeight) {
	                    target = docHeight - winHeight;
	                }

	                // animate to target, fire callback when done
	                (0, _jquery2.default)('body').stop().animate({ scrollTop: target }, this.duration, this.transition, this.complete);
	            }
	        }

	    });

	    if (!_jquery2.default.easing.easeOutExpo) {
	        _jquery2.default.easing.easeOutExpo = function (x, t, b, c, d) {
	            return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	        };
	    }
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('sticky', {

	        props: {
	            top: null,
	            bottom: Boolean,
	            offset: Number,
	            animation: String,
	            clsActive: String,
	            clsInactive: String,
	            widthElement: 'jQuery',
	            showOnUp: Boolean,
	            media: Number,
	            target: Number
	        },

	        defaults: {
	            top: 0,
	            bottom: false,
	            offset: 0,
	            animation: '',
	            clsActive: 'uk-active',
	            clsInactive: '',
	            widthElement: false,
	            showOnUp: false,
	            media: false,
	            target: false
	        },

	        ready: function ready() {
	            var _this = this;

	            this.placeholder = (0, _jquery2.default)('<div class="uk-sticky-placeholder"></div>').insertAfter(this.$el).css({
	                height: this.$el.css('position') !== 'absolute' ? this.$el.outerHeight() : '',
	                margin: this.$el.css('margin')
	            }).attr('hidden', true);

	            this.widthElement = this.widthElement || this.placeholder;
	            this.topProp = this.top;
	            this.bottomProp = this.bottom;

	            var scroll = (0, _jquery2.default)(window).scrollTop();
	            if (location.hash && scroll > 0 && this.target) {

	                var target = (0, _index.toJQuery)(location.hash);

	                if (target) {
	                    (0, _index.requestAnimationFrame)(function () {

	                        var top = target.offset().top,
	                            elTop = _this.$el.offset().top,
	                            elHeight = _this.$el.outerHeight(),
	                            elBottom = elTop + elHeight;

	                        if (elBottom >= top && elTop <= top + target.outerHeight()) {
	                            window.scrollTo(0, top - elHeight - _this.target - _this.offset);
	                        }
	                    });
	                }
	            }

	            // TODO: fix
	            this.$el.css({
	                // 'overflow-y': 'scroll',
	                '-webkit-overflow-scrolling': 'touch'
	            });
	        },


	        update: {
	            handler: function handler(_ref) {
	                var type = _ref.type;
	                var dir = _ref.dir;


	                var isActive = this.$el.hasClass(this.clsActive);

	                if (type !== 'scroll') {

	                    this.offsetTop = (isActive ? this.placeholder.offset() : this.$el.offset()).top;

	                    this.top = this.topProp;

	                    if (this.topProp && typeof this.topProp === 'string') {
	                        if (this.topProp.match(/^-?\d+vh$/)) {
	                            this.top = window.innerHeight * parseFloat(this.topProp) / 100;
	                        } else {
	                            var el = (0, _index.toJQuery)(this.topProp);
	                            if (el) {
	                                this.top = el[0].offsetTop + el[0].offsetHeight;
	                            }
	                        }
	                    }

	                    this.top = Math.max(parseFloat(this.top), this.offsetTop) - this.offset;

	                    if (this.bottomProp === true || this.bottomProp[0] === '!') {
	                        this.bottom = this.bottomProp === true ? this.$el.parent() : this.$el.closest(this.bottomProp.substr(1));
	                        this.bottom = this.bottom.offset().top + this.bottom.height() + parseFloat(this.bottom.css('padding-top'));
	                    } else if (typeof this.bottomProp === 'string') {
	                        this.bottom = (0, _index.toJQuery)(this.bottomProp);
	                        if (this.bottom) {
	                            this.bottom = this.bottom.offset().top;
	                        }
	                    }

	                    this.bottom = this.bottom ? this.bottom - this.$el.outerHeight() : this.bottom;

	                    this.mediaInactive = this.media && !(typeof this.media === 'number' && window.innerWidth >= this.media || typeof this.media === 'string' && window.matchMedia(this.media).matches);
	                }

	                var scroll = (0, _jquery2.default)(window).scrollTop();

	                if (scroll < 0 || !this.$el.is(':visible') || this.disabled) {
	                    return;
	                }

	                if (this.mediaInactive || scroll < this.top || this.showOnUp && (dir !== 'up' || dir === 'up' && !isActive && scroll <= this.offsetTop + this.$el.outerHeight())) {
	                    if (isActive) {

	                        _index.Animation.cancel(this.$el);

	                        this.$el.css({ position: '', top: '', width: '' }).removeClass(this.clsActive).addClass(this.clsInactive).trigger('inactive');

	                        this.placeholder.attr('hidden', true);
	                    }

	                    return;
	                }

	                this.placeholder.attr('hidden', false);

	                var top = Math.max(0, this.offset);
	                if (this.bottom && scroll > this.bottom - this.offset) {
	                    top = this.bottom - scroll;
	                }

	                this.$el.css({
	                    position: 'fixed',
	                    top: top + 'px',
	                    width: this.widthElement[0].getBoundingClientRect().width
	                });

	                if (isActive) {
	                    return;
	                }

	                if (this.animation) {
	                    _index.Animation.cancel(this.$el).in(this.$el, this.animation);
	                }

	                this.$el.addClass(this.clsActive).removeClass(this.clsInactive).trigger('active');
	            },


	            events: ['scroll', 'load', 'resize', 'orientationchange']

	        }

	    });
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('svg', {

	        mixins: [UIkit.mixin.svg],

	        props: ['src'],

	        defaults: { exclude: ['src'] },

	        ready: function ready() {
	            var _this = this;

	            if (this.src.indexOf('#') !== -1) {

	                var parts = this.src.split('#');

	                if (parts.length < 2) {
	                    return;
	                }

	                this.getIcon(parts[0], parts[1]).then(this.$replace.bind(this));
	            } else {

	                this.get(this.src).then(function (doc) {

	                    var svg = (0, _index.toJQuery)(doc);

	                    if (!svg) {
	                        return;
	                    }

	                    _this.$replace(_this.addProps(svg));
	                });
	            }
	        }
	    });
	};

	var _index = __webpack_require__(4);

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('switcher', {

	        mixins: [UIkit.mixin.toggable],

	        props: {
	            connect: 'jQuery',
	            toggle: String,
	            active: Number,
	            swiping: Boolean
	        },

	        defaults: {
	            connect: false,
	            toggle: '> *',
	            active: 0,
	            swiping: true,
	            cls: 'uk-active',
	            attrItem: 'uk-switcher-item'
	        },

	        ready: function ready() {
	            var _this = this;

	            this.toggles = (0, _index.toJQuery)(this.toggle, this.$el);

	            if (!this.connect || !this.toggles) {
	                return;
	            }

	            var self = this;
	            this.$el.on('click', this.toggle + ':not(.uk-disabled)', function (e) {
	                e.preventDefault();
	                self.show(this);
	            });

	            this.connect.on('click', '[' + this.attrItem + ']', function (e) {
	                e.preventDefault();
	                self.show((0, _jquery2.default)(this).attr(self.attrItem));
	            });

	            if (this.swiping) {
	                this.connect.on('swipeRight swipeLeft', function (e) {
	                    e.preventDefault();
	                    if (!window.getSelection().toString()) {
	                        _this.show(e.type == 'swipeLeft' ? 'next' : 'previous');
	                    }
	                });
	            }

	            this.updateAria(this.connect.children());
	            this.show((0, _index.toJQuery)(this.toggles.filter('.' + this.cls + ':first')) || (0, _index.toJQuery)(this.toggles.eq(this.active)) || this.toggles.first());
	        },


	        methods: {
	            show: function show(item) {
	                var _this2 = this;

	                var length = this.toggles.length,
	                    prev = this.connect.children('.' + this.cls).index(),
	                    hasPrev = prev >= 0,
	                    index = (item === 'next' ? prev + 1 : item === 'previous' ? prev - 1 : typeof item === 'string' ? parseInt(item, 10) : typeof item === 'number' ? item : this.toggles.index(item)) % length,
	                    toggle,
	                    dir = item === 'previous' ? -1 : 1;

	                index = index < 0 ? index + length : index;

	                for (var i = 0; i < length; i++, index = (index + dir + length) % length) {
	                    if (!this.toggles.eq(index).is('.uk-disabled, [disabled]')) {
	                        toggle = this.toggles.eq(index);
	                        break;
	                    }
	                }

	                if (!toggle || prev >= 0 && toggle.hasClass(this.cls) || prev === index) {
	                    return;
	                }

	                this.toggles.removeClass(this.cls).attr('aria-expanded', false);
	                toggle.addClass(this.cls).attr('aria-expanded', true);

	                this.toggleElement(hasPrev ? this.connect.children(':nth-child(' + (prev + 1) + ')') : undefined, hasPrev).then(function () {
	                    _this2.toggleElement(_this2.connect.children(':nth-child(' + (index + 1) + ')'), hasPrev);
	                });
	            }
	        }

	    });
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('tab', UIkit.components.switcher.extend({

	        name: 'tab',

	        props: {
	            media: Number
	        },

	        defaults: {
	            media: 960,
	            attrItem: 'uk-tab-item'
	        },

	        ready: function ready() {

	            this.vertical = this.$el.hasClass('uk-tab-left') && 'uk-tab-left' || this.$el.hasClass('uk-tab-right') && 'uk-tab-right';
	        },


	        update: {
	            handler: function handler() {

	                this.$el.toggleClass(this.vertical || '', this.vertical && this.media && typeof this.media === 'number' && window.innerWidth >= this.media || typeof this.media === 'string' && window.matchMedia(this.media).matches);
	            },


	            events: ['resize', 'orientationchange']

	        }

	    }));
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('toggle', {

	        mixins: [UIkit.mixin.toggable],

	        props: {
	            href: 'jQuery',
	            target: 'jQuery',
	            mode: String
	        },

	        defaults: {
	            href: false,
	            target: false,
	            mode: false
	        },

	        ready: function ready() {
	            var _this = this;

	            this.target = this.target || this.href;

	            if (!this.target) {
	                return;
	            }

	            var target,
	                targets = UIkit.getComponents(this.target[0]);

	            (0, _index.each)(targets, function (i, component) {
	                if (component.doToggle) {
	                    target = component;
	                    return false;
	                }
	            });

	            var mode = _index.hasTouch ? 'click' : this.mode;

	            if (target) {

	                mode = this.mode || target.mode;

	                target.target = this.$el;

	                this.$el.on('click', function (e) {

	                    if (!(0, _index.isWithin)(e.target, _this.target)) {
	                        e.preventDefault();
	                    }

	                    target.doToggle(_this.$el);
	                });

	                this.$el.attr('aria-expanded', false);

	                if (mode === 'hover') {
	                    this.$el.add(target.$el).on('mouseenter', function () {
	                        return target.show(_this.$el);
	                    }).on('mouseleave', function () {
	                        return target.hide(_this.$el);
	                    });
	                }

	                target.$el.on('beforeshow', function () {
	                    return _this.$el.addClass(target.cls).attr('aria-expanded', 'true');
	                }).on('beforehide', function () {
	                    return _this.$el.removeClass(target.cls).attr('aria-expanded', 'false').blur().find('a, button').blur();
	                });
	            } else {

	                this.aria = this.cls === false;
	                this.updateAria(this.target);

	                this.$el.on('click', function (e) {
	                    e.preventDefault();
	                    _this.toggleElement(_this.target);
	                });
	            }
	        }
	    });
	};

	var _index = __webpack_require__(4);

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    var active = false;

	    (0, _jquery2.default)(document).on('click', function (e) {
	        if (active && !e.isDefaultPrevented() && !(0, _index.isWithin)(e.target, active.panel)) {
	            active.hide();
	        }
	    });

	    UIkit.mixin.modal = {

	        props: {
	            clsPanel: String,
	            clsOpen: String,
	            clsClose: String
	        },

	        defaults: {
	            clsOpen: 'uk-open'
	        },

	        ready: function ready() {
	            var _this = this;

	            this.page = (0, _jquery2.default)('html');
	            this.body = (0, _jquery2.default)('body');
	            this.panel = (0, _index.toJQuery)('.' + this.clsPanel, this.$el);

	            this.$el.on('click', '.' + this.clsClose, function (e) {
	                e.preventDefault();
	                _this.hide();
	            });
	        },


	        methods: {
	            isActive: function isActive() {
	                return this.$el.hasClass(this.clsOpen);
	            },
	            doToggle: function doToggle() {
	                this[this.isActive() ? 'hide' : 'show']();
	            },
	            show: function show() {

	                if (this.isActive()) {
	                    return;
	                }

	                var hide = false;

	                if (active && active !== this) {
	                    hide = true;
	                }

	                active = this;

	                if (hide) {
	                    active.hide();
	                }

	                this.$el.trigger('beforeshow', [this]);
	                this.$el.trigger('show', [this]);

	                this.$update();
	            },
	            hide: function hide() {

	                if (!this.isActive()) {
	                    return;
	                }

	                active = false;

	                this.$el.trigger('beforehide', [this]);
	                this.$el.trigger('hide', [this]);

	                this.$update();
	            },
	            getActive: function getActive() {
	                return active;
	            }
	        }

	    };
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }
/******/ ])
});
;