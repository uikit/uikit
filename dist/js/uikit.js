/*! UIkit 3.0.0-beta.2 | http://www.getuikit.com | (c) 2014 - 2016 YOOtheme | MIT License */

(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
   typeof define === 'function' && define.amd ? define(['jquery'], factory) :
   (global.UIkit = factory(global.jQuery));
}(this, (function ($) { 'use strict';

var $__default = 'default' in $ ? $['default'] : $;

var win = $__default(window);
var doc = $__default(document);

var langDirection = $__default('html').attr('dir') == 'rtl' ? 'right' : 'left';

function isReady() {
    return document.readyState === 'complete' || document.readyState !== 'loading' && !document.documentElement.doScroll;
}

function ready(fn) {

    var handle = function () {
        off(document, 'DOMContentLoaded', handle);
        off(window, 'load', handle);
        fn();
    };

    if (isReady()) {
        fn();
    } else {
        on(document, 'DOMContentLoaded', handle);
        on(window, 'load', handle);
    }

}

function on(el, type, listener, useCapture) {
    $__default(el)[0].addEventListener(type, listener, useCapture)
}

function off(el, type, listener, useCapture) {
    $__default(el)[0].removeEventListener(type, listener, useCapture)
}

function transition(element, props, duration, transition) {
    if ( duration === void 0 ) duration = 400;
    if ( transition === void 0 ) transition = 'linear';


    var d = $__default.Deferred();

    element = $__default(element);

    for (var name in props) {
        element.css(name, element.css(name));
    }

    var timer = setTimeout(function () { return element.trigger(transitionend || 'transitionend'); }, duration);

    element
        .one(transitionend || 'transitionend', function (e, cancel) {
            clearTimeout(timer);
            element.removeClass('uk-transition').css('transition', '');
            if (!cancel) {
                d.resolve();
            } else {
                d.reject();
            }
        })
        .addClass('uk-transition')
        .css('transition', ("all " + duration + "ms " + transition))
        .css(props);

    return d.promise();
}

var Transition = {

    start: transition,

    stop: function stop(element) {
        $__default(element).trigger(transitionend || 'transitionend');
        return this;
    },

    cancel: function cancel(element) {
        $__default(element).trigger(transitionend || 'transitionend', [true]);
        return this;
    },

    inProgress: function inProgress(element) {
        return $__default(element).hasClass('uk-transition');
    }

};

function animate(element, animation, duration, origin, out) {
    if ( duration === void 0 ) duration = 200;


    var d = $__default.Deferred(), cls = out ? 'uk-animation-leave' : 'uk-animation-enter';

    element = $__default(element);

    if (animation.lastIndexOf('uk-animation-', 0) === 0) {

        if (origin) {
            animation += " uk-animation-" + origin;
        }

        if (out) {
            animation += ' uk-animation-reverse';
        }

    }

    reset();

    element
        .one(animationend || 'animationend', function () { return d.resolve().then(reset); })
        .css('animation-duration', duration + 'ms')
        .addClass(animation)
        .addClass(cls);

    if (!animationend) {
        requestAnimationFrame$1(function () { return Animation.cancel(element); });
    }

    return d.promise();

    function reset() {
        element.css('animation-duration', '').removeClass((cls + " " + animation));
    }
}

var Animation = {

    in: function in$1(element, animation, duration, origin) {
        return animate(element, animation, duration, origin, false);
    },

    out: function out(element, animation, duration, origin) {
        return animate(element, animation, duration, origin, true);
    },

    inProgress: function inProgress(element) {
        return $__default(element).hasClass('uk-animation-enter') || $__default(element).hasClass('uk-animation-leave');
    },

    cancel: function cancel(element) {
        var deferred = $__default.Deferred();
        $__default(element).trigger(animationend || 'animationend');
        requestAnimationFrame$1(function () { return deferred.resolve(); });
        return deferred.promise();
    }

};

function isWithin(element, selector) {
    element = $__default(element);
    return element.is(selector) || !!(isString(selector) ? element.parents(selector).length : $__default.contains(selector instanceof $__default ? selector[0] : selector, element[0]));
}

function attrFilter(element, attr, pattern, replacement) {
    element = $__default(element);
    return element.attr(attr, function (i, value) { return value ? value.replace(pattern, replacement) : value; });
}

function removeClass(element, cls) {
    return attrFilter(element, 'class', new RegExp(("(^|\\s)" + cls + "(?!\\S)"), 'g'), '');
}

function createEvent(e, bubbles, cancelable) {
    if ( bubbles === void 0 ) bubbles = true;
    if ( cancelable === void 0 ) cancelable = false;

    if (isString(e)) {
        var event = document.createEvent('Event');
        event.initEvent(e, bubbles, cancelable);
        return event;
    }

    return e;
}

function isInView(element, offsetTop, offsetLeft) {
    if ( offsetTop === void 0 ) offsetTop = 0;
    if ( offsetLeft === void 0 ) offsetLeft = 0;


    element = $__default(element);

    if (!element.is(':visible')) {
        return false;
    }

    var scrollLeft = win.scrollLeft(), scrollTop = win.scrollTop();
    var ref = element.offset();
    var top = ref.top;
    var left = ref.left;

    return top + element.height() >= scrollTop
        && top - offsetTop <= scrollTop + win.height()
        && left + element.width() >= scrollLeft
        && left - offsetLeft <= scrollLeft + win.width();
}

function getIndex(index, elements, current) {
    if ( current === void 0 ) current = 0;


    elements = $__default(elements);

    var length = $__default(elements).length;

    index = (isNumber(index)
        ? index
        : index === 'next'
            ? current + 1
            : index === 'previous'
                ? current - 1
                : isString(index)
                    ? parseInt(index, 10)
                    : elements.index(index)
    ) % length;

    return index < 0 ? index + length : index;
}

var voidElements = {
    area: true,
    base: true,
    br: true,
    col: true,
    embed: true,
    hr: true,
    img: true,
    input: true,
    keygen: true,
    link: true,
    menuitem: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true
};
function isVoidElement(element) {
    element = $__default(element);
    return voidElements[element[0].tagName.toLowerCase()];
}

var Dimensions = {

    ratio: function ratio(dimensions, prop, value) {

        var aProp = prop === 'width' ? 'height' : 'width';

        return ( obj = {}, obj[aProp] = Math.round(value * dimensions[aProp] / dimensions[prop]), obj[prop] = value, obj );
        var obj;
    },

    fit: function fit(dimensions, maxDimensions) {
        var this$1 = this;

        dimensions = $.extend({}, dimensions);

        $.each(dimensions, function (prop) { return dimensions = dimensions[prop] > maxDimensions[prop] ? this$1.ratio(dimensions, prop, maxDimensions[prop]) : dimensions; });

        return dimensions;
    },

    cover: function cover(dimensions, maxDimensions) {
        var this$1 = this;

        dimensions = this.fit(dimensions, maxDimensions);

        $.each(dimensions, function (prop) { return dimensions = dimensions[prop] < maxDimensions[prop] ? this$1.ratio(dimensions, prop, maxDimensions[prop]) : dimensions; });

        return dimensions;
    }

};

function query(selector, context) {
    var selectors = getContextSelectors(selector);
    return selectors ? selectors.reduce(function (context, selector) { return toJQuery(selector, context); }, context) : toJQuery(selector);
}

var Observer = window.MutationObserver || window.WebKitMutationObserver;
var requestAnimationFrame$1 = window.requestAnimationFrame || function (fn) { return setTimeout(fn, 1000 / 60); };
var cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;

var hasTouch = 'ontouchstart' in window
    || window.DocumentTouch && document instanceof DocumentTouch
    || navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 // IE 10
    || navigator.pointerEnabled && navigator.maxTouchPoints > 0; // IE >=11

var pointerDown = !hasTouch ? 'mousedown' : window.PointerEvent ? 'pointerdown' : 'touchstart';
var pointerMove = !hasTouch ? 'mousemove' : window.PointerEvent ? 'pointermove' : 'touchmove';
var pointerUp = !hasTouch ? 'mouseup' : window.PointerEvent ? 'pointerup' : 'touchend';

var transitionend = (function () {

    var element = document.body || document.documentElement,
        names = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        }, name;

    for (name in names) {
        if (element.style[name] !== undefined) {
            return names[name];
        }
    }

})();

var animationend = (function () {

    var element = document.body || document.documentElement,
        names = {
            WebkitAnimation: 'webkitAnimationEnd',
            MozAnimation: 'animationend',
            OAnimation: 'oAnimationEnd oanimationend',
            animation: 'animationend'
        }, name;

    for (name in names) {
        if (element.style[name] !== undefined) {
            return names[name];
        }
    }

})();

var matchesFn = Element.prototype.matches
    ? 'matches'
    : Element.prototype.msMatchesSelector
        ? 'msMatchesSelector'
        : Element.prototype.webkitMatchesSelector
            ? 'webkitMatchesSelector'
            : false;
function matches(element, selector) {
    return element[matchesFn] ? element[matchesFn](selector) : false;
}

function getStyle(element, property, pseudoElt) {
    return (window.getComputedStyle(element, pseudoElt) || {})[property];
}

function getCssVar(name) {

    /* usage in css:  .var-name:before { content:"xyz" } */

    var val, doc = document.documentElement,
        element = doc.appendChild(document.createElement('div'));

    element.classList.add(("var-" + name));

    try {

        val = getStyle(element, 'content', ':before').replace(/^["'](.*)["']$/, '$1');
        val = JSON.parse(val);

    } catch (e) {}

    doc.removeChild(element);

    return val || undefined;
}

// Copyright (c) 2016 Wilson Page wilsonpage@me.com
// https://github.com/wilsonpage/fastdom

/**
 * Initialize a `FastDom`.
 *
 * @constructor
 */
function FastDom() {
    var self = this;
    self.reads = [];
    self.writes = [];
    self.raf = requestAnimationFrame$1.bind(window); // test hook
}

FastDom.prototype = {
    constructor: FastDom,

    /**
     * Adds a job to the read batch and
     * schedules a new frame if need be.
     *
     * @param  {Function} fn
     * @public
     */
    measure: function(fn, ctx) {
        var task = !ctx ? fn : fn.bind(ctx);
        this.reads.push(task);
        scheduleFlush(this);
        return task;
    },

    /**
     * Adds a job to the
     * write batch and schedules
     * a new frame if need be.
     *
     * @param  {Function} fn
     * @public
     */
    mutate: function(fn, ctx) {
        var task = !ctx ? fn : fn.bind(ctx);
        this.writes.push(task);
        scheduleFlush(this);
        return task;
    },

    /**
     * Clears a scheduled 'read' or 'write' task.
     *
     * @param {Object} task
     * @return {Boolean} success
     * @public
     */
    clear: function(task) {
        return remove(this.reads, task) || remove(this.writes, task);
    },

    /**
     * Extend this FastDom with some
     * custom functionality.
     *
     * Because fastdom must *always* be a
     * singleton, we're actually extending
     * the fastdom instance. This means tasks
     * scheduled by an extension still enter
     * fastdom's global task queue.
     *
     * The 'super' instance can be accessed
     * from `this.fastdom`.
     *
     * @example
     *
     * var myFastdom = fastdom.extend({
   *   initialize: function() {
   *     // runs on creation
   *   },
   *
   *   // override a method
   *   measure: function(fn) {
   *     // do extra stuff ...
   *
   *     // then call the original
   *     return this.fastdom.measure(fn);
   *   },
   *
   *   ...
   * });
     *
     * @param  {Object} props  properties to mixin
     * @return {FastDom}
     */
    extend: function(props) {
        if (typeof props != 'object') { throw new Error('expected object'); }

        var child = Object.create(this);
        mixin(child, props);
        child.fastdom = this;

        // run optional creation hook
        if (child.initialize) { child.initialize(); }

        return child;
    },

    // override this with a function
    // to prevent Errors in console
    // when tasks throw
    catch: null
};

/**
 * Schedules a new read/write
 * batch if one isn't pending.
 *
 * @private
 */
function scheduleFlush(fastdom) {
    if (!fastdom.scheduled) {
        fastdom.scheduled = true;
        fastdom.raf(flush.bind(null, fastdom));
    }
}

/**
 * Runs queued `read` and `write` tasks.
 *
 * Errors are caught and thrown by default.
 * If a `.catch` function has been defined
 * it is called instead.
 *
 * @private
 */
function flush(fastdom) {

    var writes = fastdom.writes;
    var reads = fastdom.reads;
    var error;

    try {
        runTasks(reads);
        runTasks(writes);
    } catch (e) { error = e; }

    fastdom.scheduled = false;

    // If the batch errored we may still have tasks queued
    if (reads.length || writes.length) { scheduleFlush(fastdom); }

    if (error) {
        if (fastdom.catch) { fastdom.catch(error); }
        else { throw error; }
    }
}

/**
 * We run this inside a try catch
 * so that if any jobs error, we
 * are able to recover and continue
 * to flush the batch until it's empty.
 *
 * @private
 */
function runTasks(tasks) {
    var task; while (task = tasks.shift()) { task(); }
}

/**
 * Remove an item from an Array.
 *
 * @param  {Array} array
 * @param  {*} item
 * @return {Boolean}
 */
function remove(array, item) {
    var index = array.indexOf(item);
    return !!~index && !!array.splice(index, 1);
}

/**
 * Mixin own properties of source
 * object into the target.
 *
 * @param  {Object} target
 * @param  {Object} source
 */
function mixin(target, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) { target[key] = source[key]; }
    }
}

var fastdom = new FastDom();

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

function classify(str) {
    return str.replace(/(?:^|[-_\/])(\w)/g, function (_, c) { return c ? c.toUpperCase() : ''; });
}

function hyphenate(str) {
    return str
        .replace(/([a-z\d])([A-Z])/g, '$1-$2')
        .toLowerCase()
}

var camelizeRE = /-(\w)/g;
function camelize(str) {
    return str.replace(camelizeRE, toUpper)
}

function toUpper(_, c) {
    return c ? c.toUpperCase() : ''
}

function isString(value) {
    return typeof value === 'string';
}

function isNumber(value) {
    return typeof value === 'number';
}

function isContextSelector(selector) {
    return isString(selector) && selector.match(/^(!|>|\+|-)/);
}

function getContextSelectors(selector) {
    return isContextSelector(selector) && selector.split(/(?=\s(?:!|>|\+|-))/g).map(function (value) { return value.trim(); });
}

var contextSelectors = {'!': 'closest', '+': 'nextAll', '-': 'prevAll'};
function toJQuery(element, context) {

    if (element === true) {
        return null;
    }

    try {

        if (context && isContextSelector(element) && element[0] !== '>') {
            element = $__default(context)[contextSelectors[element[0]]](element.substr(1));
        } else {
            element = $__default(element, context);
        }

    } catch (e) {
        return null;
    }

    return element.length ? element : null;
}

function toBoolean(value) {
    return typeof value === 'boolean'
        ? value
        : value === 'true' || value == '1' || value === ''
            ? true
            : value === 'false' || value == '0'
                ? false
                : value;
}

function toNumber(value) {
    var number = Number(value);
    return !isNaN(number) ? number : false;
}

var vars = {};
function toMedia(value) {
    if (isString(value) && value[0] == '@') {
        var name = "media-" + (value.substr(1));
        value = vars[name] || (vars[name] = parseFloat(getCssVar(name)));
    }

    return value && !isNaN(value) ? ("(min-width: " + value + "px)") : false;
}

function coerce(type, value, context) {

    if (type === Boolean) {
        return toBoolean(value);
    } else if (type === Number) {
        return toNumber(value);
    } else if (type === 'jQuery') {
        return query(value, context);
    } else if (type === 'media') {
        return toMedia(value);
    }

    return type ? type(value) : value;
}

var strats = {};

// concat strategy
strats.created =
strats.init =
strats.ready =
strats.update =
strats.connected =
strats.disconnected =
strats.destroy = function (parentVal, childVal) {
    return childVal
        ? parentVal
            ? parentVal.concat(childVal)
            : $.isArray(childVal)
                ? childVal
                : [childVal]
        : parentVal;
};

// events strategy
strats.events = function (parentVal, childVal) {

    if (!childVal) {
        return parentVal;
    }

    if (!parentVal) {
        return childVal;
    }

    var ret = $.extend({}, parentVal);

    for (var key in childVal) {
        var parent = ret[key], child = childVal[key];

        if (parent && !$.isArray(parent)) {
            parent = [parent]
        }

        ret[key] = parent
            ? parent.concat(child)
            : [child]
    }

    return ret;
};

// property strategy
strats.props = function (parentVal, childVal) {

    if ($.isArray(childVal)) {
        var ret = {};
        childVal.forEach(function (val) {
            ret[val] = String;
        });
        childVal = ret;
    }

    return strats.methods(parentVal, childVal);
};

// extend strategy
strats.defaults =
strats.methods = function (parentVal, childVal) {
    return childVal
        ? parentVal
            ? $.extend({}, parentVal, childVal)
            : childVal
        : parentVal;
};

// default strategy
var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
};

function mergeOptions (parent, child, thisArg) {

    var options = {}, key;

    if (child.mixins) {
        for (var i = 0, l = child.mixins.length; i < l; i++) {
            parent = mergeOptions(parent, child.mixins[i], thisArg);
        }
    }

    for (key in parent) {
        mergeKey(key);
    }

    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeKey(key);
        }
    }

    function mergeKey (key) {
        options[key] = (strats[key] || defaultStrat)(parent[key], child[key], thisArg, key);
    }

    return options;
}

