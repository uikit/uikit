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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_index2.default.version = '3.0.0';

	(0, _index4.default)(_index2.default, _index2.default.util);

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

	    var selector;

	    if (!_index.Observer) {

	        (0, _index.ready)(function () {
	            (0, _jquery2.default)(getSelector()).each(function (i, node) {
	                attachComponents(node);
	            });
	        });

	        return;
	    }

	    new _index.Observer(function (mutations) {

	        mutations.forEach(function (mutation) {

	            if (mutation.type === 'childList') {

	                for (var i = 0; i < mutation.addedNodes.length; ++i) {

	                    var node = mutation.addedNodes[i];

	                    if ((0, _index.matches)(node, getSelector())) {
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

	    function getSelector() {

	        if (!selector) {
	            var components = Object.keys(UIkit.components).map(_index.hyphenate);
	            selector = components.length ? '[uk-' + components.join('],[uk-') + ']' : false;
	        }

	        return selector;
	    }

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
	exports.offsetParent = offsetParent;
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

	    (0, _env.cancelAnimationFrame)(element[0].__uk_transition);

	    element[0].__uk_transition = (0, _env.requestAnimationFrame)(function () {

	        var timer = setTimeout(function () {
	            element.trigger(_env.transitionend || 'transitionend');
	        }, duration);

	        element.one(_env.transitionend || 'transitionend', function () {
	            d.resolve();
	            element.css('transition', '');
	            clearTimeout(timer);
	        }).css('transition', 'all ' + duration + 'ms ' + (transition || 'linear')).css(props);

	        delete element[0].__uk_transition;
	    });

	    return d.promise();
	}

	var Transition = exports.Transition = {

	    start: transition,

	    stop: function stop(element) {

	        element = (0, _jquery2.default)(element);

	        (0, _env.cancelAnimationFrame)(element[0].__uk_transition);
	        (0, _jquery2.default)(element).trigger(_env.transitionend || 'transitionend');

	        return this;
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

	    element.css('animation-duration', duration + 'ms').addClass(animation);

	    (0, _env.requestAnimationFrame)(function () {
	        element.addClass(cls);
	    });

	    element.one(_env.animationend || 'animationend', function () {
	        reset();
	        d.resolve();
	    });

	    if (!_env.animationend) {
	        (0, _env.requestAnimationFrame)(function () {
	            Animation.cancel(element);
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

	// TODO still needed?
	function offsetParent(element) {
	    return (0, _jquery2.default)(element).parents().filter(function () {
	        return _jquery2.default.inArray((0, _jquery2.default)(this).css('position'), ['relative', 'fixed', 'absolute']) !== -1;
	    }).first();
	}

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

	    boundary = getDimensions(boundary || (0, _jquery2.default)(window));

	    var flipped = { element: attach, target: targetAttach };

	    if (flip) {
	        _jquery2.default.each(dirs, function (dir, props) {

	            if (!(flip === true || flip.indexOf(dir) !== -1)) {
	                return;
	            }

	            var elemOffset = attach[dir] === props[1] ? -dim[props[0]] : attach[dir] === props[2] ? dim[props[0]] : 0,
	                targetOffset = targetAttach[dir] === props[1] ? targetDim[props[0]] : targetAttach[dir] === props[2] ? -targetDim[props[0]] : 0;

	            if (position[props[1]] < boundary[props[1]] || position[props[1]] + dim[props[0]] > boundary[props[2]]) {

	                var newVal = position[props[1]] + elemOffset + targetOffset - offset[dir] * 2;

	                if (newVal >= boundary[props[1]] && newVal + dim[props[0]] <= boundary[props[2]]) {
	                    position[props[1]] = newVal;

	                    flipped.element[dir] = elemOffset ? flipped.element[dir] === dirs[dir][1] ? dirs[dir][2] : dirs[dir][1] : flipped.element[dir];
	                    flipped.target[dir] = elemOffset ? flipped.target[dir] === dirs[dir][1] ? dirs[dir][2] : dirs[dir][1] : flipped.target[dir];
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
	    _jquery2.default.each(dirs, function (dir, props) {
	        if (attach[dir] === props[2]) {
	            position[props[1]] += dim[props[0]] * factor;
	        } else if (attach[dir] === 'center') {
	            position[props[1]] += dim[props[0]] * factor / 2;
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
	        var _this = this;

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
	                options.split(';').forEach(function (option) {
	                    var opt = option.split(/:(.+)/).map(function (value) {
	                        return value.trim();
	                    }),
	                        key = (0, _index.camelize)(opt[0]);
	                    if (props[key] !== undefined) {
	                        _this[key] = (0, _index.coerce)(props[key], opt[1]);
	                    }
	                });
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
	        var _this2 = this;

	        var handlers = this.$options[hook];

	        if (handlers) {
	            handlers.forEach(function (handler) {
	                handler.call(_this2);
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

	    UIkit.prototype.$update = function (e) {
	        (0, _jquery2.default)(UIkit.elements, this.$el).each(function () {
	            if (this[DATA]) {
	                for (var name in this[DATA]) {
	                    this[DATA][name]._callUpdate(e);
	                }
	            }
	        });
	    };

	    UIkit.prototype.$updateParents = function (e) {
	        var _this2 = this;

	        (0, _jquery2.default)(UIkit.elements).each(function (i, el) {
	            if (el[DATA] && _jquery2.default.contains(el, _this2.$el[0])) {
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

	        this.$updateParents();
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

	        name = (0, _index.camelize)(name);

	        UIkit.components[name] = options;

	        UIkit[name] = function (element, data) {

	            var result = [];

	            (0, _jquery2.default)(element).each(function () {
	                result.push(this[DATA] && this[DATA][name] || new UIkit.components[name]({ el: this, data: data || {} }));
	            });

	            return result;
	        };

	        return UIkit.components[name];
	    };

	    UIkit.getComponent = function (element, name) {
	        return element[DATA] && element[DATA][name];
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
	    UIkit.use(_navbar2.default);
	    UIkit.use(_responsive2.default);
	    UIkit.use(_scrollspy2.default);
	    UIkit.use(_scrollspyNav2.default);
	    UIkit.use(_smoothScroll2.default);
	    UIkit.use(_sticky2.default);
	    UIkit.use(_svg2.default);
	    UIkit.use(_switcher2.default);
	    UIkit.use(_toggle2.default);
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _alert = __webpack_require__(16);

	var _alert2 = _interopRequireDefault(_alert);

	var _close = __webpack_require__(17);

	var _close2 = _interopRequireDefault(_close);

	var _cover = __webpack_require__(18);

	var _cover2 = _interopRequireDefault(_cover);

	var _drop = __webpack_require__(19);

	var _drop2 = _interopRequireDefault(_drop);

	var _dropdown = __webpack_require__(20);

	var _dropdown2 = _interopRequireDefault(_dropdown);

	var _grid = __webpack_require__(21);

	var _grid2 = _interopRequireDefault(_grid);

	var _heightViewport = __webpack_require__(22);

	var _heightViewport2 = _interopRequireDefault(_heightViewport);

	var _icon = __webpack_require__(23);

	var _icon2 = _interopRequireDefault(_icon);

	var _marginWrap = __webpack_require__(25);

	var _marginWrap2 = _interopRequireDefault(_marginWrap);

	var _matchHeight = __webpack_require__(26);

	var _matchHeight2 = _interopRequireDefault(_matchHeight);

	var _navbar = __webpack_require__(27);

	var _navbar2 = _interopRequireDefault(_navbar);

	var _responsive = __webpack_require__(28);

	var _responsive2 = _interopRequireDefault(_responsive);

	var _scrollspy = __webpack_require__(29);

	var _scrollspy2 = _interopRequireDefault(_scrollspy);

	var _scrollspyNav = __webpack_require__(30);

	var _scrollspyNav2 = _interopRequireDefault(_scrollspyNav);

	var _smoothScroll = __webpack_require__(31);

	var _smoothScroll2 = _interopRequireDefault(_smoothScroll);

	var _sticky = __webpack_require__(32);

	var _sticky2 = _interopRequireDefault(_sticky);

	var _svg = __webpack_require__(33);

	var _svg2 = _interopRequireDefault(_svg);

	var _switcher = __webpack_require__(34);

	var _switcher2 = _interopRequireDefault(_switcher);

	var _toggle = __webpack_require__(36);

	var _toggle2 = _interopRequireDefault(_toggle);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('alert', {

	        props: {
	            animation: null,
	            duration: Number,
	            close: String
	        },

	        defaults: {
	            animation: true,
	            duration: 200,
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

	                this.$el.trigger('close');

	                if (String(this.animation) === 'true') {

	                    _index.Transition.start(this.$el, {
	                        'overflow': 'hidden',
	                        'height': 0,
	                        'opacity': 0,
	                        'padding-top': 0,
	                        'padding-bottom': 0,
	                        'margin-top': 0,
	                        'margin-bottom': 0
	                    }, this.duration).then(this.$destroy.bind(this));
	                } else if (typeof this.animation === 'string' && this.animation !== 'false') {

	                    _index.Animation.out(this.$el, this.animation, this.duration).then(this.$destroy.bind(this));
	                } else {
	                    this.$destroy();
	                }
	            }
	        },

	        destroy: function destroy() {
	            this.$el.off('click');
	            this.$el.trigger('closed');
	        }
	    });
	};

	var _index = __webpack_require__(4);

/***/ },
/* 17 */
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
/* 18 */
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    var active, handler;

	    UIkit.component('drop', {

	        props: {
	            mode: String,
	            pos: String,
	            target: 'jQuery',
	            boundary: 'jQuery',
	            boundaryAlign: Boolean,
	            flip: Boolean,
	            offset: Number,
	            delayShow: Number,
	            delayHide: Number,
	            cls: String
	        },

	        defaults: {
	            mode: 'hover',
	            pos: 'bottom-left',
	            target: false,
	            boundary: (0, _jquery2.default)(window),
	            boundaryAlign: false,
	            flip: true,
	            offset: 0,
	            delayShow: 0,
	            delayHide: 800,
	            hoverIdle: 200,
	            cls: false
	        },

	        ready: function ready() {
	            var _this = this;

	            this.cls = this.cls || 'uk-' + this.$options.name;
	            this.drop = this.target || (0, _index.toJQuery)('.' + this.cls + ':first', this.$el) || (0, _index.toJQuery)(this.$el.nextAll('.' + this.cls + ':first'));

	            if (!this.drop) {
	                return;
	            }

	            this.mode = _index.hasTouch ? 'click' : this.mode;
	            this.positions = [];
	            this.pos = (this.pos + (this.pos.indexOf('-') === -1 ? '-center' : '')).split('-');

	            // Init ARIA
	            this.drop.attr('aria-expanded', false);

	            if (!handler) {
	                (0, _jquery2.default)('html').on('click', function () {
	                    if (active) {
	                        active.hide(true);
	                    }
	                });
	            }

	            this.$el.on('click', function (e) {

	                e.preventDefault();
	                e.stopPropagation();

	                if (_this.isActive()) {
	                    _this.hide(true);
	                } else {
	                    _this.show(true);
	                }
	            });

	            this.drop.on('click', '.' + this.cls + '-close', function () {
	                _this.hide(true);
	            });

	            if (this.mode === 'hover') {

	                this.$el.on('mouseenter', function () {
	                    _this.$el.trigger('pointerenter', [_this]);
	                    _this.show();
	                }).on('mouseleave', function () {
	                    _this.$el.trigger('pointerleave', [_this]);
	                    _this.hide();
	                });

	                this.drop.on('mouseenter', function () {
	                    if (_this.isActive()) {
	                        _this.show();
	                    }
	                }).on('mouseleave', function () {
	                    if (_this.isActive()) {
	                        _this.hide();
	                    }
	                });
	            }
	        },


	        methods: {
	            show: function show(force) {
	                var _this2 = this;

	                this.clearTimers();

	                if (this.isActive()) {
	                    return;
	                } else if (!force && active && active !== this && active.isDelaying()) {
	                    this.delayShowTimer = setTimeout(this.show.bind(this), 75);
	                    return;
	                } else if (active) {
	                    active.hide(true);
	                }

	                var show = function show() {

	                    _this2.updatePosition();

	                    _this2.$el.trigger('beforeshow', [_this2]).addClass('uk-open');
	                    _this2.drop.addClass('uk-open').attr('aria-expanded', 'true');
	                    _this2.$el.trigger('show', [_this2]);

	                    _this2.initMouseTracker();
	                    _this2.$update();
	                };

	                if (!force && this.delayShow) {
	                    this.delayShowTimer = setTimeout(show, this.delayShow);
	                } else {
	                    show();
	                }

	                active = this;
	            },
	            hide: function hide(force) {
	                var _this3 = this;

	                this.clearTimers();

	                var hide = function hide() {

	                    if (!_this3.isActive()) {
	                        return;
	                    }

	                    active = null;

	                    _this3.cancelMouseTracker();

	                    _this3.$el.trigger('beforehide', [_this3, force]).removeClass('uk-open').blur();
	                    _this3.drop.removeClass('uk-open').attr('aria-expanded', 'false');
	                    _this3.$el.trigger('hide', [_this3, force]);
	                };

	                if (!force && this.isDelaying()) {
	                    this.hoverTimer = setTimeout(this.hide.bind(this), this.hoverIdle);
	                } else if (!force && this.delayHide) {
	                    this.delayHideTimer = setTimeout(hide, this.delayHide);
	                } else {
	                    hide();
	                }
	            },
	            clearTimers: function clearTimers() {

	                if (this.delayShowTimer) {
	                    clearTimeout(this.delayShowTimer);
	                }

	                if (this.delayHideTimer) {
	                    clearTimeout(this.delayHideTimer);
	                }

	                if (this.hoverTimer) {
	                    clearTimeout(this.hoverTimer);
	                    delete this.hoverTimer;
	                }
	            },
	            updatePosition: function updatePosition() {

	                if (!this.drop) {
	                    return;
	                }

	                (0, _index.removeClass)(this.drop, this.cls + '-(top|bottom|left|right|stack|boundary)(-[a-z]+)?').css({ top: '', left: '', width: '', height: '' });

	                if (this.boundaryAlign) {
	                    this.drop.addClass(this.cls + '-boundary');
	                }

	                this.drop.show();

	                this.dir = this.pos[0];
	                this.align = this.pos[1];

	                var boundary = (0, _index.getDimensions)(this.boundary),
	                    alignTo = this.boundaryAlign ? boundary : (0, _index.getDimensions)(this.$el);

	                if (this.align === 'justify') {
	                    if (this.getAxis() === 'y') {
	                        this.drop.css('width', alignTo.width);
	                    } else {
	                        this.drop.css('height', alignTo.height);
	                    }
	                }

	                if (this.drop.outerWidth > Math.max(boundary.right - alignTo.left, alignTo.right - boundary.left)) {
	                    this.drop.addClass(this.cls + '-stack');
	                    this.$el.trigger('stack', [this]);
	                }

	                var flipped = (0, _index.position)(this.drop, this.boundaryAlign ? this.boundary : this.$el, this.getAxis() === 'x' ? flipPosition(this.dir) + ' ' + this.align : this.align + ' ' + flipPosition(this.dir), this.getAxis() === 'x' ? this.dir + ' ' + this.align : this.align + ' ' + this.dir, this.getAxis() === 'x' ? '' + this.offset : ' ' + this.offset, null, this.flip, this.boundary);

	                this.dir = this.getAxis() === 'x' ? flipped.target.x : flipped.target.y;
	                this.align = this.getAxis() === 'x' ? flipped.target.y : flipped.target.x;

	                this.drop.css('display', '').addClass(this.cls + '-' + this.dir + '-' + this.align);
	            },
	            initMouseTracker: function initMouseTracker() {
	                var _this4 = this;

	                if (!this.drop) {
	                    return;
	                }

	                this.positions = [];
	                this.position = null;

	                if (this.mode !== 'hover') {
	                    return;
	                }

	                this.mouseHandler = function (e) {
	                    _this4.positions.push({ x: e.pageX, y: e.pageY });

	                    if (_this4.positions.length > 3) {
	                        _this4.positions.shift();
	                    }
	                };

	                (0, _jquery2.default)(document).on('mousemove', this.mouseHandler);

	                var p = (0, _index.getDimensions)(this.drop);

	                this.points = [[{ x: p.left, y: p.top }, { x: p.right, y: p.bottom }], [{ x: p.right, y: p.top }, { x: p.left, y: p.bottom }]];

	                if (this.dir === 'right') {
	                    this.points[0].reverse();
	                    this.points[1].reverse();
	                } else if (this.dir === 'top') {
	                    this.points[0].reverse();
	                } else if (this.dir === 'bottom') {
	                    this.points[1].reverse();
	                }
	            },
	            cancelMouseTracker: function cancelMouseTracker() {
	                if (this.mouseHandler) {
	                    (0, _jquery2.default)(document).off('mousemove', this.mouseHandler);
	                }
	            },
	            isDelaying: function isDelaying() {

	                if (this.hoverTimer) {
	                    return true;
	                }

	                var position = this.positions[this.positions.length - 1],
	                    prevPos = this.positions[0] || position,
	                    delay = position && this.mode === 'hover' && this.points && !(this.position && position.x === this.position.x && position.y === this.position.y);

	                if (delay) {
	                    delay = !!this.points.reduce(function (result, point) {
	                        return result + (slope(prevPos, point[0]) < slope(position, point[0]) && slope(prevPos, point[1]) > slope(position, point[1]));
	                    }, 0);
	                }

	                this.position = delay ? position : null;
	                return delay;
	            },
	            getAxis: function getAxis() {
	                return this.dir === 'top' || this.dir === 'bottom' ? 'y' : 'x';
	            },
	            isActive: function isActive() {
	                return active === this;
	            }
	        }

	    });

	    UIkit.drop.getActive = function () {
	        return active;
	    };

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

	    function slope(a, b) {
	        return (b.y - a.y) / (b.x - a.x);
	    }
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('dropdown', UIkit.components.drop.extend({ name: 'dropdown' }));
	};

/***/ },
/* 21 */
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
/* 22 */
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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('icon', {

	        mixins: [_svg2.default],

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

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _svg = __webpack_require__(24);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var storage = window.sessionStorage || {},
	    svgs = {};

	exports.default = {

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

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('margin-wrap', {

	        props: ['margin', 'rowFirst'],

	        defaults: {
	            margin: 'uk-margin-small-top',
	            rowFirst: 'uk-row-first'
	        },

	        update: {
	            handler: function handler() {
	                var _this = this;

	                if (!this.$el.is(':visible')) {
	                    return this;
	                }

	                var skip = false,
	                    columns = this.$el.children(':visible').removeClass(this.margin),
	                    offset = columns.length ? columns.position().top + columns.outerHeight() - 1 : false; // (-1): weird firefox bug when parent container is display:flex

	                if (offset !== false && columns.length > 1) {
	                    columns.slice(1).each(function (i, column) {

	                        column = (0, _jquery2.default)(column);

	                        if (skip) {
	                            column.addClass(_this.margin);
	                        } else if (column.position().top >= offset) {
	                            skip = column.addClass(_this.margin);
	                        }
	                    });
	                }

	                if (this.rowFirst) {

	                    // Mark first column elements
	                    columns.removeClass(this.rowFirst);

	                    var pos = columns.first().position();

	                    if (pos) {
	                        columns.each(function (i, el) {
	                            (0, _jquery2.default)(el).toggleClass(_this.rowFirst, (0, _jquery2.default)(el).position().left == pos.left);
	                        });
	                    }
	                }

	                return this;
	            },


	            events: ['load', 'resize', 'orientationchange']

	        }

	    });
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 26 */
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
/* 27 */
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
	            cls: String,
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
	            cls: 'uk-navbar-dropdown',
	            delayHide: 800,
	            hoverIdle: 200,
	            dropbar: false,
	            duration: 200,
	            dropbarMode: 'hover'
	        },

	        ready: function ready() {
	            var _this = this;

	            UIkit.drop(this.$el.find(this.dropdown + ':not([uk-drop], [uk-dropdown])'), {
	                mode: this.mode,
	                pos: this.pos,
	                offset: this.offset,
	                boundary: this.boundary === true || this.boundaryAlign ? this.$el : this.boundary,
	                boundaryAlign: this.boundaryAlign,
	                cls: this.cls,
	                flip: 'x',
	                delayShow: this.delayShow,
	                delayHide: this.delayHide
	            });

	            if (!this.dropbar) {
	                return;
	            }

	            this.dropbar = (0, _index.toJQuery)(this.dropbar);

	            if (!this.dropbar) {
	                this.dropbar = (0, _jquery2.default)('<div class="uk-navbar-dropbar"></div>').insertAfter(this.$el);
	            }

	            if (this.dropbarMode === 'hover') {
	                this.dropbar.addClass('uk-navbar-dropbar-hover');
	            }

	            var height, transition;

	            this.$el.on({

	                beforeshow: function beforeshow(e, drop) {
	                    drop.drop.addClass(_this.cls + '-dropbar');
	                },

	                show: function show(e, drop) {

	                    drop.$el.removeClass('uk-open');

	                    var newHeight = drop.drop.outerHeight(true);
	                    if (height === newHeight) {

	                        if (transition && transition.state() !== 'pending') {
	                            drop.$el.addClass('uk-open');
	                        }

	                        return;
	                    }
	                    height = newHeight;

	                    transition = _index.Transition.start(_this.dropbar, { height: drop.drop.outerHeight(true) }, _this.duration).then(function () {
	                        var active = _this.getActive();
	                        if (active) {
	                            active.$el.addClass('uk-open');
	                            active.$update();
	                        }
	                    });
	                },

	                hide: function hide() {
	                    (0, _index.requestAnimationFrame)(function () {
	                        if (!_this.getActive()) {
	                            _index.Transition.stop(_this.dropbar).start(_this.dropbar, { height: 0 }, _this.duration);
	                            height = 0;
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

	                mouseleave: function mouseleave(e) {
	                    var active = _this.getActive();
	                    if (active && !(0, _index.isWithin)(e.relatedTarget, active.$el)) {
	                        active.hide();
	                    }
	                }

	            });
	        },


	        methods: {
	            getActive: function getActive() {
	                var active = UIkit.drop.getActive();
	                if (active && (0, _index.isWithin)(active.$el, this.$el)) {
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
/* 28 */
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
/* 29 */
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
/* 30 */
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
/* 31 */
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
/* 32 */
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

	            this.$el.css({
	                'overflow-y': 'scroll',
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

	                if (this.mediaInactive || scroll < this.top || this.showOnUp && (dir === 'down' || dir === 'up' && !isActive && scroll <= this.offsetTop + this.$el.outerHeight())) {
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
	                    width: this.widthElement.width()
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
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('svg', {

	        mixins: [_svg2.default],

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

	var _svg = __webpack_require__(24);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('switcher', {

	        mixins: [_toggle2.default],

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
	            cls: 'uk-active',
	            swiping: true
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

	            this.connect.on('click', '[uk-switcher-item]', function (e) {
	                e.preventDefault();
	                self.show((0, _jquery2.default)(this).attr('uk-switcher-item'));
	            });

	            if (this.swiping) {
	                this.connect.on('swipeRight swipeLeft', function (e) {
	                    e.preventDefault();
	                    if (!window.getSelection().toString()) {
	                        _this.show(e.type == 'swipeLeft' ? 'next' : 'previous');
	                    }
	                });
	            }

	            this.show((0, _index.toJQuery)(this.toggles.filter('.' + this.cls)) || (0, _index.toJQuery)(this.toggles.eq(this.active)) || this.toggles.first());
	        },


	        methods: {

	            show: function show(item) {
	                var _this2 = this;

	                var length = this.toggles.length,
	                    prev = this.connect.children('.' + this.cls).index(),
	                    hasPrev = prev >= 0,
	                    index = (item === 'next' ? prev + 1 : item === 'previous' ? prev - 1 : typeof item === 'string' ? parseInt(item, 10) : this.toggles.index(item)) % length,
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

	                this.toggles.removeClass(this.cls);
	                toggle.addClass(this.cls);

	                this.toggleState(hasPrev ? this.connect.children(':nth-child(' + (prev + 1) + ')') : undefined, hasPrev).then(function () {
	                    _this2.toggleState(_this2.connect.children(':nth-child(' + (index + 1) + ')'), hasPrev);
	                });
	            }

	        }

	    });
	};

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(4);

	var _toggle = __webpack_require__(35);

	var _toggle2 = _interopRequireDefault(_toggle);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var updating;

	exports.default = {

	    props: {
	        cls: Boolean,
	        animation: String,
	        duration: Number
	    },

	    defaults: {
	        cls: false,
	        animation: false,
	        duration: 200
	    },

	    ready: function ready() {

	        this.aria = this.cls === false;
	        this.animations = this.animation && this.animation.split(' ');

	        if (this.animations) {

	            if (this.animations.length == 1) {
	                this.animations[1] = this.animations[0];
	            }

	            this.animations[0] = this.animations[0].trim();
	            this.animations[1] = this.animations[1].trim();
	        }
	    },


	    methods: {
	        toggleState: function toggleState(targets, animate) {
	            var _this = this;

	            var deferreds = [];

	            (0, _jquery2.default)(targets).each(function (i, el) {

	                el = (0, _jquery2.default)(el);

	                var toggled = _this.isToggled(el);

	                if (_this.animations && animate !== false) {

	                    _index.Animation.cancel(el);

	                    if (!_this.isToggled(el)) {

	                        _this.doToggle(el, true);
	                        deferreds.push(_index.Animation.in(el, _this.animations[0], _this.duration).then(function () {
	                            _this.doUpdate(el);
	                        }));
	                    } else {

	                        deferreds.push(_index.Animation.out(el, _this.animations[1], _this.duration).then(function () {
	                            _this.doToggle(el, false);
	                            _this.doUpdate(el);
	                        }));
	                    }
	                } else {

	                    _this.doToggle(el, !toggled);
	                    _this.doUpdate(el);
	                    deferreds.push(_jquery2.default.Deferred().resolve());
	                }
	            });

	            return _jquery2.default.when.apply(null, deferreds);
	        },
	        doToggle: function doToggle(el, toggled) {
	            el = (0, _jquery2.default)(el);
	            el.toggleClass(this.cls, this.cls && toggled).attr('hidden', !this.cls && !toggled);
	        },
	        isToggled: function isToggled(el) {
	            el = (0, _jquery2.default)(el);
	            return this.cls ? el.hasClass(this.cls) : !el.attr('hidden');
	        },
	        doUpdate: function doUpdate(el) {
	            var _this2 = this;

	            if (!updating) {
	                requestAnimationFrame(function () {
	                    _this2.$update();
	                    updating = false;
	                });
	                updating = true;
	            }

	            if (this.aria) {
	                el.attr('aria-hidden', !!el.attr('hidden'));
	            }
	        }
	    }

	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('toggle', {

	        mixins: [_toggle2.default],

	        props: {
	            target: 'jQuery'
	        },

	        defaults: {
	            target: false
	        },

	        ready: function ready() {
	            var _this = this;

	            if (!this.target) {
	                return;
	            }

	            this.$el.on('click', function (e) {
	                e.preventDefault();
	                _this.toggleState(_this.target);
	            });
	        }
	    });
	};

	var _toggle = __webpack_require__(35);

	var _toggle2 = _interopRequireDefault(_toggle);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }
/******/ ])
});
;