var dirs = {
    x: ['width', 'left', 'right'],
    y: ['height', 'top', 'bottom']
};

function position(element, target, attach, targetAttach, offset, targetOffset, flip, boundary) {

    element = $__default(element);
    target = $__default(target);
    boundary = boundary && $__default(boundary);
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

    var flipped = {element: attach, target: targetAttach};

    if (flip) {
        $__default.each(dirs, function (dir, ref) {
            var prop = ref[0];
            var align = ref[1];
            var alignFlip = ref[2];


            if (!(flip === true || ~flip.indexOf(dir))) {
                return;
            }

            var elemOffset = attach[dir] === align ? -dim[prop] : attach[dir] === alignFlip ? dim[prop] : 0,
                targetOffset = targetAttach[dir] === align ? targetDim[prop] : targetAttach[dir] === alignFlip ? -targetDim[prop] : 0;

            if (position[align] < boundary[align] || position[align] + dim[prop] > boundary[alignFlip]) {

                var newVal = position[align] + elemOffset + targetOffset - offset[dir] * 2;

                if (newVal >= boundary[align] && newVal + dim[prop] <= boundary[alignFlip]) {
                    position[align] = newVal;

                    ['element', 'target'].forEach(function (el) {
                        flipped[el][dir] = !elemOffset
                            ? flipped[el][dir]
                            : flipped[el][dir] === dirs[dir][1]
                                ? dirs[dir][2]
                                : dirs[dir][1];
                    });
                }
            }

        });
    }

    element.offset({left: position.left, top: position.top});

    return flipped;
}

function getDimensions(elem) {

    elem = $__default(elem);

    var width = Math.round(elem.outerWidth()),
        height = Math.round(elem.outerHeight()),
        offset = elem[0].getClientRects ? elem.offset() : null,
        left = offset ? Math.round(offset.left) : elem.scrollLeft(),
        top = offset ? Math.round(offset.top) : elem.scrollTop();

    return {width: width, height: height, left: left, top: top, right: left + width, bottom: top + height};
}

function moveTo(position, attach, dim, factor) {
    $__default.each(dirs, function (dir, ref) {
        var prop = ref[0];
        var align = ref[1];
        var alignFlip = ref[2];

        if (attach[dir] === alignFlip) {
            position[align] += dim[prop] * factor;
        } else if (attach[dir] === 'center') {
            position[align] += dim[prop] * factor / 2;
        }
    });
}

function getPos(pos) {

    var x = /left|center|right/, y = /top|center|bottom/;

    pos = (pos || '').split(' ');

    if (pos.length === 1) {
        pos = x.test(pos[0])
            ? pos.concat(['center'])
            : y.test(pos[0])
                ? ['center'].concat(pos)
                : ['center', 'center'];
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

// Copyright (c) 2010-2016 Thomas Fuchs
// http://zeptojs.com/

var touch = {};
var touchTimeout;
var tapTimeout;
var swipeTimeout;
var longTapTimeout;
var longTapDelay = 750;
var gesture;
var clicked;
function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
}

function longTap() {
    longTapTimeout = null;
    if (touch.last) {
        if (touch.el !== undefined) { touch.el.trigger('longTap'); }
        touch = {};
    }
}

function cancelLongTap() {
    if (longTapTimeout) { clearTimeout(longTapTimeout); }
    longTapTimeout = null;
}

function cancelAll() {
    if (touchTimeout)   { clearTimeout(touchTimeout); }
    if (tapTimeout)     { clearTimeout(tapTimeout); }
    if (swipeTimeout)   { clearTimeout(swipeTimeout); }
    if (longTapTimeout) { clearTimeout(longTapTimeout); }
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
    touch = {};
}

ready(function () {
    var now, delta, deltaX = 0, deltaY = 0, firstTouch;

    if ('MSGesture' in window) {
        gesture = new MSGesture();
        gesture.target = document.body;
    }

    document.addEventListener('click', function () { return clicked = true; }, true);

    doc

        .on('MSGestureEnd gestureend', function (e) {

            var swipeDirectionFromVelocity = e.originalEvent.velocityX > 1 ? 'Right' : e.originalEvent.velocityX < -1 ? 'Left' : e.originalEvent.velocityY > 1 ? 'Down' : e.originalEvent.velocityY < -1 ? 'Up' : null;

            if (swipeDirectionFromVelocity && touch.el !== undefined) {
                touch.el.trigger('swipe');
                touch.el.trigger('swipe' + swipeDirectionFromVelocity);
            }
        })
        .on(pointerDown, function (e) {

            firstTouch = e.originalEvent.touches ? e.originalEvent.touches[0] : e;

            now = Date.now();
            delta = now - (touch.last || now);
            touch.el = $__default('tagName' in firstTouch.target ? firstTouch.target : firstTouch.target.parentNode);

            if (touchTimeout) { clearTimeout(touchTimeout); }

            touch.x1 = firstTouch.pageX;
            touch.y1 = firstTouch.pageY;

            if (delta > 0 && delta <= 250) { touch.isDoubleTap = true; }

            touch.last = now;
            longTapTimeout = setTimeout(longTap, longTapDelay);

            // adds the current touch contact for IE gesture recognition
            if (gesture && ( e.type == 'pointerdown' || e.type == 'touchstart' )) {
                gesture.addPointer(e.originalEvent.pointerId);
            }

            clicked = false;

        })
        .on(pointerMove, function (e) {

            firstTouch = e.originalEvent.touches ? e.originalEvent.touches[0] : e;

            cancelLongTap();
            touch.x2 = firstTouch.pageX;
            touch.y2 = firstTouch.pageY;

            deltaX += Math.abs(touch.x1 - touch.x2);
            deltaY += Math.abs(touch.y1 - touch.y2);
        })
        .on(pointerUp, function () {

            cancelLongTap();

            // swipe
            if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {

                swipeTimeout = setTimeout(function () {
                    if (touch.el !== undefined) {
                        touch.el.trigger('swipe');
                        touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
                    }
                    touch = {};
                }, 0);

                // normal tap
            } else if ('last' in touch) {

                // don't fire tap when delta position changed by more than 30 pixels,
                // for instance when moving to a point and back to origin
                if (isNaN(deltaX) || (deltaX < 30 && deltaY < 30)) {
                    // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
                    // ('tap' fires before 'scroll')
                    tapTimeout = setTimeout(function () {

                        // trigger universal 'tap' with the option to cancelTouch()
                        // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
                        var event = $__default.Event('tap');
                        event.cancelTouch = cancelAll;

                        if (touch.el !== undefined) {
                            touch.el.trigger(event);
                        }

                        // trigger double tap immediately
                        if (touch.isDoubleTap) {
                            if (touch.el !== undefined) { touch.el.trigger('doubleTap'); }
                            touch = {};
                        }

                        // trigger single tap after 300ms of inactivity
                        else {
                            touchTimeout = setTimeout(function () {
                                touchTimeout = null;
                                if (touch.el !== undefined) {
                                    touch.el.trigger('singleTap');

                                    if (!clicked) {
                                        touch.el.trigger('click');
                                    }

                                }
                                touch = {};
                            }, 300);
                        }
                    });
                } else {
                    touch = {};
                }
                deltaX = deltaY = 0;
            }
        })
        // when the browser window loses focus,
        // for example when a modal dialog is shown,
        // cancel all ongoing events
        .on('touchcancel pointercancel', cancelAll);

    // scrolling the window indicates intention of the user
    // to scroll, not tap or swipe, so cancel all ongoing events
    win.on('scroll', cancelAll);
});



var util = Object.freeze({
	win: win,
	doc: doc,
	langDirection: langDirection,
	isReady: isReady,
	ready: ready,
	on: on,
	off: off,
	transition: transition,
	Transition: Transition,
	animate: animate,
	Animation: Animation,
	isWithin: isWithin,
	attrFilter: attrFilter,
	removeClass: removeClass,
	createEvent: createEvent,
	isInView: isInView,
	getIndex: getIndex,
	isVoidElement: isVoidElement,
	Dimensions: Dimensions,
	query: query,
	Observer: Observer,
	requestAnimationFrame: requestAnimationFrame$1,
	cancelAnimationFrame: cancelAnimationFrame,
	hasTouch: hasTouch,
	pointerDown: pointerDown,
	pointerMove: pointerMove,
	pointerUp: pointerUp,
	transitionend: transitionend,
	animationend: animationend,
	matches: matches,
	getStyle: getStyle,
	getCssVar: getCssVar,
	fastdom: fastdom,
	$: $__default,
	bind: bind,
	hasOwn: hasOwn,
	classify: classify,
	hyphenate: hyphenate,
	camelize: camelize,
	isString: isString,
	isNumber: isNumber,
	isContextSelector: isContextSelector,
	getContextSelectors: getContextSelectors,
	toJQuery: toJQuery,
	toBoolean: toBoolean,
	toNumber: toNumber,
	toMedia: toMedia,
	coerce: coerce,
	ajax: $.ajax,
	each: $.each,
	extend: $.extend,
	map: $.map,
	merge: $.merge,
	isArray: $.isArray,
	isNumeric: $.isNumeric,
	isFunction: $.isFunction,
	isPlainObject: $.isPlainObject,
	mergeOptions: mergeOptions,
	position: position,
	getDimensions: getDimensions,
	flipPosition: flipPosition
});

function bootAPI (UIkit) {

    if (Observer) {

        if (document.body) {

            init();

        } else {

            (new Observer(function () {

                if (document.body) {
                    this.disconnect();
                    init();
                }

            })).observe(document.documentElement, {childList: true});

        }

    } else {

        ready(function () {
            apply(document.body, connect);
            on(document.body, 'DOMNodeInserted', function (e) { return apply(e.target, UIkit.connect); });
            on(document.body, 'DOMNodeRemoved', function (e) { return apply(e.target, UIkit.disconnect); });
        });

    }

    function init() {

        var forEach = Array.prototype.forEach;

        apply(document.body, UIkit.connect);

        (new Observer(function (mutations) { return mutations.forEach(function (mutation) {
                forEach.call(mutation.addedNodes, function (node) { return apply(node, UIkit.connect); });
                forEach.call(mutation.removedNodes, function (node) { return apply(node, UIkit.disconnect); });
            }); }
        )).observe(document.body, {childList: true, subtree: true});

    }

    function apply(node, fn) {

        if (node.nodeType !== Node.ELEMENT_NODE || node.hasAttribute('uk-no-boot')) {
            return;
        }

        fn(node);
        node = node.firstChild;
        while (node) {
            var next = node.nextSibling;
            apply(node, fn);
            node = next;
        }
    }

}

function globalAPI (UIkit) {

    UIkit.use = function (plugin) {

        if (plugin.installed) {
            return;
        }

        plugin.call(null, this);
        plugin.installed = true;

        return this;
    };

    UIkit.mixin = function (mixin, component) {
        component = (isString(component) ? UIkit.components[component] : component) || this;
        component.options = mergeOptions(component.options, mixin);
    };

    UIkit.extend = function (options) {

        options = options || {};

        var Super = this, name = options.name || Super.options.name;
        var Sub = createClass(name || 'UIkitComponent');

        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(Super.options, options);

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

    var container;
    Object.defineProperty(UIkit, 'container', {

        get: function get() {
            return container || document.body;
        },

        set: function set(element) {
            container = element;
        }

    });

}

function createClass(name) {
    return new Function(("return function " + (classify(name)) + " (options) { this._init(options); }"))();
}

function internalAPI (UIkit) {

    var uid = 0;

    UIkit.prototype.props = {};

    UIkit.prototype._init = function (options) {

        options = options || {};
        options = this.$options = mergeOptions(this.constructor.options, options, this);

        UIkit.instances[uid] = this;

        this.$el = null;
        this.$name = UIkit.prefix + hyphenate(this.$options.name);

        this._uid = uid++;
        this._initData();
        this._initMethods();
        this._callHook('created');

        this._frames = {reads: {}, writes: {}};

        if (options.el) {
            this.$mount(options.el);
        }
    };

    UIkit.prototype._initData = function () {
        var this$1 = this;


        var defaults = $.extend(true, {}, this.$options.defaults),
            data = this.$options.data || {},
            props = this.$options.props || {};

        if (!defaults) {
            return;
        }

        for (var key in defaults) {
            this$1[key] = hasOwn(data, key) ? coerce(props[key], data[key], this$1.$options.el) : defaults[key];
        }
    };

    UIkit.prototype._initProps = function () {
        var this$1 = this;


        var el = this.$el[0],
            props = this.$options.props || {},
            options = el.getAttribute(this.$name),
            key, prop;

        if (!props) {
            return;
        }

        for (key in props) {
            prop = hyphenate(key);
            if (el.hasAttribute(prop)) {

                var value = coerce(props[key], el.getAttribute(prop), el);

                if (prop === 'target' && (!value || value.lastIndexOf('_', 0) === 0)) {
                    continue;
                }

                this$1[key] = value;
            }
        }

        if (!options) {
            return;
        }

        if (options[0] === '{') {
            try {
                options = JSON.parse(options);
            } catch (e) {
                console.warn("Invalid JSON.");
                options = {};
            }
        } else {
            var tmp = {};
            options.split(';').forEach(function (option) {
                var ref = option.split(/:(.+)/);
                var key = ref[0];
                var value = ref[1];
                if (key && value) {
                    tmp[key.trim()] = value.trim();
                }
            });
            options = tmp;
        }

        for (key in options || {}) {
            prop = camelize(key);
            if (props[prop] !== undefined) {
                this$1[prop] = coerce(props[prop], options[key], el);
            }
        }

    };

    UIkit.prototype._initMethods = function () {
        var this$1 = this;


        var methods = this.$options.methods;

        if (methods) {
            for (var key in methods) {
                this$1[key] = bind(methods[key], this$1);
            }
        }
    };

    UIkit.prototype._initEvents = function () {
        var this$1 = this;


        var events = this.$options.events,
            register = function (name, fn) { return this$1.$el.on(name, isString(fn) ? this$1[fn] : bind(fn, this$1)); };

        if (events) {
            for (var key in events) {

                if ($.isArray(events[key])) {
                    events[key].forEach(function (event) { return register(key, event); });
                } else {
                    register(key, events[key]);
                }

            }
        }
    };

    UIkit.prototype._callReady = function () {
        this._isReady = true;
        this._callHook('ready');
        this._callUpdate();
    };

    UIkit.prototype._callHook = function (hook) {
        var this$1 = this;


        var handlers = this.$options[hook];

        if (handlers) {
            handlers.forEach(function (handler) { return handler.call(this$1); });
        }
    };

    UIkit.prototype._callUpdate = function (e) {
        var this$1 = this;


        e = createEvent(e || 'update');

        var updates = this.$options.update;

        if (!updates) {
            return;
        }

        updates.forEach(function (update, i) {

            if (!$.isPlainObject) {
                update.call(this$1, e);
                return;
            }

            if (e.type !== 'update' && (!update.events || !~update.events.indexOf(e.type))) {
                return;
            }

            if (update.read && !~fastdom.reads.indexOf(this$1._frames.reads[i])) {
                this$1._frames.reads[i] = fastdom.measure(function () { return update.read.call(this$1, e); });
            }

            if (update.write && !~fastdom.writes.indexOf(this$1._frames.writes[i])) {
                this$1._frames.writes[i] = fastdom.mutate(function () { return update.write.call(this$1, e); });
            }

        });

    };

}

function instanceAPI (UIkit) {

    var DATA = UIkit.data;

    UIkit.prototype.$mount = function (el) {
        var this$1 = this;


        var name = this.$options.name;

        if (!el[DATA]) {
            el[DATA] = {};
            UIkit.elements.push(el);
        }

        if (el[DATA][name]) {
            console.warn(("Component \"" + name + "\" is already mounted on element: "), el);
            return;
        }

        el[DATA][name] = this;

        this.$el = $__default(el);

        this._initProps();

        this._callHook('init');

        this._initEvents();

        if (document.documentElement.contains(this.$el[0])) {
            this._callHook('connected');
        }

        ready(function () { return this$1._callReady(); });

    };

    UIkit.prototype.$update = function (e, element) {

        element = element ? $__default(element)[0] : this.$el[0];

        UIkit.elements.forEach(function (el) {
            if (el[DATA] && (el === element || $__default.contains(element, el))) {
                for (var name in el[DATA]) {
                    el[DATA][name]._callUpdate(e);
                }
            }
        });
    };

    UIkit.prototype.$updateParents = function (e, element) {

        element = element ? $__default(element)[0] : this.$el[0];

        UIkit.elements.forEach(function (el) {
            if (el[DATA] && (el === element || $__default.contains(el, element))) {
                for (var name in el[DATA]) {
                    el[DATA][name]._callUpdate(e);
                }
            }
        });
    };

    UIkit.prototype.$destroy = function (remove) {
        if ( remove === void 0 ) remove = false;


        this._callHook('destroy');

        delete UIkit.instances[this._uid];

        var el = this.$options.el;

        if (!el || !el[DATA]) {
            return;
        }

        delete el[DATA][this.$options.name];

        if (!Object.keys(el[DATA]).length) {
            delete el[DATA];

            var index = UIkit.elements.indexOf(el);

            if (~index) {
                UIkit.elements.splice(index, 1);
            }
        }

        if (remove) {
            this.$el.remove();
        }
    };

}

function componentAPI (UIkit) {

    var DATA = UIkit.data;

    UIkit.components = {};

    UIkit.component = function (name, options) {

        var selector = "[uk-" + name + "]";

        UIkit.component.selector = (((UIkit.component.selector) + ",") || '') + selector;

        name = camelize(name);

        if ($.isPlainObject(options)) {
            options.name = name;
            options = UIkit.extend(options);
        } else {
            options.options.name = name
        }

        UIkit.components[name] = options;

        UIkit[name] = function (element, data) {

            if ($.isPlainObject(element)) {
                return new UIkit.components[name]({data: element});
            }

            var result = [];

            data = data || {};

            $__default(element).each(function (i, el) { return result.push(el[DATA] && el[DATA][name] || new UIkit.components[name]({el: el, data: data})); });

            return result;
        };

        if (document.body) {
            UIkit[name](selector)
        }

        return UIkit.components[name];
    };

    UIkit.getComponents = function (element) { return element && element[DATA] || {}; };
    UIkit.getComponent = function (element, name) { return UIkit.getComponents(element)[name]; };

    UIkit.connect = function (node) {

        if (node[DATA]) {

            if (!~UIkit.elements.indexOf(node)) {
                UIkit.elements.push(node);
            }

            for (var name in node[DATA]) {

                var component = node[DATA][name];
                if (!(component._uid in UIkit.instances)) {
                    UIkit.instances[component._uid] = component;
                    component._callHook('connected');
                }

            }
        }

        if (!matches(node, UIkit.component.selector)) {
            return;
        }

        for (var i = 0, name; i < node.attributes.length; i++) {

            name = node.attributes[i].name;

            if (name.lastIndexOf('uk-', 0) === 0) {
                name = camelize(name.replace('uk-', ''));

                if (UIkit[name]) {
                    UIkit[name](node);
                }
            }
        }

    };

    UIkit.disconnect = function (node) {

        var index = UIkit.elements.indexOf(node);

        if (~index) {
            UIkit.elements.splice(index, 1);
        }

        for (var name in node[DATA]) {
            var component = node[DATA][name];
            if (component._uid in UIkit.instances) {
                delete UIkit.instances[component._uid];
                component._callHook('disconnected');
            }
        }

    }

}

var UIkit = function (options) {
    this._init(options);
};

UIkit.util = util;
UIkit.data = '__uikit__';
UIkit.prefix = 'uk-';
UIkit.options = {};
UIkit.instances = {};
UIkit.elements = [];

globalAPI(UIkit);
internalAPI(UIkit);
instanceAPI(UIkit);
componentAPI(UIkit);
bootAPI(UIkit);

var Class = {

    init: function init() {
        this.$el.addClass(this.$name);
    }

}

var initProps = {
        overflow: '',
        height: '',
        paddingTop: '',
        paddingBottom: '',
        marginTop: '',
        marginBottom: ''
    };
var hideProps = {
        overflow: 'hidden',
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0
    };
var Toggable = {

    props: {
        cls: Boolean,
        animation: Boolean,
        duration: Number,
        origin: String,
        transition: String,
        queued: Boolean
    },

    defaults: {
        cls: false,
        animation: false,
        duration: 200,
        origin: false,
        transition: 'linear',
        queued: false
    },

    ready: function ready() {

        if (isString(this.animation)) {

            this.animation = this.animation.split(',');

            if (this.animation.length === 1) {
                this.animation[1] = this.animation[0];
            }

            this.animation = this.animation.map(function (animation) { return animation.trim(); });

        }

        this.queued = this.queued && !!this.animation;

    },

    methods: {

        toggleElement: function toggleElement(targets, show, animate) {
            var this$1 = this;


            var toggles, body = document.body, scroll = body.scrollTop,
                all = function (targets) { return $__default.when.apply($__default, targets.toArray().map(function (el) { return this$1._toggleElement(el, show, animate); })); },
                delay = function (targets) {
                    var def = all(targets);
                    this$1.queued = true;
                    body.scrollTop = scroll;
                    return def;
                };

            targets = $__default(targets);

            if (!this.queued || targets.length < 2) {
                return all(targets);
            }

            if (this.queued !== true) {
                return delay(targets.not(this.queued));
            }

            this.queued = targets.not(toggles = targets.filter(function (_, el) { return this$1.isToggled(el); }));

            return all(toggles).then(function () { return this$1.queued !== true && delay(this$1.queued); });
        },

        toggleNow: function toggleNow(targets, show) {
            var this$1 = this;

            $__default(targets).each(function (_, el) { return this$1._toggleElement(el, show, false); });
        },

        isToggled: function isToggled(el) {
            el = $__default(el);
            return this.cls ? el.hasClass(this.cls.split(' ')[0]) : !el.attr('hidden');
        },

        updateAria: function updateAria(el) {
            if (this.cls === false) {
                el.attr('aria-hidden', !this.isToggled(el));
            }
        },

        _toggleElement: function _toggleElement(el, show, animate) {
            var this$1 = this;


            el = $__default(el);

            var deferred;

            if (Animation.inProgress(el)) {
                return Animation.cancel(el).then(function () { return this$1._toggleElement(el, show, animate); });
            }

            show = typeof show === 'boolean' ? show : !this.isToggled(el);

            var event = $__default.Event(("before" + (show ? 'show' : 'hide')));
            el.trigger(event, [this]);

            if (event.result === false) {
                return $__default.Deferred().reject();
            }

            deferred = (this.animation === true && animate !== false
                ? this._toggleHeight
                : this.animation && animate !== false
                    ? this._toggleAnimation
                    : this._toggleImmediate
            )(el, show);

            el.trigger(show ? 'show' : 'hide', [this]);
            return deferred;
        },

        _toggle: function _toggle(el, toggled) {
            el = $__default(el);

            if (this.cls) {
                el.toggleClass(this.cls, ~this.cls.indexOf(' ') ? undefined : toggled);
            } else {
                el.attr('hidden', !toggled);
            }

            el.find('[autofocus]:visible').focus();

            this.updateAria(el);
            this.$update(null, el);
        },

        _toggleImmediate: function _toggleImmediate(el, show) {
            this._toggle(el, show);
            return $__default.Deferred().resolve();
        },

        _toggleHeight: function _toggleHeight(el, show) {
            var this$1 = this;


            var inProgress = Transition.inProgress(el),
                inner = parseFloat(el.children().first().css('margin-top')) + parseFloat(el.children().last().css('margin-bottom')),
                height = el[0].offsetHeight ? el.height() + (inProgress ? 0 : inner) : 0,
                endHeight;

            Transition.cancel(el);

            if (!this.isToggled(el)) {
                this._toggle(el, true);
            }

            el.css('height', '');
            endHeight = el.height() + (inProgress ? 0 : inner);
            el.height(height);

            return show
                ? Transition.start(el, $.extend(initProps, {overflow: 'hidden', height: endHeight}), Math.round(this.duration * (1 - height / endHeight)), this.transition)
                : Transition.start(el, hideProps, Math.round(this.duration * (height / endHeight)), this.transition).then(function () {
                        this$1._toggle(el, false);
                        el.css(initProps);
                    });

        },

        _toggleAnimation: function _toggleAnimation(el, show) {
            var this$1 = this;


            if (show) {
                this._toggle(el, true);
                return Animation.in(el, this.animation[0], this.duration, this.origin);
            }

            return Animation.out(el, this.animation[1], this.duration, this.origin).then(function () { return this$1._toggle(el, false); });
        }

    }

};

var active;

doc.on({

    click: function click(e) {
        if (active && active.bgClose && !e.isDefaultPrevented() && !isWithin(e.target, active.panel)) {
            active.hide();
        }
    },

    keydown: function keydown(e) {
        if (e.keyCode === 27 && active && active.escClose) {
            e.preventDefault();
            active.hide();
        }
    }

});

var Modal = {

    mixins: [Class, Toggable],

    props: {
        clsPanel: String,
        selClose: String,
        escClose: Boolean,
        bgClose: Boolean,
        stack: Boolean
    },

    defaults: {
        cls: 'uk-open',
        escClose: true,
        bgClose: true,
        overlay: true,
        stack: false
    },

    ready: function ready() {
        var this$1 = this;


        this.page = $__default(document.documentElement);
        this.body = $__default(document.body);
        this.panel = toJQuery(("." + (this.clsPanel)), this.$el);

        this.$el.on('click', this.selClose, function (e) {
            e.preventDefault();
            this$1.hide();
        });

    },

    events: {

        toggle: function toggle(e) {
            e.preventDefault();
            this.toggleNow(this.$el);
        },

        beforeshow: function beforeshow(e) {
            var this$1 = this;


            if (!this.$el.is(e.target)) {
                return;
            }

            if (this.isActive()) {
                return false;
            }

            var prev = active && active !== this && active;

            if (!active) {
                this.body.css('overflow-y', this.getScrollbarWidth() && this.overlay ? 'scroll' : '');
            }

            active = this;

            if (prev) {
                if (this.stack) {
                    this.prev = prev;
                } else {
                    prev.hide();
                }
            }

            this.panel.one(transitionend, function () {
                var event = $__default.Event('show');
                event.isShown = true;
                this$1.$el.trigger(event, [this$1]);
            });

        },

        show: function show(e) {

            if (!this.$el.is(e.target)) {
                return;
            }

            if (!e.isShown) {
                e.stopImmediatePropagation();
            }

        },

        beforehide: function beforehide(e) {
            var this$1 = this;


            if (!this.$el.is(e.target)) {
                return;
            }

            active = active && active !== this && active || this.prev;

            this.panel.one(transitionend, function () {
                var event = $__default.Event('hide');
                event.isHidden = true;
                this$1.$el.trigger(event, [this$1]);
            });

        },

        hide: function hide(e) {

            if (!this.$el.is(e.target)) {
                return;
            }

            if (!e.isHidden) {
                e.stopImmediatePropagation();
                return;
            }

            if (!active) {
                this.body.css('overflow-y', '');
            }

        }

    },

    methods: {

        isActive: function isActive() {
            return this.$el.hasClass(this.cls);
        },

        toggle: function toggle() {
            return this.isActive() ? this.hide() : this.show();
        },

        show: function show() {
            var deferred = $__default.Deferred();
            this.$el.one('show', function () { return deferred.resolve(); });
            this.toggleNow(this.$el, true);
            return deferred.promise();
        },

        hide: function hide() {
            var deferred = $__default.Deferred();
            this.$el.one('hide', function () { return deferred.resolve(); });
            this.toggleNow(this.$el, false);
            return deferred.promise();
        },

        getActive: function getActive() {
            return active;
        },

        getScrollbarWidth: function getScrollbarWidth() {
            var width = this.page[0].style.width;

            this.page.css('width', '');

            var scrollbarWidth = window.innerWidth - this.page.width();

            if (width) {
                this.page.width(width);
            }

            return scrollbarWidth;
        }
    }

}

var Mouse = {

    defaults: {

        positions: [],
        position: null

    },

    methods: {

        initMouseTracker: function initMouseTracker() {
            var this$1 = this;


            this.positions = [];
            this.position = null;

            this.mouseHandler = function (e) {
                this$1.positions.push({x: e.pageX, y: e.pageY});

                if (this$1.positions.length > 5) {
                    this$1.positions.shift();
                }
            };

            doc.on('mousemove', this.mouseHandler);

        },

        cancelMouseTracker: function cancelMouseTracker() {
            if (this.mouseHandler) {
                doc.off('mousemove', this.mouseHandler);
            }
        },

        movesTo: function movesTo(target) {

            var p = getDimensions(target),
                points = [
                    [{x: p.left, y: p.top}, {x: p.right, y: p.bottom}],
                    [{x: p.right, y: p.top}, {x: p.left, y: p.bottom}]
                ],
                position = this.positions[this.positions.length - 1],
                prevPos = this.positions[0] || position;

            if (!position) {
                return false;
            }

            if (p.right <= position.x) {

            } else if (p.left >= position.x) {
                points[0].reverse();
                points[1].reverse();
            } else if (p.bottom <= position.y) {
                points[0].reverse();
            } else if (p.top >= position.y) {
                points[1].reverse();
            }

            var delay = position
                && !(this.position && position.x === this.position.x && position.y === this.position.y)
                && points.reduce(function (result, point) {
                    return result + (slope(prevPos, point[0]) < slope(position, point[0]) && slope(prevPos, point[1]) > slope(position, point[1]));
                }, 0);

            this.position = delay ? position : null;
            return delay;
        }

    }

}

function slope(a, b) {
    return (b.y - a.y) / (b.x - a.x);
}

var Position = {

    props: {
        pos: String,
        offset: null,
        flip: Boolean,
        clsPos: String
    },

    defaults: {
        pos: 'bottom-left',
        flip: true,
        offset: false,
        clsPos: ''
    },

    init: function init() {
        this.pos = (this.pos + (!~this.pos.indexOf('-') ? '-center' : '')).split('-');
        this.dir = this.pos[0];
        this.align = this.pos[1];
    },

    methods: {

        positionAt: function positionAt(element, target, boundary) {

            removeClass(element, this.clsPos + '-(top|bottom|left|right)(-[a-z]+)?').css({top: '', left: ''});

            this.dir = this.pos[0];
            this.align = this.pos[1];

            var offset = toNumber(this.offset) || 0,
                axis = this.getAxis(),
                flipped = position(
                    element,
                    target,
                    axis === 'x' ? ((flipPosition(this.dir)) + " " + (this.align)) : ((this.align) + " " + (flipPosition(this.dir))),
                    axis === 'x' ? ((this.dir) + " " + (this.align)) : ((this.align) + " " + (this.dir)),
                    axis === 'x' ? ("" + (this.dir === 'left' ? -1 * offset : offset)) : (" " + (this.dir === 'top' ? -1 * offset : offset)),
                    null,
                    this.flip,
                    boundary
                );

            this.dir = axis === 'x' ? flipped.target.x : flipped.target.y;
            this.align = axis === 'x' ? flipped.target.y : flipped.target.x;

            element.css('display', '').toggleClass(((this.clsPos) + "-" + (this.dir) + "-" + (this.align)), this.offset === false);

        },

        getAxis: function getAxis() {
            return this.pos[0] === 'top' || this.pos[0] === 'bottom' ? 'y' : 'x';
        }

    }

}

function mixin$1 (UIkit) {

    UIkit.mixin.class = Class;
    UIkit.mixin.modal = Modal;
    UIkit.mixin.mouse = Mouse;
    UIkit.mixin.position = Position;
    UIkit.mixin.toggable = Toggable;

}

function Accordion (UIkit) {

    UIkit.component('accordion', {

        mixins: [Class, Toggable],

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
            var this$1 = this;


            this.items = toJQuery(this.targets, this.$el);

            if (!this.items) {
                return;
            }

            this.$el.on('click', ((this.targets) + " " + (this.toggle)), function (e) {
                e.preventDefault();
                this$1.show(this$1.items.find(this$1.toggle).index(e.currentTarget));
            });

            this.items.each(function (i, el) {
                el = $__default(el);
                this$1.toggleNow(el.find(this$1.content), el.hasClass(this$1.clsOpen));
            });

            var active = this.active !== false && toJQuery(this.items.eq(Number(this.active))) || !this.collapsible && toJQuery(this.items.eq(0));
            if (active && !active.hasClass(this.clsOpen)) {
                this.show(active, false);
            }
        },

        methods: {

            show: function show(item, animate) {
                var this$1 = this;


                var index = getIndex(item, this.items),
                    active = this.items.filter(("." + (this.clsOpen)));

                item = this.items.eq(index);

                item.add(!this.multiple && active).each(function (i, el) {

                    el = $__default(el);

                    var content = el.find(this$1.content), isItem = el.is(item), state = isItem && !el.hasClass(this$1.clsOpen);

                    if (!state && isItem && !this$1.collapsible && active.length < 2) {
                        return;
                    }

                    el.toggleClass(this$1.clsOpen, state);

                    if (!Transition.inProgress(content.parent())) {
                        content.wrap('<div>').parent().attr('hidden', state);
                    }

                    this$1.toggleNow(content, true);
                    this$1.toggleElement(content.parent(), state, animate).then(function () {
                        if (el.hasClass(this$1.clsOpen) === state) {

                            if (!state) {
                                this$1.toggleNow(content, false);
                            }

                            content.unwrap();
                        }
                    });

                })
            }

        }

    });

}

function Alert (UIkit) {

    UIkit.component('alert', {

        mixins: [Class, Toggable],

        props: {
            animation: Boolean,
            close: String
        },

        defaults: {
            animation: true,
            close: '.uk-alert-close',
            duration: 150
        },

        ready: function ready() {
            var this$1 = this;

            this.$el.on('click', this.close, function (e) {
                e.preventDefault();
                this$1.closeAlert();
            });
        },

        methods: {

            closeAlert: function closeAlert() {
                var this$1 = this;

                this.toggleElement(this.$el).then(function () { return this$1.$destroy(true); });
                requestAnimationFrame(function () { return this$1.$el.css('opacity', 0); });
            }

        }

    });

}

function Cover (UIkit) {

    UIkit.component('cover', {

        props: {
            automute: Boolean,
            width: Number,
            height: Number
        },

        defaults: {automute: true},

        ready: function ready() {
            if (this.$el.is('iframe') && this.automute) {

                var src = this.$el.attr('src');

                this.$el.attr('src', '').on('load', function () {

                    this.contentWindow.postMessage('{"event": "command", "func": "mute", "method":"setVolume", "value":0}', '*');

                }).attr('src', [src, (~src.indexOf('?') ? '&' : '?'), 'enablejsapi=1&api=1'].join(''));
            }
        },

        update: {

            write: function write() {

                if (this.$el[0].offsetHeight === 0) {
                    return;
                }

                this.$el
                    .css({width: '', height: ''})
                    .css(Dimensions.cover(
                        {width: this.width || this.$el.width(), height: this.height || this.$el.height()},
                        {width: this.$el.parent().width(), height: this.$el.parent().height()}
                    ));

            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}

function Drop (UIkit) {

    var active;

    doc.on('click', function (e) {
        if (active && !isWithin(e.target, active.$el) && (!active.toggle || !isWithin(e.target, active.toggle.$el))) {
            active.hide(false);
        }
    });

    UIkit.component('drop', {

        mixins: [Mouse, Position, Toggable],

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
            toggle: '- :first',
            boundary: window,
            boundaryAlign: false,
            delayShow: 0,
            delayHide: 800,
            clsDrop: false,
            hoverIdle: 200,
            animation: 'uk-animation-fade',
            cls: 'uk-open'
        },

        init: function init() {
            this.clsDrop = this.clsDrop || ("uk-" + (this.$options.name));
            this.clsPos = this.clsDrop;

            this.$el.addClass(this.clsDrop);
        },

        ready: function ready() {
            var this$1 = this;


            this.updateAria(this.$el);

            this.$el.on('click', ("." + (this.clsDrop) + "-close"), function (e) {
                e.preventDefault();
                this$1.hide(false);
            });

            if (this.toggle) {

                this.toggle = query(this.toggle, this.$el);

                if (this.toggle) {
                    this.toggle = UIkit.toggle(this.toggle, {target: this.$el, mode: this.mode})[0];
                }
            }

        },

        update: {

            write: function write() {

                if (!this.$el.hasClass(this.cls)) {
                    return;
                }

                removeClass(this.$el, ((this.clsDrop) + "-(stack|boundary)")).css({top: '', left: ''});

                this.$el.toggleClass(((this.clsDrop) + "-boundary"), this.boundaryAlign);

                this.dir = this.pos[0];
                this.align = this.pos[1];

                var boundary = getDimensions(this.boundary), alignTo = this.boundaryAlign ? boundary : getDimensions(this.toggle.$el);

                if (this.align === 'justify') {
                    var prop = this.getAxis() === 'y' ? 'width' : 'height';
                    this.$el.css(prop, alignTo[prop]);
                } else if (this.$el.outerWidth() > Math.max(boundary.right - alignTo.left, alignTo.right - boundary.left)) {
                    this.$el.addClass(this.clsDrop + '-stack');
                    this.$el.trigger('stack', [this]);
                }

                this.positionAt(this.$el, this.boundaryAlign ? this.boundary : this.toggle.$el, this.boundary);

            },

            events: ['resize', 'orientationchange']

        },

        events: {

            toggle: function toggle(e, toggle$1) {
                e.preventDefault();

                if (this.isToggled(this.$el)) {
                    this.hide(false);
                } else {
                    this.show(toggle$1, false);
                }
            },

            'toggleShow mouseenter': function toggleShowmouseenter(e, toggle) {
                e.preventDefault();
                this.show(toggle || this.toggle);
            },

            'toggleHide mouseleave': function toggleHidemouseleave(e) {
                e.preventDefault();

                if (this.toggle && this.toggle.mode === 'hover') {
                    this.hide();
                }
            }

        },

        methods: {

            show: function show(toggle, delay) {
                var this$1 = this;
                if ( delay === void 0 ) delay = true;


                if (toggle && this.toggle && !this.toggle.$el.is(toggle.$el)) {
                    this.hide(false);
                }

                this.toggle = toggle || this.toggle;

                this.clearTimers();

                if (this.isActive()) {
                    return;
                } else if (delay && active && active !== this && active.isDelaying) {
                    this.showTimer = setTimeout(this.show, 75);
                    return;
                } else if (active) {
                    active.hide(false);
                }

                var show = function () {
                    if (this$1.toggleElement(this$1.$el, true).state() !== 'rejected') {
                        this$1.initMouseTracker();
                        this$1.toggle.$el.addClass(this$1.cls).attr('aria-expanded', 'true');
                        this$1.clearTimers();
                    }
                };

                if (delay && this.delayShow) {
                    this.showTimer = setTimeout(show, this.delayShow);
                } else {
                    show();
                }

                active = this;
            },

            hide: function hide(delay) {
                var this$1 = this;
                if ( delay === void 0 ) delay = true;


                this.clearTimers();

                var hide = function () {
                    if (this$1.toggleElement(this$1.$el, false, false).state() !== 'rejected') {
                        active = this$1.isActive() ? null : active;
                        this$1.toggle.$el.removeClass(this$1.cls).attr('aria-expanded', 'false').blur().find('a, button').blur();
                        this$1.cancelMouseTracker();
                        this$1.clearTimers();
                    }
                };

                this.isDelaying = this.movesTo(this.$el);

                if (delay && this.isDelaying) {
                    this.hideTimer = setTimeout(this.hide, this.hoverIdle);
                } else if (delay && this.delayHide) {
                    this.hideTimer = setTimeout(hide, this.delayHide);
                } else {
                    hide();
                }
            },

            clearTimers: function clearTimers() {
                clearTimeout(this.showTimer);
                clearTimeout(this.hideTimer);
                this.showTimer = null;
                this.hideTimer = null;
            },

            isActive: function isActive() {
                return active === this;
            }

        }

    });

    UIkit.drop.getActive = function () { return active; };
}

function Dropdown (UIkit) {

    UIkit.component('dropdown', UIkit.components.drop.extend({name: 'dropdown'}));

}

function FormCustom (UIkit) {

    UIkit.component('form-custom', {

        mixins: [Class],

        props: {
            target: Boolean
        },

        defaults: {
            target: false
        },

        ready: function ready() {
            this.input = this.$el.find(':input:first');
            this.target = this.target && query(this.target === true ? '> :input:first + :first' : this.target, this.$el);

            var state = this.input.next();
            this.input.on({
                focus: function (e) { return state.addClass('uk-focus'); },
                blur: function (e) { return state.removeClass('uk-focus'); },
                mouseenter: function (e) { return state.addClass('uk-hover'); },
                mouseleave: function (e) { return state.removeClass('uk-hover'); }
            });

            this.input.trigger('change');
        },

        events: {

            change: function change() {
                this.target && this.target[this.target.is(':input') ? 'val' : 'text'](
                    this.input[0].files && this.input[0].files[0]
                        ? this.input[0].files[0].name
                        : this.input.is('select')
                            ? this.input.find('option:selected').text()
                            : this.input.val()
                );
            }

        }

    });

}

function Gif (UIkit) {

    UIkit.component('gif', {

        update: {

            read: function read() {

                var inview = isInView(this.$el);

                if (!this.isInView && inview) {
                    this.$el[0].src = this.$el[0].src;
                }

                this.isInView = inview;
            },

            events: ['scroll', 'load', 'resize', 'orientationchange']
        }

    });

}

function Grid (UIkit) {

    UIkit.component('grid', UIkit.components.margin.extend({

        mixins: [Class],

        name: 'grid',

        defaults: {
            margin: 'uk-grid-margin',
            clsStack: 'uk-grid-stack'
        },

        update: {

            write: function write() {

                this.$el.toggleClass(this.clsStack, this.stacks);

            },

            events: ['load', 'resize', 'orientationchange']

        }

    }));

}

function HeightMatch (UIkit) {

    UIkit.component('height-match', {

        props: {
            target: String,
            row: Boolean
        },

        defaults: {
            target: '> *',
            row: true
        },

        update: {

            write: function write() {
                var this$1 = this;


                var elements = toJQuery(this.target, this.$el).css('min-height', '');

                if (!this.row) {
                    this.match(elements);
                    return this;
                }

                var lastOffset = false, group = [];

                elements.each(function (i, el) {

                    el = $__default(el);

                    var offset = el.offset().top;

                    if (offset != lastOffset && group.length) {
                        this$1.match($__default(group));
                        group = [];
                        offset = el.offset().top;
                    }

                    group.push(el);
                    lastOffset = offset;
                });

                if (group.length) {
                    this.match($__default(group));
                }

            },

            events: ['resize', 'orientationchange']

        },

        methods: {

            match: function match(elements) {

                if (elements.length < 2) {
                    return;
                }

                var max = 0;

                elements
                    .each(function (i, el) {

                        el = $__default(el);

                        var height;

                        if (el.css('display') === 'none') {
                            var style = el.attr('style');
                            el.attr('style', (style + ";display:block !important;"));
                            height = el.outerHeight();
                            el.attr('style', style || '');
                        } else {
                            height = el.outerHeight();
                        }

                        max = Math.max(max, height);

                    })
                    .each(function (i, el) {
                        el = $__default(el);
                        el.css('min-height', ((max - (el.outerHeight() - parseFloat(el.css('height')))) + "px"));
                    });
            }

        }

    });

}

function HeightViewport (UIkit) {

    UIkit.component('height-viewport', {

        props: {
            expand: Boolean,
            offsetTop: Boolean,
            offsetBottom: Boolean
        },

        defaults: {
            expand: false,
            offsetTop: false,
            offsetBottom: false
        },

        init: function init() {
            this._callUpdate();
        },

        update: {

            write: function write() {

                var viewport = window.innerHeight, height, offset = 0;

                if (this.expand) {

                    this.$el.css({height: '', minHeight: ''});

                    var diff = viewport - document.documentElement.offsetHeight;

                    if (diff > 0) {
                        this.$el.css('min-height', height = this.$el.outerHeight() + diff)
                    }

                } else {

                    var top = this.$el[0].offsetTop;

                    if (top < viewport) {

                        if (this.offsetTop) {
                            offset += top;
                        }

                        if (this.offsetBottom) {
                            offset += this.$el.next().outerHeight() || 0;
                        }

                    }

                    this.$el.css('min-height', height = offset ? ("calc(100vh - " + offset + "px)") : '100vh');

                }

                // IE 10-11 fix (min-height on a flex container won't apply to its flex items)
                this.$el.css('height', '');
                if (height && viewport - offset >= this.$el.outerHeight()) {
                    this.$el.css('height', height);
                }

            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}

function Hover (UIkit) {

    ready(function () {

        if (!hasTouch) {
            return;
        }

        var cls = 'uk-hover';

        doc.on('tap', function (ref) {
            var target = ref.target;

            return $__default(("." + cls)).filter(function (_, el) { return !isWithin(target, el); }).removeClass(cls);
        });

        Object.defineProperty(UIkit, 'hoverSelector', {

            set: function set(selector) {

                doc.on('tap', selector, function () {
                    this.classList.add(cls);
                });

            }

        });

        UIkit.hoverSelector = '.uk-animation-toggle, .uk-transition-toggle, [uk-hover]';

    });

}

function Icon (UIkit) {

    UIkit.component('icon', UIkit.components.svg.extend({

        mixins: [Class],

        name: 'icon',

        props: ['icon'],

        defaults: {exclude: ['id', 'style', 'class', 'src']},

        init: function init() {
            this.$el.addClass('uk-icon');
        }

    }));

    [
        'close',
        'navbar-toggle-icon',
        'overlay-icon',
        'pagination-previous',
        'pagination-next',
        'slidenav',
        'search-icon',
        'totop'
    ].forEach(function (name) { return UIkit.component(name, UIkit.components.icon.extend({name: name})); });

}

function Margin (UIkit) {

    UIkit.component('margin', {

        props: {
            margin: String,
            firstColumn: Boolean
        },

        defaults: {
            margin: 'uk-margin-small-top',
            firstColumn: 'uk-first-column'
        },

        connected: function connected() {
            this._callUpdate();
        },

        update: {

            read: function read() {
                var this$1 = this;


                if (this.$el[0].offsetHeight === 0) {
                    this.hidden = true;
                    return;
                }

                this.hidden = false;
                this.stacks = true;

                var columns = this.$el.children().filter(function (_, el) { return el.offsetHeight > 0; });

                this.rows = [[columns.get(0)]];

                columns.slice(1).each(function (_, el) {

                    var top = Math.ceil(el.offsetTop), bottom = top + el.offsetHeight;

                    for (var index = this$1.rows.length - 1; index >= 0; index--) {
                        var row = this$1.rows[index], rowTop = Math.ceil(row[0].offsetTop);

                        if (top >= rowTop + row[0].offsetHeight) {
                            this$1.rows.push([el]);
                            break;
                        }

                        if (bottom > rowTop) {

                            this$1.stacks = false;

                            if (el.offsetLeft < row[0].offsetLeft) {
                                row.unshift(el);
                                break;
                            }

                            row.push(el);
                            break;
                        }

                        if (index === 0) {
                            this$1.rows.splice(index, 0, [el]);
                            break;
                        }

                    }

                });

            },

            write: function write() {
                var this$1 = this;


                if (this.hidden) {
                    return;
                }

                this.rows.forEach(function (row, i) { return row.forEach(function (el, j) { return $__default(el)
                            .toggleClass(this$1.margin, i !== 0)
                            .toggleClass(this$1.firstColumn, j === 0); }
                    ); }
                )

            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}

function Modal$1 (UIkit) {

    UIkit.component('modal', {

        mixins: [Modal],

        props: {
            center: Boolean,
            container: Boolean
        },

        defaults: {
            center: false,
            clsPage: 'uk-modal-page',
            clsPanel: 'uk-modal-dialog',
            selClose: '.uk-modal-close, .uk-modal-close-default, .uk-modal-close-outside, .uk-modal-close-full',
            container: true
        },

        ready: function ready() {

            this.container = this.container === true && UIkit.container || this.container && toJQuery(this.container);

            if (this.container && !this.$el.parent().is(this.container)) {
                this.$el.appendTo(this.container);
            }

        },

        update: {

            write: function write() {

                if (this.$el.css('display') === 'block' && this.center) {
                    this.$el
                        .removeClass('uk-flex uk-flex-center uk-flex-middle')
                        .css('display', 'block')
                        .toggleClass('uk-flex uk-flex-center uk-flex-middle', window.innerHeight > this.panel.outerHeight(true))
                        .css('display', this.$el.hasClass('uk-flex') ? '' : 'block');
                }

            },

            events: ['resize', 'orientationchange']

        },

        events: {

            beforeshow: function beforeshow(e) {

                if (!this.$el.is(e.target)) {
                    return;
                }

                this.page.addClass(this.clsPage);
                this.$el.css('display', 'block');
                this.$el.height();
            },

            hide: function hide(e) {

                if (!this.$el.is(e.target)) {
                    return;
                }

                if (!this.getActive()) {
                    this.page.removeClass(this.clsPage);
                }

                this.$el.css('display', '').removeClass('uk-flex uk-flex-center uk-flex-middle');
            }

        }

    });

    UIkit.component('overflow-auto', {

        mixins: [Class],

        ready: function ready() {
            this.panel = query('!.uk-modal-dialog', this.$el);
            this.$el.css('min-height', 150);

            (new Observer(this._callUpdate.bind(this))).observe(this.panel[0], {childList: true, subtree: true});

        },

        update: {

            write: function write() {
                var current = this.$el.css('max-height');
                this.$el.css('max-height', 150).css('max-height', Math.max(150, 150 - (this.panel.outerHeight(true) - window.innerHeight)));
                if (current !== this.$el.css('max-height')) {
                    this.$el.trigger('resize');
                }
            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

    UIkit.modal.dialog = function (content, options) {

        var dialog = UIkit.modal($__default(
            ("<div class=\"uk-modal\">\n                <div class=\"uk-modal-dialog\">" + content + "</div>\n             </div>")
        ), options)[0];

        dialog.show();
        dialog.$el.on('hide', function () { return dialog.$destroy(true); });

        return dialog;
    };

    UIkit.modal.alert = function (message, options) {

        options = $.extend({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        var deferred = $__default.Deferred();

        UIkit.modal.dialog(("\n            <div class=\"uk-modal-body\">" + (isString(message) ? message : $__default(message).html()) + "</div>\n            <div class=\"uk-modal-footer uk-text-right\">\n                <button class=\"uk-button uk-button-primary uk-modal-close\" autofocus>" + (options.labels.ok) + "</button>\n            </div>\n        "), options).$el.on('hide', function () { return deferred.resolve(); });

        return deferred.promise();
    };

    UIkit.modal.confirm = function (message, options) {

        options = $.extend({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        var deferred = $__default.Deferred();

        UIkit.modal.dialog(("\n            <div class=\"uk-modal-body\">" + (isString(message) ? message : $__default(message).html()) + "</div>\n            <div class=\"uk-modal-footer uk-text-right\">\n                <button class=\"uk-button uk-button-default uk-modal-close\">" + (options.labels.cancel) + "</button>\n                <button class=\"uk-button uk-button-primary uk-modal-close\" autofocus>" + (options.labels.ok) + "</button>\n            </div>\n        "), options).$el.on('click', '.uk-modal-footer button', function (e) { return deferred[$__default(e.target).index() === 0 ? 'reject' : 'resolve'](); });

        return deferred.promise();
    };

    UIkit.modal.prompt = function (message, value, options) {

        options = $.extend({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        var deferred = $__default.Deferred(),
            prompt = UIkit.modal.dialog(("\n                <form class=\"uk-form-stacked\">\n                    <div class=\"uk-modal-body\">\n                        <label>" + (isString(message) ? message : $__default(message).html()) + "</label>\n                        <input class=\"uk-input\" type=\"text\" autofocus>\n                    </div>\n                    <div class=\"uk-modal-footer uk-text-right\">\n                        <button class=\"uk-button uk-button-default uk-modal-close\" type=\"button\">" + (options.labels.cancel) + "</button>\n                        <button class=\"uk-button uk-button-primary\" type=\"submit\">" + (options.labels.ok) + "</button>\n                    </div>\n                </form>\n            "), options),
            input = prompt.$el.find('input').val(value);

        prompt.$el
            .on('submit', 'form', function (e) {
                e.preventDefault();
                deferred.resolve(input.val());
                prompt.hide()
            })
            .on('hide', function () {
                if (deferred.state() === 'pending') {
                    deferred.resolve(null);
                }
            });

        return deferred.promise();
    };

    UIkit.modal.labels = {
        ok: 'Ok',
        cancel: 'Cancel'
    }

}

function Nav (UIkit) {

    UIkit.component('nav', UIkit.components.accordion.extend({

        name: 'nav',

        defaults: {
            targets: '> .uk-parent',
            toggle: '> a',
            content: 'ul:first'
        }

    }));

}

function Navbar (UIkit) {

    UIkit.component('navbar', {

        mixins: [Class],

        props: {
            dropdown: String,
            mode: String,
            align: String,
            offset: Number,
            boundary: Boolean,
            boundaryAlign: Boolean,
            clsDrop: String,
            delayShow: Number,
            delayHide: Number,
            dropbar: Boolean,
            dropbarMode: String,
            dropbarAnchor: 'jQuery',
            duration: Number
        },

        defaults: {
            dropdown: '.uk-navbar-nav > li',
            mode: 'hover',
            align: 'left',
            offset: false,
            boundary: true,
            boundaryAlign: false,
            clsDrop: 'uk-navbar-dropdown',
            delayShow: 0,
            delayHide: 800,
            flip: 'x',
            dropbar: false,
            dropbarMode: 'slide',
            dropbarAnchor: false,
            duration: 200,
        },

        ready: function ready() {
            var this$1 = this;


            var drop;

            this.boundary = (this.boundary === true || this.boundaryAlign) ? this.$el : this.boundary;
            this.pos = "bottom-" + (this.align);

            $__default(this.dropdown, this.$el).each(function (i, el) {

                drop = toJQuery(("." + (this$1.clsDrop)), el);

                if (drop && !UIkit.getComponent(drop, 'drop') && !UIkit.getComponent(drop, 'dropdown')) {
                    UIkit.drop(drop, $.extend({}, this$1));
                }
            }).on('mouseenter', function (ref) {
                var target = ref.target;

                var active = this$1.getActive();
                if (active && !isWithin(target, active.toggle.$el) && !active.isDelaying) {
                    active.hide(false);
                }
            });

            if (!this.dropbar) {
                return;
            }

            this.dropbar = query(this.dropbar, this.$el) || $__default('<div class="uk-navbar-dropbar"></div>').insertAfter(this.dropbarAnchor || this.$el);

            if (this.dropbarMode === 'slide') {
                this.dropbar.addClass('uk-navbar-dropbar-slide');
            }

            this.dropbar.on({

                mouseleave: function () {

                    var active = this$1.getActive();

                    if (active && !this$1.dropbar.is(':hover')) {
                        active.hide();
                    }
                },

                beforeshow: function (e, ref) {
                    var $el = ref.$el;

                    $el.addClass(((this$1.clsDrop) + "-dropbar"));
                    this$1.transitionTo($el.outerHeight(true));
                },

                beforehide: function (e, ref) {
                    var $el = ref.$el;


                    var active = this$1.getActive();

                    if (this$1.dropbar.is(':hover') && active && active.$el.is($el)) {
                        return false;
                    }
                },

                hide: function (e, ref) {
                    var $el = ref.$el;


                    var active = this$1.getActive();

                    if (!active || active && active.$el.is($el)) {
                        this$1.transitionTo(0);
                    }
                }

            });

        },

        events: {

            beforeshow: function beforeshow(e, ref) {
                var $el = ref.$el;
                var dir = ref.dir;

                if (this.dropbar && dir === 'bottom' && !isWithin($el, this.dropbar)) {
                    $el.appendTo(this.dropbar);
                    this.dropbar.trigger('beforeshow', [{$el: $el}]);
                }
            }

        },

        methods: {

            getActive: function getActive() {
                var active = UIkit.drop.getActive();
                return active && active.mode !== 'click' && isWithin(active.toggle.$el, this.$el) && active;
            },

            transitionTo: function transitionTo(height) {
                this.dropbar.height(this.dropbar[0].offsetHeight ? this.dropbar.height() : 0);
                return Transition.cancel(this.dropbar).start(this.dropbar, {height: height}, this.duration);
            }

        }

    });

}

function Offcanvas (UIkit) {

    UIkit.component('offcanvas', {

        mixins: [Modal],

        props: {
            mode: String,
            flip: Boolean,
            overlay: Boolean
        },

        defaults: {
            mode: 'slide',
            flip: false,
            overlay: false,
            clsPage: 'uk-offcanvas-page',
            clsPanel: 'uk-offcanvas-bar',
            clsFlip: 'uk-offcanvas-flip',
            clsPageAnimation: 'uk-offcanvas-page-animation',
            clsSidebarAnimation: 'uk-offcanvas-bar-animation',
            clsMode: 'uk-offcanvas',
            clsOverlay: 'uk-offcanvas-overlay',
            clsPageOverlay: 'uk-offcanvas-page-overlay',
            selClose: '.uk-offcanvas-close'
        },

        ready: function ready() {

            this.clsFlip = this.flip ? this.clsFlip : '';
            this.clsOverlay = this.overlay ? this.clsOverlay : '';
            this.clsPageOverlay = this.overlay ? this.clsPageOverlay : '';
            this.clsMode = (this.clsMode) + "-" + (this.mode);

            if (this.mode === 'none' || this.mode === 'reveal') {
                this.clsSidebarAnimation = '';
            }

            if (this.mode !== 'push' && this.mode !== 'reveal') {
                this.clsPageAnimation = '';
            }

        },

        update: {

            write: function write() {

                if (this.isActive()) {
                    this.page.width(window.innerWidth - this.getScrollbarWidth());
                }

            },

            events: ['resize', 'orientationchange']

        },

        events: {

            beforeshow: function beforeshow(e) {

                if (!this.$el.is(e.target)) {
                    return;
                }

                this.page.addClass(((this.clsPage) + " " + (this.clsFlip) + " " + (this.clsPageAnimation) + " " + (this.clsPageOverlay)));
                this.panel.addClass(((this.clsSidebarAnimation) + " " + (this.clsMode)));
                this.$el.addClass(this.clsOverlay).css('display', 'block').height();

            },

            beforehide: function beforehide(e) {

                if (!this.$el.is(e.target)) {
                    return;
                }

                this.page.removeClass(this.clsPageAnimation).css('margin-left', '');

                if (this.mode === 'none' || this.getActive() && this.getActive() !== this) {
                    this.panel.trigger(transitionend);
                }

            },

            hide: function hide(e) {

                if (!this.$el.is(e.target)) {
                    return;
                }

                this.page.removeClass(((this.clsPage) + " " + (this.clsFlip) + " " + (this.clsPageOverlay))).width('');
                this.panel.removeClass(((this.clsSidebarAnimation) + " " + (this.clsMode)));
                this.$el.removeClass(this.clsOverlay).css('display', '');
            }

        }

    });

}

function Responsive (UIkit) {

    UIkit.component('responsive', {

        props: ['width', 'height'],

        update: {

            write: function write() {
                if (this.$el.is(':visible') && this.width && this.height) {
                    this.$el.height(Dimensions.fit(
                        {height: this.height, width: this.width},
                        {width: this.$el.parent().width(), height: this.height || this.$el.height()}
                    )['height']);
                }
            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}

function Scroll (UIkit) {

    UIkit.component('scroll', {

        props: {
            duration: Number,
            transition: String,
            offset: Number
        },

        defaults: {
            duration: 1000,
            transition: 'easeOutExpo',
            offset: 0
        },

        methods: {

            scrollToElement: function scrollToElement(el) {
                var this$1 = this;


                el = $__default(el);

                // get / set parameters
                var target = el.offset().top - this.offset,
                    docHeight = doc.height(),
                    winHeight = window.innerHeight;

                if (target + winHeight > docHeight) {
                    target = docHeight - winHeight;
                }

                // animate to target, fire callback when done
                $__default('html,body')
                    .stop()
                    .animate({scrollTop: parseInt(target, 10) || 1}, this.duration, this.transition)
                    .promise()
                    .then(function () { return this$1.$el.triggerHandler($__default.Event('scrolled'), [this$1]); });

            }

        },

        events: {
            click: function click(e) {
                e.preventDefault();
                this.scrollToElement($__default(this.$el[0].hash).length ? this.$el[0].hash : 'body');
            }
        }

    });

    if (!$__default.easing.easeOutExpo) {
        $__default.easing.easeOutExpo = function (x, t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        };
    }

}

function Scrollspy (UIkit) {

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

        init: function init() {
            if (this.hidden) {
                this.getElements().css('visibility', 'hidden');
            }
        },

        ready: function ready() {

            this.elements = this.getElements();

            if (this.hidden) {
                this.elements.css('visibility', 'hidden');
            }
        },

        update: {

            read: function read() {
                var this$1 = this;

                this.elements.each(function (i, el) {

                    if (!el.__uk_scrollspy) {
                        el.__uk_scrollspy = {toggles: ($__default(el).attr('uk-scrollspy-class') || this$1.cls).split(',')};
                    }

                    el.__uk_scrollspy.show = isInView(el, this$1.offsetTop, this$1.offsetLeft);

                });
            },

            write: function write() {
                var this$1 = this;


                var index = this.elements.length === 1 ? 1 : 0;

                this.elements.each(function (i, el) {

                    var $el = $__default(el);

                    var data = el.__uk_scrollspy;

                    if (data.show) {

                        if (!data.inview && !data.timer) {

                            data.timer = setTimeout(function () {

                                $el.css('visibility', '')
                                    .addClass(this$1.inViewClass)
                                    .toggleClass(data.toggles[0])
                                    .trigger('inview');

                                data.inview = true;
                                delete data.timer;

                            }, this$1.delay * index++);

                        }

                    } else {

                        if (data.inview && this$1.repeat) {

                            if (data.timer) {
                                clearTimeout(data.timer);
                                delete data.timer;
                            }

                            $el.removeClass(this$1.inViewClass)
                                .toggleClass(data.toggles[0])
                                .css('visibility', this$1.hidden ? 'hidden' : '')
                                .trigger('outview');

                            data.inview = false;
                        }

                    }

                    data.toggles.reverse();

                });

            },

            events: ['scroll', 'load', 'resize', 'orientationchange']

        },

        methods: {

            getElements: function getElements() {
                return this.target && toJQuery(this.target, this.$el) || this.$el;
            }

        }

    });

}

function ScrollspyNav (UIkit) {

    UIkit.component('scrollspy-nav', {

        props: {
            cls: String,
            closest: String,
            scroll: Boolean,
            overflow: Boolean,
            offset: Number
        },

        defaults: {
            cls: 'uk-active',
            closest: false,
            scroll: false,
            overflow: true,
            offset: 0
        },

        ready: function ready() {
            this.links = this.$el.find('a[href^="#"]').filter(function (i, el) { return el.hash; });
            this.elements = (this.closest ? this.links.closest(this.closest) : this.links);
            this.targets = $__default($__default.map(this.links, function (el) { return el.hash; }).join(','));

            if (this.scroll) {

                var offset = this.offset || 0;

                this.links.each(function () {
                    UIkit.scroll(this, {offset: offset});
                });
            }
        },

        update: {

            write: function write() {
                var this$1 = this;


                var scroll = win.scrollTop() + this.offset,
                    max = document.documentElement.scrollHeight - window.innerHeight + this.offset;

                this.links.blur();
                this.elements.removeClass(this.cls);

                this.targets.each(function (i, el) {

                    el = $__default(el);

                    var offset = el.offset(), last = i + 1 === this$1.targets.length;
                    if (!this$1.overflow && (i === 0 && offset.top > scroll || last && offset.top + el.outerHeight() < scroll)) {
                        return false;
                    }

                    if (!last && this$1.targets.eq(i + 1).offset().top <= scroll) {
                        return;
                    }

                    if (scroll >= max) {
                        for (var j = this$1.targets.length; j > i; j--) {
                            if (isInView(this$1.targets.eq(j))) {
                                el = this$1.targets.eq(j);
                                break;
                            }
                        }
                    }

                    var active = this$1.links.filter(("[href=\"#" + (el.attr('id')) + "\"]"));

                    if (active.length) {
                        active = (this$1.closest ? active.closest(this$1.closest) : active).addClass(this$1.cls);
                        this$1.$el.trigger('active', [el, active]);

                        return false;
                    }
                });
            },

            events: ['scroll', 'load', 'resize', 'orientationchange']

        }

    });

}

function Spinner (UIkit) {

    UIkit.component('spinner', UIkit.components.icon.extend({

        name: 'spinner',

        init: function init() {
            this.height = this.width = this.$el.width();
        },

        ready: function ready() {
            var this$1 = this;


            this.svg.then(function (svg) {
                var circle = svg.find('circle'),
                    diameter = Math.floor(this$1.width / 2);

                svg[0].setAttribute('viewBox', ("0 0 " + (this$1.width) + " " + (this$1.width)));
                circle.attr({cx: diameter, cy: diameter, r: diameter - parseInt(circle.css('stroke-width'), 10)});
            });

        }

    }));

}

function Sticky (UIkit) {

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
            media: 'media',
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

        connected: function connected() {
            this.placeholder = $__default('<div class="uk-sticky-placeholder"></div>').insertAfter(this.$el).attr('hidden', true);
            this._widthElement = this.widthElement || this.placeholder;
        },

        disconnected: function disconnected() {
            this.placeholder.remove();
            this.placeholder = null;
            this._widthElement = null;
        },

        ready: function ready() {
            var this$1 = this;


            this.topProp = this.top;
            this.bottomProp = this.bottom;

            if (this.target && location.hash && win.scrollTop() > 0) {

                var target = query(location.hash);

                if (target) {
                    requestAnimationFrame$1(function () {

                        var top = target.offset().top,
                            elTop = this$1.$el.offset().top,
                            elHeight = this$1.$el.outerHeight(),
                            elBottom = elTop + elHeight;

                        if (elBottom >= top && elTop <= top + target.outerHeight()) {
                            window.scrollTo(0, top - elHeight - this$1.target - this$1.offset);
                        }

                    });
                }
            }

        },

        update: [

            {

                write: function write(ref) {
                    var this$1 = this;
                    var type = ref.type;


                    var isActive = this.$el.hasClass(this.clsActive) && !this.$el.hasClass('uk-animation-leave');

                    var el, outerHeight = this.$el.outerHeight();

                    this.placeholder
                        .css('height', this.$el.css('position') !== 'absolute' ? outerHeight : '')
                        .css(this.$el.css(['marginTop', 'marginBottom', 'marginLeft', 'marginRight']));

                    this.topOffset = (isActive ? this.placeholder.offset() : this.$el.offset()).top;
                    this.bottomOffset = this.topOffset + outerHeight;

                    ['top', 'bottom'].forEach(function (prop) {

                        this$1[prop] = this$1[(prop + "Prop")];

                        if (!this$1[prop]) {
                            return;
                        }

                        if ($.isNumeric(this$1[prop])) {

                            this$1[prop] = this$1[(prop + "Offset")] + parseFloat(this$1[prop]);

                        } else {

                            if (isString(this$1[prop]) && this$1[prop].match(/^-?\d+vh$/)) {
                                this$1[prop] = window.innerHeight * parseFloat(this$1[prop]) / 100;
                            } else {

                                el = this$1[prop] === true ? this$1.$el.parent() : query(this$1[prop], this$1.$el);

                                if (el) {
                                    this$1[prop] = el.offset().top + el.outerHeight();
                                }

                            }

                        }

                    });

                    this.top = Math.max(parseFloat(this.top), this.topOffset) - this.offset;
                    this.bottom = this.bottom && this.bottom - outerHeight;
                    this.inactive = this.media && !window.matchMedia(this.media).matches;

                    if (type !== 'update') {
                        this._callUpdate('scroll');
                    }
                },

                events: ['load', 'resize', 'orientationchange']

            },

            {

                write: function write(ref) {
                    var this$1 = this;
                    var dir = ref.dir;


                    var isActive = this.$el.hasClass(this.clsActive) && !this.$el.hasClass('uk-animation-leave'),
                        scroll = win.scrollTop();

                    if (scroll < 0 || !this.$el.is(':visible') || this.disabled) {
                        return;
                    }

                    if (this.inactive || scroll < this.top || this.showOnUp && (dir !== 'up' || dir === 'up' && !isActive && scroll <= this.bottomOffset)) {

                        if (!isActive) {
                            return;
                        }

                        if (this.animation && this.bottomOffset < this.$el.offset().top) {
                            Animation.cancel(this.$el).then(function () { return Animation.out(this$1.$el, this$1.animation).then(function () { return this$1.hide(); }); });
                        } else {
                            this.hide();
                        }

                    } else if (isActive) {

                        this.update();

                    } else if (this.animation) {

                        Animation.cancel(this.$el).then(function () {
                            this$1.show();
                            Animation.in(this$1.$el, this$1.animation);
                        });

                    } else {
                        this.show();
                    }

                },

                events: ['scroll']

            } ],

        methods: {

            show: function show() {

                this.update();

                this.$el
                    .addClass(this.clsActive)
                    .removeClass(this.clsInactive)
                    .trigger('active');

            },

            hide: function hide() {

                this.$el
                    .addClass(this.clsInactive)
                    .removeClass(this.clsActive)
                    .css({position: '', top: '', width: ''})
                    .trigger('inactive');

                this.placeholder.attr('hidden', true);
            },

            update: function update() {

                var top = Math.max(0, this.offset), scroll = win.scrollTop();

                this.placeholder.attr('hidden', false);

                if (this.bottom && scroll > this.bottom - this.offset) {
                    top = this.bottom - scroll;
                }

                this.$el.css({
                    position: 'fixed',
                    top: top + 'px',
                    width: this._widthElement[0].getBoundingClientRect().width
                });

            }

        }

    });

}

var storage = window.sessionStorage || {};
var svgs = {};
function Svg (UIkit) {

    UIkit.component('svg', {

        props: {
            id: String,
            icon: String,
            src: String,
            class: String,
            style: String,
            width: Number,
            height: Number,
            ratio: Number
        },

        defaults: {
            ratio: 1,
            id: false,
            class: '',
            exclude: ['src']
        },

        connected: function connected() {
            this.svg = $__default.Deferred();
        },

        update: {

            read: function read() {
                var this$1 = this;


                if (!this.src) {
                    this.src = getSrc(this.$el);
                }

                if (!this.src || this.isSet) {
                    return;
                }

                this.isSet = true;

                if (!this.icon && ~this.src.indexOf('#')) {

                    var parts = this.src.split('#');

                    if (parts.length > 1) {
                        this.src = parts[0];
                        this.icon = parts[1];
                    }
                }

                this.get(this.src).then(function (svg) { return fastdom.mutate(function () {

                        var el;

                        el = !this$1.icon
                            ? svg.clone()
                            : (el = toJQuery(("#" + (this$1.icon)), svg))
                                && toJQuery((el[0].outerHTML || $__default('<div>').append(el.clone()).html()).replace(/symbol/g, 'svg')) // IE workaround, el[0].outerHTML
                                || !toJQuery('symbol', svg) && svg.clone(); // fallback if SVG has no symbols

                        if (!el || !el.length) {
                            return $__default.Deferred().reject('SVG not found.');
                        }

                        var dimensions = el[0].getAttribute('viewBox'); // jQuery workaround, el.attr('viewBox')

                        if (dimensions) {
                            dimensions = dimensions.split(' ');
                            this$1.width = this$1.width || dimensions[2];
                            this$1.height = this$1.height || dimensions[3];
                        }

                        this$1.width *= this$1.ratio;
                        this$1.height *= this$1.ratio;

                        for (var prop in this$1.$options.props) {
                            if (this$1[prop] && !~this$1.exclude.indexOf(prop)) {
                                el.attr(prop, this$1[prop]);
                            }
                        }

                        if (!this$1.id) {
                            el.removeAttr('id');
                        }

                        if (this$1.width && !this$1.height) {
                            el.removeAttr('height');
                        }

                        if (this$1.height && !this$1.width) {
                            el.removeAttr('width');
                        }

                        if (isVoidElement(this$1.$el) || this$1.$el[0].tagName === 'CANVAS') {
                            this$1.$el.attr({hidden: true, id: null});
                            el.insertAfter(this$1.$el);
                        } else {
                            el.appendTo(this$1.$el);
                        }

                        this$1.svg.resolve(el);

                    }); }
                );
            },

            events: ['load']

        },

        methods: {

            get: function get(src) {

                if (svgs[src]) {
                    return svgs[src];
                }

                svgs[src] = $__default.Deferred();

                if (src.lastIndexOf('data:', 0) === 0) {
                    svgs[src].resolve(getSvg(decodeURIComponent(src.split(',')[1])));
                } else {

                    var key = "uikit_" + (UIkit.version) + "_" + src;

                    if (storage[key]) {
                        svgs[src].resolve(getSvg(storage[key]));
                    } else {
                        $__default.get(src).then(function (doc, status, res) {
                            storage[key] = res.responseText;
                            svgs[src].resolve(getSvg(storage[key]));
                        });
                    }
                }

                return svgs[src];

                function getSvg (doc) {
                    return $__default(doc).filter('svg');
                }
            }

        },

        destroy: function destroy() {

            if (isVoidElement(this.$el)) {
                this.$el.attr({hidden: null, id: this.id || null});
            }

            if (this.svg) {
                this.svg.then(function (svg) { return svg.remove(); });
            }
        }

    });

    function getSrc(el) {

        var image = getBackgroundImage(el);

        if (!image) {

            el = el.clone().empty().attr('uk-no-boot', '').appendTo(document.body).show();

            if (!el.is(':visible')) {
                image = getBackgroundImage(el);
            }

            // safari workaround
            if (!image && el[0].tagName === 'CANVAS') {
                var span = $__default(el[0].outerHTML.replace(/canvas/g, 'span')).insertAfter(el);
                image = getBackgroundImage(span);
                span.remove();
            }

            el.remove();

        }

        return image && image.slice(4, -1).replace(/"/g, '');
    }

    function getBackgroundImage(el) {
        var image = getStyle(el[0], 'backgroundImage', '::before');
        return image !== 'none' && image;
    }

}

function Switcher (UIkit) {

    UIkit.component('switcher', {

        mixins: [Toggable],

        props: {
            connect: 'jQuery',
            toggle: String,
            active: Number,
            swiping: Boolean
        },

        defaults: {
            connect: false,
            toggle: ' > *',
            active: 0,
            swiping: true,
            cls: 'uk-active',
            clsContainer: 'uk-switcher',
            attrItem: 'uk-switcher-item',
            queued: true
        },

        ready: function ready() {
            var this$1 = this;


            this.toggles = toJQuery(this.toggle, this.$el);

            if (!this.connect) {
                this.connect = toJQuery(this.$el.next(("." + (this.clsContainer))));
            }

            if (!this.connect || !this.toggles) {
                return;
            }

            this.$el.on('click', ((this.toggle) + ":not(.uk-disabled)"), function (e) {
                e.preventDefault();
                this$1.show(e.currentTarget);
            });

            this.connect.on('click', ("[" + (this.attrItem) + "]"), function (e) {
                e.preventDefault();
                this$1.show($__default(e.currentTarget).attr(this$1.attrItem));
            });

            if (this.swiping) {
                this.connect.on('swipeRight swipeLeft', function (e) {
                    e.preventDefault();
                    if (!window.getSelection().toString()) {
                        this$1.show(e.type == 'swipeLeft' ? 'next' : 'previous');
                    }
                });
            }

            this.updateAria(this.connect.children());
            this.show(toJQuery(this.toggles.filter(("." + (this.cls) + ":first"))) || toJQuery(this.toggles.eq(this.active)) || this.toggles.first());
        },

        methods: {

            show: function show(item) {
                var this$1 = this;


                var length = this.toggles.length,
                    prev = this.connect.children(("." + (this.cls))).index(),
                    hasPrev = prev >= 0,
                    index = getIndex(item, this.toggles, prev),
                    dir = item === 'previous' ? -1 : 1,
                    toggle;

                for (var i = 0; i < length; i++, index = (index + dir + length) % length) {
                    if (!this$1.toggles.eq(index).is('.uk-disabled, [disabled]')) {
                        toggle = this$1.toggles.eq(index);
                        break;
                    }
                }

                if (!toggle || prev >= 0 && toggle.hasClass(this.cls) || prev === index) {
                    return;
                }

                this.toggles.removeClass(this.cls).attr('aria-expanded', false);
                toggle.addClass(this.cls).attr('aria-expanded', true);

                if (!hasPrev) {
                    this.toggleNow(this.connect.children((":nth-child(" + (index + 1) + ")")));
                } else {
                    this.toggleElement(this.connect.children((":nth-child(" + (prev + 1) + "),:nth-child(" + (index + 1) + ")")));
                }
            }

        }

    });

}

function Tab (UIkit) {

    UIkit.component('tab', UIkit.components.switcher.extend({

        mixins: [Class],

        name: 'tab',

        defaults: {
            media: 960,
            attrItem: 'uk-tab-item'
        },

        init: function init() {

            var cls = this.$el.hasClass('uk-tab-left') && 'uk-tab-left' || this.$el.hasClass('uk-tab-right') && 'uk-tab-right';

            if (cls) {
                UIkit.toggle(this.$el, {cls: cls, mode: 'media', media: this.media});
            }
        }

    }));

}

function Toggle (UIkit) {

    UIkit.component('toggle', {

        mixins: [UIkit.mixin.toggable],

        props: {
            href: 'jQuery',
            target: 'jQuery',
            mode: String,
            media: 'media'
        },

        defaults: {
            href: false,
            target: false,
            mode: 'click',
            queued: true,
            media: false
        },

        ready: function ready() {
            var this$1 = this;


            this.target = this.target || this.href || this.$el;

            this.mode = hasTouch && this.mode == 'hover' ? 'click' : this.mode;

            if (this.mode === 'media') {
                return;
            }

            if (this.mode === 'hover') {
                this.$el.on({
                    mouseenter: function () { return this$1.toggle('toggleShow'); },
                    mouseleave: function () { return this$1.toggle('toggleHide'); }
                });
            }

            this.$el.on('click', function (e) {

                // TODO better isToggled handling
                if ($__default(e.target).closest('a[href="#"], button').length || $__default(e.target).closest('a[href]') && (this$1.cls || !this$1.target.is(':visible'))) {
                    e.preventDefault();
                }

                this$1.toggle();
            });

        },

        update: {

            write: function write() {

                if (this.mode !== 'media' || !this.media) {
                    return;
                }

                var toggled = this.isToggled(this.target);
                if (window.matchMedia(this.media).matches ? !toggled : toggled) {
                    this.toggle();
                }

            },

            events: ['load', 'resize', 'orientationchange']

        },

        methods: {

            toggle: function toggle(type) {

                var event = $__default.Event(type || 'toggle');
                this.target.triggerHandler(event, [this]);

                if (!event.isDefaultPrevented()) {
                    this.toggleElement(this.target);
                }
            }

        }

    });

}

function core (UIkit) {

    var scroll = null, dir, ticking, resizing;

    win
        .on('load', UIkit.update)
        .on('resize orientationchange', function (e) {
            if (!resizing) {
                requestAnimationFrame$1(function () {
                    UIkit.update(e);
                    resizing = false;
                });
                resizing = true;
            }
        })
        .on('scroll', function (e) {

            if (scroll === null) {
                scroll = window.pageYOffset;
            }

            dir = scroll < window.pageYOffset;
            scroll = window.pageYOffset;
            if (!ticking) {
                requestAnimationFrame$1(function () {
                    e.dir = dir ? 'down' : 'up';
                    UIkit.update(e);
                    ticking = false;
                });
                ticking = true;
            }
        });

    var started = 0;
    on(document, 'animationstart', function (ref) {
        var target = ref.target;

        fastdom.measure(function () {
            if (hasAnimation(target)) {
                fastdom.mutate(function () {
                    document.body.style.overflowX = 'hidden';
                    started++;
                });
            }
        });
    }, true);

    on(document, 'animationend', function (ref) {
        var target = ref.target;

        fastdom.measure(function () {
            if (hasAnimation(target) && !--started) {
                fastdom.mutate(function () { return document.body.style.overflowX = ''; })
            }
        });
    }, true);

    on(document.documentElement, 'webkitAnimationEnd', function (ref) {
        var target = ref.target;

        fastdom.measure(function () {
            if (getStyle(target, 'webkitFontSmoothing') === 'antialiased') {
                fastdom.mutate(function () {
                    target.style.webkitFontSmoothing = 'subpixel-antialiased';
                    setTimeout(function () { return target.style.webkitFontSmoothing = ''; });
                })
            }
        });
    }, true);

    // core components
    UIkit.use(Accordion);
    UIkit.use(Alert);
    UIkit.use(Cover);
    UIkit.use(Drop);
    UIkit.use(Dropdown);
    UIkit.use(FormCustom);
    UIkit.use(HeightMatch);
    UIkit.use(HeightViewport);
    UIkit.use(Hover);
    UIkit.use(Margin);
    UIkit.use(Gif);
    UIkit.use(Grid);
    UIkit.use(Modal$1);
    UIkit.use(Nav);
    UIkit.use(Navbar);
    UIkit.use(Offcanvas);
    UIkit.use(Responsive);
    UIkit.use(Scroll);
    UIkit.use(Scrollspy);
    UIkit.use(ScrollspyNav);
    UIkit.use(Sticky);
    UIkit.use(Svg);
    UIkit.use(Icon);
    UIkit.use(Spinner);
    UIkit.use(Switcher);
    UIkit.use(Tab);
    UIkit.use(Toggle);

    function hasAnimation(target) {
        return (getStyle(target, 'animationName') || '').lastIndexOf('uk-', 0) === 0;
    }
}

UIkit.version = '3.0.0';

mixin$1(UIkit);
core(UIkit);

if (typeof module !== 'undefined') {
    module.exports = UIkit;
}

return UIkit;

})));/*! UIkit 3.0.0-beta.2 | http://www.getuikit.com | (c) 2014 - 2016 YOOtheme | MIT License */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('uikit')) :
    typeof define === 'function' && define.amd ? define(['uikit'], factory) :
    (factory(global.UIkit));
}(this, (function (uikit) { 'use strict';

var $ = uikit.util.$;
var doc = uikit.util.doc;
var extend = uikit.util.extend;
var Dimensions = uikit.util.Dimensions;
var getIndex = uikit.util.getIndex;
var Transition = uikit.util.Transition;
var active;

doc.on({
    keydown: function (e) {
        if (active) {
            switch (e.keyCode) {
                case 37:
                    active.show('previous');
                    break;
                case 39:
                    active.show('next');
                    break;
            }
        }
    }
});

UIkit.component('lightbox', {

    name: 'lightbox',

    props: {
        toggle: String,
        duration: Number,
        inverse: Boolean
    },

    defaults: {
        toggle: 'a',
        duration: 400,
        dark: false,
        attrItem: 'uk-lightbox-item',
        items: [],
        index: 0
    },

    ready: function ready() {
        var this$1 = this;


        this.toggles = $(this.toggle, this.$el);

        this.toggles.each(function (i, el) {
            el = $(el);
            this$1.items.push({
                source: el.attr('href'),
                title: el.attr('title'),
                type: el.attr('type')
            })
        });

        this.$el.on('click', ((this.toggle) + ":not(.uk-disabled)"), function (e) {
            e.preventDefault();
            this$1.show(this$1.toggles.index(e.currentTarget));
        });

    },

    update: {

        write: function write() {
            var this$1 = this;


            var item = this.getItem();

            if (!this.modal || !item.content) {
                return;
            }

            var panel = this.modal.panel,
                dim = {width: panel.width(), height: panel.height()},
                max = {
                    width: window.innerWidth - (panel.outerWidth(true) - dim.width),
                    height: window.innerHeight - (panel.outerHeight(true) - dim.height)
                },
                newDim = Dimensions.fit({width: item.width, height: item.height}, max);

            Transition
                .stop(panel)
                .stop(this.modal.content);

            if (this.modal.content) {
                this.modal.content.remove();
            }

            this.modal.content = $(item.content).css('opacity', 0).appendTo(panel);
            panel.css(dim);

            Transition.start(panel, newDim, this.duration).then(function () {
                Transition.start(this$1.modal.content, {opacity: 1}, 400).then(function () {
                    panel.find('[uk-transition-hide]').show();
                    panel.find('[uk-transition-show]').hide();
                });
            });

        },

        events: ['resize', 'orientationchange']

    },

    events: {

        showitem: function showitem(e) {

            var item = this.getItem();

            if (item.content) {
                this.$update();
                e.stopImmediatePropagation();
            }
        }

    },

    methods: {

        show: function show(index) {
            var this$1 = this;


            this.index = getIndex(index, this.items, this.index);

            if (!this.modal) {
                this.modal = UIkit.modal.dialog("\n                    <button class=\"uk-modal-close-outside\" uk-transition-hide type=\"button\" uk-close></button>\n                    <span class=\"uk-position-center\" uk-transition-show uk-icon=\"icon: trash\"></span>\n                    ", {center: true});
                this.modal.$el.css('overflow', 'hidden').addClass('uk-modal-lightbox');
                this.modal.panel.css({width: 200, height: 200});
                this.modal.caption = $('<div class="uk-modal-caption" uk-transition-hide></div>').appendTo(this.modal.panel);

                if (this.items.length > 1) {
                    $(("<div class=\"" + (this.dark ? 'uk-dark' : 'uk-light') + "\" uk-transition-hide>\n                            <a href=\"#\" class=\"uk-position-center-left\" uk-slidenav=\"previous\" uk-lightbox-item=\"previous\"></a>\n                            <a href=\"#\" class=\"uk-position-center-right\" uk-slidenav=\"next\" uk-lightbox-item=\"next\"></a>\n                        </div>\n                    ")).appendTo(this.modal.panel.addClass('uk-slidenav-position'));
                }

                this.modal.$el
                    .on('hide', this.hide)
                    .on('click', ("[" + (this.attrItem) + "]"), function (e) {
                        e.preventDefault();
                        this$1.show($(e.currentTarget).attr(this$1.attrItem));
                    }).on('swipeRight swipeLeft', function (e) {
                    e.preventDefault();
                    if (!window.getSelection().toString()) {
                        this$1.show(e.type == 'swipeLeft' ? 'next' : 'previous');
                    }
                });
            }

            active = this;

            this.modal.panel.find('[uk-transition-hide]').hide();
            this.modal.panel.find('[uk-transition-show]').show();

            this.modal.content && this.modal.content.remove();
            this.modal.caption.text(this.getItem().title);

            var event = $.Event('showitem');
            this.$el.trigger(event);
            if (!event.isImmediatePropagationStopped()) {
                this.setError(this.getItem());
            }
        },

        hide: function hide() {
            var this$1 = this;


            active = active && active !== this && active;

            this.modal.hide().then(function () {
                this$1.modal.$destroy(true);
                this$1.modal = null;
            });
        },

        getItem: function getItem() {
            return this.items[this.index] || {source: '', title: '', type: ''};
        },

        setItem: function setItem(item, content, width, height) {
            if ( width === void 0 ) width = 200;
            if ( height === void 0 ) height = 200;

            extend(item, {content: content, width: width, height: height});
            this.$update();
        },

        setError: function setError(item) {
            this.setItem(item, '<div class="uk-position-cover uk-flex uk-flex-middle uk-flex-center"><strong>Loading resource failed!</strong></div>', 400, 300);
        }

    }

});

UIkit.mixin({

    events: {

        showitem: function showitem(e) {
            var this$1 = this;


            var item = this.getItem();

            if (item.type !== 'image' && item.source && !item.source.match(/\.(jp(e)?g|png|gif|svg)$/i)) {
                return;
            }

            var img = new Image();

            img.onerror = function () { return this$1.setError(item); };
            img.onload = function () { return this$1.setItem(item, ("<img class=\"uk-responsive-width\" width=\"" + (img.width) + "\" height=\"" + (img.height) + "\" src =\"" + (item.source) + "\">"), img.width, img.height); };

            img.src = item.source;

            e.stopImmediatePropagation();
        }

    }

}, 'lightbox');

UIkit.mixin({

    events: {

        showitem: function showitem(e) {
            var this$1 = this;


            var item = this.getItem();

            if (item.type !== 'video' && item.source && !item.source.match(/\.(mp4|webm|ogv)$/i)) {
                return;
            }

            var vid = $('<video class="uk-responsive-width" controls></video>')
                .on('loadedmetadata', function () { return this$1.setItem(item, vid.attr({width: vid[0].videoWidth, height: vid[0].videoHeight}), vid[0].videoWidth, vid[0].videoHeight); })
                .attr('src', item.source);

            e.stopImmediatePropagation();
        }

    }

}, 'lightbox');

UIkit.mixin({

    events: {

        showitem: function showitem(e) {
            var this$1 = this;


            var item = this.getItem(), matches;

            if (!(matches = item.source.match(/\/\/.*?youtube\.[a-z]+\/watch\?v=([^&]+)&?(.*)/)) && !(item.source.match(/youtu\.be\/(.*)/))) {
                return;
            }

            var id = matches[1],
                img = new Image(),
                lowres = false,
                setIframe = function (width, height) { return this$1.setItem(item, ("<iframe src=\"//www.youtube.com/embed/" + id + "\" width=\"" + width + "\" height=\"" + height + "\" style=\"max-width:100%;box-sizing:border-box;\"></iframe>"), width, height); };

            img.onerror = function () { return setIframe(640, 320); };
            img.onload = function () {
                //youtube default 404 thumb, fall back to lowres
                if (img.width === 120 && img.height === 90) {
                    if (!lowres) {
                        lowres = true;
                        img.src = "//img.youtube.com/vi/" + id + "/0.jpg";
                    } else {
                        setIframe(640, 320);
                    }
                } else {
                    setIframe(img.width, img.height);
                }
            };

            img.src = "//img.youtube.com/vi/" + id + "/maxresdefault.jpg";

            e.stopImmediatePropagation();
        }

    }

}, 'lightbox');

UIkit.mixin({

    events: {

        showitem: function showitem(e) {
            var this$1 = this;


            var item = this.getItem(), matches;

            if (!(matches = item.source.match(/(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/))) {
                return;
            }

            var id = matches[2],
                setIframe = function (width, height) { return this$1.setItem(item, ("<iframe src=\"//player.vimeo.com/video/" + id + "\" width=\"" + width + "\" height=\"" + height + "\" style=\"max-width:100%;box-sizing:border-box;\"></iframe>"), width, height); };

            $.ajax({type: 'GET', url: ("http://vimeo.com/api/oembed.json?url=" + (encodeURI(item.source))), jsonp: 'callback', dataType: 'jsonp'}).then(function (res) { return setIframe(res.width, res.height); });

            e.stopImmediatePropagation();
        }

    }

}, 'lightbox');

})));/*! UIkit 3.0.0-beta.2 | http://www.getuikit.com | (c) 2014 - 2016 YOOtheme | MIT License */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('uikit')) :
    typeof define === 'function' && define.amd ? define(['uikit'], factory) :
    (factory(global.UIkit));
}(this, (function (uikit) { 'use strict';

var $ = uikit.util.$;
var Transition = uikit.util.Transition;

var containers = {};

UIkit.component('notification', {

    defaults: {
        message: '',
        status: '',
        timeout: 5000,
        group: null,
        pos: 'top-center',
        onClose: null
    },

    created: function created() {

        if (!containers[this.pos]) {
            containers[this.pos] = $(("<div class=\"uk-notification uk-notification-" + (this.pos) + "\"></div>")).appendTo(uikit.container);
        }

        this.$mount($(
            ("<div class=\"uk-notification-message" + (this.status ? (" uk-notification-message-" + (this.status)) : '') + "\">\n                <a href=\"#\" class=\"uk-notification-close\" uk-close></a>\n                <div>" + (this.message) + "</div>\n            </div>")
        ).appendTo(containers[this.pos].show()));

    },

    ready: function ready() {
        var this$1 = this;


        var marginBottom = parseInt(this.$el.css('margin-bottom'), 10);

        Transition.start(
            this.$el.css({opacity: 0, marginTop: -1 * this.$el.outerHeight(), marginBottom: 0}),
            {opacity: 1, marginTop: 0, marginBottom: marginBottom}
        ).then(function () {
            if (this$1.timeout) {
                this$1.timer = setTimeout(this$1.close, this$1.timeout);
                this$1.$el
                    .on('mouseenter', function () { return clearTimeout(this$1.timer); })
                    .on('mouseleave', function () { return this$1.timer = setTimeout(this$1.close, this$1.timeout); });
            }
        });

    },

    events: {

        click: function click(e) {
            e.preventDefault();
            this.close();
        }

    },

    methods: {

        close: function close(immediate) {
            var this$1 = this;


            var remove = function () {

                this$1.onClose && this$1.onClose();
                this$1.$el.trigger('close', [this$1]).remove();

                if (!containers[this$1.pos].children().length) {
                    containers[this$1.pos].hide();
                }

            };

            if (this.timer) {
                clearTimeout(this.timer);
            }

            if (immediate) {
                remove();
            } else {
                Transition.start(this.$el, {opacity: 0, marginTop: -1 * this.$el.outerHeight(), marginBottom: 0}).then(remove)
            }
        }

    }

});

UIkit.notification.closeAll = function (group, immediate) {

    var notification;
    UIkit.elements.forEach(function (el) {
        if ((notification = UIkit.getComponent(el, 'notification')) && (!group || group === notification.group)) {
            notification.close(immediate);
        }
    });

};

})));/*! UIkit 3.0.0-beta.2 | http://www.getuikit.com | (c) 2014 - 2016 YOOtheme | MIT License */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('uikit')) :
    typeof define === 'function' && define.amd ? define(['uikit'], factory) :
    (factory(global.UIkit));
}(this, (function (uikit) { 'use strict';

var $ = uikit.util.$;
var doc = uikit.util.doc;
var extend = uikit.util.extend;
var isWithin = uikit.util.isWithin;
var Observer = uikit.util.Observer;
var on = uikit.util.on;
var off = uikit.util.off;
var pointerDown = uikit.util.pointerDown;
var pointerMove = uikit.util.pointerMove;
var pointerUp = uikit.util.pointerUp;
var requestAnimationFrame = uikit.util.requestAnimationFrame;
var win = uikit.util.win;

UIkit.component('sortable', {

    mixins: [uikit.mixin.class],

    props: {
        group: String,
        animation: Number,
        threshold: Number,
        clsItem: String,
        clsPlaceholder: String,
        clsDrag: String,
        clsDragState: String,
        clsBase: String,
        clsNoDrag: String,
        clsEmpty: String,
        clsCustom: String,
        handle: String
    },

    defaults: {
        group: false,
        animation: 150,
        threshold: 5,
        clsItem: 'uk-sortable-item',
        clsPlaceholder: 'uk-sortable-placeholder',
        clsDrag: 'uk-sortable-drag',
        clsDragState: 'uk-drag',
        clsBase: 'uk-sortable',
        clsNoDrag: 'uk-sortable-nodrag',
        clsEmpty: 'uk-sortable-empty',
        clsCustom: '',
        handle: false
    },

    ready: function ready() {
        var this$1 = this;


        ['init', 'start', 'move', 'end'].forEach(function (key) {
            var fn = this$1[key];
            this$1[key] = function (e) {
                e = e.originalEvent || e;
                this$1.scrollY = window.scrollY;
                var ref = e.touches && e.touches[0] || e;
                var pageX = ref.pageX;
                var pageY = ref.pageY;
                this$1.pos = {x: pageX, y: pageY};

                fn(e);
            }
        });

        on(this.$el, pointerDown, this.init);

        if (this.clsEmpty) {
            var empty = function () { return this$1.$el.toggleClass(this$1.clsEmpty, !this$1.$el.children().length); };
            (new Observer(empty)).observe(this.$el[0], {childList: true});
            empty();
        }

    },

    update: {

        write: function write() {
            var this$1 = this;


            if (!this.drag) {
                return;
            }

            this.drag.offset({top: this.pos.y + this.origin.top, left: this.pos.x + this.origin.left});

            var top = this.drag.offset().top, bottom = top + this.drag[0].offsetHeight;

            if (top > 0 && top < this.scrollY) {
                setTimeout(function () { return win.scrollTop(this$1.scrollY - 5); }, 5);
            } else if (bottom < doc[0].offsetHeight && bottom > window.innerHeight + this.scrollY) {
                setTimeout(function () { return win.scrollTop(this$1.scrollY + 5); }, 5);
            }

        }

    },

    methods: {

        init: function init(e) {

            var target = $(e.target), placeholder = this.$el.children().filter(function (i, el) { return isWithin(e.target, el); });

            if (!placeholder.length
                || target.is(':input')
                || this.handle && !isWithin(target, this.handle)
                || e.button && e.button !== 0
                || isWithin(target, ("." + (this.clsNoDrag)))
            ) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            this.touched = [this];
            this.placeholder = placeholder;
            this.origin = extend({target: target, index: this.placeholder.index()}, this.pos);

            doc.on(pointerMove, this.move);
            doc.on(pointerUp, this.end);
            win.on('scroll', this.scroll);

            if (!this.threshold) {
                this.start(e);
            }

        },

        start: function start(e) {

            this.drag = $(this.placeholder[0].outerHTML.replace(/^<li/i, '<div').replace(/li>$/i, 'div>'))
                .attr('uk-no-boot', '')
                .addClass(((this.clsDrag) + " " + (this.clsCustom)))
                .css({
                    boxSizing: 'border-box',
                    width: this.placeholder.outerWidth(),
                    height: this.placeholder.outerHeight()
                })
                .css(this.placeholder.css(['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom']))
                .appendTo(uikit.container);

            this.drag.children().first().height(this.placeholder.children().height());

            var ref = this.placeholder.offset();
            var left = ref.left;
            var top = ref.top;
            extend(this.origin, {left: left - this.pos.x, top: top - this.pos.y});

            this.placeholder.addClass(this.clsPlaceholder);
            this.$el.children().addClass(this.clsItem);
            doc.addClass(this.clsDragState);

            this.$el.trigger('start', [this, this.placeholder, this.drag]);

            this.move(e);
        },

        move: function move(e) {

            if (!this.drag) {

                if (Math.abs(this.pos.x - this.origin.x) > this.threshold || Math.abs(this.pos.y - this.origin.y) > this.threshold) {
                    this.start(e);
                }

                return;
            }

            this.update();

            var target = e.type === 'mousemove' ? e.target : document.elementFromPoint(this.pos.x - document.body.scrollLeft, this.pos.y - document.body.scrollTop),
                sortable = getSortable(target),
                previous = getSortable(this.placeholder[0]),
                move = sortable !== previous;

            if (!sortable || isWithin(target, this.placeholder) || move && (!sortable.group || sortable.group !== previous.group)) {
                return;
            }

            target = sortable.$el.is(target.parentNode) && $(target) || sortable.$el.children().has(target);

            if (move) {
                previous.remove(this.placeholder);
            } else if (!target.length) {
                return;
            }

            sortable.insert(this.placeholder, target);

            if (!~this.touched.indexOf(sortable)) {
                this.touched.push(sortable);
            }

        },

        scroll: function scroll() {
            var scroll = window.scrollY;
            if (scroll !== this.scrollY) {
                this.pos.y += scroll - this.scrollY;
                this.scrollY = scroll;
                this.update();
            }
        },

        end: function end(e) {

            doc.off(pointerMove, this.move);
            doc.off(pointerUp, this.end);
            win.off('scroll', this.scroll);

            if (!this.drag) {

                if (e.type !== 'mouseup' && isWithin(e.target, 'a[href]')) {
                    location.href = $(e.target).closest('a[href]').attr('href');
                }

                return;
            }

            preventClick();

            var sortable = getSortable(this.placeholder[0]);

            if (this === sortable) {
                if (this.origin.index !== this.placeholder.index()) {
                    this.$el.trigger('change', [this, this.placeholder, 'moved']);
                }
            } else {
                sortable.$el.trigger('change', [sortable, this.placeholder, 'added']);
                this.$el.trigger('change', [this, this.placeholder, 'removed']);
            }

            this.$el.trigger('stop', [this]);

            this.drag.remove();
            this.drag = null;

            this.touched.forEach(function (sortable) { return sortable.$el.children().removeClass(((sortable.clsPlaceholder) + " " + (sortable.clsItem))); });

            doc.removeClass(this.clsDragState);

        },

        update: function update() {
            this._callUpdate();
        },

        insert: function insert(element, target) {
            var this$1 = this;


            this.$el.children().addClass(this.clsItem);

            var insert = function () {

                if (target.length) {

                    if (!this$1.$el.has(element).length || element.prevAll().filter(target).length) {
                        element.insertBefore(target);
                    } else {
                        element.insertAfter(target);
                    }

                } else {
                    this$1.$el.append(element);
                }

                this$1.$updateParents();
            };

            if (this.animation) {
                this.animate(insert);
            } else {
                insert();
            }

        },

        remove: function remove(element) {
            var this$1 = this;


            if (!this.$el.has(element).length) {
                return;
            }

            var remove = function () {
                element.remove();
                this$1.$updateParents();
            };

            if (this.animation) {
                this.animate(remove);
            } else {
                remove();
            }

        },

        animate: function animate(action) {
            var this$1 = this;


            var props = [],
                children = this.$el.children().toArray().map(function (el) {
                    el = $(el);
                    props.push(extend({
                        position: 'absolute',
                        pointerEvents: 'none',
                        width: el.outerWidth(),
                        height: el.outerHeight()
                    }, el.position()));
                    return el;
                }),
                reset = {position: '', width: '', height: '', pointerEvents: '', top: '', left: ''};

            action();

            children.forEach(function (el) { return el.stop(); });
            this.$el.children().css(reset);
            this.$updateParents();

            requestAnimationFrame(function () {

                this$1.$el.css('min-height', this$1.$el.height());

                var positions = children.map(function (el) { return el.position(); });
                $.when.apply($, children.map(function (el, i) { return el.css(props[i]).animate(positions[i], this$1.animation).promise(); }))
                    .then(function () {
                        this$1.$el.css('min-height', '').children().css(reset);
                        this$1.$updateParents();
                    });
            })
        }

    }

});

function getSortable(element) {
    return UIkit.getComponent(element, 'sortable') || element.parentNode && getSortable(element.parentNode);
}

function preventClick() {
    var timer = setTimeout(function () { return doc.trigger('click'); }, 0),
        listener = function (e) {

            e.preventDefault();
            e.stopPropagation();

            clearTimeout(timer);
            off(doc, 'click', listener, true);
        };

    on(doc, 'click', listener, true);
}

})));/*! UIkit 3.0.0-beta.2 | http://www.getuikit.com | (c) 2014 - 2016 YOOtheme | MIT License */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('uikit')) :
    typeof define === 'function' && define.amd ? define(['uikit'], factory) :
    (factory(global.UIkit));
}(this, (function (uikit) { 'use strict';

var $ = uikit.util.$;
var flipPosition = uikit.util.flipPosition;

UIkit.component('tooltip', {

    mixins: [uikit.mixin.toggable, uikit.mixin.position],

    props: {
        delay: Number
    },

    defaults: {
        pos: 'top',
        delay: 0,
        animation: 'uk-animation-scale-up',
        duration: 100,
        cls: 'uk-active',
        clsPos: 'uk-tooltip'
    },

    ready: function ready() {
        this.content = this.$el.attr('title');
        this.$el
            .removeAttr('title')
            .attr('aria-expanded', false);
    },

    methods: {

        show: function show() {
            var this$1 = this;


            clearTimeout(this.showTimer);

            if (this.$el.attr('aria-expanded') === 'true') {
                return;
            }

            this.tooltip = $(("<div class=\"" + (this.clsPos) + "\" aria-hidden=\"true\"><div class=\"" + (this.clsPos) + "-inner\">" + (this.content) + "</div></div>")).appendTo(uikit.container);

            this.$el.attr('aria-expanded', true);

            this.positionAt(this.tooltip, this.$el);
            this.origin = this.getAxis() === 'y' ? ((flipPosition(this.dir)) + "-" + (this.align)) : ((this.align) + "-" + (flipPosition(this.dir)));

            this.showTimer = setTimeout(function () {
                this$1.toggleElement(this$1.tooltip, true);

                this$1.hideTimer = setInterval(function () {
                    if (!this$1.$el.is(':visible')) {
                        this$1.hide();
                    }
                }, 150);

            }, this.delay);
        },

        hide: function hide() {

            if (this.$el.is('input') && this.$el[0] === document.activeElement) {
                return;
            }

            clearTimeout(this.showTimer);
            clearInterval(this.hideTimer);
            this.$el.attr('aria-expanded', false);
            this.toggleElement(this.tooltip, false);
            this.tooltip.remove();
            this.tooltip = false;
        }

    },

    events: {
        'focus mouseenter': 'show',
        'blur mouseleave': 'hide'
    }

});

})));/*! UIkit 3.0.0-beta.2 | http://www.getuikit.com | (c) 2014 - 2016 YOOtheme | MIT License */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('uikit')) :
    typeof define === 'function' && define.amd ? define(['uikit'], factory) :
    (factory(global.UIkit));
}(this, (function (uikit) { 'use strict';

var $ = uikit.util.$;
var ajax = uikit.util.ajax;
var on = uikit.util.on;

UIkit.component('upload', {

    props: {
        allow: String,
        clsDragover: String,
        concurrent: Number,
        dataType: String,
        mime: String,
        msgInvalidMime: String,
        msgInvalidName: String,
        multiple: Boolean,
        name: String,
        params: Object,
        type: String,
        url: String
    },

    defaults: {
        allow: false,
        clsDragover: 'uk-dragover',
        concurrent: 1,
        dataType: undefined,
        mime: false,
        msgInvalidMime: 'Invalid File Type: %s',
        msgInvalidName: 'Invalid File Name: %s',
        multiple: false,
        name: 'files[]',
        params: {},
        type: 'POST',
        url: '',
        abort: null,
        beforeAll: null,
        beforeSend: null,
        complete: null,
        completeAll: null,
        error: null,
        fail: function fail(msg) {
            alert(msg);
        },
        load: null,
        loadEnd: null,
        loadStart: null,
        progress: null
    },

    events: {

        change: function change(e) {

            if (!$(e.target).is('input[type="file"]')) {
                return;
            }

            e.preventDefault();

            if (e.target.files) {
                this.upload(e.target.files);
            }

            e.target.value = '';
        },

        drop: function drop(e) {
            e.preventDefault();
            e.stopPropagation();

            var transfer = e.originalEvent.dataTransfer;

            if (!transfer || !transfer.files) {
                return;
            }

            this.$el.removeClass(this.clsDragover);

            this.upload(transfer.files);
        },

        dragenter: function dragenter(e) {
            e.preventDefault();
            e.stopPropagation();
        },

        dragover: function dragover(e) {
            e.preventDefault();
            e.stopPropagation();
            this.$el.addClass(this.clsDragover);
        },

        dragleave: function dragleave(e) {
            e.preventDefault();
            e.stopPropagation();
            this.$el.removeClass(this.clsDragover);
        }

    },

    methods: {

        upload: function upload(files) {
            var this$1 = this;


            if (!files.length) {
                return;
            }

            this.$el.trigger('upload', [files]);

            for (var i = 0; i < files.length; i++) {

                if (this$1.allow) {
                    if (!match(this$1.allow, files[i].name)) {
                        this$1.fail(this$1.msgInvalidName.replace(/%s/, this$1.allow));
                        return;
                    }
                }

                if (this$1.mime) {
                    if (!match(this$1.mime, files[i].type)) {
                        this$1.fail(this$1.msgInvalidMime.replace(/%s/, this$1.mime));
                        return;
                    }
                }

            }

            if (!this.multiple) {
                files = [files[0]];
            }

            this.beforeAll && this.beforeAll(this, files);

            var chunks = chunk(files, this.concurrent),
                upload = function (files) {

                    var data = new FormData();

                    files.forEach(function (file) { return data.append(this$1.name, file); });

                    for (var key in this$1.params) {
                        data.append(key, this$1.params[key]);
                    }

                    ajax({
                        data: data,
                        url: this$1.url,
                        type: this$1.type,
                        dataType: this$1.dataType,
                        beforeSend: this$1.beforeSend,
                        complete: [this$1.complete, function (xhr, status) {
                            if (chunks.length) {
                                upload(chunks.shift());
                            } else {
                                this$1.completeAll && this$1.completeAll(xhr);
                            }

                            if (status === 'abort') {
                                this$1.abort && this$1.abort(xhr);
                            }
                        }],
                        cache: false,
                        contentType: false,
                        processData: false,
                        xhr: function () {
                            var xhr = $.ajaxSettings.xhr();
                            xhr.upload && this$1.progress && on(xhr.upload, 'progress', this$1.progress);
                            ['loadStart', 'load', 'loadEnd', 'error', 'abort'].forEach(function (type) { return this$1[type] && on(xhr, type.toLowerCase(), this$1[type]); });
                            return xhr;
                        }
                    })

                };

            upload(chunks.shift());

        }

    }

});

function match(pattern, path) {
    return path.match(new RegExp(("^" + (pattern.replace(/\//g, '\\/').replace(/\*\*/g, '(\\/[^\\/]+)*').replace(/\*/g, '[^\\/]+').replace(/((?!\\))\?/g, '$1.')) + "$"), 'i'));
}

function chunk(files, size) {
    var chunks = [];
    for (var i = 0; i < files.length; i += size) {
        var chunk = [];
        for (var j = 0; j < size; j++) {
            chunk.push(files[i+j]);
        }
        chunks.push(chunk);
    }
    return chunks;
}

})));