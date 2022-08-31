/*! UIkit 3.15.6 | https://www.getuikit.com | (c) 2014 - 2022 YOOtheme | MIT License */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('uikit', factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.UIkit = factory());
})(this, (function () { 'use strict';

    const { hasOwnProperty, toString } = Object.prototype;

    function hasOwn(obj, key) {
      return hasOwnProperty.call(obj, key);
    }

    const hyphenateRe = /\B([A-Z])/g;

    const hyphenate = memoize((str) => str.replace(hyphenateRe, '-$1').toLowerCase());

    const camelizeRe = /-(\w)/g;

    const camelize = memoize((str) => str.replace(camelizeRe, toUpper));

    const ucfirst = memoize((str) =>
    str.length ? toUpper(null, str.charAt(0)) + str.slice(1) : '');


    function toUpper(_, c) {
      return c ? c.toUpperCase() : '';
    }

    function startsWith(str, search) {
      return str == null ? void 0 : str.startsWith == null ? void 0 : str.startsWith(search);
    }

    function endsWith(str, search) {
      return str == null ? void 0 : str.endsWith == null ? void 0 : str.endsWith(search);
    }

    function includes(obj, search) {
      return obj == null ? void 0 : obj.includes == null ? void 0 : obj.includes(search);
    }

    function findIndex(array, predicate) {
      return array == null ? void 0 : array.findIndex == null ? void 0 : array.findIndex(predicate);
    }

    const { isArray, from: toArray } = Array;
    const { assign } = Object;

    function isFunction(obj) {
      return typeof obj === 'function';
    }

    function isObject(obj) {
      return obj !== null && typeof obj === 'object';
    }

    function isPlainObject(obj) {
      return toString.call(obj) === '[object Object]';
    }

    function isWindow(obj) {
      return isObject(obj) && obj === obj.window;
    }

    function isDocument(obj) {
      return nodeType(obj) === 9;
    }

    function isNode(obj) {
      return nodeType(obj) >= 1;
    }

    function isElement(obj) {
      return nodeType(obj) === 1;
    }

    function nodeType(obj) {
      return !isWindow(obj) && isObject(obj) && obj.nodeType;
    }

    function isBoolean(value) {
      return typeof value === 'boolean';
    }

    function isString(value) {
      return typeof value === 'string';
    }

    function isNumber(value) {
      return typeof value === 'number';
    }

    function isNumeric(value) {
      return isNumber(value) || isString(value) && !isNaN(value - parseFloat(value));
    }

    function isEmpty(obj) {
      return !(isArray(obj) ? obj.length : isObject(obj) ? Object.keys(obj).length : false);
    }

    function isUndefined(value) {
      return value === void 0;
    }

    function toBoolean(value) {
      return isBoolean(value) ?
      value :
      value === 'true' || value === '1' || value === '' ?
      true :
      value === 'false' || value === '0' ?
      false :
      value;
    }

    function toNumber(value) {
      const number = Number(value);
      return isNaN(number) ? false : number;
    }

    function toFloat(value) {
      return parseFloat(value) || 0;
    }

    function toNode(element) {
      return toNodes(element)[0];
    }

    function toNodes(element) {
      return element && (isNode(element) ? [element] : Array.from(element).filter(isNode)) || [];
    }

    function toWindow(element) {var _element;
      if (isWindow(element)) {
        return element;
      }

      element = toNode(element);
      const document = isDocument(element) ? element : (_element = element) == null ? void 0 : _element.ownerDocument;

      return (document == null ? void 0 : document.defaultView) || window;
    }

    function isEqual(value, other) {
      return (
        value === other ||
        isObject(value) &&
        isObject(other) &&
        Object.keys(value).length === Object.keys(other).length &&
        each(value, (val, key) => val === other[key]));

    }

    function swap(value, a, b) {
      return value.replace(new RegExp(a + "|" + b, 'g'), (match) => match === a ? b : a);
    }

    function last(array) {
      return array[array.length - 1];
    }

    function each(obj, cb) {
      for (const key in obj) {
        if (false === cb(obj[key], key)) {
          return false;
        }
      }
      return true;
    }

    function sortBy$1(array, prop) {
      return array.
      slice().
      sort((_ref, _ref2) => {let { [prop]: propA = 0 } = _ref;let { [prop]: propB = 0 } = _ref2;return (
          propA > propB ? 1 : propB > propA ? -1 : 0);});

    }

    function uniqueBy(array, prop) {
      const seen = new Set();
      return array.filter((_ref3) => {let { [prop]: check } = _ref3;return seen.has(check) ? false : seen.add(check);});
    }

    function clamp(number, min, max) {if (min === void 0) {min = 0;}if (max === void 0) {max = 1;}
      return Math.min(Math.max(toNumber(number) || 0, min), max);
    }

    function noop() {}

    function intersectRect() {for (var _len = arguments.length, rects = new Array(_len), _key = 0; _key < _len; _key++) {rects[_key] = arguments[_key];}
      return [
      ['bottom', 'top'],
      ['right', 'left']].
      every(
      (_ref4) => {let [minProp, maxProp] = _ref4;return (
          Math.min(...rects.map((_ref5) => {let { [minProp]: min } = _ref5;return min;})) -
          Math.max(...rects.map((_ref6) => {let { [maxProp]: max } = _ref6;return max;})) >
          0);});

    }

    function pointInRect(point, rect) {
      return (
        point.x <= rect.right &&
        point.x >= rect.left &&
        point.y <= rect.bottom &&
        point.y >= rect.top);

    }

    function ratio(dimensions, prop, value) {
      const aProp = prop === 'width' ? 'height' : 'width';

      return {
        [aProp]: dimensions[prop] ?
        Math.round(value * dimensions[aProp] / dimensions[prop]) :
        dimensions[aProp],
        [prop]: value };

    }

    function contain(dimensions, maxDimensions) {
      dimensions = { ...dimensions };

      for (const prop in dimensions) {
        dimensions =
        dimensions[prop] > maxDimensions[prop] ?
        ratio(dimensions, prop, maxDimensions[prop]) :
        dimensions;
      }

      return dimensions;
    }

    function cover$1(dimensions, maxDimensions) {
      dimensions = contain(dimensions, maxDimensions);

      for (const prop in dimensions) {
        dimensions =
        dimensions[prop] < maxDimensions[prop] ?
        ratio(dimensions, prop, maxDimensions[prop]) :
        dimensions;
      }

      return dimensions;
    }

    const Dimensions = { ratio, contain, cover: cover$1 };

    function getIndex(i, elements, current, finite) {if (current === void 0) {current = 0;}if (finite === void 0) {finite = false;}
      elements = toNodes(elements);

      const { length } = elements;

      if (!length) {
        return -1;
      }

      i = isNumeric(i) ?
      toNumber(i) :
      i === 'next' ?
      current + 1 :
      i === 'previous' ?
      current - 1 :
      elements.indexOf(toNode(i));

      if (finite) {
        return clamp(i, 0, length - 1);
      }

      i %= length;

      return i < 0 ? i + length : i;
    }

    function memoize(fn) {
      const cache = Object.create(null);
      return (key) => cache[key] || (cache[key] = fn(key));
    }

    class Deferred {
      constructor() {
        this.promise = new Promise((resolve, reject) => {
          this.reject = reject;
          this.resolve = resolve;
        });
      }}

    function attr(element, name, value) {
      if (isObject(name)) {
        for (const key in name) {
          attr(element, key, name[key]);
        }
        return;
      }

      if (isUndefined(value)) {var _toNode;
        return (_toNode = toNode(element)) == null ? void 0 : _toNode.getAttribute(name);
      } else {
        for (const el of toNodes(element)) {
          if (isFunction(value)) {
            value = value.call(el, attr(el, name));
          }

          if (value === null) {
            removeAttr(el, name);
          } else {
            el.setAttribute(name, value);
          }
        }
      }
    }

    function hasAttr(element, name) {
      return toNodes(element).some((element) => element.hasAttribute(name));
    }

    function removeAttr(element, name) {
      const elements = toNodes(element);
      for (const attribute of name.split(' ')) {
        for (const element of elements) {
          element.removeAttribute(attribute);
        }
      }
    }

    function data(element, attribute) {
      for (const name of [attribute, "data-" + attribute]) {
        if (hasAttr(element, name)) {
          return attr(element, name);
        }
      }
    }

    const voidElements = {
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
      wbr: true };

    function isVoidElement(element) {
      return toNodes(element).some((element) => voidElements[element.tagName.toLowerCase()]);
    }

    function isVisible(element) {
      return toNodes(element).some(
      (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length);

    }

    const selInput = 'input,select,textarea,button';
    function isInput(element) {
      return toNodes(element).some((element) => matches(element, selInput));
    }

    const selFocusable = selInput + ",a[href],[tabindex]";
    function isFocusable(element) {
      return matches(element, selFocusable);
    }

    function parent(element) {var _toNode;
      return (_toNode = toNode(element)) == null ? void 0 : _toNode.parentElement;
    }

    function filter$1(element, selector) {
      return toNodes(element).filter((element) => matches(element, selector));
    }

    function matches(element, selector) {
      return toNodes(element).some((element) => element.matches(selector));
    }

    function closest(element, selector) {
      return isElement(element) ?
      element.closest(startsWith(selector, '>') ? selector.slice(1) : selector) :
      toNodes(element).
      map((element) => closest(element, selector)).
      filter(Boolean);
    }

    function within(element, selector) {
      return isString(selector) ?
      !!closest(element, selector) :
      toNode(selector).contains(toNode(element));
    }

    function parents(element, selector) {
      const elements = [];

      while (element = parent(element)) {
        if (!selector || matches(element, selector)) {
          elements.push(element);
        }
      }

      return elements;
    }

    function children(element, selector) {
      element = toNode(element);
      const children = element ? toNodes(element.children) : [];
      return selector ? filter$1(children, selector) : children;
    }

    function index(element, ref) {
      return ref ? toNodes(element).indexOf(toNode(ref)) : children(parent(element)).indexOf(element);
    }

    function query(selector, context) {
      return find(selector, getContext(selector, context));
    }

    function queryAll(selector, context) {
      return findAll(selector, getContext(selector, context));
    }

    function find(selector, context) {
      return toNode(_query(selector, context, 'querySelector'));
    }

    function findAll(selector, context) {
      return toNodes(_query(selector, context, 'querySelectorAll'));
    }

    const contextSelectorRe = /(^|[^\\],)\s*[!>+~-]/;
    const isContextSelector = memoize((selector) => selector.match(contextSelectorRe));

    function getContext(selector, context) {if (context === void 0) {context = document;}
      return isString(selector) && isContextSelector(selector) || isDocument(context) ?
      context :
      context.ownerDocument;
    }

    const contextSanitizeRe = /([!>+~-])(?=\s+[!>+~-]|\s*$)/g;
    const sanatize = memoize((selector) => selector.replace(contextSanitizeRe, '$1 *'));

    function _query(selector, context, queryFn) {if (context === void 0) {context = document;}
      if (!selector || !isString(selector)) {
        return selector;
      }

      selector = sanatize(selector);

      if (isContextSelector(selector)) {
        const split = splitSelector(selector);
        selector = '';
        for (let sel of split) {
          let ctx = context;

          if (sel[0] === '!') {
            const selectors = sel.substr(1).trim().split(' ');
            ctx = closest(parent(context), selectors[0]);
            sel = selectors.slice(1).join(' ').trim();
            if (!sel.length && split.length === 1) {
              return ctx;
            }
          }

          if (sel[0] === '-') {
            const selectors = sel.substr(1).trim().split(' ');
            const prev = (ctx || context).previousElementSibling;
            ctx = matches(prev, sel.substr(1)) ? prev : null;
            sel = selectors.slice(1).join(' ');
          }

          if (ctx) {
            selector += "" + (selector ? ',' : '') + domPath(ctx) + " " + sel;
          }
        }

        context = document;
      }

      try {
        return context[queryFn](selector);
      } catch (e) {
        return null;
      }
    }

    const selectorRe = /.*?[^\\](?:,|$)/g;

    const splitSelector = memoize((selector) =>
    selector.match(selectorRe).map((selector) => selector.replace(/,$/, '').trim()));


    function domPath(element) {
      const names = [];
      while (element.parentNode) {
        const id = attr(element, 'id');
        if (id) {
          names.unshift("#" + escape(id));
          break;
        } else {
          let { tagName } = element;
          if (tagName !== 'HTML') {
            tagName += ":nth-child(" + (index(element) + 1) + ")";
          }
          names.unshift(tagName);
          element = element.parentNode;
        }
      }
      return names.join(' > ');
    }

    function escape(css) {
      return isString(css) ? CSS.escape(css) : '';
    }

    function on() {for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
      let [targets, types, selector, listener, useCapture = false] = getArgs(args);

      if (listener.length > 1) {
        listener = detail(listener);
      }

      if (useCapture != null && useCapture.self) {
        listener = selfFilter(listener);
      }

      if (selector) {
        listener = delegate(selector, listener);
      }

      for (const type of types) {
        for (const target of targets) {
          target.addEventListener(type, listener, useCapture);
        }
      }

      return () => off(targets, types, listener, useCapture);
    }

    function off() {for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {args[_key2] = arguments[_key2];}
      let [targets, types,, listener, useCapture = false] = getArgs(args);
      for (const type of types) {
        for (const target of targets) {
          target.removeEventListener(type, listener, useCapture);
        }
      }
    }

    function once() {for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {args[_key3] = arguments[_key3];}
      const [element, types, selector, listener, useCapture = false, condition] = getArgs(args);
      const off = on(
      element,
      types,
      selector,
      (e) => {
        const result = !condition || condition(e);
        if (result) {
          off();
          listener(e, result);
        }
      },
      useCapture);


      return off;
    }

    function trigger(targets, event, detail) {
      return toEventTargets(targets).every((target) =>
      target.dispatchEvent(createEvent(event, true, true, detail)));

    }

    function createEvent(e, bubbles, cancelable, detail) {if (bubbles === void 0) {bubbles = true;}if (cancelable === void 0) {cancelable = false;}
      if (isString(e)) {
        e = new CustomEvent(e, { bubbles, cancelable, detail });
      }

      return e;
    }

    function getArgs(args) {
      // Event targets
      args[0] = toEventTargets(args[0]);

      // Event types
      if (isString(args[1])) {
        args[1] = args[1].split(' ');
      }

      // Delegate?
      if (isFunction(args[2])) {
        args.splice(2, 0, false);
      }

      return args;
    }

    function delegate(selector, listener) {
      return (e) => {
        const current =
        selector[0] === '>' ?
        findAll(selector, e.currentTarget).
        reverse().
        filter((element) => within(e.target, element))[0] :
        closest(e.target, selector);

        if (current) {
          e.current = current;
          listener.call(this, e);
        }
      };
    }

    function detail(listener) {
      return (e) => isArray(e.detail) ? listener(e, ...e.detail) : listener(e);
    }

    function selfFilter(listener) {
      return function (e) {
        if (e.target === e.currentTarget || e.target === e.current) {
          return listener.call(null, e);
        }
      };
    }

    function isEventTarget(target) {
      return target && 'addEventListener' in target;
    }

    function toEventTarget(target) {
      return isEventTarget(target) ? target : toNode(target);
    }

    function toEventTargets(target) {
      return isArray(target) ?
      target.map(toEventTarget).filter(Boolean) :
      isString(target) ?
      findAll(target) :
      isEventTarget(target) ?
      [target] :
      toNodes(target);
    }

    function isTouch(e) {
      return e.pointerType === 'touch' || !!e.touches;
    }

    function getEventPos(e) {var _e$touches, _e$changedTouches;
      const { clientX: x, clientY: y } = ((_e$touches = e.touches) == null ? void 0 : _e$touches[0]) || ((_e$changedTouches = e.changedTouches) == null ? void 0 : _e$changedTouches[0]) || e;

      return { x, y };
    }

    function ajax(url, options) {
      const env = {
        data: null,
        method: 'GET',
        headers: {},
        xhr: new XMLHttpRequest(),
        beforeSend: noop,
        responseType: '',
        ...options };

      return Promise.resolve().
      then(() => env.beforeSend(env)).
      then(() => send(url, env));
    }

    function send(url, env) {
      return new Promise((resolve, reject) => {
        const { xhr } = env;

        for (const prop in env) {
          if (prop in xhr) {
            try {
              xhr[prop] = env[prop];
            } catch (e) {
              // noop
            }
          }
        }

        xhr.open(env.method.toUpperCase(), url);

        for (const header in env.headers) {
          xhr.setRequestHeader(header, env.headers[header]);
        }

        on(xhr, 'load', () => {
          if (xhr.status === 0 || xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            resolve(xhr);
          } else {
            reject(
            assign(Error(xhr.statusText), {
              xhr,
              status: xhr.status }));


          }
        });

        on(xhr, 'error', () => reject(assign(Error('Network Error'), { xhr })));
        on(xhr, 'timeout', () => reject(assign(Error('Network Timeout'), { xhr })));

        xhr.send(env.data);
      });
    }

    function getImage(src, srcset, sizes) {
      return new Promise((resolve, reject) => {
        const img = new Image();

        img.onerror = (e) => {
          reject(e);
        };
        img.onload = () => {
          resolve(img);
        };

        sizes && (img.sizes = sizes);
        srcset && (img.srcset = srcset);
        img.src = src;
      });
    }

    const cssNumber = {
      'animation-iteration-count': true,
      'column-count': true,
      'fill-opacity': true,
      'flex-grow': true,
      'flex-shrink': true,
      'font-weight': true,
      'line-height': true,
      opacity: true,
      order: true,
      orphans: true,
      'stroke-dasharray': true,
      'stroke-dashoffset': true,
      widows: true,
      'z-index': true,
      zoom: true };


    function css(element, property, value, priority) {if (priority === void 0) {priority = '';}
      const elements = toNodes(element);
      for (const element of elements) {
        if (isString(property)) {
          property = propName(property);

          if (isUndefined(value)) {
            return getComputedStyle(element).getPropertyValue(property);
          } else {
            element.style.setProperty(
            property,
            isNumeric(value) && !cssNumber[property] ?
            value + "px" :
            value || isNumber(value) ?
            value :
            '',
            priority);

          }
        } else if (isArray(property)) {
          const props = {};
          for (const prop of property) {
            props[prop] = css(element, prop);
          }
          return props;
        } else if (isObject(property)) {
          priority = value;
          each(property, (value, property) => css(element, property, value, priority));
        }
      }
      return elements[0];
    }

    // https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-setproperty
    const propName = memoize((name) => vendorPropName(name));

    function vendorPropName(name) {
      if (startsWith(name, '--')) {
        return name;
      }

      name = hyphenate(name);

      const { style } = document.documentElement;

      if (name in style) {
        return name;
      }

      for (const prefix of ['webkit', 'moz']) {
        const prefixedName = "-" + prefix + "-" + name;
        if (prefixedName in style) {
          return prefixedName;
        }
      }
    }

    function addClass(element) {for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {args[_key - 1] = arguments[_key];}
      apply$1(element, args, 'add');
    }

    function removeClass(element) {for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {args[_key2 - 1] = arguments[_key2];}
      apply$1(element, args, 'remove');
    }

    function removeClasses(element, cls) {
      attr(element, 'class', (value) =>
      (value || '').replace(new RegExp("\\b" + cls + "\\b\\s?", 'g'), ''));

    }

    function replaceClass(element) {
      (arguments.length <= 1 ? undefined : arguments[1]) && removeClass(element, arguments.length <= 1 ? undefined : arguments[1]);
      (arguments.length <= 2 ? undefined : arguments[2]) && addClass(element, arguments.length <= 2 ? undefined : arguments[2]);
    }

    function hasClass(element, cls) {
      [cls] = getClasses(cls);
      return !!cls && toNodes(element).some((node) => node.classList.contains(cls));
    }

    function toggleClass(element, cls, force) {
      const classes = getClasses(cls);

      if (!isUndefined(force)) {
        force = !!force;
      }

      for (const node of toNodes(element)) {
        for (const cls of classes) {
          node.classList.toggle(cls, force);
        }
      }
    }

    function apply$1(element, args, fn) {
      args = args.reduce((args, arg) => args.concat(getClasses(arg)), []);

      for (const node of toNodes(element)) {
        node.classList[fn](...args);
      }
    }

    function getClasses(str) {
      return String(str).split(/\s|,/).filter(Boolean);
    }

    function transition$1(element, props, duration, timing) {if (duration === void 0) {duration = 400;}if (timing === void 0) {timing = 'linear';}
      duration = Math.round(duration);
      return Promise.all(
      toNodes(element).map(
      (element) =>
      new Promise((resolve, reject) => {
        for (const name in props) {
          const value = css(element, name);
          if (value === '') {
            css(element, name, value);
          }
        }

        const timer = setTimeout(() => trigger(element, 'transitionend'), duration);

        once(
        element,
        'transitionend transitioncanceled',
        (_ref) => {let { type } = _ref;
          clearTimeout(timer);
          removeClass(element, 'uk-transition');
          css(element, {
            transitionProperty: '',
            transitionDuration: '',
            transitionTimingFunction: '' });

          type === 'transitioncanceled' ? reject() : resolve(element);
        },
        { self: true });


        addClass(element, 'uk-transition');
        css(element, {
          transitionProperty: Object.keys(props).map(propName).join(','),
          transitionDuration: duration + "ms",
          transitionTimingFunction: timing,
          ...props });

      })));


    }

    const Transition = {
      start: transition$1,

      async stop(element) {
        trigger(element, 'transitionend');
        await Promise.resolve();
      },

      async cancel(element) {
        trigger(element, 'transitioncanceled');
        await Promise.resolve();
      },

      inProgress(element) {
        return hasClass(element, 'uk-transition');
      } };


    const animationPrefix = 'uk-animation-';

    function animate$2(element, animation, duration, origin, out) {if (duration === void 0) {duration = 200;}
      return Promise.all(
      toNodes(element).map(
      (element) =>
      new Promise((resolve, reject) => {
        trigger(element, 'animationcanceled');
        const timer = setTimeout(() => trigger(element, 'animationend'), duration);

        once(
        element,
        'animationend animationcanceled',
        (_ref2) => {let { type } = _ref2;
          clearTimeout(timer);

          type === 'animationcanceled' ? reject() : resolve(element);

          css(element, 'animationDuration', '');
          removeClasses(element, animationPrefix + "\\S*");
        },
        { self: true });


        css(element, 'animationDuration', duration + "ms");
        addClass(element, animation, animationPrefix + (out ? 'leave' : 'enter'));

        if (startsWith(animation, animationPrefix)) {
          origin && addClass(element, "uk-transform-origin-" + origin);
          out && addClass(element, animationPrefix + "reverse");
        }
      })));


    }

    const inProgressRe = new RegExp(animationPrefix + "(enter|leave)");

    const Animation = {
      in: animate$2,

      out(element, animation, duration, origin) {
        return animate$2(element, animation, duration, origin, true);
      },

      inProgress(element) {
        return inProgressRe.test(attr(element, 'class'));
      },

      cancel(element) {
        trigger(element, 'animationcanceled');
      } };

    const dirs$1 = {
      width: ['left', 'right'],
      height: ['top', 'bottom'] };


    function dimensions$1(element) {
      const rect = isElement(element) ?
      toNode(element).getBoundingClientRect() :
      { height: height(element), width: width(element), top: 0, left: 0 };

      return {
        height: rect.height,
        width: rect.width,
        top: rect.top,
        left: rect.left,
        bottom: rect.top + rect.height,
        right: rect.left + rect.width };

    }

    function offset(element, coordinates) {
      const currentOffset = dimensions$1(element);

      if (element) {
        const { scrollY, scrollX } = toWindow(element);
        const offsetBy = { height: scrollY, width: scrollX };

        for (const dir in dirs$1) {
          for (const prop of dirs$1[dir]) {
            currentOffset[prop] += offsetBy[dir];
          }
        }
      }

      if (!coordinates) {
        return currentOffset;
      }

      const pos = css(element, 'position');

      each(css(element, ['left', 'top']), (value, prop) =>
      css(
      element,
      prop,
      coordinates[prop] -
      currentOffset[prop] +
      toFloat(pos === 'absolute' && value === 'auto' ? position(element)[prop] : value)));


    }

    function position(element) {
      let { top, left } = offset(element);

      const {
        ownerDocument: { body, documentElement },
        offsetParent } =
      toNode(element);
      let parent = offsetParent || documentElement;

      while (
      parent && (
      parent === body || parent === documentElement) &&
      css(parent, 'position') === 'static')
      {
        parent = parent.parentNode;
      }

      if (isElement(parent)) {
        const parentOffset = offset(parent);
        top -= parentOffset.top + toFloat(css(parent, 'borderTopWidth'));
        left -= parentOffset.left + toFloat(css(parent, 'borderLeftWidth'));
      }

      return {
        top: top - toFloat(css(element, 'marginTop')),
        left: left - toFloat(css(element, 'marginLeft')) };

    }

    function offsetPosition(element) {
      element = toNode(element);

      const offset = [element.offsetTop, element.offsetLeft];

      while (element = element.offsetParent) {
        offset[0] += element.offsetTop + toFloat(css(element, "borderTopWidth"));
        offset[1] += element.offsetLeft + toFloat(css(element, "borderLeftWidth"));

        if (css(element, 'position') === 'fixed') {
          const win = toWindow(element);
          offset[0] += win.scrollY;
          offset[1] += win.scrollX;
          return offset;
        }
      }

      return offset;
    }

    const height = dimension('height');
    const width = dimension('width');

    function dimension(prop) {
      const propName = ucfirst(prop);
      return (element, value) => {
        if (isUndefined(value)) {
          if (isWindow(element)) {
            return element["inner" + propName];
          }

          if (isDocument(element)) {
            const doc = element.documentElement;
            return Math.max(doc["offset" + propName], doc["scroll" + propName]);
          }

          element = toNode(element);

          value = css(element, prop);
          value = value === 'auto' ? element["offset" + propName] : toFloat(value) || 0;

          return value - boxModelAdjust(element, prop);
        } else {
          return css(
          element,
          prop,
          !value && value !== 0 ? '' : +value + boxModelAdjust(element, prop) + 'px');

        }
      };
    }

    function boxModelAdjust(element, prop, sizing) {if (sizing === void 0) {sizing = 'border-box';}
      return css(element, 'boxSizing') === sizing ?
      dirs$1[prop].
      map(ucfirst).
      reduce(
      (value, prop) =>
      value +
      toFloat(css(element, "padding" + prop)) +
      toFloat(css(element, "border" + prop + "Width")),
      0) :

      0;
    }

    function flipPosition(pos) {
      for (const dir in dirs$1) {
        for (const i in dirs$1[dir]) {
          if (dirs$1[dir][i] === pos) {
            return dirs$1[dir][1 - i];
          }
        }
      }
      return pos;
    }

    function toPx(value, property, element, offsetDim) {if (property === void 0) {property = 'width';}if (element === void 0) {element = window;}if (offsetDim === void 0) {offsetDim = false;}
      if (!isString(value)) {
        return toFloat(value);
      }

      return parseCalc(value).reduce((result, value) => {
        const unit = parseUnit(value);
        if (unit) {
          value = percent(
          unit === 'vh' ?
          height(toWindow(element)) :
          unit === 'vw' ?
          width(toWindow(element)) :
          offsetDim ?
          element["offset" + ucfirst(property)] :
          dimensions$1(element)[property],
          value);

        }

        return result + toFloat(value);
      }, 0);
    }

    const calcRe = /-?\d+(?:\.\d+)?(?:v[wh]|%|px)?/g;
    const parseCalc = memoize((calc) => calc.toString().replace(/\s/g, '').match(calcRe) || []);
    const unitRe$1 = /(?:v[hw]|%)$/;
    const parseUnit = memoize((str) => (str.match(unitRe$1) || [])[0]);

    function percent(base, value) {
      return base * toFloat(value) / 100;
    }

    function ready(fn) {
      if (document.readyState !== 'loading') {
        fn();
        return;
      }

      once(document, 'DOMContentLoaded', fn);
    }

    function isTag(element, tagName) {var _element$tagName;
      return (element == null ? void 0 : (_element$tagName = element.tagName) == null ? void 0 : _element$tagName.toLowerCase()) === tagName.toLowerCase();
    }

    function empty(element) {
      element = $(element);
      element.innerHTML = '';
      return element;
    }

    function html(parent, html) {
      return isUndefined(html) ? $(parent).innerHTML : append(empty(parent), html);
    }

    const prepend = applyFn('prepend');
    const append = applyFn('append');
    const before = applyFn('before');
    const after = applyFn('after');

    function applyFn(fn) {
      return function (ref, element) {var _$;
        const nodes = toNodes(isString(element) ? fragment(element) : element);
        (_$ = $(ref)) == null ? void 0 : _$[fn](...nodes);
        return unwrapSingle(nodes);
      };
    }

    function remove$1(element) {
      toNodes(element).forEach((element) => element.remove());
    }

    function wrapAll(element, structure) {
      structure = toNode(before(element, structure));

      while (structure.firstChild) {
        structure = structure.firstChild;
      }

      append(structure, element);

      return structure;
    }

    function wrapInner(element, structure) {
      return toNodes(
      toNodes(element).map((element) =>
      element.hasChildNodes() ?
      wrapAll(toNodes(element.childNodes), structure) :
      append(element, structure)));


    }

    function unwrap(element) {
      toNodes(element).
      map(parent).
      filter((value, index, self) => self.indexOf(value) === index).
      forEach((parent) => parent.replaceWith(...parent.childNodes));
    }

    const fragmentRe = /^\s*<(\w+|!)[^>]*>/;
    const singleTagRe = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;

    function fragment(html) {
      const matches = singleTagRe.exec(html);
      if (matches) {
        return document.createElement(matches[1]);
      }

      const container = document.createElement('div');
      if (fragmentRe.test(html)) {
        container.insertAdjacentHTML('beforeend', html.trim());
      } else {
        container.textContent = html;
      }

      return unwrapSingle(container.childNodes);
    }

    function unwrapSingle(nodes) {
      return nodes.length > 1 ? nodes : nodes[0];
    }

    function apply(node, fn) {
      if (!isElement(node)) {
        return;
      }

      fn(node);
      node = node.firstElementChild;
      while (node) {
        const next = node.nextElementSibling;
        apply(node, fn);
        node = next;
      }
    }

    function $(selector, context) {
      return isHtml(selector) ? toNode(fragment(selector)) : find(selector, context);
    }

    function $$(selector, context) {
      return isHtml(selector) ? toNodes(fragment(selector)) : findAll(selector, context);
    }

    function isHtml(str) {
      return isString(str) && startsWith(str.trim(), '<');
    }

    const inBrowser = typeof window !== 'undefined';
    const isRtl = inBrowser && attr(document.documentElement, 'dir') === 'rtl';

    const hasTouch = inBrowser && 'ontouchstart' in window;
    const hasPointerEvents = inBrowser && window.PointerEvent;

    const pointerDown$1 = hasPointerEvents ? 'pointerdown' : hasTouch ? 'touchstart' : 'mousedown';
    const pointerMove$1 = hasPointerEvents ? 'pointermove' : hasTouch ? 'touchmove' : 'mousemove';
    const pointerUp$1 = hasPointerEvents ? 'pointerup' : hasTouch ? 'touchend' : 'mouseup';
    const pointerEnter = hasPointerEvents ? 'pointerenter' : hasTouch ? '' : 'mouseenter';
    const pointerLeave = hasPointerEvents ? 'pointerleave' : hasTouch ? '' : 'mouseleave';
    const pointerCancel = hasPointerEvents ? 'pointercancel' : 'touchcancel';

    /*
        Based on:
        Copyright (c) 2016 Wilson Page wilsonpage@me.com
        https://github.com/wilsonpage/fastdom
    */

    const fastdom = {
      reads: [],
      writes: [],

      read(task) {
        this.reads.push(task);
        scheduleFlush();
        return task;
      },

      write(task) {
        this.writes.push(task);
        scheduleFlush();
        return task;
      },

      clear(task) {
        remove(this.reads, task);
        remove(this.writes, task);
      },

      flush };


    function flush(recursion) {
      runTasks(fastdom.reads);
      runTasks(fastdom.writes.splice(0));

      fastdom.scheduled = false;

      if (fastdom.reads.length || fastdom.writes.length) {
        scheduleFlush(recursion + 1);
      }
    }

    const RECURSION_LIMIT = 4;
    function scheduleFlush(recursion) {
      if (fastdom.scheduled) {
        return;
      }

      fastdom.scheduled = true;
      if (recursion && recursion < RECURSION_LIMIT) {
        Promise.resolve().then(() => flush(recursion));
      } else {
        requestAnimationFrame(() => flush(1));
      }
    }

    function runTasks(tasks) {
      let task;
      while (task = tasks.shift()) {
        try {
          task();
        } catch (e) {
          console.error(e);
        }
      }
    }

    function remove(array, item) {
      const index = array.indexOf(item);
      return ~index && array.splice(index, 1);
    }

    function MouseTracker() {}

    MouseTracker.prototype = {
      positions: [],

      init() {
        this.positions = [];

        let position;
        this.unbind = on(document, 'mousemove', (e) => position = getEventPos(e));
        this.interval = setInterval(() => {
          if (!position) {
            return;
          }

          this.positions.push(position);

          if (this.positions.length > 5) {
            this.positions.shift();
          }
        }, 50);
      },

      cancel() {var _this$unbind;
        (_this$unbind = this.unbind) == null ? void 0 : _this$unbind.call(this);
        this.interval && clearInterval(this.interval);
      },

      movesTo(target) {
        if (this.positions.length < 2) {
          return false;
        }

        const p = target.getBoundingClientRect();
        const { left, right, top, bottom } = p;

        const [prevPosition] = this.positions;
        const position = last(this.positions);
        const path = [prevPosition, position];

        if (pointInRect(position, p)) {
          return false;
        }

        const diagonals = [
        [
        { x: left, y: top },
        { x: right, y: bottom }],

        [
        { x: left, y: bottom },
        { x: right, y: top }]];



        return diagonals.some((diagonal) => {
          const intersection = intersect(path, diagonal);
          return intersection && pointInRect(intersection, p);
        });
      } };


    // Inspired by http://paulbourke.net/geometry/pointlineplane/
    function intersect(_ref, _ref2) {let [{ x: x1, y: y1 }, { x: x2, y: y2 }] = _ref;let [{ x: x3, y: y3 }, { x: x4, y: y4 }] = _ref2;
      const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

      // Lines are parallel
      if (denominator === 0) {
        return false;
      }

      const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;

      if (ua < 0) {
        return false;
      }

      // Return an object with the x and y coordinates of the intersection
      return { x: x1 + ua * (x2 - x1), y: y1 + ua * (y2 - y1) };
    }

    function observeIntersection(targets, cb, options, intersecting) {if (intersecting === void 0) {intersecting = true;}
      const observer = new IntersectionObserver(
      intersecting ?
      (entries, observer) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          cb(entries, observer);
        }
      } :
      cb,
      options);

      for (const el of toNodes(targets)) {
        observer.observe(el);
      }

      return observer;
    }

    const hasResizeObserver = inBrowser && window.ResizeObserver;
    function observeResize(targets, cb, options) {if (options === void 0) {options = { box: 'border-box' };}
      if (hasResizeObserver) {
        return observe(ResizeObserver, targets, cb, options);
      }

      // Fallback Safari < 13.1
      initResizeListener();
      listeners.add(cb);

      return {
        disconnect() {
          listeners.delete(cb);
        } };

    }

    let listeners;
    function initResizeListener() {
      if (listeners) {
        return;
      }

      listeners = new Set();

      // throttle 'resize'
      let pendingResize;
      const handleResize = () => {
        if (pendingResize) {
          return;
        }
        pendingResize = true;
        requestAnimationFrame(() => pendingResize = false);
        for (const listener of listeners) {
          listener();
        }
      };

      on(window, 'load resize', handleResize);
      on(document, 'loadedmetadata load', handleResize, true);
    }

    function observeMutation(targets, cb, options) {
      return observe(MutationObserver, targets, cb, options);
    }

    function observe(Observer, targets, cb, options) {
      const observer = new Observer(cb);
      for (const el of toNodes(targets)) {
        observer.observe(el, options);
      }

      return observer;
    }

    const strats = {};

    strats.events =
    strats.created =
    strats.beforeConnect =
    strats.connected =
    strats.beforeDisconnect =
    strats.disconnected =
    strats.destroy =
    concatStrat;

    // args strategy
    strats.args = function (parentVal, childVal) {
      return childVal !== false && concatStrat(childVal || parentVal);
    };

    // update strategy
    strats.update = function (parentVal, childVal) {
      return sortBy$1(
      concatStrat(parentVal, isFunction(childVal) ? { read: childVal } : childVal),
      'order');

    };

    // property strategy
    strats.props = function (parentVal, childVal) {
      if (isArray(childVal)) {
        const value = {};
        for (const key of childVal) {
          value[key] = String;
        }
        childVal = value;
      }

      return strats.methods(parentVal, childVal);
    };

    // extend strategy
    strats.computed = strats.methods = function (parentVal, childVal) {
      return childVal ? parentVal ? { ...parentVal, ...childVal } : childVal : parentVal;
    };

    // data strategy
    strats.data = function (parentVal, childVal, vm) {
      if (!vm) {
        if (!childVal) {
          return parentVal;
        }

        if (!parentVal) {
          return childVal;
        }

        return function (vm) {
          return mergeFnData(parentVal, childVal, vm);
        };
      }

      return mergeFnData(parentVal, childVal, vm);
    };

    function mergeFnData(parentVal, childVal, vm) {
      return strats.computed(
      isFunction(parentVal) ? parentVal.call(vm, vm) : parentVal,
      isFunction(childVal) ? childVal.call(vm, vm) : childVal);

    }

    // concat strategy
    function concatStrat(parentVal, childVal) {
      parentVal = parentVal && !isArray(parentVal) ? [parentVal] : parentVal;

      return childVal ?
      parentVal ?
      parentVal.concat(childVal) :
      isArray(childVal) ?
      childVal :
      [childVal] :
      parentVal;
    }

    // default strategy
    function defaultStrat(parentVal, childVal) {
      return isUndefined(childVal) ? parentVal : childVal;
    }

    function mergeOptions(parent, child, vm) {
      const options = {};

      if (isFunction(child)) {
        child = child.options;
      }

      if (child.extends) {
        parent = mergeOptions(parent, child.extends, vm);
      }

      if (child.mixins) {
        for (const mixin of child.mixins) {
          parent = mergeOptions(parent, mixin, vm);
        }
      }

      for (const key in parent) {
        mergeKey(key);
      }

      for (const key in child) {
        if (!hasOwn(parent, key)) {
          mergeKey(key);
        }
      }

      function mergeKey(key) {
        options[key] = (strats[key] || defaultStrat)(parent[key], child[key], vm);
      }

      return options;
    }

    function parseOptions(options, args) {if (args === void 0) {args = [];}
      try {
        return options ?
        startsWith(options, '{') ?
        JSON.parse(options) :
        args.length && !includes(options, ':') ?
        { [args[0]]: options } :
        options.split(';').reduce((options, option) => {
          const [key, value] = option.split(/:(.*)/);
          if (key && !isUndefined(value)) {
            options[key.trim()] = value.trim();
          }
          return options;
        }, {}) :
        {};
      } catch (e) {
        return {};
      }
    }

    function play(el) {
      if (isIFrame(el)) {
        call(el, { func: 'playVideo', method: 'play' });
      }

      if (isHTML5(el)) {
        try {
          el.play().catch(noop);
        } catch (e) {
          // noop
        }
      }
    }

    function pause(el) {
      if (isIFrame(el)) {
        call(el, { func: 'pauseVideo', method: 'pause' });
      }

      if (isHTML5(el)) {
        el.pause();
      }
    }

    function mute(el) {
      if (isIFrame(el)) {
        call(el, { func: 'mute', method: 'setVolume', value: 0 });
      }

      if (isHTML5(el)) {
        el.muted = true;
      }
    }

    function isVideo(el) {
      return isHTML5(el) || isIFrame(el);
    }

    function isHTML5(el) {
      return isTag(el, 'video');
    }

    function isIFrame(el) {
      return isTag(el, 'iframe') && (isYoutube(el) || isVimeo(el));
    }

    function isYoutube(el) {
      return !!el.src.match(
      /\/\/.*?youtube(-nocookie)?\.[a-z]+\/(watch\?v=[^&\s]+|embed)|youtu\.be\/.*/);

    }

    function isVimeo(el) {
      return !!el.src.match(/vimeo\.com\/video\/.*/);
    }

    async function call(el, cmd) {
      await enableApi(el);
      post(el, cmd);
    }

    function post(el, cmd) {
      try {
        el.contentWindow.postMessage(JSON.stringify({ event: 'command', ...cmd }), '*');
      } catch (e) {
        // noop
      }
    }

    const stateKey = '_ukPlayer';
    let counter = 0;
    function enableApi(el) {
      if (el[stateKey]) {
        return el[stateKey];
      }

      const youtube = isYoutube(el);
      const vimeo = isVimeo(el);

      const id = ++counter;
      let poller;

      return el[stateKey] = new Promise((resolve) => {
        youtube &&
        once(el, 'load', () => {
          const listener = () => post(el, { event: 'listening', id });
          poller = setInterval(listener, 100);
          listener();
        });

        once(window, 'message', resolve, false, (_ref) => {let { data } = _ref;
          try {
            data = JSON.parse(data);
            return (
              data && (
              youtube && data.id === id && data.event === 'onReady' ||
              vimeo && Number(data.player_id) === id));

          } catch (e) {
            // noop
          }
        });

        el.src = "" + el.src + (includes(el.src, '?') ? '&' : '?') + (
        youtube ? 'enablejsapi=1' : "api=1&player_id=" + id);

      }).then(() => clearInterval(poller));
    }

    function isInView(element, offsetTop, offsetLeft) {if (offsetTop === void 0) {offsetTop = 0;}if (offsetLeft === void 0) {offsetLeft = 0;}
      if (!isVisible(element)) {
        return false;
      }

      return intersectRect(
      ...scrollParents(element).
      map((parent) => {
        const { top, left, bottom, right } = offsetViewport(parent);

        return {
          top: top - offsetTop,
          left: left - offsetLeft,
          bottom: bottom + offsetTop,
          right: right + offsetLeft };

      }).
      concat(offset(element)));

    }

    function scrollIntoView(element, _temp) {let { offset: offsetBy = 0 } = _temp === void 0 ? {} : _temp;
      const parents = isVisible(element) ? scrollParents(element) : [];
      return parents.reduce(
      (fn, scrollElement, i) => {
        const { scrollTop, scrollHeight, offsetHeight } = scrollElement;
        const viewport = offsetViewport(scrollElement);
        const maxScroll = scrollHeight - viewport.height;
        const { height: elHeight, top: elTop } = parents[i - 1] ?
        offsetViewport(parents[i - 1]) :
        offset(element);

        let top = Math.ceil(elTop - viewport.top - offsetBy + scrollTop);

        if (offsetBy > 0 && offsetHeight < elHeight + offsetBy) {
          top += offsetBy;
        } else {
          offsetBy = 0;
        }

        if (top > maxScroll) {
          offsetBy -= top - maxScroll;
          top = maxScroll;
        } else if (top < 0) {
          offsetBy -= top;
          top = 0;
        }

        return () => scrollTo(scrollElement, top - scrollTop).then(fn);
      },
      () => Promise.resolve())();


      function scrollTo(element, top) {
        return new Promise((resolve) => {
          const scroll = element.scrollTop;
          const duration = getDuration(Math.abs(top));
          const start = Date.now();

          (function step() {
            const percent = ease(clamp((Date.now() - start) / duration));

            element.scrollTop = scroll + top * percent;

            // scroll more if we have not reached our destination
            if (percent === 1) {
              resolve();
            } else {
              requestAnimationFrame(step);
            }
          })();
        });
      }

      function getDuration(dist) {
        return 40 * Math.pow(dist, 0.375);
      }

      function ease(k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
      }
    }

    function scrolledOver(element, startOffset, endOffset) {if (startOffset === void 0) {startOffset = 0;}if (endOffset === void 0) {endOffset = 0;}
      if (!isVisible(element)) {
        return 0;
      }

      const [scrollElement] = scrollParents(element, /auto|scroll/, true);
      const { scrollHeight, scrollTop } = scrollElement;
      const { height: viewportHeight } = offsetViewport(scrollElement);
      const maxScroll = scrollHeight - viewportHeight;
      const elementOffsetTop = offsetPosition(element)[0] - offsetPosition(scrollElement)[0];

      const start = Math.max(0, elementOffsetTop - viewportHeight + startOffset);
      const end = Math.min(maxScroll, elementOffsetTop + element.offsetHeight - endOffset);

      return clamp((scrollTop - start) / (end - start));
    }

    function scrollParents(element, overflowRe, scrollable) {if (overflowRe === void 0) {overflowRe = /auto|scroll|hidden|clip/;}if (scrollable === void 0) {scrollable = false;}
      const scrollEl = scrollingElement(element);

      let ancestors = parents(element).reverse();
      ancestors = ancestors.slice(ancestors.indexOf(scrollEl) + 1);

      const fixedIndex = findIndex(ancestors, (el) => css(el, 'position') === 'fixed');
      if (~fixedIndex) {
        ancestors = ancestors.slice(fixedIndex);
      }

      return [scrollEl].
      concat(
      ancestors.filter(
      (parent) =>
      overflowRe.test(css(parent, 'overflow')) && (
      !scrollable || parent.scrollHeight > offsetViewport(parent).height))).


      reverse();
    }

    function offsetViewport(scrollElement) {
      const window = toWindow(scrollElement);
      const {
        document: { documentElement } } =
      window;
      let viewportElement =
      scrollElement === scrollingElement(scrollElement) ? window : scrollElement;

      const { visualViewport } = window;
      if (isWindow(viewportElement) && visualViewport) {
        let { height, width, scale, pageTop: top, pageLeft: left } = visualViewport;
        height = Math.round(height * scale);
        width = Math.round(width * scale);
        return { height, width, top, left, bottom: top + height, right: left + width };
      }

      let rect = offset(viewportElement);
      for (let [prop, dir, start, end] of [
      ['width', 'x', 'left', 'right'],
      ['height', 'y', 'top', 'bottom']])
      {
        if (isWindow(viewportElement)) {
          // iOS 12 returns <body> as scrollingElement
          viewportElement = documentElement;
        } else {
          rect[start] += toFloat(css(viewportElement, "border-" + start + "-width"));
        }
        rect[prop] = rect[dir] = viewportElement["client" + ucfirst(prop)];
        rect[end] = rect[prop] + rect[start];
      }
      return rect;
    }

    function scrollingElement(element) {
      return toWindow(element).document.scrollingElement;
    }

    const dirs = [
    ['width', 'x', 'left', 'right'],
    ['height', 'y', 'top', 'bottom']];


    function positionAt(element, target, options) {
      options = {
        attach: {
          element: ['left', 'top'],
          target: ['left', 'top'],
          ...options.attach },

        offset: [0, 0],
        placement: [],
        ...options };


      if (!isArray(target)) {
        target = [target, target];
      }

      offset(element, getPosition(element, target, options));
    }

    function getPosition(element, target, options) {
      const position = attachTo(element, target, options);
      const { boundary, viewportOffset = 0, placement } = options;

      let offsetPosition = position;
      for (const [i, [prop,, start, end]] of Object.entries(dirs)) {
        const viewport = getViewport$1(target[i], viewportOffset, boundary, i);

        if (isWithin(position, viewport, i)) {
          continue;
        }

        let offsetBy = 0;

        // Flip
        if (placement[i] === 'flip') {
          const attach = options.attach.target[i];
          if (
          attach === end && position[end] <= viewport[end] ||
          attach === start && position[start] >= viewport[start])
          {
            continue;
          }

          offsetBy = flip(element, target, options, i)[start] - position[start];

          const scrollArea = getScrollArea(target[i], viewportOffset, i);

          if (!isWithin(applyOffset(position, offsetBy, i), scrollArea, i)) {
            if (isWithin(position, scrollArea, i)) {
              continue;
            }

            if (options.recursion) {
              return false;
            }

            const newPos = flipAxis(element, target, options);

            if (newPos && isWithin(newPos, scrollArea, 1 - i)) {
              return newPos;
            }

            continue;
          }

          // Shift
        } else if (placement[i] === 'shift') {
          const targetDim = offset(target[i]);
          const { offset: elOffset } = options;
          offsetBy =
          clamp(
          clamp(position[start], viewport[start], viewport[end] - position[prop]),
          targetDim[start] - position[prop] + elOffset[i],
          targetDim[end] - elOffset[i]) -
          position[start];
        }

        offsetPosition = applyOffset(offsetPosition, offsetBy, i);
      }

      return offsetPosition;
    }

    function attachTo(element, target, options) {
      let { attach, offset: offsetBy } = {
        attach: {
          element: ['left', 'top'],
          target: ['left', 'top'],
          ...options.attach },

        offset: [0, 0],
        ...options };


      let elOffset = offset(element);

      for (const [i, [prop,, start, end]] of Object.entries(dirs)) {
        const targetOffset =
        attach.target[i] === attach.element[i] ? offsetViewport(target[i]) : offset(target[i]);

        elOffset = applyOffset(
        elOffset,
        targetOffset[start] -
        elOffset[start] +
        moveBy(attach.target[i], end, targetOffset[prop]) -
        moveBy(attach.element[i], end, elOffset[prop]) +
        +offsetBy[i],
        i);

      }
      return elOffset;
    }

    function applyOffset(position, offset, i) {
      const [, dir, start, end] = dirs[i];
      const newPos = { ...position };
      newPos[start] = position[dir] = position[start] + offset;
      newPos[end] += offset;
      return newPos;
    }

    function moveBy(attach, end, dim) {
      return attach === 'center' ? dim / 2 : attach === end ? dim : 0;
    }

    function getViewport$1(element, viewportOffset, boundary, i) {
      let viewport = getIntersectionArea(...scrollParents(element).map(offsetViewport));

      if (viewportOffset) {
        viewport[dirs[i][2]] += viewportOffset;
        viewport[dirs[i][3]] -= viewportOffset;
      }

      if (boundary) {
        viewport = getIntersectionArea(
        viewport,
        offset(isArray(boundary) ? boundary[i] : boundary));

      }

      return viewport;
    }

    function getScrollArea(element, viewportOffset, i) {
      const [prop,, start, end] = dirs[i];
      const [scrollElement] = scrollParents(element);
      const viewport = offsetViewport(scrollElement);
      viewport[start] -= scrollElement["scroll" + ucfirst(start)] - viewportOffset;
      viewport[end] = viewport[start] + scrollElement["scroll" + ucfirst(prop)] - viewportOffset;
      return viewport;
    }

    function getIntersectionArea() {
      let area = {};for (var _len = arguments.length, rects = new Array(_len), _key = 0; _key < _len; _key++) {rects[_key] = arguments[_key];}
      for (const rect of rects) {
        for (const [,, start, end] of dirs) {
          area[start] = Math.max(area[start] || 0, rect[start]);
          area[end] = Math.min(...[area[end], rect[end]].filter(Boolean));
        }
      }
      return area;
    }

    function isWithin(positionA, positionB, i) {
      const [,, start, end] = dirs[i];
      return positionA[start] >= positionB[start] && positionA[end] <= positionB[end];
    }

    function flip(element, target, _ref, i) {let { offset, attach } = _ref;
      return attachTo(element, target, {
        attach: {
          element: flipAttach(attach.element, i),
          target: flipAttach(attach.target, i) },

        offset: flipOffset(offset, i) });

    }

    function flipAxis(element, target, options) {
      return getPosition(element, target, {
        ...options,
        attach: {
          element: options.attach.element.map(flipAttachAxis).reverse(),
          target: options.attach.target.map(flipAttachAxis).reverse() },

        offset: options.offset.reverse(),
        placement: options.placement.reverse(),
        recursion: true });

    }

    function flipAttach(attach, i) {
      const newAttach = [...attach];
      const index = dirs[i].indexOf(attach[i]);
      if (~index) {
        newAttach[i] = dirs[i][1 - index % 2 + 2];
      }
      return newAttach;
    }

    function flipAttachAxis(prop) {
      for (let i = 0; i < dirs.length; i++) {
        const index = dirs[i].indexOf(prop);
        if (~index) {
          return dirs[1 - i][index % 2 + 2];
        }
      }
    }

    function flipOffset(offset, i) {
      offset = [...offset];
      offset[i] *= -1;
      return offset;
    }

    var util = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ajax: ajax,
        getImage: getImage,
        Transition: Transition,
        Animation: Animation,
        attr: attr,
        hasAttr: hasAttr,
        removeAttr: removeAttr,
        data: data,
        addClass: addClass,
        removeClass: removeClass,
        removeClasses: removeClasses,
        replaceClass: replaceClass,
        hasClass: hasClass,
        toggleClass: toggleClass,
        dimensions: dimensions$1,
        offset: offset,
        position: position,
        offsetPosition: offsetPosition,
        height: height,
        width: width,
        boxModelAdjust: boxModelAdjust,
        flipPosition: flipPosition,
        toPx: toPx,
        ready: ready,
        isTag: isTag,
        empty: empty,
        html: html,
        prepend: prepend,
        append: append,
        before: before,
        after: after,
        remove: remove$1,
        wrapAll: wrapAll,
        wrapInner: wrapInner,
        unwrap: unwrap,
        fragment: fragment,
        apply: apply,
        $: $,
        $$: $$,
        inBrowser: inBrowser,
        isRtl: isRtl,
        hasTouch: hasTouch,
        pointerDown: pointerDown$1,
        pointerMove: pointerMove$1,
        pointerUp: pointerUp$1,
        pointerEnter: pointerEnter,
        pointerLeave: pointerLeave,
        pointerCancel: pointerCancel,
        on: on,
        off: off,
        once: once,
        trigger: trigger,
        createEvent: createEvent,
        toEventTargets: toEventTargets,
        isTouch: isTouch,
        getEventPos: getEventPos,
        fastdom: fastdom,
        isVoidElement: isVoidElement,
        isVisible: isVisible,
        selInput: selInput,
        isInput: isInput,
        selFocusable: selFocusable,
        isFocusable: isFocusable,
        parent: parent,
        filter: filter$1,
        matches: matches,
        closest: closest,
        within: within,
        parents: parents,
        children: children,
        index: index,
        hasOwn: hasOwn,
        hyphenate: hyphenate,
        camelize: camelize,
        ucfirst: ucfirst,
        startsWith: startsWith,
        endsWith: endsWith,
        includes: includes,
        findIndex: findIndex,
        isArray: isArray,
        toArray: toArray,
        assign: assign,
        isFunction: isFunction,
        isObject: isObject,
        isPlainObject: isPlainObject,
        isWindow: isWindow,
        isDocument: isDocument,
        isNode: isNode,
        isElement: isElement,
        isBoolean: isBoolean,
        isString: isString,
        isNumber: isNumber,
        isNumeric: isNumeric,
        isEmpty: isEmpty,
        isUndefined: isUndefined,
        toBoolean: toBoolean,
        toNumber: toNumber,
        toFloat: toFloat,
        toNode: toNode,
        toNodes: toNodes,
        toWindow: toWindow,
        isEqual: isEqual,
        swap: swap,
        last: last,
        each: each,
        sortBy: sortBy$1,
        uniqueBy: uniqueBy,
        clamp: clamp,
        noop: noop,
        intersectRect: intersectRect,
        pointInRect: pointInRect,
        Dimensions: Dimensions,
        getIndex: getIndex,
        memoize: memoize,
        Deferred: Deferred,
        MouseTracker: MouseTracker,
        observeIntersection: observeIntersection,
        observeResize: observeResize,
        observeMutation: observeMutation,
        mergeOptions: mergeOptions,
        parseOptions: parseOptions,
        play: play,
        pause: pause,
        mute: mute,
        isVideo: isVideo,
        positionAt: positionAt,
        query: query,
        queryAll: queryAll,
        find: find,
        findAll: findAll,
        escape: escape,
        css: css,
        propName: propName,
        isInView: isInView,
        scrollIntoView: scrollIntoView,
        scrolledOver: scrolledOver,
        scrollParents: scrollParents,
        offsetViewport: offsetViewport
    });

    function globalAPI (UIkit) {
      const DATA = UIkit.data;

      UIkit.use = function (plugin) {
        if (plugin.installed) {
          return;
        }

        plugin.call(null, this);
        plugin.installed = true;

        return this;
      };

      UIkit.mixin = function (mixin, component) {
        component = (isString(component) ? UIkit.component(component) : component) || this;
        component.options = mergeOptions(component.options, mixin);
      };

      UIkit.extend = function (options) {
        options = options || {};

        const Super = this;
        const Sub = function UIkitComponent(options) {
          this._init(options);
        };

        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(Super.options, options);

        Sub.super = Super;
        Sub.extend = Super.extend;

        return Sub;
      };

      UIkit.update = function (element, e) {
        element = element ? toNode(element) : document.body;

        for (const parentEl of parents(element).reverse()) {
          update(parentEl[DATA], e);
        }

        apply(element, (element) => update(element[DATA], e));
      };

      let container;
      Object.defineProperty(UIkit, 'container', {
        get() {
          return container || document.body;
        },

        set(element) {
          container = $(element);
        } });


      function update(data, e) {
        if (!data) {
          return;
        }

        for (const name in data) {
          if (data[name]._connected) {
            data[name]._callUpdate(e);
          }
        }
      }
    }

    function hooksAPI (UIkit) {
      UIkit.prototype._callHook = function (hook) {var _this$$options$hook;
        (_this$$options$hook = this.$options[hook]) == null ? void 0 : _this$$options$hook.forEach((handler) => handler.call(this));
      };

      UIkit.prototype._callConnected = function () {
        if (this._connected) {
          return;
        }

        this._data = {};
        this._computed = {};

        this._initProps();

        this._callHook('beforeConnect');
        this._connected = true;

        this._initEvents();
        this._initObservers();

        this._callHook('connected');
        this._callUpdate();
      };

      UIkit.prototype._callDisconnected = function () {
        if (!this._connected) {
          return;
        }

        this._callHook('beforeDisconnect');
        this._disconnectObservers();
        this._unbindEvents();
        this._callHook('disconnected');

        this._connected = false;
        delete this._watch;
      };

      UIkit.prototype._callUpdate = function (e) {if (e === void 0) {e = 'update';}
        if (!this._connected) {
          return;
        }

        if (e === 'update' || e === 'resize') {
          this._callWatches();
        }

        if (!this.$options.update) {
          return;
        }

        if (!this._updates) {
          this._updates = new Set();
          fastdom.read(() => {
            if (this._connected) {
              runUpdates.call(this, this._updates);
            }
            delete this._updates;
          });
        }

        this._updates.add(e.type || e);
      };

      UIkit.prototype._callWatches = function () {
        if (this._watch) {
          return;
        }

        const initial = !hasOwn(this, '_watch');

        this._watch = fastdom.read(() => {
          if (this._connected) {
            runWatches.call(this, initial);
          }
          this._watch = null;
        });
      };

      function runUpdates(types) {
        for (const { read, write, events = [] } of this.$options.update) {
          if (!types.has('update') && !events.some((type) => types.has(type))) {
            continue;
          }

          let result;
          if (read) {
            result = read.call(this, this._data, types);

            if (result && isPlainObject(result)) {
              assign(this._data, result);
            }
          }

          if (write && result !== false) {
            fastdom.write(() => {
              if (this._connected) {
                write.call(this, this._data, types);
              }
            });
          }
        }
      }

      function runWatches(initial) {
        const {
          $options: { computed } } =
        this;
        const values = { ...this._computed };
        this._computed = {};

        for (const key in computed) {
          const { watch, immediate } = computed[key];
          if (
          watch && (
          initial && immediate ||
          hasOwn(values, key) && !isEqual(values[key], this[key])))
          {
            watch.call(this, this[key], values[key]);
          }
        }
      }
    }

    function stateAPI (UIkit) {
      let uid = 0;

      UIkit.prototype._init = function (options) {
        options = options || {};
        options.data = normalizeData(options, this.constructor.options);

        this.$options = mergeOptions(this.constructor.options, options, this);
        this.$el = null;
        this.$props = {};

        this._uid = uid++;
        this._initData();
        this._initMethods();
        this._initComputeds();
        this._callHook('created');

        if (options.el) {
          this.$mount(options.el);
        }
      };

      UIkit.prototype._initData = function () {
        const { data = {} } = this.$options;

        for (const key in data) {
          this.$props[key] = this[key] = data[key];
        }
      };

      UIkit.prototype._initMethods = function () {
        const { methods } = this.$options;

        if (methods) {
          for (const key in methods) {
            this[key] = methods[key].bind(this);
          }
        }
      };

      UIkit.prototype._initComputeds = function () {
        const { computed } = this.$options;

        this._computed = {};

        if (computed) {
          for (const key in computed) {
            registerComputed(this, key, computed[key]);
          }
        }
      };

      UIkit.prototype._initProps = function (props) {
        let key;

        props = props || getProps$1(this.$options, this.$name);

        for (key in props) {
          if (!isUndefined(props[key])) {
            this.$props[key] = props[key];
          }
        }

        const exclude = [this.$options.computed, this.$options.methods];
        for (key in this.$props) {
          if (key in props && notIn(exclude, key)) {
            this[key] = this.$props[key];
          }
        }
      };

      UIkit.prototype._initEvents = function () {
        this._events = [];
        for (const event of this.$options.events || []) {
          if (hasOwn(event, 'handler')) {
            registerEvent(this, event);
          } else {
            for (const key in event) {
              registerEvent(this, event[key], key);
            }
          }
        }
      };

      UIkit.prototype._unbindEvents = function () {
        this._events.forEach((unbind) => unbind());
        delete this._events;
      };

      UIkit.prototype._initObservers = function () {
        this._observers = [initPropsObserver(this)];

        if (this.$options.computed) {
          this.registerObserver(initChildListObserver(this));
        }
      };

      UIkit.prototype.registerObserver = function (observer) {
        this._observers.push(observer);
      };

      UIkit.prototype._disconnectObservers = function () {
        this._observers.forEach((observer) => observer == null ? void 0 : observer.disconnect());
      };
    }

    function getProps$1(opts, name) {
      const data$1 = {};
      const { args = [], props = {}, el } = opts;

      if (!props) {
        return data$1;
      }

      for (const key in props) {
        const prop = hyphenate(key);
        let value = data(el, prop);

        if (isUndefined(value)) {
          continue;
        }

        value = props[key] === Boolean && value === '' ? true : coerce$1(props[key], value);

        if (prop === 'target' && startsWith(value, '_')) {
          continue;
        }

        data$1[key] = value;
      }

      const options = parseOptions(data(el, name), args);

      for (const key in options) {
        const prop = camelize(key);
        if (!isUndefined(props[prop])) {
          data$1[prop] = coerce$1(props[prop], options[key]);
        }
      }

      return data$1;
    }

    function registerComputed(component, key, cb) {
      Object.defineProperty(component, key, {
        enumerable: true,

        get() {
          const { _computed, $props, $el } = component;

          if (!hasOwn(_computed, key)) {
            _computed[key] = (cb.get || cb).call(component, $props, $el);
          }

          return _computed[key];
        },

        set(value) {
          const { _computed } = component;

          _computed[key] = cb.set ? cb.set.call(component, value) : value;

          if (isUndefined(_computed[key])) {
            delete _computed[key];
          }
        } });

    }

    function registerEvent(component, event, key) {
      if (!isPlainObject(event)) {
        event = { name: key, handler: event };
      }

      let { name, el, handler, capture, passive, delegate, filter, self } = event;
      el = isFunction(el) ? el.call(component) : el || component.$el;

      if (isArray(el)) {
        el.forEach((el) => registerEvent(component, { ...event, el }, key));
        return;
      }

      if (!el || filter && !filter.call(component)) {
        return;
      }

      component._events.push(
      on(
      el,
      name,
      delegate ? isString(delegate) ? delegate : delegate.call(component) : null,
      isString(handler) ? component[handler] : handler.bind(component),
      { passive, capture, self }));


    }

    function notIn(options, key) {
      return options.every((arr) => !arr || !hasOwn(arr, key));
    }

    function coerce$1(type, value) {
      if (type === Boolean) {
        return toBoolean(value);
      } else if (type === Number) {
        return toNumber(value);
      } else if (type === 'list') {
        return toList(value);
      }

      return type ? type(value) : value;
    }

    function toList(value) {
      return isArray(value) ?
      value :
      isString(value) ?
      value.
      split(/,(?![^(]*\))/).
      map((value) => isNumeric(value) ? toNumber(value) : toBoolean(value.trim())) :
      [value];
    }

    function normalizeData(_ref, _ref2) {let { data = {} } = _ref;let { args = [], props = {} } = _ref2;
      if (isArray(data)) {
        data = data.slice(0, args.length).reduce((data, value, index) => {
          if (isPlainObject(value)) {
            assign(data, value);
          } else {
            data[args[index]] = value;
          }
          return data;
        }, {});
      }

      for (const key in data) {
        if (isUndefined(data[key])) {
          delete data[key];
        } else if (props[key]) {
          data[key] = coerce$1(props[key], data[key]);
        }
      }

      return data;
    }

    function initChildListObserver(component) {
      const { el } = component.$options;

      const observer = new MutationObserver(() => component._callWatches());
      observer.observe(el, {
        childList: true,
        subtree: true });


      return observer;
    }

    function initPropsObserver(component) {
      const { $name, $options, $props } = component;
      const { attrs, props, el } = $options;

      if (!props || attrs === false) {
        return;
      }

      const attributes = isArray(attrs) ? attrs : Object.keys(props);
      const filter = attributes.map((key) => hyphenate(key)).concat($name);

      const observer = new MutationObserver((records) => {
        const data = getProps$1($options, $name);
        if (
        records.some((_ref3) => {let { attributeName } = _ref3;
          const prop = attributeName.replace('data-', '');
          return (
          prop === $name ? attributes : [camelize(prop), camelize(attributeName)]).
          some((prop) => !isUndefined(data[prop]) && data[prop] !== $props[prop]);
        }))
        {
          component.$reset();
        }
      });

      observer.observe(el, {
        attributes: true,
        attributeFilter: filter.concat(filter.map((key) => "data-" + key)) });


      return observer;
    }

    function instanceAPI (UIkit) {
      const DATA = UIkit.data;

      UIkit.prototype.$create = function (component, element, data) {
        return UIkit[component](element, data);
      };

      UIkit.prototype.$mount = function (el) {
        const { name } = this.$options;

        if (!el[DATA]) {
          el[DATA] = {};
        }

        if (el[DATA][name]) {
          return;
        }

        el[DATA][name] = this;

        this.$el = this.$options.el = this.$options.el || el;

        if (within(el, document)) {
          this._callConnected();
        }
      };

      UIkit.prototype.$reset = function () {
        this._callDisconnected();
        this._callConnected();
      };

      UIkit.prototype.$destroy = function (removeEl) {if (removeEl === void 0) {removeEl = false;}
        const { el, name } = this.$options;

        if (el) {
          this._callDisconnected();
        }

        this._callHook('destroy');

        if (!(el != null && el[DATA])) {
          return;
        }

        delete el[DATA][name];

        if (!isEmpty(el[DATA])) {
          delete el[DATA];
        }

        if (removeEl) {
          remove$1(this.$el);
        }
      };

      UIkit.prototype.$emit = function (e) {
        this._callUpdate(e);
      };

      UIkit.prototype.$update = function (element, e) {if (element === void 0) {element = this.$el;}
        UIkit.update(element, e);
      };

      UIkit.prototype.$getComponent = UIkit.getComponent;

      const componentName = memoize((name) => UIkit.prefix + hyphenate(name));
      Object.defineProperties(UIkit.prototype, {
        $container: Object.getOwnPropertyDescriptor(UIkit, 'container'),

        $name: {
          get() {
            return componentName(this.$options.name);
          } } });


    }

    function componentAPI (UIkit) {
      const DATA = UIkit.data;

      const components = {};

      UIkit.component = function (name, options) {
        const id = hyphenate(name);

        name = camelize(id);

        if (!options) {
          if (isPlainObject(components[name])) {
            components[name] = UIkit.extend(components[name]);
          }

          return components[name];
        }

        UIkit[name] = function (element, data) {
          const component = UIkit.component(name);

          return component.options.functional ?
          new component({ data: isPlainObject(element) ? element : [...arguments] }) :
          element ?
          $$(element).map(init)[0] :
          init();

          function init(element) {
            const instance = UIkit.getComponent(element, name);

            if (instance) {
              if (data) {
                instance.$destroy();
              } else {
                return instance;
              }
            }

            return new component({ el: element, data });
          }
        };

        const opt = isPlainObject(options) ? { ...options } : options.options;

        opt.name = name;

        opt.install == null ? void 0 : opt.install(UIkit, opt, name);

        if (UIkit._initialized && !opt.functional) {
          requestAnimationFrame(() => UIkit[name]("[uk-" + id + "],[data-uk-" + id + "]"));
        }

        return components[name] = isPlainObject(options) ? opt : options;
      };

      UIkit.getComponents = (element) => (element == null ? void 0 : element[DATA]) || {};
      UIkit.getComponent = (element, name) => UIkit.getComponents(element)[name];

      UIkit.connect = (node) => {
        if (node[DATA]) {
          for (const name in node[DATA]) {
            node[DATA][name]._callConnected();
          }
        }

        for (const attribute of node.attributes) {
          const name = getComponentName(attribute.name);

          if (name && name in components) {
            UIkit[name](node);
          }
        }
      };

      UIkit.disconnect = (node) => {
        for (const name in node[DATA]) {
          node[DATA][name]._callDisconnected();
        }
      };
    }

    const getComponentName = memoize((attribute) => {
      return startsWith(attribute, 'uk-') || startsWith(attribute, 'data-uk-') ?
      camelize(attribute.replace('data-uk-', '').replace('uk-', '')) :
      false;
    });

    const UIkit = function (options) {
      this._init(options);
    };

    UIkit.util = util;
    UIkit.data = '__uikit__';
    UIkit.prefix = 'uk-';
    UIkit.options = {};
    UIkit.version = '3.15.6';

    globalAPI(UIkit);
    hooksAPI(UIkit);
    stateAPI(UIkit);
    componentAPI(UIkit);
    instanceAPI(UIkit);

    function boot (UIkit) {
      const { connect, disconnect } = UIkit;

      if (!inBrowser || !window.MutationObserver) {
        return;
      }

      requestAnimationFrame(function () {
        if (document.body) {
          apply(document.body, connect);
        }

        new MutationObserver((records) => records.forEach(applyChildListMutation)).observe(
        document,
        {
          childList: true,
          subtree: true });



        new MutationObserver((records) => records.forEach(applyAttributeMutation)).observe(
        document,
        {
          attributes: true,
          subtree: true });



        UIkit._initialized = true;
      });

      function applyChildListMutation(_ref) {let { addedNodes, removedNodes } = _ref;
        for (const node of addedNodes) {
          apply(node, connect);
        }

        for (const node of removedNodes) {
          apply(node, disconnect);
        }
      }

      function applyAttributeMutation(_ref2) {var _UIkit$getComponent;let { target, attributeName } = _ref2;
        const name = getComponentName(attributeName);

        if (!name || !(name in UIkit)) {
          return;
        }

        if (hasAttr(target, attributeName)) {
          UIkit[name](target);
          return;
        }

        (_UIkit$getComponent = UIkit.getComponent(target, name)) == null ? void 0 : _UIkit$getComponent.$destroy();
      }
    }

    var Class = {
      connected() {
        !hasClass(this.$el, this.$name) && addClass(this.$el, this.$name);
      } };

    var Lazyload = {
      data: {
        preload: 5 },


      methods: {
        lazyload(observeTargets, targets) {if (observeTargets === void 0) {observeTargets = this.$el;}if (targets === void 0) {targets = this.$el;}
          this.registerObserver(
          observeIntersection(observeTargets, (entries, observer) => {
            for (const el of toNodes(isFunction(targets) ? targets() : targets)) {
              $$('[loading="lazy"]', el).
              slice(0, this.preload - 1).
              forEach((el) => removeAttr(el, 'loading'));
            }

            for (const el of entries.
            filter((_ref) => {let { isIntersecting } = _ref;return isIntersecting;}).
            map((_ref2) => {let { target } = _ref2;return target;})) {
              observer.unobserve(el);
            }
          }));

        } } };

    var Togglable = {
      props: {
        cls: Boolean,
        animation: 'list',
        duration: Number,
        velocity: Number,
        origin: String,
        transition: String },


      data: {
        cls: false,
        animation: [false],
        duration: 200,
        velocity: 0.2,
        origin: false,
        transition: 'ease',
        clsEnter: 'uk-togglabe-enter',
        clsLeave: 'uk-togglabe-leave' },


      computed: {
        hasAnimation(_ref) {let { animation } = _ref;
          return !!animation[0];
        },

        hasTransition(_ref2) {let { animation } = _ref2;
          return ['slide', 'reveal'].some((transition) => startsWith(animation[0], transition));
        } },


      methods: {
        toggleElement(targets, toggle, animate) {
          return new Promise((resolve) =>
          Promise.all(
          toNodes(targets).map((el) => {
            const show = isBoolean(toggle) ? toggle : !this.isToggled(el);

            if (!trigger(el, "before" + (show ? 'show' : 'hide'), [this])) {
              return Promise.reject();
            }

            const promise = (
            isFunction(animate) ?
            animate :
            animate === false || !this.hasAnimation ?
            toggleInstant :
            this.hasTransition ?
            toggleTransition :
            toggleAnimation)(
            el, show, this);

            const cls = show ? this.clsEnter : this.clsLeave;

            addClass(el, cls);

            trigger(el, show ? 'show' : 'hide', [this]);

            const done = () => {
              removeClass(el, cls);
              trigger(el, show ? 'shown' : 'hidden', [this]);
            };

            return promise ?
            promise.then(done, () => {
              removeClass(el, cls);
              return Promise.reject();
            }) :
            done();
          })).
          then(resolve, noop));

        },

        isToggled(el) {if (el === void 0) {el = this.$el;}
          [el] = toNodes(el);
          return hasClass(el, this.clsEnter) ?
          true :
          hasClass(el, this.clsLeave) ?
          false :
          this.cls ?
          hasClass(el, this.cls.split(' ')[0]) :
          isVisible(el);
        },

        _toggle(el, toggled) {
          if (!el) {
            return;
          }

          toggled = Boolean(toggled);

          let changed;
          if (this.cls) {
            changed = includes(this.cls, ' ') || toggled !== hasClass(el, this.cls);
            changed && toggleClass(el, this.cls, includes(this.cls, ' ') ? undefined : toggled);
          } else {
            changed = toggled === el.hidden;
            changed && (el.hidden = !toggled);
          }

          $$('[autofocus]', el).some((el) => isVisible(el) ? el.focus() || true : el.blur());

          if (changed) {
            trigger(el, 'toggled', [toggled, this]);
          }
        } } };



    function toggleInstant(el, show, _ref3) {let { _toggle } = _ref3;
      Animation.cancel(el);
      Transition.cancel(el);
      return _toggle(el, show);
    }

    async function toggleTransition(
    el,
    show, _ref4)

    {var _animation$;let { animation, duration, velocity, transition, _toggle } = _ref4;
      const [mode = 'reveal', startProp = 'top'] = ((_animation$ = animation[0]) == null ? void 0 : _animation$.split('-')) || [];

      const dirs = [
      ['left', 'right'],
      ['top', 'bottom']];

      const dir = dirs[includes(dirs[0], startProp) ? 0 : 1];
      const end = dir[1] === startProp;
      const props = ['width', 'height'];
      const dimProp = props[dirs.indexOf(dir)];
      const marginProp = "margin-" + dir[0];
      const marginStartProp = "margin-" + startProp;

      let currentDim = dimensions$1(el)[dimProp];

      const inProgress = Transition.inProgress(el);
      await Transition.cancel(el);

      if (show) {
        _toggle(el, true);
      }

      const prevProps = Object.fromEntries(
      [
      'padding',
      'border',
      'width',
      'height',
      'minWidth',
      'minHeight',
      'overflowY',
      'overflowX',
      marginProp,
      marginStartProp].
      map((key) => [key, el.style[key]]));


      const dim = dimensions$1(el);
      const currentMargin = toFloat(css(el, marginProp));
      const marginStart = toFloat(css(el, marginStartProp));
      const endDim = dim[dimProp] + marginStart;

      if (!inProgress && !show) {
        currentDim += marginStart;
      }

      const [wrapper] = wrapInner(el, '<div>');
      css(wrapper, {
        boxSizing: 'border-box',
        height: dim.height,
        width: dim.width,
        ...css(el, [
        'overflow',
        'padding',
        'borderTop',
        'borderRight',
        'borderBottom',
        'borderLeft',
        'borderImage',
        marginStartProp]) });



      css(el, {
        padding: 0,
        border: 0,
        minWidth: 0,
        minHeight: 0,
        [marginStartProp]: 0,
        width: dim.width,
        height: dim.height,
        overflow: 'hidden',
        [dimProp]: currentDim });


      const percent = currentDim / endDim;
      duration = (velocity * endDim + duration) * (show ? 1 - percent : percent);
      const endProps = { [dimProp]: show ? endDim : 0 };

      if (end) {
        css(el, marginProp, endDim - currentDim + currentMargin);
        endProps[marginProp] = show ? currentMargin : endDim + currentMargin;
      }

      if (!end ^ mode === 'reveal') {
        css(wrapper, marginProp, -endDim + currentDim);
        Transition.start(wrapper, { [marginProp]: show ? 0 : -endDim }, duration, transition);
      }

      try {
        await Transition.start(el, endProps, duration, transition);
      } finally {
        css(el, prevProps);
        unwrap(wrapper.firstChild);

        if (!show) {
          _toggle(el, false);
        }
      }
    }

    function toggleAnimation(el, show, cmp) {
      Animation.cancel(el);

      const { animation, duration, _toggle } = cmp;

      if (show) {
        _toggle(el, true);
        return Animation.in(el, animation[0], duration, cmp.origin);
      }

      return Animation.out(el, animation[1] || animation[0], duration, cmp.origin).then(() =>
      _toggle(el, false));

    }

    var Accordion = {
      mixins: [Class, Lazyload, Togglable],

      props: {
        animation: Boolean,
        targets: String,
        active: null,
        collapsible: Boolean,
        multiple: Boolean,
        toggle: String,
        content: String,
        offset: Number },


      data: {
        targets: '> *',
        active: false,
        animation: true,
        collapsible: true,
        multiple: false,
        clsOpen: 'uk-open',
        toggle: '> .uk-accordion-title',
        content: '> .uk-accordion-content',
        offset: 0 },


      computed: {
        items: {
          get(_ref, $el) {let { targets } = _ref;
            return $$(targets, $el);
          },

          watch(items, prev) {
            if (prev || hasClass(items, this.clsOpen)) {
              return;
            }

            const active =
            this.active !== false && items[Number(this.active)] ||
            !this.collapsible && items[0];

            if (active) {
              this.toggle(active, false);
            }
          },

          immediate: true },


        toggles(_ref2) {let { toggle } = _ref2;
          return this.items.map((item) => $(toggle, item));
        },

        contents: {
          get(_ref3) {let { content } = _ref3;
            return this.items.map((item) => $(content, item));
          },

          watch(items) {
            for (const el of items) {
              hide(
              el,
              !hasClass(
              this.items.find((item) => within(el, item)),
              this.clsOpen));


            }
          },

          immediate: true } },



      connected() {
        this.lazyload();
      },

      events: [
      {
        name: 'click',

        delegate() {
          return this.targets + " " + this.$props.toggle;
        },

        handler(e) {
          e.preventDefault();
          this.toggle(index(this.toggles, e.current));
        } }],



      methods: {
        toggle(item, animate) {
          let items = [this.items[getIndex(item, this.items)]];
          const activeItems = filter$1(this.items, "." + this.clsOpen);

          if (!this.multiple && !includes(activeItems, items[0])) {
            items = items.concat(activeItems);
          }

          if (
          !this.collapsible &&
          activeItems.length < 2 &&
          !filter$1(items, ":not(." + this.clsOpen + ")").length)
          {
            return;
          }

          for (const el of items) {
            this.toggleElement(el, !hasClass(el, this.clsOpen), (el, show) => {
              toggleClass(el, this.clsOpen, show);
              attr($(this.$props.toggle, el), 'aria-expanded', show);

              if (animate === false || !this.animation) {
                hide($(this.content, el), !show);
                return;
              }

              return transition(el, show, this).then(() => {
                if (show) {
                  const toggle = $(this.$props.toggle, el);
                  requestAnimationFrame(() => {
                    if (!isInView(toggle)) {
                      scrollIntoView(toggle, { offset: this.offset });
                    }
                  });
                }
              }, noop);
            });
          }
        } } };



    function hide(el, hide) {
      el && (el.hidden = hide);
    }

    async function transition(el, show, _ref4) {var _el$_wrapper;let { content, duration, velocity, transition } = _ref4;
      content = ((_el$_wrapper = el._wrapper) == null ? void 0 : _el$_wrapper.firstElementChild) || $(content, el);

      if (!el._wrapper) {
        el._wrapper = wrapAll(content, '<div>');
      }

      const wrapper = el._wrapper;
      css(wrapper, 'overflow', 'hidden');
      const currentHeight = toFloat(css(wrapper, 'height'));

      await Transition.cancel(wrapper);
      hide(content, false);

      const endHeight =
      toFloat(css(content, 'height')) +
      toFloat(css(content, 'marginTop')) +
      toFloat(css(content, 'marginBottom'));
      const percent = currentHeight / endHeight;
      duration = (velocity * endHeight + duration) * (show ? 1 - percent : percent);
      css(wrapper, 'height', currentHeight);

      await Transition.start(wrapper, { height: show ? endHeight : 0 }, duration, transition);

      unwrap(content);
      delete el._wrapper;

      if (!show) {
        hide(content, true);
      }
    }

    var alert = {
      mixins: [Class, Togglable],

      args: 'animation',

      props: {
        animation: Boolean,
        close: String },


      data: {
        animation: true,
        selClose: '.uk-alert-close',
        duration: 150 },


      events: {
        name: 'click',

        delegate() {
          return this.selClose;
        },

        handler(e) {
          e.preventDefault();
          this.close();
        } },


      methods: {
        async close() {
          await this.toggleElement(this.$el, false, animate$1);
          this.$destroy(true);
        } } };



    function animate$1(el, show, _ref) {let { duration, transition, velocity } = _ref;
      const height = toFloat(css(el, 'height'));
      css(el, 'height', height);
      return Transition.start(
      el,
      {
        height: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        borderTop: 0,
        borderBottom: 0,
        opacity: 0 },

      velocity * height + duration,
      transition);

    }

    var Video = {
      args: 'autoplay',

      props: {
        automute: Boolean,
        autoplay: Boolean },


      data: {
        automute: false,
        autoplay: true },


      connected() {
        this.inView = this.autoplay === 'inview';

        if (this.inView && !hasAttr(this.$el, 'preload')) {
          this.$el.preload = 'none';
        }

        if (isTag(this.$el, 'iframe') && !hasAttr(this.$el, 'allow')) {
          this.$el.allow = 'autoplay';
        }

        if (this.automute) {
          mute(this.$el);
        }

        this.registerObserver(observeIntersection(this.$el, () => this.$emit(), {}, false));
      },

      update: {
        read() {
          if (!isVideo(this.$el)) {
            return false;
          }

          return {
            visible: isVisible(this.$el) && css(this.$el, 'visibility') !== 'hidden',
            inView: this.inView && isInView(this.$el) };

        },

        write(_ref) {let { visible, inView } = _ref;
          if (!visible || this.inView && !inView) {
            pause(this.$el);
          } else if (this.autoplay === true || this.inView && inView) {
            play(this.$el);
          }
        } } };

    var Resize = {
      connected() {var _this$$options$resize;
        this.registerObserver(
        observeResize(((_this$$options$resize = this.$options.resizeTargets) == null ? void 0 : _this$$options$resize.call(this)) || this.$el, () =>
        this.$emit('resize')));


      } };

    var cover = {
      mixins: [Resize, Video],

      props: {
        width: Number,
        height: Number },


      data: {
        automute: true },


      events: {
        'load loadedmetadata'() {
          this.$emit('resize');
        } },


      resizeTargets() {
        return [this.$el, getPositionedParent(this.$el) || parent(this.$el)];
      },

      update: {
        read() {
          const { ratio, cover } = Dimensions;
          const { $el, width, height } = this;

          let dim = { width, height };

          if (!dim.width || !dim.height) {
            const intrinsic = {
              width: $el.naturalWidth || $el.videoWidth || $el.clientWidth,
              height: $el.naturalHeight || $el.videoHeight || $el.clientHeight };


            if (dim.width) {
              dim = ratio(intrinsic, 'width', dim.width);
            } else if (height) {
              dim = ratio(intrinsic, 'height', dim.height);
            } else {
              dim = intrinsic;
            }
          }

          const { offsetHeight: coverHeight, offsetWidth: coverWidth } =
          getPositionedParent($el) || parent($el);
          const coverDim = cover(dim, {
            width: coverWidth + (coverWidth % 2 ? 1 : 0),
            height: coverHeight + (coverHeight % 2 ? 1 : 0) });


          if (!coverDim.width || !coverDim.height) {
            return false;
          }

          return coverDim;
        },

        write(_ref) {let { height, width } = _ref;
          css(this.$el, { height, width });
        },

        events: ['resize'] } };



    function getPositionedParent(el) {
      while (el = parent(el)) {
        if (css(el, 'position') !== 'static') {
          return el;
        }
      }
    }

    var Container = {
      props: {
        container: Boolean },


      data: {
        container: true },


      computed: {
        container(_ref) {let { container } = _ref;
          return container === true && this.$container || container && $(container);
        } } };

    var Position = {
      props: {
        pos: String,
        offset: null,
        flip: Boolean,
        shift: Boolean,
        inset: Boolean },


      data: {
        pos: "bottom-" + (isRtl ? 'right' : 'left'),
        offset: false,
        flip: true,
        shift: true,
        inset: false },


      connected() {
        this.pos = this.$props.pos.split('-').concat('center').slice(0, 2);
        [this.dir, this.align] = this.pos;
        this.axis = includes(['top', 'bottom'], this.dir) ? 'y' : 'x';
      },

      methods: {
        positionAt(element, target, boundary) {
          let offset = [this.getPositionOffset(element), this.getShiftOffset(element)];
          const placement = [this.flip && 'flip', this.shift && 'shift'];

          const attach = {
            element: [this.inset ? this.dir : flipPosition(this.dir), this.align],
            target: [this.dir, this.align] };


          if (this.axis === 'y') {
            for (const prop in attach) {
              attach[prop].reverse();
            }
            offset.reverse();
            placement.reverse();
          }

          const [scrollElement] = scrollParents(element, /auto|scroll/);
          const { scrollTop, scrollLeft } = scrollElement;

          // Ensure none positioned element does not generate scrollbars
          const elDim = dimensions$1(element);
          css(element, { top: -elDim.height, left: -elDim.width });

          positionAt(element, target, {
            attach,
            offset,
            boundary,
            placement,
            viewportOffset: this.getViewportOffset(element) });


          // Restore scroll position
          scrollElement.scrollTop = scrollTop;
          scrollElement.scrollLeft = scrollLeft;
        },

        getPositionOffset(element) {
          return (
            toPx(
            this.offset === false ? css(element, '--uk-position-offset') : this.offset,
            this.axis === 'x' ? 'width' : 'height',
            element) * (

            includes(['left', 'top'], this.dir) ? -1 : 1) * (
            this.inset ? -1 : 1));

        },

        getShiftOffset(element) {
          return this.align === 'center' ?
          0 :
          toPx(
          css(element, '--uk-position-shift-offset'),
          this.axis === 'y' ? 'width' : 'height',
          element) * (
          includes(['left', 'top'], this.align) ? 1 : -1);
        },

        getViewportOffset(element) {
          return toPx(css(element, '--uk-position-viewport-offset'));
        } } };

    var Style = {
      beforeConnect() {
        this._style = attr(this.$el, 'style');
      },

      disconnected() {
        attr(this.$el, 'style', this._style);
      } };

    const active$1 = [];

    var Modal = {
      mixins: [Class, Container, Togglable],

      props: {
        selPanel: String,
        selClose: String,
        escClose: Boolean,
        bgClose: Boolean,
        stack: Boolean },


      data: {
        cls: 'uk-open',
        escClose: true,
        bgClose: true,
        overlay: true,
        stack: false },


      computed: {
        panel(_ref, $el) {let { selPanel } = _ref;
          return $(selPanel, $el);
        },

        transitionElement() {
          return this.panel;
        },

        bgClose(_ref2) {let { bgClose } = _ref2;
          return bgClose && this.panel;
        } },


      beforeDisconnect() {
        if (includes(active$1, this)) {
          this.toggleElement(this.$el, false, false);
        }
      },

      events: [
      {
        name: 'click',

        delegate() {
          return this.selClose;
        },

        handler(e) {
          e.preventDefault();
          this.hide();
        } },


      {
        name: 'click',

        delegate() {
          return 'a[href*="#"]';
        },

        handler(_ref3) {let { current, defaultPrevented } = _ref3;
          const { hash } = current;
          if (
          !defaultPrevented &&
          hash &&
          isSameSiteAnchor(current) &&
          !within(hash, this.$el) &&
          $(hash, document.body))
          {
            this.hide();
          }
        } },


      {
        name: 'toggle',

        self: true,

        handler(e) {
          if (e.defaultPrevented) {
            return;
          }

          e.preventDefault();

          if (this.isToggled() === includes(active$1, this)) {
            this.toggle();
          }
        } },


      {
        name: 'beforeshow',

        self: true,

        handler(e) {
          if (includes(active$1, this)) {
            return false;
          }

          if (!this.stack && active$1.length) {
            Promise.all(active$1.map((modal) => modal.hide())).then(this.show);
            e.preventDefault();
          } else {
            active$1.push(this);
          }
        } },


      {
        name: 'show',

        self: true,

        handler() {
          once(
          this.$el,
          'hide',
          on(document, 'focusin', (e) => {
            if (last(active$1) === this && !within(e.target, this.$el)) {
              this.$el.focus();
            }
          }));


          if (this.overlay) {
            once(this.$el, 'hidden', preventOverscroll(this.$el), { self: true });
            once(this.$el, 'hidden', preventBackgroundScroll(), { self: true });
          }

          if (this.stack) {
            css(this.$el, 'zIndex', toFloat(css(this.$el, 'zIndex')) + active$1.length);
          }

          addClass(document.documentElement, this.clsPage);

          if (this.bgClose) {
            once(
            this.$el,
            'hide',
            on(document, pointerDown$1, (_ref4) => {let { target } = _ref4;
              if (
              last(active$1) !== this ||
              this.overlay && !within(target, this.$el) ||
              within(target, this.panel))
              {
                return;
              }

              once(
              document,
              pointerUp$1 + " " + pointerCancel + " scroll",
              (_ref5) => {let { defaultPrevented, type, target: newTarget } = _ref5;
                if (
                !defaultPrevented &&
                type === pointerUp$1 &&
                target === newTarget)
                {
                  this.hide();
                }
              },
              true);

            }),
            { self: true });

          }

          if (this.escClose) {
            once(
            this.$el,
            'hide',
            on(document, 'keydown', (e) => {
              if (e.keyCode === 27 && last(active$1) === this) {
                this.hide();
              }
            }),
            { self: true });

          }
        } },


      {
        name: 'shown',

        self: true,

        handler() {
          if (!isFocusable(this.$el)) {
            attr(this.$el, 'tabindex', '-1');
          }

          if (!$(':focus', this.$el)) {
            this.$el.focus();
          }
        } },


      {
        name: 'hidden',

        self: true,

        handler() {
          if (includes(active$1, this)) {
            active$1.splice(active$1.indexOf(this), 1);
          }

          css(this.$el, 'zIndex', '');

          if (!active$1.some((modal) => modal.clsPage === this.clsPage)) {
            removeClass(document.documentElement, this.clsPage);
          }
        } }],



      methods: {
        toggle() {
          return this.isToggled() ? this.hide() : this.show();
        },

        show() {
          if (this.container && parent(this.$el) !== this.container) {
            append(this.container, this.$el);
            return new Promise((resolve) =>
            requestAnimationFrame(() => this.show().then(resolve)));

          }

          return this.toggleElement(this.$el, true, animate);
        },

        hide() {
          return this.toggleElement(this.$el, false, animate);
        } } };



    function animate(el, show, _ref6) {let { transitionElement, _toggle } = _ref6;
      return new Promise((resolve, reject) =>
      once(el, 'show hide', () => {
        el._reject == null ? void 0 : el._reject();
        el._reject = reject;

        _toggle(el, show);

        const off = once(
        transitionElement,
        'transitionstart',
        () => {
          once(transitionElement, 'transitionend transitioncancel', resolve, {
            self: true });

          clearTimeout(timer);
        },
        { self: true });


        const timer = setTimeout(() => {
          off();
          resolve();
        }, toMs(css(transitionElement, 'transitionDuration')));
      })).
      then(() => delete el._reject);
    }

    function toMs(time) {
      return time ? endsWith(time, 'ms') ? toFloat(time) : toFloat(time) * 1000 : 0;
    }

    function preventOverscroll(el) {
      if (CSS.supports('overscroll-behavior', 'contain')) {
        const elements = filterChildren(el, (child) => /auto|scroll/.test(css(child, 'overflow')));
        css(elements, 'overscrollBehavior', 'contain');
        return () => css(elements, 'overscrollBehavior', '');
      }

      let startClientY;

      const events = [
      on(
      el,
      'touchstart',
      (_ref7) => {let { targetTouches } = _ref7;
        if (targetTouches.length === 1) {
          startClientY = targetTouches[0].clientY;
        }
      },
      { passive: true }),


      on(
      el,
      'touchmove',
      (e) => {
        if (e.targetTouches.length !== 1) {
          return;
        }

        let [scrollParent] = scrollParents(e.target, /auto|scroll/);
        if (!within(scrollParent, el)) {
          scrollParent = el;
        }

        const clientY = e.targetTouches[0].clientY - startClientY;
        const { scrollTop, scrollHeight, clientHeight } = scrollParent;

        if (
        clientHeight >= scrollHeight ||
        scrollTop === 0 && clientY > 0 ||
        scrollHeight - scrollTop <= clientHeight && clientY < 0)
        {
          e.cancelable && e.preventDefault();
        }
      },
      { passive: false })];



      return () => events.forEach((fn) => fn());
    }

    let prevented;
    function preventBackgroundScroll() {
      if (prevented) {
        return noop;
      }
      prevented = true;

      const { scrollingElement } = document;
      css(scrollingElement, {
        overflowY: 'hidden',
        touchAction: 'none',
        paddingRight: width(window) - scrollingElement.clientWidth });

      return () => {
        prevented = false;
        css(scrollingElement, { overflowY: '', touchAction: '', paddingRight: '' });
      };
    }

    function filterChildren(el, fn) {
      const children = [];
      apply(el, (node) => {
        if (fn(node)) {
          children.push(node);
        }
      });
      return children;
    }

    function isSameSiteAnchor(a) {
      return ['origin', 'pathname', 'search'].every((part) => a[part] === location[part]);
    }

    let active;

    var drop = {
      mixins: [Container, Lazyload, Position, Style, Togglable],

      args: 'pos',

      props: {
        mode: 'list',
        toggle: Boolean,
        boundary: Boolean,
        boundaryX: Boolean,
        boundaryY: Boolean,
        target: Boolean,
        targetX: Boolean,
        targetY: Boolean,
        stretch: Boolean,
        delayShow: Number,
        delayHide: Number,
        autoUpdate: Boolean,
        clsDrop: String,
        animateOut: Boolean,
        bgScroll: Boolean },


      data: {
        mode: ['click', 'hover'],
        toggle: '- *',
        boundary: false,
        boundaryX: false,
        boundaryY: false,
        target: false,
        targetX: false,
        targetY: false,
        stretch: false,
        delayShow: 0,
        delayHide: 800,
        autoUpdate: true,
        clsDrop: false,
        animateOut: false,
        bgScroll: true,
        animation: ['uk-animation-fade'],
        cls: 'uk-open',
        container: false },


      computed: {
        boundary(_ref, $el) {let { boundary, boundaryX, boundaryY } = _ref;
          return [
          query(boundaryX || boundary, $el) || window,
          query(boundaryY || boundary, $el) || window];

        },

        target(_ref2, $el) {let { target, targetX, targetY } = _ref2;
          targetX = targetX || target || this.targetEl;
          targetY = targetY || target || this.targetEl;

          return [
          targetX === true ? window : query(targetX, $el),
          targetY === true ? window : query(targetY, $el)];

        } },


      created() {
        this.tracker = new MouseTracker();
      },

      beforeConnect() {
        this.clsDrop = this.$props.clsDrop || "uk-" + this.$options.name;
      },

      connected() {
        addClass(this.$el, this.clsDrop);

        if (this.toggle && !this.targetEl) {
          this.targetEl = this.$create('toggle', query(this.toggle, this.$el), {
            target: this.$el,
            mode: this.mode }).
          $el;
          attr(this.targetEl, 'aria-haspopup', true);
          this.lazyload(this.targetEl);
        }
      },

      disconnected() {
        if (this.isActive()) {
          this.hide(false);
          active = null;
        }
      },

      events: [
      {
        name: 'click',

        delegate() {
          return "." + this.clsDrop + "-close";
        },

        handler(e) {
          e.preventDefault();
          this.hide(false);
        } },


      {
        name: 'click',

        delegate() {
          return 'a[href*="#"]';
        },

        handler(_ref3) {let { defaultPrevented, current } = _ref3;
          const { hash } = current;
          if (
          !defaultPrevented &&
          hash &&
          isSameSiteAnchor(current) &&
          !within(hash, this.$el))
          {
            this.hide(false);
          }
        } },


      {
        name: 'beforescroll',

        handler() {
          this.hide(false);
        } },


      {
        name: 'toggle',

        self: true,

        handler(e, toggle) {
          e.preventDefault();

          if (this.isToggled()) {
            this.hide(false);
          } else {
            this.show(toggle == null ? void 0 : toggle.$el, false);
          }
        } },


      {
        name: 'toggleshow',

        self: true,

        handler(e, toggle) {
          e.preventDefault();
          this.show(toggle == null ? void 0 : toggle.$el);
        } },


      {
        name: 'togglehide',

        self: true,

        handler(e) {
          e.preventDefault();
          if (!matches(this.$el, ':focus,:hover')) {
            this.hide();
          }
        } },


      {
        name: pointerEnter + " focusin",

        filter() {
          return includes(this.mode, 'hover');
        },

        handler(e) {
          if (!isTouch(e)) {
            this.clearTimers();
          }
        } },


      {
        name: pointerLeave + " focusout",

        filter() {
          return includes(this.mode, 'hover');
        },

        handler(e) {
          if (!isTouch(e) && e.relatedTarget) {
            this.hide();
          }
        } },


      {
        name: 'toggled',

        self: true,

        handler(e, toggled) {
          if (!toggled) {
            return;
          }

          this.clearTimers();
          this.position();
        } },


      {
        name: 'show',

        self: true,

        handler() {
          active = this;

          this.tracker.init();

          const update = () => this.$emit();
          const handlers = [
          on(
          document,
          pointerDown$1,
          (_ref4) => {let { target } = _ref4;return (
              !within(target, this.$el) &&
              once(
              document,
              pointerUp$1 + " " + pointerCancel + " scroll",
              (_ref5) => {let { defaultPrevented, type, target: newTarget } = _ref5;
                if (
                !defaultPrevented &&
                type === pointerUp$1 &&
                target === newTarget &&
                !(this.targetEl && within(target, this.targetEl)))
                {
                  this.hide(false);
                }
              },
              true));}),



          on(document, 'keydown', (e) => {
            if (e.keyCode === 27) {
              this.hide(false);
            }
          }),

          on(window, 'resize', update),

          (() => {
            const observer = observeResize(
            scrollParents(this.$el).concat(this.target),
            update);

            return () => observer.disconnect();
          })(),

          ...(this.autoUpdate ?
          [
          on([document, scrollParents(this.$el)], 'scroll', update, {
            passive: true })] :


          []),

          ...(this.bgScroll ?
          [] :
          [preventOverscroll(this.$el), preventBackgroundScroll()])];


          once(this.$el, 'hide', () => handlers.forEach((handler) => handler()), {
            self: true });

        } },


      {
        name: 'beforehide',

        self: true,

        handler() {
          this.clearTimers();
        } },


      {
        name: 'hide',

        handler(_ref6) {let { target } = _ref6;
          if (this.$el !== target) {
            active =
            active === null && within(target, this.$el) && this.isToggled() ?
            this :
            active;
            return;
          }

          active = this.isActive() ? null : active;
          this.tracker.cancel();
        } }],



      update: {
        write() {
          if (this.isToggled() && !hasClass(this.$el, this.clsEnter)) {
            this.position();
          }
        } },


      methods: {
        show(target, delay) {if (target === void 0) {target = this.targetEl;}if (delay === void 0) {delay = true;}
          if (this.isToggled() && target && this.targetEl && target !== this.targetEl) {
            this.hide(false, false);
          }

          this.targetEl = target;

          this.clearTimers();

          if (this.isActive()) {
            return;
          }

          if (active) {
            if (delay && active.isDelaying) {
              this.showTimer = setTimeout(() => matches(target, ':hover') && this.show(), 10);
              return;
            }

            let prev;
            while (active && prev !== active && !within(this.$el, active.$el)) {
              prev = active;
              active.hide(false, false);
            }
          }

          if (this.container && parent(this.$el) !== this.container) {
            append(this.container, this.$el);
          }

          this.showTimer = setTimeout(
          () => this.toggleElement(this.$el, true),
          delay && this.delayShow || 0);

        },

        hide(delay, animate) {if (delay === void 0) {delay = true;}if (animate === void 0) {animate = true;}
          const hide = () => this.toggleElement(this.$el, false, this.animateOut && animate);

          this.clearTimers();

          this.isDelaying = getPositionedElements(this.$el).some((el) =>
          this.tracker.movesTo(el));


          if (delay && this.isDelaying) {
            this.hideTimer = setTimeout(this.hide, 50);
          } else if (delay && this.delayHide) {
            this.hideTimer = setTimeout(hide, this.delayHide);
          } else {
            hide();
          }
        },

        clearTimers() {
          clearTimeout(this.showTimer);
          clearTimeout(this.hideTimer);
          this.showTimer = null;
          this.hideTimer = null;
          this.isDelaying = false;
        },

        isActive() {
          return active === this;
        },

        position() {
          removeClass(this.$el, this.clsDrop + "-stack");
          attr(this.$el, 'style', this._style);

          // Ensure none positioned element does not generate scrollbars
          this.$el.hidden = true;

          const viewports = this.target.map((target) => offsetViewport(scrollParents(target)[0]));
          const viewportOffset = this.getViewportOffset(this.$el);

          const dirs = [
          [0, ['x', 'width', 'left', 'right']],
          [1, ['y', 'height', 'top', 'bottom']]];


          for (const [i, [axis, prop]] of dirs) {
            if (this.axis !== axis && includes([axis, true], this.stretch)) {
              css(this.$el, {
                [prop]: Math.min(
                offset(this.boundary[i])[prop],
                viewports[i][prop] - 2 * viewportOffset),

                ["overflow-" + axis]: 'auto' });

            }
          }

          const maxWidth = viewports[0].width - 2 * viewportOffset;

          if (this.$el.offsetWidth > maxWidth) {
            addClass(this.$el, this.clsDrop + "-stack");
          }

          css(this.$el, 'maxWidth', maxWidth);

          this.$el.hidden = false;

          this.positionAt(this.$el, this.target, this.boundary);

          for (const [i, [axis, prop, start, end]] of dirs) {
            if (this.axis === axis && includes([axis, true], this.stretch)) {
              const positionOffset = Math.abs(this.getPositionOffset(this.$el));
              const targetOffset = offset(this.target[i]);
              const elOffset = offset(this.$el);

              css(this.$el, {
                [prop]:
                (targetOffset[start] > elOffset[start] ?
                targetOffset[start] -
                Math.max(
                offset(this.boundary[i])[start],
                viewports[i][start] + viewportOffset) :

                Math.min(
                offset(this.boundary[i])[end],
                viewports[i][end] - viewportOffset) -
                targetOffset[end]) - positionOffset,
                ["overflow-" + axis]: 'auto' });


              this.positionAt(this.$el, this.target, this.boundary);
            }
          }
        } } };



    function getPositionedElements(el) {
      const result = [];
      apply(el, (el) => css(el, 'position') !== 'static' && result.push(el));
      return result;
    }

    var formCustom = {
      mixins: [Class],

      args: 'target',

      props: {
        target: Boolean },


      data: {
        target: false },


      computed: {
        input(_, $el) {
          return $(selInput, $el);
        },

        state() {
          return this.input.nextElementSibling;
        },

        target(_ref, $el) {let { target } = _ref;
          return (
            target && (
            target === true && parent(this.input) === $el && this.input.nextElementSibling ||
            $(target, $el)));

        } },


      update() {var _input$files;
        const { target, input } = this;

        if (!target) {
          return;
        }

        let option;
        const prop = isInput(target) ? 'value' : 'textContent';
        const prev = target[prop];
        const value = (_input$files = input.files) != null && _input$files[0] ?
        input.files[0].name :
        matches(input, 'select') && (
        option = $$('option', input).filter((el) => el.selected)[0]) // eslint-disable-line prefer-destructuring
        ? option.textContent :
        input.value;

        if (prev !== value) {
          target[prop] = value;
        }
      },

      events: [
      {
        name: 'change',

        handler() {
          this.$emit();
        } },


      {
        name: 'reset',

        el() {
          return closest(this.$el, 'form');
        },

        handler() {
          this.$emit();
        } }] };

    var Margin = {
      mixins: [Resize],

      props: {
        margin: String,
        firstColumn: Boolean },


      data: {
        margin: 'uk-margin-small-top',
        firstColumn: 'uk-first-column' },


      resizeTargets() {
        return [this.$el, ...toArray(this.$el.children)];
      },

      connected() {
        this.registerObserver(
        observeMutation(this.$el, () => this.$reset(), {
          childList: true }));


      },

      update: {
        read() {
          const rows = getRows(this.$el.children);

          return {
            rows,
            columns: getColumns(rows) };

        },

        write(_ref) {let { columns, rows } = _ref;
          for (const row of rows) {
            for (const column of row) {
              toggleClass(column, this.margin, rows[0] !== row);
              toggleClass(column, this.firstColumn, columns[0].includes(column));
            }
          }
        },

        events: ['resize'] } };



    function getRows(items) {
      return sortBy(items, 'top', 'bottom');
    }

    function getColumns(rows) {
      const columns = [];

      for (const row of rows) {
        const sorted = sortBy(row, 'left', 'right');
        for (let j = 0; j < sorted.length; j++) {
          columns[j] = columns[j] ? columns[j].concat(sorted[j]) : sorted[j];
        }
      }

      return isRtl ? columns.reverse() : columns;
    }

    function sortBy(items, startProp, endProp) {
      const sorted = [[]];

      for (const el of items) {
        if (!isVisible(el)) {
          continue;
        }

        let dim = getOffset(el);

        for (let i = sorted.length - 1; i >= 0; i--) {
          const current = sorted[i];

          if (!current[0]) {
            current.push(el);
            break;
          }

          let startDim;
          if (current[0].offsetParent === el.offsetParent) {
            startDim = getOffset(current[0]);
          } else {
            dim = getOffset(el, true);
            startDim = getOffset(current[0], true);
          }

          if (dim[startProp] >= startDim[endProp] - 1 && dim[startProp] !== startDim[startProp]) {
            sorted.push([el]);
            break;
          }

          if (dim[endProp] - 1 > startDim[startProp] || dim[startProp] === startDim[startProp]) {
            current.push(el);
            break;
          }

          if (i === 0) {
            sorted.unshift([el]);
            break;
          }
        }
      }

      return sorted;
    }

    function getOffset(element, offset) {if (offset === void 0) {offset = false;}
      let { offsetTop, offsetLeft, offsetHeight, offsetWidth } = element;

      if (offset) {
        [offsetTop, offsetLeft] = offsetPosition(element);
      }

      return {
        top: offsetTop,
        left: offsetLeft,
        bottom: offsetTop + offsetHeight,
        right: offsetLeft + offsetWidth };

    }

    var Scroll = {
      connected() {
        registerScrollListener(this._uid, () => this.$emit('scroll'));
      },

      disconnected() {
        unregisterScrollListener(this._uid);
      } };


    const scrollListeners = new Map();
    let unbindScrollListener;
    function registerScrollListener(id, listener) {
      unbindScrollListener =
      unbindScrollListener ||
      on(window, 'scroll', () => scrollListeners.forEach((listener) => listener()), {
        passive: true,
        capture: true });


      scrollListeners.set(id, listener);
    }

    function unregisterScrollListener(id) {
      scrollListeners.delete(id);
      if (unbindScrollListener && !scrollListeners.size) {
        unbindScrollListener();
        unbindScrollListener = null;
      }
    }

    var grid = {
      extends: Margin,

      mixins: [Class],

      name: 'grid',

      props: {
        masonry: Boolean,
        parallax: Number },


      data: {
        margin: 'uk-grid-margin',
        clsStack: 'uk-grid-stack',
        masonry: false,
        parallax: 0 },


      connected() {
        this.masonry && addClass(this.$el, 'uk-flex-top uk-flex-wrap-top');
        this.parallax && registerScrollListener(this._uid, () => this.$emit('scroll'));
      },

      disconnected() {
        unregisterScrollListener(this._uid);
      },

      update: [
      {
        write(_ref) {let { columns } = _ref;
          toggleClass(this.$el, this.clsStack, columns.length < 2);
        },

        events: ['resize'] },


      {
        read(data) {
          let { columns, rows } = data;

          // Filter component makes elements positioned absolute
          if (
          !columns.length ||
          !this.masonry && !this.parallax ||
          positionedAbsolute(this.$el))
          {
            data.translates = false;
            return false;
          }

          let translates = false;

          const nodes = children(this.$el);
          const columnHeights = getColumnHeights(columns);
          const margin = getMarginTop(nodes, this.margin) * (rows.length - 1);
          const elHeight = Math.max(...columnHeights) + margin;

          if (this.masonry) {
            columns = columns.map((column) => sortBy$1(column, 'offsetTop'));
            translates = getTranslates(rows, columns);
          }

          let padding = Math.abs(this.parallax);
          if (padding) {
            padding = columnHeights.reduce(
            (newPadding, hgt, i) =>
            Math.max(
            newPadding,
            hgt + margin + (i % 2 ? padding : padding / 8) - elHeight),

            0);

          }

          return { padding, columns, translates, height: translates ? elHeight : '' };
        },

        write(_ref2) {let { height, padding } = _ref2;
          css(this.$el, 'paddingBottom', padding || '');
          height !== false && css(this.$el, 'height', height);
        },

        events: ['resize'] },


      {
        read() {
          if (this.parallax && positionedAbsolute(this.$el)) {
            return false;
          }

          return {
            scrolled: this.parallax ?
            scrolledOver(this.$el) * Math.abs(this.parallax) :
            false };

        },

        write(_ref3) {let { columns, scrolled, translates } = _ref3;
          if (scrolled === false && !translates) {
            return;
          }

          columns.forEach((column, i) =>
          column.forEach((el, j) =>
          css(
          el,
          'transform',
          !scrolled && !translates ?
          '' : "translateY(" + (

          (translates && -translates[i][j]) + (
          scrolled ? i % 2 ? scrolled : scrolled / 8 : 0)) + "px)")));




        },

        events: ['scroll', 'resize'] }] };




    function positionedAbsolute(el) {
      return children(el).some((el) => css(el, 'position') === 'absolute');
    }

    function getTranslates(rows, columns) {
      const rowHeights = rows.map((row) => Math.max(...row.map((el) => el.offsetHeight)));

      return columns.map((elements) => {
        let prev = 0;
        return elements.map(
        (element, row) =>
        prev += row ? rowHeights[row - 1] - elements[row - 1].offsetHeight : 0);

      });
    }

    function getMarginTop(nodes, cls) {
      const [node] = nodes.filter((el) => hasClass(el, cls));

      return toFloat(node ? css(node, 'marginTop') : css(nodes[0], 'paddingLeft'));
    }

    function getColumnHeights(columns) {
      return columns.map((column) => column.reduce((sum, el) => sum + el.offsetHeight, 0));
    }

    var heightMatch = {
      mixins: [Resize],

      args: 'target',

      props: {
        target: String,
        row: Boolean },


      data: {
        target: '> *',
        row: true },


      computed: {
        elements: {
          get(_ref, $el) {let { target } = _ref;
            return $$(target, $el);
          },

          watch() {
            this.$reset();
          } } },



      resizeTargets() {
        return [this.$el, ...this.elements];
      },

      update: {
        read() {
          return {
            rows: (this.row ? getRows(this.elements) : [this.elements]).map(match$1) };

        },

        write(_ref2) {let { rows } = _ref2;
          for (const { heights, elements } of rows) {
            elements.forEach((el, i) => css(el, 'minHeight', heights[i]));
          }
        },

        events: ['resize'] } };



    function match$1(elements) {
      if (elements.length < 2) {
        return { heights: [''], elements };
      }

      css(elements, 'minHeight', '');
      let heights = elements.map(getHeight);
      const max = Math.max(...heights);

      return {
        heights: elements.map((el, i) => heights[i].toFixed(2) === max.toFixed(2) ? '' : max),
        elements };

    }

    function getHeight(element) {
      let style = false;
      if (!isVisible(element)) {
        style = element.style.display;
        css(element, 'display', 'block', 'important');
      }

      const height = dimensions$1(element).height - boxModelAdjust(element, 'height', 'content-box');

      if (style !== false) {
        css(element, 'display', style);
      }

      return height;
    }

    var heightViewport = {
      mixins: [Resize],

      props: {
        expand: Boolean,
        offsetTop: Boolean,
        offsetBottom: Boolean,
        minHeight: Number },


      data: {
        expand: false,
        offsetTop: false,
        offsetBottom: false,
        minHeight: 0 },


      resizeTargets() {
        // check for offsetTop change
        return [this.$el, ...scrollParents(this.$el, /auto|scroll/)];
      },

      update: {
        read(_ref) {let { minHeight: prev } = _ref;
          if (!isVisible(this.$el)) {
            return false;
          }

          let minHeight = '';
          const box = boxModelAdjust(this.$el, 'height', 'content-box');

          const { body, scrollingElement } = document;
          const [scrollElement] = scrollParents(this.$el, /auto|scroll/);
          const { height: viewportHeight } = offsetViewport(
          scrollElement === body ? scrollingElement : scrollElement);


          if (this.expand) {
            minHeight = Math.max(
            viewportHeight - (
            dimensions$1(scrollElement).height - dimensions$1(this.$el).height) -
            box,
            0);

          } else {
            const isScrollingElement =
            scrollingElement === scrollElement || body === scrollElement;

            // on mobile devices (iOS and Android) window.innerHeight !== 100vh
            minHeight = "calc(" + (isScrollingElement ? '100vh' : viewportHeight + "px");

            if (this.offsetTop) {
              if (isScrollingElement) {
                const top = offsetPosition(this.$el)[0] - offsetPosition(scrollElement)[0];
                minHeight += top > 0 && top < viewportHeight / 2 ? " - " + top + "px" : '';
              } else {
                minHeight += " - " + css(scrollElement, 'paddingTop');
              }
            }

            if (this.offsetBottom === true) {
              minHeight += " - " + dimensions$1(this.$el.nextElementSibling).height + "px";
            } else if (isNumeric(this.offsetBottom)) {
              minHeight += " - " + this.offsetBottom + "vh";
            } else if (this.offsetBottom && endsWith(this.offsetBottom, 'px')) {
              minHeight += " - " + toFloat(this.offsetBottom) + "px";
            } else if (isString(this.offsetBottom)) {
              minHeight += " - " + dimensions$1(query(this.offsetBottom, this.$el)).height + "px";
            }

            minHeight += (box ? " - " + box + "px" : '') + ")";
          }

          return { minHeight, prev };
        },

        write(_ref2) {let { minHeight } = _ref2;
          css(this.$el, { minHeight });

          if (this.minHeight && toFloat(css(this.$el, 'minHeight')) < this.minHeight) {
            css(this.$el, 'minHeight', this.minHeight);
          }
        },

        events: ['resize'] } };

    var SVG = {
      args: 'src',

      props: {
        id: Boolean,
        icon: String,
        src: String,
        style: String,
        width: Number,
        height: Number,
        ratio: Number,
        class: String,
        strokeAnimation: Boolean,
        focusable: Boolean, // IE 11
        attributes: 'list' },


      data: {
        ratio: 1,
        include: ['style', 'class', 'focusable'],
        class: '',
        strokeAnimation: false },


      beforeConnect() {
        this.class += ' uk-svg';
      },

      connected() {
        if (!this.icon && includes(this.src, '#')) {
          [this.src, this.icon] = this.src.split('#');
        }

        this.svg = this.getSvg().then((el) => {
          if (this._connected) {
            const svg = insertSVG(el, this.$el);

            if (this.svgEl && svg !== this.svgEl) {
              remove$1(this.svgEl);
            }

            this.applyAttributes(svg, el);

            return this.svgEl = svg;
          }
        }, noop);

        if (this.strokeAnimation) {
          this.svg.then((el) => {
            if (this._connected) {
              applyAnimation(el);
              this.registerObserver(
              observeIntersection(el, (records, observer) => {
                applyAnimation(el);
                observer.disconnect();
              }));

            }
          });
        }
      },

      disconnected() {
        this.svg.then((svg) => {
          if (this._connected) {
            return;
          }

          if (isVoidElement(this.$el)) {
            this.$el.hidden = false;
          }

          remove$1(svg);
          this.svgEl = null;
        });

        this.svg = null;
      },

      methods: {
        async getSvg() {
          if (isTag(this.$el, 'img') && !this.$el.complete && this.$el.loading === 'lazy') {
            return new Promise((resolve) =>
            once(this.$el, 'load', () => resolve(this.getSvg())));

          }

          return parseSVG(await loadSVG(this.src), this.icon) || Promise.reject('SVG not found.');
        },

        applyAttributes(el, ref) {
          for (const prop in this.$options.props) {
            if (includes(this.include, prop) && prop in this) {
              attr(el, prop, this[prop]);
            }
          }

          for (const attribute in this.attributes) {
            const [prop, value] = this.attributes[attribute].split(':', 2);
            attr(el, prop, value);
          }

          if (!this.id) {
            removeAttr(el, 'id');
          }

          const props = ['width', 'height'];
          let dimensions = props.map((prop) => this[prop]);

          if (!dimensions.some((val) => val)) {
            dimensions = props.map((prop) => attr(ref, prop));
          }

          const viewBox = attr(ref, 'viewBox');
          if (viewBox && !dimensions.some((val) => val)) {
            dimensions = viewBox.split(' ').slice(2);
          }

          dimensions.forEach((val, i) => attr(el, props[i], toFloat(val) * this.ratio || null));
        } } };



    const loadSVG = memoize(async (src) => {
      if (src) {
        if (startsWith(src, 'data:')) {
          return decodeURIComponent(src.split(',')[1]);
        } else {
          return (await fetch(src)).text();
        }
      } else {
        return Promise.reject();
      }
    });

    function parseSVG(svg, icon) {var _svg;
      if (icon && includes(svg, '<symbol')) {
        svg = parseSymbols(svg, icon) || svg;
      }

      svg = $(svg.substr(svg.indexOf('<svg')));
      return ((_svg = svg) == null ? void 0 : _svg.hasChildNodes()) && svg;
    }

    const symbolRe = /<symbol([^]*?id=(['"])(.+?)\2[^]*?<\/)symbol>/g;
    const symbols = {};

    function parseSymbols(svg, icon) {
      if (!symbols[svg]) {
        symbols[svg] = {};

        symbolRe.lastIndex = 0;

        let match;
        while (match = symbolRe.exec(svg)) {
          symbols[svg][match[3]] = "<svg xmlns=\"http://www.w3.org/2000/svg\"" + match[1] + "svg>";
        }
      }

      return symbols[svg][icon];
    }

    function applyAnimation(el) {
      const length = getMaxPathLength(el);

      if (length) {
        el.style.setProperty('--uk-animation-stroke', length);
      }
    }

    function getMaxPathLength(el) {
      return Math.ceil(
      Math.max(
      0,
      ...$$('[stroke]', el).map((stroke) => {
        try {
          return stroke.getTotalLength();
        } catch (e) {
          return 0;
        }
      })));


    }

    function insertSVG(el, root) {
      if (isVoidElement(root) || isTag(root, 'canvas')) {
        root.hidden = true;

        const next = root.nextElementSibling;
        return equals(el, next) ? next : after(root, el);
      }

      const last = root.lastElementChild;
      return equals(el, last) ? last : append(root, el);
    }

    function equals(el, other) {
      return isTag(el, 'svg') && isTag(other, 'svg') && innerHTML(el) === innerHTML(other);
    }

    function innerHTML(el) {
      return (
      el.innerHTML ||
      new XMLSerializer().serializeToString(el).replace(/<svg.*?>(.*?)<\/svg>/g, '$1')).
      replace(/\s/g, '');
    }

    var closeIcon = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" xmlns=\"http://www.w3.org/2000/svg\"><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"1\" y1=\"1\" x2=\"13\" y2=\"13\"/><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"13\" y1=\"1\" x2=\"1\" y2=\"13\"/></svg>";

    var closeLarge = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" x1=\"1\" y1=\"1\" x2=\"19\" y2=\"19\"/><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" x1=\"19\" y1=\"1\" x2=\"1\" y2=\"19\"/></svg>";

    var marker = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"9\" y=\"4\" width=\"1\" height=\"11\"/><rect x=\"4\" y=\"9\" width=\"11\" height=\"1\"/></svg>";

    var navParentIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 12 12\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" points=\"1 3.5 6 8.5 11 3.5\"/></svg>";

    var navParentIconLarge = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" points=\"1 4 7 10 13 4\"/></svg>";

    var navbarParentIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 12 12\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" points=\"1 3.5 6 8.5 11 3.5\"/></svg>";

    var navbarToggleIcon = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><style>.uk-navbar-toggle-animate svg > [class*='line-'] {\n            transition: 0.2s ease-in-out;\n            transition-property: transform, opacity,;\n            transform-origin: center;\n            opacity: 1;\n        }\n\n        .uk-navbar-toggle svg > .line-3 { opacity: 0; }\n        .uk-navbar-toggle-animate[aria-expanded=\"true\"] svg > .line-3 { opacity: 1; }\n\n        .uk-navbar-toggle-animate[aria-expanded=\"true\"] svg > .line-2 { transform: rotate(45deg); }\n        .uk-navbar-toggle-animate[aria-expanded=\"true\"] svg > .line-3 { transform: rotate(-45deg); }\n\n        .uk-navbar-toggle-animate[aria-expanded=\"true\"] svg > .line-1,\n        .uk-navbar-toggle-animate[aria-expanded=\"true\"] svg > .line-4 { opacity: 0; }\n        .uk-navbar-toggle-animate[aria-expanded=\"true\"] svg > .line-1 { transform: translateY(6px) scaleX(0); }\n        .uk-navbar-toggle-animate[aria-expanded=\"true\"] svg > .line-4 { transform: translateY(-6px) scaleX(0); }</style><rect class=\"line-1\" y=\"3\" width=\"20\" height=\"2\"/><rect class=\"line-2\" y=\"9\" width=\"20\" height=\"2\"/><rect class=\"line-3\" y=\"9\" width=\"20\" height=\"2\"/><rect class=\"line-4\" y=\"15\" width=\"20\" height=\"2\"/></svg>";

    var overlayIcon = "<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"19\" y=\"0\" width=\"1\" height=\"40\"/><rect x=\"0\" y=\"19\" width=\"40\" height=\"1\"/></svg>";

    var paginationNext = "<svg width=\"7\" height=\"12\" viewBox=\"0 0 7 12\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"1 1 6 6 1 11\"/></svg>";

    var paginationPrevious = "<svg width=\"7\" height=\"12\" viewBox=\"0 0 7 12\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"6 1 1 6 6 11\"/></svg>";

    var searchIcon = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"9\" cy=\"9\" r=\"7\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M14,14 L18,18 L14,14 Z\"/></svg>";

    var searchLarge = "<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.8\" cx=\"17.5\" cy=\"17.5\" r=\"16.5\"/><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.8\" x1=\"38\" y1=\"39\" x2=\"29\" y2=\"30\"/></svg>";

    var searchNavbar = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"10.5\" cy=\"10.5\" r=\"9.5\"/><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"23\" y1=\"23\" x2=\"17\" y2=\"17\"/></svg>";

    var slidenavNext = "<svg width=\"14\" height=\"24\" viewBox=\"0 0 14 24\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" points=\"1.225,23 12.775,12 1.225,1 \"/></svg>";

    var slidenavNextLarge = "<svg width=\"25\" height=\"40\" viewBox=\"0 0 25 40\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"2\" points=\"4.002,38.547 22.527,20.024 4,1.5 \"/></svg>";

    var slidenavPrevious = "<svg width=\"14\" height=\"24\" viewBox=\"0 0 14 24\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" points=\"12.775,1 1.225,12 12.775,23 \"/></svg>";

    var slidenavPreviousLarge = "<svg width=\"25\" height=\"40\" viewBox=\"0 0 25 40\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"2\" points=\"20.527,1.5 2,20.024 20.525,38.547 \"/></svg>";

    var spinner = "<svg width=\"30\" height=\"30\" viewBox=\"0 0 30 30\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" cx=\"15\" cy=\"15\" r=\"14\"/></svg>";

    var totop = "<svg width=\"18\" height=\"10\" viewBox=\"0 0 18 10\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"1 9 9 1 17 9 \"/></svg>";

    const icons = {
      spinner,
      totop,
      marker,
      'close-icon': closeIcon,
      'close-large': closeLarge,
      'nav-parent-icon': navParentIcon,
      'nav-parent-icon-large': navParentIconLarge,
      'navbar-parent-icon': navbarParentIcon,
      'navbar-toggle-icon': navbarToggleIcon,
      'overlay-icon': overlayIcon,
      'pagination-next': paginationNext,
      'pagination-previous': paginationPrevious,
      'search-icon': searchIcon,
      'search-large': searchLarge,
      'search-navbar': searchNavbar,
      'slidenav-next': slidenavNext,
      'slidenav-next-large': slidenavNextLarge,
      'slidenav-previous': slidenavPrevious,
      'slidenav-previous-large': slidenavPreviousLarge };


    const Icon = {
      install: install$3,

      extends: SVG,

      args: 'icon',

      props: ['icon'],

      data: {
        include: ['focusable'] },


      isIcon: true,

      beforeConnect() {
        addClass(this.$el, 'uk-icon');
      },

      methods: {
        async getSvg() {
          const icon = getIcon(this.icon);

          if (!icon) {
            throw 'Icon not found.';
          }

          return icon;
        } } };

    const IconComponent = {
      args: false,

      extends: Icon,

      data: (vm) => ({
        icon: hyphenate(vm.constructor.options.name) }),


      beforeConnect() {
        addClass(this.$el, this.$name);
      } };


    const NavParentIcon = {
      extends: IconComponent,

      beforeConnect() {
        const icon = this.$props.icon;
        this.icon = closest(this.$el, '.uk-nav-primary') ? icon + "-large" : icon;
      } };


    const Slidenav = {
      extends: IconComponent,

      beforeConnect() {
        addClass(this.$el, 'uk-slidenav');
        const icon = this.$props.icon;
        this.icon = hasClass(this.$el, 'uk-slidenav-large') ? icon + "-large" : icon;
      } };


    const Search = {
      extends: IconComponent,

      beforeConnect() {
        this.icon =
        hasClass(this.$el, 'uk-search-icon') && parents(this.$el, '.uk-search-large').length ?
        'search-large' :
        parents(this.$el, '.uk-search-navbar').length ?
        'search-navbar' :
        this.$props.icon;
      } };


    const Close = {
      extends: IconComponent,

      beforeConnect() {
        this.icon = "close-" + (hasClass(this.$el, 'uk-close-large') ? 'large' : 'icon');
      } };


    const Spinner = {
      extends: IconComponent,

      methods: {
        async getSvg() {
          const icon = await Icon.methods.getSvg.call(this);

          if (this.ratio !== 1) {
            css($('circle', icon), 'strokeWidth', 1 / this.ratio);
          }

          return icon;
        } } };



    const parsed = {};
    function install$3(UIkit) {
      UIkit.icon.add = (name, svg) => {
        const added = isString(name) ? { [name]: svg } : name;
        each(added, (svg, name) => {
          icons[name] = svg;
          delete parsed[name];
        });

        if (UIkit._initialized) {
          apply(document.body, (el) =>
          each(UIkit.getComponents(el), (cmp) => {
            cmp.$options.isIcon && cmp.icon in added && cmp.$reset();
          }));

        }
      };
    }

    function getIcon(icon) {
      if (!icons[icon]) {
        return null;
      }

      if (!parsed[icon]) {
        parsed[icon] = $((icons[applyRtl(icon)] || icons[icon]).trim());
      }

      return parsed[icon].cloneNode(true);
    }

    function applyRtl(icon) {
      return isRtl ? swap(swap(icon, 'left', 'right'), 'previous', 'next') : icon;
    }

    const nativeLazyLoad = inBrowser && 'loading' in HTMLImageElement.prototype;

    var img = {
      args: 'dataSrc',

      props: {
        dataSrc: String,
        sources: String,
        offsetTop: String,
        offsetLeft: String,
        target: String,
        loading: String },


      data: {
        dataSrc: '',
        sources: false,
        offsetTop: '50vh',
        offsetLeft: '50vw',
        target: false,
        loading: 'lazy' },


      connected() {
        if (this.loading !== 'lazy') {
          this.load();
          return;
        }

        const target = [this.$el, ...queryAll(this.$props.target, this.$el)];

        if (nativeLazyLoad && isImg(this.$el)) {
          this.$el.loading = 'lazy';
          setSrcAttrs(this.$el);

          if (target.length === 1) {
            return;
          }
        }

        ensureSrcAttribute(this.$el);

        this.registerObserver(
        observeIntersection(
        target,
        (entries, observer) => {
          this.load();
          observer.disconnect();
        },
        {
          rootMargin: toPx(this.offsetTop, 'height') + "px " + toPx(
          this.offsetLeft,
          'width') + "px" }));




      },

      disconnected() {
        if (this._data.image) {
          this._data.image.onload = '';
        }
      },

      methods: {
        load() {
          if (this._data.image) {
            return this._data.image;
          }

          const image = isImg(this.$el) ?
          this.$el :
          getImageFromElement(this.$el, this.dataSrc, this.sources);

          removeAttr(image, 'loading');
          setSrcAttrs(this.$el, image.currentSrc);
          return this._data.image = image;
        } } };



    function setSrcAttrs(el, src) {
      if (isImg(el)) {
        const parentNode = parent(el);
        const elements = isPicture(parentNode) ? children(parentNode) : [el];
        elements.forEach((el) => setSourceProps(el, el));
      } else if (src) {
        const change = !includes(el.style.backgroundImage, src);
        if (change) {
          css(el, 'backgroundImage', "url(" + escape(src) + ")");
          trigger(el, createEvent('load', false));
        }
      }
    }

    const srcProps = ['data-src', 'data-srcset', 'sizes'];
    function setSourceProps(sourceEl, targetEl) {
      srcProps.forEach((prop) => {
        const value = data(sourceEl, prop);
        if (value) {
          attr(targetEl, prop.replace(/^(data-)+/, ''), value);
        }
      });
    }

    function getImageFromElement(el, src, sources) {
      const img = new Image();

      wrapInPicture(img, sources);
      setSourceProps(el, img);
      img.onload = () => {
        setSrcAttrs(el, img.currentSrc);
      };
      attr(img, 'src', src);
      return img;
    }

    function wrapInPicture(img, sources) {
      sources = parseSources(sources);

      if (sources.length) {
        const picture = fragment('<picture>');
        for (const attrs of sources) {
          const source = fragment('<source>');
          attr(source, attrs);
          append(picture, source);
        }
        append(picture, img);
      }
    }

    function parseSources(sources) {
      if (!sources) {
        return [];
      }

      if (startsWith(sources, '[')) {
        try {
          sources = JSON.parse(sources);
        } catch (e) {
          sources = [];
        }
      } else {
        sources = parseOptions(sources);
      }

      if (!isArray(sources)) {
        sources = [sources];
      }

      return sources.filter((source) => !isEmpty(source));
    }

    function ensureSrcAttribute(el) {
      if (isImg(el) && !hasAttr(el, 'src')) {
        attr(el, 'src', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"></svg>');
      }
    }

    function isPicture(el) {
      return isTag(el, 'picture');
    }

    function isImg(el) {
      return isTag(el, 'img');
    }

    var Media = {
      props: {
        media: Boolean },


      data: {
        media: false },


      connected() {
        const media = toMedia(this.media, this.$el);
        this.matchMedia = true;
        if (media) {
          this.mediaObj = window.matchMedia(media);
          const handler = () => {
            this.matchMedia = this.mediaObj.matches;
            trigger(this.$el, createEvent('mediachange', false, true, [this.mediaObj]));
          };
          this.offMediaObj = on(this.mediaObj, 'change', () => {
            handler();
            this.$emit('resize');
          });
          handler();
        }
      },

      disconnected() {var _this$offMediaObj;
        (_this$offMediaObj = this.offMediaObj) == null ? void 0 : _this$offMediaObj.call(this);
      } };


    function toMedia(value, element) {
      if (isString(value)) {
        if (startsWith(value, '@')) {
          value = toFloat(css(element, "--uk-breakpoint-" + value.substr(1)));
        } else if (isNaN(value)) {
          return value;
        }
      }

      return value && isNumeric(value) ? "(min-width: " + value + "px)" : '';
    }

    var leader = {
      mixins: [Class, Media, Resize],

      props: {
        fill: String },


      data: {
        fill: '',
        clsWrapper: 'uk-leader-fill',
        clsHide: 'uk-leader-hide',
        attrFill: 'data-fill' },


      computed: {
        fill(_ref) {let { fill } = _ref;
          return fill || css(this.$el, '--uk-leader-fill-content');
        } },


      connected() {
        [this.wrapper] = wrapInner(this.$el, "<span class=\"" + this.clsWrapper + "\">");
      },

      disconnected() {
        unwrap(this.wrapper.childNodes);
      },

      update: {
        read() {
          const width = Math.trunc(this.$el.offsetWidth / 2);

          return {
            width,
            fill: this.fill,
            hide: !this.matchMedia };

        },

        write(_ref2) {let { width, fill, hide } = _ref2;
          toggleClass(this.wrapper, this.clsHide, hide);
          attr(this.wrapper, this.attrFill, new Array(width).join(fill));
        },

        events: ['resize'] } };

    var modal = {
      install: install$2,

      mixins: [Modal],

      data: {
        clsPage: 'uk-modal-page',
        selPanel: '.uk-modal-dialog',
        selClose:
        '.uk-modal-close, .uk-modal-close-default, .uk-modal-close-outside, .uk-modal-close-full' },


      events: [
      {
        name: 'show',

        self: true,

        handler() {
          if (hasClass(this.panel, 'uk-margin-auto-vertical')) {
            addClass(this.$el, 'uk-flex');
          } else {
            css(this.$el, 'display', 'block');
          }

          height(this.$el); // force reflow
        } },


      {
        name: 'hidden',

        self: true,

        handler() {
          css(this.$el, 'display', '');
          removeClass(this.$el, 'uk-flex');
        } }] };




    function install$2(_ref) {let { modal } = _ref;
      modal.dialog = function (content, options) {
        const dialog = modal("<div class=\"uk-modal\"> <div class=\"uk-modal-dialog\">" +

        content + "</div> </div>",

        options);


        dialog.show();

        on(
        dialog.$el,
        'hidden',
        async () => {
          await Promise.resolve();
          dialog.$destroy(true);
        },
        { self: true });


        return dialog;
      };

      modal.alert = function (message, options) {
        return openDialog(
        (_ref2) => {let { labels } = _ref2;return "<div class=\"uk-modal-body\">" + (
          isString(message) ? message : html(message)) + "</div> <div class=\"uk-modal-footer uk-text-right\"> <button class=\"uk-button uk-button-primary uk-modal-close\" autofocus>" +



          labels.ok + "</button> </div>";},


        options,
        (deferred) => deferred.resolve());

      };

      modal.confirm = function (message, options) {
        return openDialog(
        (_ref3) => {let { labels } = _ref3;return "<form> <div class=\"uk-modal-body\">" + (
          isString(message) ? message : html(message)) + "</div> <div class=\"uk-modal-footer uk-text-right\"> <button class=\"uk-button uk-button-default uk-modal-close\" type=\"button\">" +


          labels.cancel + "</button> <button class=\"uk-button uk-button-primary\" autofocus>" +

          labels.ok + "</button> </div> </form>";},


        options,
        (deferred) => deferred.reject());

      };

      modal.prompt = function (message, value, options) {
        return openDialog(
        (_ref4) => {let { labels } = _ref4;return "<form class=\"uk-form-stacked\"> <div class=\"uk-modal-body\"> <label>" + (

          isString(message) ? message : html(message)) + "</label> <input class=\"uk-input\" value=\"" + (
          value || '') + "\" autofocus> </div> <div class=\"uk-modal-footer uk-text-right\"> <button class=\"uk-button uk-button-default uk-modal-close\" type=\"button\">" +



          labels.cancel + "</button> <button class=\"uk-button uk-button-primary\">" +

          labels.ok + "</button> </div> </form>";},


        options,
        (deferred) => deferred.resolve(null),
        (dialog) => $('input', dialog.$el).value);

      };

      modal.labels = {
        ok: 'Ok',
        cancel: 'Cancel' };


      function openDialog(tmpl, options, hideFn, submitFn) {
        options = { bgClose: false, escClose: true, labels: modal.labels, ...options };

        const dialog = modal.dialog(tmpl(options), options);
        const deferred = new Deferred();

        let resolved = false;

        on(dialog.$el, 'submit', 'form', (e) => {
          e.preventDefault();
          deferred.resolve(submitFn == null ? void 0 : submitFn(dialog));
          resolved = true;
          dialog.hide();
        });

        on(dialog.$el, 'hide', () => !resolved && hideFn(deferred));

        deferred.promise.dialog = dialog;

        return deferred.promise;
      }
    }

    var nav = {
      extends: Accordion,

      data: {
        targets: '> .uk-parent',
        toggle: '> a',
        content: '> ul' } };

    var navbar = {
      mixins: [Class, Container],

      props: {
        dropdown: String,
        align: String,
        clsDrop: String,
        boundary: Boolean,
        dropbar: Boolean,
        dropbarAnchor: Boolean,
        duration: Number,
        mode: Boolean,
        offset: Boolean,
        stretch: Boolean,
        delayShow: Boolean,
        delayHide: Boolean,
        target: Boolean,
        targetX: Boolean,
        targetY: Boolean,
        animation: Boolean,
        animateOut: Boolean },


      data: {
        dropdown: '.uk-navbar-nav > li > a, .uk-navbar-item, .uk-navbar-toggle',
        align: isRtl ? 'right' : 'left',
        clsDrop: 'uk-navbar-dropdown',
        boundary: true,
        dropbar: false,
        dropbarAnchor: false,
        duration: 200,
        container: false },


      computed: {
        dropbarAnchor(_ref, $el) {let { dropbarAnchor } = _ref;
          return query(dropbarAnchor, $el) || $el;
        },

        dropbar: {
          get(_ref2) {let { dropbar } = _ref2;
            if (!dropbar) {
              return null;
            }

            dropbar =
            this._dropbar ||
            query(dropbar, this.$el) ||
            $('+ .uk-navbar-dropbar', this.$el);

            return dropbar ? dropbar : this._dropbar = $('<div></div>');
          },

          watch(dropbar) {
            addClass(dropbar, 'uk-dropbar', 'uk-dropbar-top', 'uk-navbar-dropbar');
          },

          immediate: true },


        dropContainer(_, $el) {
          return this.container || $el;
        },

        dropdowns: {
          get(_ref3, $el) {let { clsDrop } = _ref3;
            const dropdowns = $$("." + clsDrop, $el);

            if (this.dropContainer !== $el) {
              for (const el of $$("." + clsDrop, this.dropContainer)) {var _this$getDropdown;
                const target = (_this$getDropdown = this.getDropdown(el)) == null ? void 0 : _this$getDropdown.targetEl;
                if (!includes(dropdowns, el) && target && within(target, this.$el)) {
                  dropdowns.push(el);
                }
              }
            }

            return dropdowns;
          },

          watch(dropdowns) {
            this.$create(
            'drop',
            dropdowns.filter((el) => !this.getDropdown(el)),
            {
              ...this.$props,
              flip: false,
              shift: true,
              pos: "bottom-" + this.align,
              boundary: this.boundary === true ? this.$el : this.boundary });


          },

          immediate: true },


        toggles: {
          get(_ref4, $el) {let { dropdown } = _ref4;
            return $$(dropdown, $el);
          },

          watch() {
            const justify = hasClass(this.$el, 'uk-navbar-justify');
            for (const container of $$(
            '.uk-navbar-nav, .uk-navbar-left, .uk-navbar-right',
            this.$el))
            {
              css(container, 'flexGrow', justify ? $$(this.dropdown, container).length : '');
            }
          },

          immediate: true } },



      disconnected() {
        this.dropbar && remove$1(this.dropbar);
        delete this._dropbar;
      },

      events: [
      {
        name: 'mouseover focusin',

        delegate() {
          return this.dropdown;
        },

        handler(_ref5) {let { current } = _ref5;
          const active = this.getActive();
          if (
          active &&
          includes(active.mode, 'hover') &&
          active.targetEl &&
          !within(active.targetEl, current) &&
          !active.isDelaying)
          {
            active.hide(false);
          }
        } },


      {
        name: 'keydown',

        delegate() {
          return this.dropdown;
        },

        handler(e) {
          const { current, keyCode } = e;
          const active = this.getActive();

          if (keyCode === keyMap.DOWN && hasAttr(current, 'aria-expanded')) {
            e.preventDefault();

            if (!active || active.targetEl !== current) {
              current.click();
              once(this.dropContainer, 'show', (_ref6) => {let { target } = _ref6;return (
                  focusFirstFocusableElement(target));});

            } else {
              focusFirstFocusableElement(active.$el);
            }
          }

          handleNavItemNavigation(e, this.toggles, active);
        } },


      {
        name: 'keydown',

        el() {
          return this.dropContainer;
        },

        delegate() {
          return "." + this.clsDrop;
        },

        handler(e) {
          const { current, keyCode } = e;

          if (!includes(this.dropdowns, current)) {
            return;
          }

          const active = this.getActive();
          const elements = $$(selFocusable, current);
          const i = findIndex(elements, (el) => matches(el, ':focus'));

          if (keyCode === keyMap.UP) {
            e.preventDefault();
            if (i > 0) {
              elements[i - 1].focus();
            }
          }

          if (keyCode === keyMap.DOWN) {
            e.preventDefault();
            if (i < elements.length - 1) {
              elements[i + 1].focus();
            }
          }

          if (keyCode === keyMap.ESC) {var _active$targetEl;
            active == null ? void 0 : (_active$targetEl = active.targetEl) == null ? void 0 : _active$targetEl.focus();
          }

          handleNavItemNavigation(e, this.toggles, active);
        } },


      {
        name: 'mouseleave',

        el() {
          return this.dropbar;
        },

        filter() {
          return this.dropbar;
        },

        handler() {
          const active = this.getActive();

          if (
          active &&
          includes(active.mode, 'hover') &&
          !this.dropdowns.some((el) => matches(el, ':hover')))
          {
            active.hide();
          }
        } },


      {
        name: 'beforeshow',

        el() {
          return this.dropContainer;
        },

        filter() {
          return this.dropbar;
        },

        handler(_ref7) {let { target } = _ref7;
          if (!this.isDropbarDrop(target)) {
            return;
          }

          if (this.dropbar.previousElementSibling !== this.dropbarAnchor) {
            after(this.dropbarAnchor, this.dropbar);
          }

          addClass(target, this.clsDrop + "-dropbar");
        } },


      {
        name: 'show',

        el() {
          return this.dropContainer;
        },

        filter() {
          return this.dropbar;
        },

        handler(_ref8) {let { target } = _ref8;
          if (!this.isDropbarDrop(target)) {
            return;
          }

          const drop = this.getDropdown(target);
          this._observer = observeResize([drop.$el, ...drop.target], () => {
            const targetOffsets = parents(target, "." + this.clsDrop).
            concat(target).
            map((el) => offset(el));
            const minTop = Math.min(...targetOffsets.map((_ref9) => {let { top } = _ref9;return top;}));
            const maxBottom = Math.max(...targetOffsets.map((_ref10) => {let { bottom } = _ref10;return bottom;}));
            const dropbarOffset = offset(this.dropbar);
            css(this.dropbar, 'top', this.dropbar.offsetTop - (dropbarOffset.top - minTop));
            this.transitionTo(
            maxBottom - minTop + toFloat(css(target, 'marginBottom')),
            target);

          });
        } },


      {
        name: 'beforehide',

        el() {
          return this.dropContainer;
        },

        filter() {
          return this.dropbar;
        },

        handler(e) {
          const active = this.getActive();

          if (
          matches(this.dropbar, ':hover') &&
          (active == null ? void 0 : active.$el) === e.target &&
          !this.toggles.some((el) => active.targetEl !== el && matches(el, ':focus')))
          {
            e.preventDefault();
          }
        } },


      {
        name: 'hide',

        el() {
          return this.dropContainer;
        },

        filter() {
          return this.dropbar;
        },

        handler(_ref11) {var _this$_observer;let { target } = _ref11;
          if (!this.isDropbarDrop(target)) {
            return;
          }

          (_this$_observer = this._observer) == null ? void 0 : _this$_observer.disconnect();

          const active = this.getActive();

          if (!active || (active == null ? void 0 : active.$el) === target) {
            this.transitionTo(0);
          }
        } }],



      methods: {
        getActive() {
          return includes(this.dropdowns, active == null ? void 0 : active.$el) && active;
        },

        transitionTo(newHeight, el) {
          const { dropbar } = this;
          const oldHeight = height(dropbar);

          el = oldHeight < newHeight && el;

          css(el, 'clipPath', "polygon(0 0,100% 0,100% " + oldHeight + "px,0 " + oldHeight + "px)");

          height(dropbar, oldHeight);

          Transition.cancel([el, dropbar]);
          Promise.all([
          Transition.start(dropbar, { height: newHeight }, this.duration),
          Transition.start(
          el,
          {
            clipPath: "polygon(0 0,100% 0,100% " + newHeight + "px,0 " + newHeight + "px)" },

          this.duration)]).


          catch(noop).
          then(() => css(el, { clipPath: '' }));
        },

        getDropdown(el) {
          return this.$getComponent(el, 'drop') || this.$getComponent(el, 'dropdown');
        },

        isDropbarDrop(el) {
          return this.getDropdown(el) && hasClass(el, this.clsDrop);
        } } };



    function handleNavItemNavigation(e, toggles, active) {
      const { current, keyCode } = e;
      const target = (active == null ? void 0 : active.targetEl) || current;
      const i = toggles.indexOf(target);

      // Left
      if (keyCode === keyMap.LEFT && i > 0) {
        active == null ? void 0 : active.hide(false);
        toggles[i - 1].focus();
      }

      // Right
      if (keyCode === keyMap.RIGHT && i < toggles.length - 1) {
        active == null ? void 0 : active.hide(false);
        toggles[i + 1].focus();
      }

      if (keyCode === keyMap.TAB) {
        target.focus();
        active == null ? void 0 : active.hide(false);
      }
    }

    function focusFirstFocusableElement(el) {
      if (!$(':focus', el)) {var _$;
        (_$ = $(selFocusable, el)) == null ? void 0 : _$.focus();
      }
    }

    const keyMap = {
      TAB: 9,
      ESC: 27,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40 };

    var Swipe = {
      props: {
        swiping: Boolean },


      data: {
        swiping: true },


      computed: {
        swipeTarget(props, $el) {
          return $el;
        } },


      connected() {
        if (!this.swiping) {
          return;
        }

        registerEvent(this, {
          el: this.swipeTarget,
          name: pointerDown$1,
          passive: true,
          handler(e) {
            if (!isTouch(e)) {
              return;
            }

            // Handle Swipe Gesture
            const pos = getEventPos(e);
            const target = 'tagName' in e.target ? e.target : parent(e.target);
            once(document, pointerUp$1 + " " + pointerCancel + " scroll", (e) => {
              const { x, y } = getEventPos(e);

              // swipe
              if (
              e.type !== 'scroll' && target && x && Math.abs(pos.x - x) > 100 ||
              y && Math.abs(pos.y - y) > 100)
              {
                setTimeout(() => {
                  trigger(target, 'swipe');
                  trigger(target, "swipe" + swipeDirection(pos.x, pos.y, x, y));
                });
              }
            });
          } });

      } };


    function swipeDirection(x1, y1, x2, y2) {
      return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ?
      x1 - x2 > 0 ?
      'Left' :
      'Right' :
      y1 - y2 > 0 ?
      'Up' :
      'Down';
    }

    var offcanvas = {
      mixins: [Modal, Swipe],

      args: 'mode',

      props: {
        mode: String,
        flip: Boolean,
        overlay: Boolean },


      data: {
        mode: 'slide',
        flip: false,
        overlay: false,
        clsPage: 'uk-offcanvas-page',
        clsContainer: 'uk-offcanvas-container',
        selPanel: '.uk-offcanvas-bar',
        clsFlip: 'uk-offcanvas-flip',
        clsContainerAnimation: 'uk-offcanvas-container-animation',
        clsSidebarAnimation: 'uk-offcanvas-bar-animation',
        clsMode: 'uk-offcanvas',
        clsOverlay: 'uk-offcanvas-overlay',
        selClose: '.uk-offcanvas-close',
        container: false },


      computed: {
        clsFlip(_ref) {let { flip, clsFlip } = _ref;
          return flip ? clsFlip : '';
        },

        clsOverlay(_ref2) {let { overlay, clsOverlay } = _ref2;
          return overlay ? clsOverlay : '';
        },

        clsMode(_ref3) {let { mode, clsMode } = _ref3;
          return clsMode + "-" + mode;
        },

        clsSidebarAnimation(_ref4) {let { mode, clsSidebarAnimation } = _ref4;
          return mode === 'none' || mode === 'reveal' ? '' : clsSidebarAnimation;
        },

        clsContainerAnimation(_ref5) {let { mode, clsContainerAnimation } = _ref5;
          return mode !== 'push' && mode !== 'reveal' ? '' : clsContainerAnimation;
        },

        transitionElement(_ref6) {let { mode } = _ref6;
          return mode === 'reveal' ? parent(this.panel) : this.panel;
        } },


      update: {
        read() {
          if (this.isToggled() && !isVisible(this.$el)) {
            this.hide();
          }
        },

        events: ['resize'] },


      events: [
      {
        name: 'touchmove',

        self: true,
        passive: false,

        filter() {
          return this.overlay;
        },

        handler(e) {
          e.cancelable && e.preventDefault();
        } },


      {
        name: 'show',

        self: true,

        handler() {
          if (this.mode === 'reveal' && !hasClass(parent(this.panel), this.clsMode)) {
            wrapAll(this.panel, '<div>');
            addClass(parent(this.panel), this.clsMode);
          }

          const { body, scrollingElement } = document;

          addClass(body, this.clsContainer, this.clsFlip);
          css(body, 'touch-action', 'pan-y pinch-zoom');
          css(this.$el, 'display', 'block');
          css(this.panel, 'maxWidth', scrollingElement.clientWidth);
          addClass(this.$el, this.clsOverlay);
          addClass(
          this.panel,
          this.clsSidebarAnimation,
          this.mode === 'reveal' ? '' : this.clsMode);


          height(body); // force reflow
          addClass(body, this.clsContainerAnimation);

          this.clsContainerAnimation && suppressUserScale();
        } },


      {
        name: 'hide',

        self: true,

        handler() {
          removeClass(document.body, this.clsContainerAnimation);
          css(document.body, 'touch-action', '');
        } },


      {
        name: 'hidden',

        self: true,

        handler() {
          this.clsContainerAnimation && resumeUserScale();

          if (this.mode === 'reveal') {
            unwrap(this.panel);
          }

          removeClass(this.panel, this.clsSidebarAnimation, this.clsMode);
          removeClass(this.$el, this.clsOverlay);
          css(this.$el, 'display', '');
          css(this.panel, 'maxWidth', '');
          removeClass(document.body, this.clsContainer, this.clsFlip);
        } },


      {
        name: 'swipeLeft swipeRight',

        handler(e) {
          if (this.isToggled() && endsWith(e.type, 'Left') ^ this.flip) {
            this.hide();
          }
        } }] };




    // Chrome in responsive mode zooms page upon opening offcanvas
    function suppressUserScale() {
      getViewport().content += ',user-scalable=0';
    }

    function resumeUserScale() {
      const viewport = getViewport();
      viewport.content = viewport.content.replace(/,user-scalable=0$/, '');
    }

    function getViewport() {
      return (
        $('meta[name="viewport"]', document.head) || append(document.head, '<meta name="viewport">'));

    }

    var overflowAuto = {
      mixins: [Class, Resize],

      props: {
        selContainer: String,
        selContent: String,
        minHeight: Number },


      data: {
        selContainer: '.uk-modal',
        selContent: '.uk-modal-dialog',
        minHeight: 150 },


      computed: {
        container(_ref, $el) {let { selContainer } = _ref;
          return closest($el, selContainer);
        },

        content(_ref2, $el) {let { selContent } = _ref2;
          return closest($el, selContent);
        } },


      resizeTargets() {
        return [this.container, this.content];
      },

      update: {
        read() {
          if (!this.content || !this.container || !isVisible(this.$el)) {
            return false;
          }

          return {
            max: Math.max(
            this.minHeight,
            height(this.container) - (dimensions$1(this.content).height - height(this.$el))) };


        },

        write(_ref3) {let { max } = _ref3;
          css(this.$el, { minHeight: this.minHeight, maxHeight: max });
        },

        events: ['resize'] } };

    var responsive = {
      mixins: [Resize],

      props: ['width', 'height'],

      resizeTargets() {
        return [this.$el, parent(this.$el)];
      },

      connected() {
        addClass(this.$el, 'uk-responsive-width');
      },

      update: {
        read() {
          return isVisible(this.$el) && this.width && this.height ?
          { width: width(parent(this.$el)), height: this.height } :
          false;
        },

        write(dim) {
          height(
          this.$el,
          Dimensions.contain(
          {
            height: this.height,
            width: this.width },

          dim).
          height);

        },

        events: ['resize'] } };

    var scroll = {
      props: {
        offset: Number },


      data: {
        offset: 0 },


      connected() {
        registerClick(this);
      },

      disconnected() {
        unregisterClick(this);
      },

      methods: {
        async scrollTo(el) {
          el = el && $(el) || document.body;

          if (trigger(this.$el, 'beforescroll', [this, el])) {
            await scrollIntoView(el, { offset: this.offset });
            trigger(this.$el, 'scrolled', [this, el]);
          }
        } } };



    const components$2 = new Set();
    function registerClick(cmp) {
      if (!components$2.size) {
        on(document, 'click', clickHandler);
      }

      components$2.add(cmp);
    }

    function unregisterClick(cmp) {
      components$2.delete(cmp);

      if (!components$2.size) {
        off(document, 'click', clickHandler);
      }
    }

    function clickHandler(e) {
      if (e.defaultPrevented) {
        return;
      }

      for (const component of components$2) {
        if (within(e.target, component.$el)) {
          e.preventDefault();
          component.scrollTo(getTargetElement(component.$el));
        }
      }
    }

    function getTargetElement(el) {
      return document.getElementById(decodeURIComponent(el.hash).substring(1));
    }

    var scrollspy = {
      mixins: [Scroll],

      args: 'cls',

      props: {
        cls: String,
        target: String,
        hidden: Boolean,
        offsetTop: Number,
        offsetLeft: Number,
        repeat: Boolean,
        delay: Number },


      data: () => ({
        cls: '',
        target: false,
        hidden: true,
        offsetTop: 0,
        offsetLeft: 0,
        repeat: false,
        delay: 0,
        inViewClass: 'uk-scrollspy-inview' }),


      computed: {
        elements: {
          get(_ref, $el) {let { target } = _ref;
            return target ? $$(target, $el) : [$el];
          },

          watch(elements, prev) {
            if (this.hidden) {
              css(filter$1(elements, ":not(." + this.inViewClass + ")"), 'visibility', 'hidden');
            }

            if (!isEqual(elements, prev)) {
              this.$reset();
            }
          },

          immediate: true } },



      connected() {
        this._data.elements = new Map();
        this.registerObserver(
        observeIntersection(
        this.elements,
        (records) => {
          const elements = this._data.elements;
          for (const { target: el, isIntersecting } of records) {
            if (!elements.has(el)) {
              elements.set(el, {
                cls: data(el, 'uk-scrollspy-class') || this.cls });

            }

            const state = elements.get(el);
            if (!this.repeat && state.show) {
              continue;
            }

            state.show = isIntersecting;
          }

          this.$emit();
        },
        {
          rootMargin: toPx(this.offsetTop, 'height') - 1 + "px " + (
          toPx(this.offsetLeft, 'width') - 1) + "px" },


        false));


      },

      disconnected() {
        for (const [el, state] of this._data.elements.entries()) {
          removeClass(el, this.inViewClass, (state == null ? void 0 : state.cls) || '');
        }
      },

      update: [
      {
        write(data) {
          for (const [el, state] of data.elements.entries()) {
            if (state.show && !state.inview && !state.queued) {
              state.queued = true;

              data.promise = (data.promise || Promise.resolve()).
              then(() => new Promise((resolve) => setTimeout(resolve, this.delay))).
              then(() => {
                this.toggle(el, true);
                setTimeout(() => {
                  state.queued = false;
                  this.$emit();
                }, 300);
              });
            } else if (!state.show && state.inview && !state.queued && this.repeat) {
              this.toggle(el, false);
            }
          }
        } }],



      methods: {
        toggle(el, inview) {
          const state = this._data.elements.get(el);

          if (!state) {
            return;
          }

          state.off == null ? void 0 : state.off();

          css(el, 'visibility', !inview && this.hidden ? 'hidden' : '');

          toggleClass(el, this.inViewClass, inview);
          toggleClass(el, state.cls);

          if (/\buk-animation-/.test(state.cls)) {
            const removeAnimationClasses = () => removeClasses(el, 'uk-animation-[\\w-]+');
            if (inview) {
              state.off = once(el, 'animationcancel animationend', removeAnimationClasses);
            } else {
              removeAnimationClasses();
            }
          }

          trigger(el, inview ? 'inview' : 'outview');

          state.inview = inview;

          // change to `visibility: hidden` does not trigger observers
          this.$update(el);
        } } };

    var scrollspyNav = {
      mixins: [Scroll],

      props: {
        cls: String,
        closest: String,
        scroll: Boolean,
        overflow: Boolean,
        offset: Number },


      data: {
        cls: 'uk-active',
        closest: false,
        scroll: false,
        overflow: true,
        offset: 0 },


      computed: {
        links: {
          get(_, $el) {
            return $$('a[href*="#"]', $el).filter((el) => el.hash && isSameSiteAnchor(el));
          },

          watch(links) {
            if (this.scroll) {
              this.$create('scroll', links, { offset: this.offset || 0 });
            }
          },

          immediate: true },


        elements(_ref) {let { closest: selector } = _ref;
          return closest(this.links, selector || '*');
        } },


      update: [
      {
        read() {
          const targets = this.links.map(getTargetElement).filter(Boolean);

          const { length } = targets;

          if (!length || !isVisible(this.$el)) {
            return false;
          }

          const [scrollElement] = scrollParents(targets, /auto|scroll/, true);
          const { scrollTop, scrollHeight } = scrollElement;
          const viewport = offsetViewport(scrollElement);
          const max = scrollHeight - viewport.height;
          let active = false;

          if (scrollTop === max) {
            active = length - 1;
          } else {
            for (let i = 0; i < targets.length; i++) {
              if (offset(targets[i]).top - viewport.top - this.offset > 0) {
                break;
              }
              active = +i;
            }

            if (active === false && this.overflow) {
              active = 0;
            }
          }

          return { active };
        },

        write(_ref2) {let { active } = _ref2;
          const changed = active !== false && !hasClass(this.elements[active], this.cls);

          this.links.forEach((el) => el.blur());
          for (let i = 0; i < this.elements.length; i++) {
            toggleClass(this.elements[i], this.cls, +i === active);
          }

          if (changed) {
            trigger(this.$el, 'active', [active, this.elements[active]]);
          }
        },

        events: ['scroll', 'resize'] }] };

    var sticky = {
      mixins: [Class, Media, Resize, Scroll],

      props: {
        position: String,
        top: null,
        bottom: null,
        start: null,
        end: null,
        offset: String,
        overflowFlip: Boolean,
        animation: String,
        clsActive: String,
        clsInactive: String,
        clsFixed: String,
        clsBelow: String,
        selTarget: String,
        showOnUp: Boolean,
        targetOffset: Number },


      data: {
        position: 'top',
        top: false,
        bottom: false,
        start: false,
        end: false,
        offset: 0,
        overflowFlip: false,
        animation: '',
        clsActive: 'uk-active',
        clsInactive: '',
        clsFixed: 'uk-sticky-fixed',
        clsBelow: 'uk-sticky-below',
        selTarget: '',
        showOnUp: false,
        targetOffset: false },


      computed: {
        selTarget(_ref, $el) {let { selTarget } = _ref;
          return selTarget && $(selTarget, $el) || $el;
        } },


      resizeTargets() {
        return document.documentElement;
      },

      connected() {
        this.start = coerce(this.start || this.top);
        this.end = coerce(this.end || this.bottom);

        this.placeholder =
        $('+ .uk-sticky-placeholder', this.$el) ||
        $('<div class="uk-sticky-placeholder"></div>');
        this.isFixed = false;
        this.setActive(false);
      },

      disconnected() {
        if (this.isFixed) {
          this.hide();
          removeClass(this.selTarget, this.clsInactive);
        }

        remove$1(this.placeholder);
        this.placeholder = null;
      },

      events: [
      {
        name: 'resize',

        el() {
          return window;
        },

        handler() {
          this.$emit('resize');
        } },

      {
        name: 'load hashchange popstate',

        el() {
          return window;
        },

        filter() {
          return this.targetOffset !== false;
        },

        handler() {
          const { scrollingElement } = document;

          if (!location.hash || scrollingElement.scrollTop === 0) {
            return;
          }

          setTimeout(() => {
            const targetOffset = offset($(location.hash));
            const elOffset = offset(this.$el);

            if (this.isFixed && intersectRect(targetOffset, elOffset)) {
              scrollingElement.scrollTop =
              targetOffset.top -
              elOffset.height -
              toPx(this.targetOffset, 'height', this.placeholder) -
              toPx(this.offset, 'height', this.placeholder);
            }
          });
        } }],



      update: [
      {
        read(_ref2, types) {let { height: height$1, margin } = _ref2;
          this.inactive = !this.matchMedia || !isVisible(this.$el);

          if (this.inactive) {
            return false;
          }

          const hide = this.active && types.has('resize');
          if (hide) {
            css(this.selTarget, 'transition', '0s');
            this.hide();
          }

          if (!this.active) {
            height$1 = offset(this.$el).height;
            margin = css(this.$el, 'margin');
          }

          if (hide) {
            this.show();
            requestAnimationFrame(() => css(this.selTarget, 'transition', ''));
          }

          const referenceElement = this.isFixed ? this.placeholder : this.$el;
          const windowHeight = height(window);

          let position = this.position;
          if (this.overflowFlip && height$1 > windowHeight) {
            position = position === 'top' ? 'bottom' : 'top';
          }

          let offset$1 = toPx(this.offset, 'height', referenceElement);
          if (position === 'bottom' && (height$1 < windowHeight || this.overflowFlip)) {
            offset$1 += windowHeight - height$1;
          }

          const overflow = this.overflowFlip ?
          0 :
          Math.max(0, height$1 + offset$1 - windowHeight);
          const topOffset = offset(referenceElement).top;

          const start =
          (this.start === false ?
          topOffset :
          parseProp(this.start, this.$el, topOffset)) - offset$1;
          const end =
          this.end === false ?
          document.scrollingElement.scrollHeight - windowHeight :
          parseProp(this.end, this.$el, topOffset + height$1, true) -
          offset(this.$el).height +
          overflow -
          offset$1;

          return {
            start,
            end,
            offset: offset$1,
            overflow,
            topOffset,
            height: height$1,
            margin,
            width: dimensions$1(referenceElement).width,
            top: offsetPosition(referenceElement)[0] };

        },

        write(_ref3) {let { height, margin } = _ref3;
          const { placeholder } = this;

          css(placeholder, { height, margin });

          if (!within(placeholder, document)) {
            after(this.$el, placeholder);
            placeholder.hidden = true;
          }
        },

        events: ['resize'] },


      {
        read(_ref4)






        {let { scroll: prevScroll = 0, dir: prevDir = 'down', overflow, overflowScroll = 0, start, end } = _ref4;
          const scroll = document.scrollingElement.scrollTop;
          const dir = prevScroll <= scroll ? 'down' : 'up';

          return {
            dir,
            prevDir,
            scroll,
            prevScroll,
            offsetParentTop: offset(
            (this.isFixed ? this.placeholder : this.$el).offsetParent).
            top,
            overflowScroll: clamp(
            overflowScroll + clamp(scroll, start, end) - clamp(prevScroll, start, end),
            0,
            overflow) };


        },

        write(data, types) {
          const isScrollUpdate = types.has('scroll');
          const {
            initTimestamp = 0,
            dir,
            prevDir,
            scroll,
            prevScroll = 0,
            top,
            start,
            topOffset,
            height } =
          data;

          if (
          scroll < 0 ||
          scroll === prevScroll && isScrollUpdate ||
          this.showOnUp && !isScrollUpdate && !this.isFixed)
          {
            return;
          }

          const now = Date.now();
          if (now - initTimestamp > 300 || dir !== prevDir) {
            data.initScroll = scroll;
            data.initTimestamp = now;
          }

          if (
          this.showOnUp &&
          !this.isFixed &&
          Math.abs(data.initScroll - scroll) <= 30 &&
          Math.abs(prevScroll - scroll) <= 10)
          {
            return;
          }

          if (
          this.inactive ||
          scroll < start ||
          this.showOnUp && (
          scroll <= start ||
          dir === 'down' && isScrollUpdate ||
          dir === 'up' && !this.isFixed && scroll <= topOffset + height))
          {
            if (!this.isFixed) {
              if (Animation.inProgress(this.$el) && top > scroll) {
                Animation.cancel(this.$el);
                this.hide();
              }

              return;
            }

            this.isFixed = false;

            if (this.animation && scroll > topOffset) {
              Animation.cancel(this.$el);
              Animation.out(this.$el, this.animation).then(() => this.hide(), noop);
            } else {
              this.hide();
            }
          } else if (this.isFixed) {
            this.update();
          } else if (this.animation && scroll > topOffset) {
            Animation.cancel(this.$el);
            this.show();
            Animation.in(this.$el, this.animation).catch(noop);
          } else {
            this.show();
          }
        },

        events: ['resize', 'scroll'] }],



      methods: {
        show() {
          this.isFixed = true;
          this.update();
          this.placeholder.hidden = false;
        },

        hide() {
          this.setActive(false);
          removeClass(this.$el, this.clsFixed, this.clsBelow);
          css(this.$el, { position: '', top: '', width: '' });
          this.placeholder.hidden = true;
        },

        update() {
          let {
            width,
            scroll = 0,
            overflow,
            overflowScroll = 0,
            start,
            end,
            offset,
            topOffset,
            height,
            offsetParentTop } =
          this._data;
          const active = start !== 0 || scroll > start;
          let position = 'fixed';

          if (scroll > end) {
            offset += end - offsetParentTop;
            position = 'absolute';
          }

          if (overflow) {
            offset -= overflowScroll;
          }

          css(this.$el, {
            position,
            top: offset + "px",
            width });


          this.setActive(active);
          toggleClass(this.$el, this.clsBelow, scroll > topOffset + height);
          addClass(this.$el, this.clsFixed);
        },

        setActive(active) {
          const prev = this.active;
          this.active = active;
          if (active) {
            replaceClass(this.selTarget, this.clsInactive, this.clsActive);
            prev !== active && trigger(this.$el, 'active');
          } else {
            replaceClass(this.selTarget, this.clsActive, this.clsInactive);
            prev !== active && trigger(this.$el, 'inactive');
          }
        } } };



    function parseProp(value, el, propOffset, padding) {
      if (!value) {
        return 0;
      }

      if (isNumeric(value) || isString(value) && value.match(/^-?\d/)) {
        return propOffset + toPx(value, 'height', el, true);
      } else {
        const refElement = value === true ? parent(el) : query(value, el);
        return (
          offset(refElement).bottom - (
          padding && refElement && within(el, refElement) ?
          toFloat(css(refElement, 'paddingBottom')) :
          0));

      }
    }

    function coerce(value) {
      if (value === 'true') {
        return true;
      } else if (value === 'false') {
        return false;
      }
      return value;
    }

    var Switcher = {
      mixins: [Lazyload, Swipe, Togglable],

      args: 'connect',

      props: {
        connect: String,
        toggle: String,
        itemNav: String,
        active: Number },


      data: {
        connect: '~.uk-switcher',
        toggle: '> * > :first-child',
        itemNav: false,
        active: 0,
        cls: 'uk-active',
        attrItem: 'uk-switcher-item' },


      computed: {
        connects: {
          get(_ref, $el) {let { connect } = _ref;
            return queryAll(connect, $el);
          },

          watch(connects) {var _this$_observer;
            if (this.swiping) {
              css(connects, 'touchAction', 'pan-y pinch-zoom');
            }

            (_this$_observer = this._observer) == null ? void 0 : _this$_observer.disconnect();
            this.registerObserver(
            this._observer = observeMutation(
            connects,
            (records) => {
              const index = this.index();
              for (const { target: el } of records) {
                children(el).forEach((child, i) =>
                toggleClass(child, this.cls, i === index));

                this.lazyload(this.$el, children(el));
              }
            },
            { childList: true }));


          },

          immediate: true },


        toggles: {
          get(_ref2, $el) {let { toggle } = _ref2;
            return $$(toggle, $el).filter(
            (el) => !matches(el, '.uk-disabled *, .uk-disabled, [disabled]'));

          },

          watch(toggles) {
            const active = this.index();
            this.show(~active ? active : toggles[this.active] || toggles[0]);
          },

          immediate: true },


        children() {
          return children(this.$el).filter((child) =>
          this.toggles.some((toggle) => within(toggle, child)));

        },

        swipeTarget() {
          return this.connects;
        } },


      connected() {
        // check for connects
        ready(() => this.$emit());
      },

      events: [
      {
        name: 'click',

        delegate() {
          return this.toggle;
        },

        handler(e) {
          e.preventDefault();
          this.show(e.current);
        } },


      {
        name: 'click',

        el() {
          return this.connects.concat(this.itemNav ? queryAll(this.itemNav, this.$el) : []);
        },

        delegate() {
          return "[" + this.attrItem + "],[data-" + this.attrItem + "]";
        },

        handler(e) {
          e.preventDefault();
          this.show(data(e.current, this.attrItem));
        } },


      {
        name: 'swipeRight swipeLeft',

        filter() {
          return this.swiping;
        },

        el() {
          return this.connects;
        },

        handler(_ref3) {let { type } = _ref3;
          this.show(endsWith(type, 'Left') ? 'next' : 'previous');
        } }],



      methods: {
        index() {
          return findIndex(this.children, (el) => hasClass(el, this.cls));
        },

        show(item) {
          const prev = this.index();
          const next = getIndex(item, this.toggles, prev);
          const active = getIndex(this.children[next], children(this.$el));
          children(this.$el).forEach((child, i) => {
            toggleClass(child, this.cls, active === i);
            attr(this.toggles[i], 'aria-expanded', active === i);
          });

          const animate = prev >= 0 && prev !== next;
          this.connects.forEach(async (_ref4) => {let { children } = _ref4;
            await this.toggleElement(
            toNodes(children).filter((child) => hasClass(child, this.cls)),
            false,
            animate);

            await this.toggleElement(children[active], true, animate);
          });
        } } };

    var tab = {
      mixins: [Class],

      extends: Switcher,

      props: {
        media: Boolean },


      data: {
        media: 960,
        attrItem: 'uk-tab-item' },


      connected() {
        const cls = hasClass(this.$el, 'uk-tab-left') ?
        'uk-tab-left' :
        hasClass(this.$el, 'uk-tab-right') ?
        'uk-tab-right' :
        false;

        if (cls) {
          this.$create('toggle', this.$el, { cls, mode: 'media', media: this.media });
        }
      } };

    const KEY_SPACE = 32;

    var toggle = {
      mixins: [Lazyload, Media, Togglable],

      args: 'target',

      props: {
        href: String,
        target: null,
        mode: 'list',
        queued: Boolean },


      data: {
        href: false,
        target: false,
        mode: 'click',
        queued: true },


      computed: {
        target: {
          get(_ref, $el) {let { href, target } = _ref;
            target = queryAll(target || href, $el);
            return target.length && target || [$el];
          },

          watch() {
            this.updateAria();
            this.lazyload(this.$el, this.target);
          },

          immediate: true } },



      connected() {
        if (!includes(this.mode, 'media') && !isFocusable(this.$el)) {
          attr(this.$el, 'tabindex', '0');
        }

        // check for target
        ready(() => this.$emit());
      },

      events: [
      {
        name: pointerDown$1,

        filter() {
          return includes(this.mode, 'hover');
        },

        handler(e) {
          this._preventClick = null;

          if (!isTouch(e) || this._showState) {
            return;
          }

          // Clicking a button does not give it focus on all browsers and platforms
          // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#clicking_and_focus
          trigger(this.$el, 'focus');
          once(
          document,
          pointerDown$1,
          () => trigger(this.$el, 'blur'),
          true,
          (e) => !within(e.target, this.$el));


          // Prevent initial click to prevent double toggle through focus + click
          if (includes(this.mode, 'click')) {
            this._preventClick = true;
          }
        } },


      {
        name: pointerEnter + " " + pointerLeave + " focus blur",

        filter() {
          return includes(this.mode, 'hover');
        },

        handler(e) {
          if (isTouch(e)) {
            return;
          }

          const show = includes([pointerEnter, 'focus'], e.type);
          const expanded = attr(this.$el, 'aria-expanded');

          // Skip hide if still hovered or focused
          if (
          !show && (
          e.type === pointerLeave && matches(this.$el, ':focus') ||
          e.type === 'blur' && matches(this.$el, ':hover')))
          {
            return;
          }

          // Skip if state does not change e.g. hover + focus received
          if (this._showState && show && expanded !== this._showState) {
            // Ensure reset if state has changed through click
            if (!show) {
              this._showState = null;
            }
            return;
          }

          this._showState = show ? expanded : null;

          this.toggle("toggle" + (show ? 'show' : 'hide'));
        } },


      {
        name: 'keydown',

        filter() {
          return includes(this.mode, 'click') && !isTag(this.$el, 'input');
        },

        handler(e) {
          if (e.keyCode === KEY_SPACE) {
            e.preventDefault();
            this.$el.click();
          }
        } },


      {
        name: 'click',

        filter() {
          return ['click', 'hover'].some((mode) => includes(this.mode, mode));
        },

        handler(e) {
          let link;
          if (
          this._preventClick ||
          closest(e.target, 'a[href="#"], a[href=""]') ||
          (link = closest(e.target, 'a[href]')) && (
          attr(this.$el, 'aria-expanded') !== 'true' ||
          link.hash && matches(this.target, link.hash)))
          {
            e.preventDefault();
          }

          if (!this._preventClick && includes(this.mode, 'click')) {
            this.toggle();
          }
        } },


      {
        name: 'hide show',

        self: true,

        el() {
          return this.target;
        },

        handler(_ref2) {let { type } = _ref2;
          this.updateAria(type === 'show');
        } },


      {
        name: 'mediachange',

        filter() {
          return includes(this.mode, 'media');
        },

        el() {
          return this.target;
        },

        handler(e, mediaObj) {
          if (mediaObj.matches ^ this.isToggled(this.target)) {
            this.toggle();
          }
        } }],



      methods: {
        async toggle(type) {
          if (!trigger(this.target, type || 'toggle', [this])) {
            return;
          }

          if (!this.queued) {
            return this.toggleElement(this.target);
          }

          const leaving = this.target.filter((el) => hasClass(el, this.clsLeave));

          if (leaving.length) {
            for (const el of this.target) {
              const isLeaving = includes(leaving, el);
              this.toggleElement(el, isLeaving, isLeaving);
            }
            return;
          }

          const toggled = this.target.filter(this.isToggled);
          await this.toggleElement(toggled, false);
          await this.toggleElement(
          this.target.filter((el) => !includes(toggled, el)),
          true);

        },

        updateAria(toggled) {
          if (includes(this.mode, 'media')) {
            return;
          }

          attr(
          this.$el,
          'aria-expanded',
          isBoolean(toggled) ? toggled : this.isToggled(this.target));

        } } };

    var components$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Accordion: Accordion,
        Alert: alert,
        Cover: cover,
        Drop: drop,
        Dropdown: drop,
        FormCustom: formCustom,
        Grid: grid,
        HeightMatch: heightMatch,
        HeightViewport: heightViewport,
        Icon: Icon,
        Img: img,
        Leader: leader,
        Margin: Margin,
        Modal: modal,
        Nav: nav,
        Navbar: navbar,
        Offcanvas: offcanvas,
        OverflowAuto: overflowAuto,
        Responsive: responsive,
        Scroll: scroll,
        Scrollspy: scrollspy,
        ScrollspyNav: scrollspyNav,
        Sticky: sticky,
        Svg: SVG,
        Switcher: Switcher,
        Tab: tab,
        Toggle: toggle,
        Video: Video,
        Close: Close,
        Spinner: Spinner,
        NavParentIcon: NavParentIcon,
        SlidenavNext: Slidenav,
        SlidenavPrevious: Slidenav,
        SearchIcon: Search,
        Marker: IconComponent,
        NavbarParentIcon: IconComponent,
        NavbarToggleIcon: IconComponent,
        OverlayIcon: IconComponent,
        PaginationNext: IconComponent,
        PaginationPrevious: IconComponent,
        Totop: IconComponent
    });

    // register components
    each(components$1, (component, name) => UIkit.component(name, component));

    boot(UIkit);

    const units = ['days', 'hours', 'minutes', 'seconds'];

    var countdown = {
      mixins: [Class],

      props: {
        date: String,
        clsWrapper: String },


      data: {
        date: '',
        clsWrapper: '.uk-countdown-%unit%' },


      connected() {
        this.date = Date.parse(this.$props.date);
        this.start();
      },

      disconnected() {
        this.stop();
      },

      events: [
      {
        name: 'visibilitychange',

        el() {
          return document;
        },

        handler() {
          if (document.hidden) {
            this.stop();
          } else {
            this.start();
          }
        } }],



      methods: {
        start() {
          this.stop();
          this.update();
          this.timer = setInterval(this.update, 1000);
        },

        stop() {
          clearInterval(this.timer);
        },

        update() {
          const timespan = getTimeSpan(this.date);

          if (!this.date || timespan.total <= 0) {
            this.stop();

            timespan.days = timespan.hours = timespan.minutes = timespan.seconds = 0;
          }

          for (const unit of units) {
            const el = $(this.clsWrapper.replace('%unit%', unit), this.$el);

            if (!el) {
              continue;
            }

            let digits = String(Math.trunc(timespan[unit]));

            digits = digits.length < 2 ? "0" + digits : digits;

            if (el.textContent !== digits) {
              digits = digits.split('');

              if (digits.length !== el.children.length) {
                html(el, digits.map(() => '<span></span>').join(''));
              }

              digits.forEach((digit, i) => el.children[i].textContent = digit);
            }
          }
        } } };



    function getTimeSpan(date) {
      const total = date - Date.now();

      return {
        total,
        seconds: total / 1000 % 60,
        minutes: total / 1000 / 60 % 60,
        hours: total / 1000 / 60 / 60 % 24,
        days: total / 1000 / 60 / 60 / 24 };

    }

    const clsLeave = 'uk-transition-leave';
    const clsEnter = 'uk-transition-enter';

    function fade(action, target, duration, stagger) {if (stagger === void 0) {stagger = 0;}
      const index = transitionIndex(target, true);
      const propsIn = { opacity: 1 };
      const propsOut = { opacity: 0 };

      const wrapIndexFn = (fn) => () => index === transitionIndex(target) ? fn() : Promise.reject();

      const leaveFn = wrapIndexFn(async () => {
        addClass(target, clsLeave);

        await Promise.all(
        getTransitionNodes(target).map(
        (child, i) =>
        new Promise((resolve) =>
        setTimeout(
        () =>
        Transition.start(child, propsOut, duration / 2, 'ease').then(
        resolve),

        i * stagger))));





        removeClass(target, clsLeave);
      });

      const enterFn = wrapIndexFn(async () => {
        const oldHeight = height(target);

        addClass(target, clsEnter);
        action();

        css(children(target), { opacity: 0 });

        // Ensure UIkit updates have propagated
        await awaitFrame$1();

        const nodes = children(target);
        const newHeight = height(target);

        // Ensure Grid cells do not stretch when height is applied
        css(target, 'alignContent', 'flex-start');
        height(target, oldHeight);

        const transitionNodes = getTransitionNodes(target);
        css(nodes, propsOut);

        const transitions = transitionNodes.map(async (child, i) => {
          await awaitTimeout(i * stagger);
          await Transition.start(child, propsIn, duration / 2, 'ease');
        });

        if (oldHeight !== newHeight) {
          transitions.push(
          Transition.start(
          target,
          { height: newHeight },
          duration / 2 + transitionNodes.length * stagger,
          'ease'));


        }

        await Promise.all(transitions).then(() => {
          removeClass(target, clsEnter);
          if (index === transitionIndex(target)) {
            css(target, { height: '', alignContent: '' });
            css(nodes, { opacity: '' });
            delete target.dataset.transition;
          }
        });
      });

      return hasClass(target, clsLeave) ?
      waitTransitionend(target).then(enterFn) :
      hasClass(target, clsEnter) ?
      waitTransitionend(target).then(leaveFn).then(enterFn) :
      leaveFn().then(enterFn);
    }

    function transitionIndex(target, next) {
      if (next) {
        target.dataset.transition = 1 + transitionIndex(target);
      }

      return toNumber(target.dataset.transition) || 0;
    }

    function waitTransitionend(target) {
      return Promise.all(
      children(target).
      filter(Transition.inProgress).
      map(
      (el) =>
      new Promise((resolve) => once(el, 'transitionend transitioncanceled', resolve))));


    }

    function getTransitionNodes(target) {
      return getRows(children(target)).reduce(
      (nodes, row) =>
      nodes.concat(
      sortBy$1(
      row.filter((el) => isInView(el)),
      'offsetLeft')),


      []);

    }

    function awaitFrame$1() {
      return new Promise((resolve) => requestAnimationFrame(resolve));
    }

    function awaitTimeout(timeout) {
      return new Promise((resolve) => setTimeout(resolve, timeout));
    }

    async function slide (action, target, duration) {
      await awaitFrame();

      let nodes = children(target);

      // Get current state
      const currentProps = nodes.map((el) => getProps(el, true));
      const targetProps = css(target, ['height', 'padding']);

      // Cancel previous animations
      Transition.cancel(target);
      nodes.forEach(Transition.cancel);
      reset(target);

      // Adding, sorting, removing nodes
      action();

      // Find new nodes
      nodes = nodes.concat(children(target).filter((el) => !includes(nodes, el)));

      // Wait for update to propagate
      await Promise.resolve();

      // Force update
      fastdom.flush();

      // Get new state
      const targetPropsTo = css(target, ['height', 'padding']);
      const [propsTo, propsFrom] = getTransitionProps(target, nodes, currentProps);

      // Reset to previous state
      nodes.forEach((el, i) => propsFrom[i] && css(el, propsFrom[i]));
      css(target, { display: 'block', ...targetProps });

      // Start transitions on next frame
      await awaitFrame();

      const transitions = nodes.
      map((el, i) => parent(el) === target && Transition.start(el, propsTo[i], duration, 'ease')).
      concat(Transition.start(target, targetPropsTo, duration, 'ease'));

      await Promise.all(transitions).then(() => {
        nodes.forEach(
        (el, i) =>
        parent(el) === target && css(el, 'display', propsTo[i].opacity === 0 ? 'none' : ''));

        reset(target);
      }, noop);
    }

    function getProps(el, opacity) {
      const zIndex = css(el, 'zIndex');

      return isVisible(el) ?
      {
        display: '',
        opacity: opacity ? css(el, 'opacity') : '0',
        pointerEvents: 'none',
        position: 'absolute',
        zIndex: zIndex === 'auto' ? index(el) : zIndex,
        ...getPositionWithMargin(el) } :

      false;
    }

    function getTransitionProps(target, nodes, currentProps) {
      const propsTo = nodes.map((el, i) =>
      parent(el) && i in currentProps ?
      currentProps[i] ?
      isVisible(el) ?
      getPositionWithMargin(el) :
      { opacity: 0 } :
      { opacity: isVisible(el) ? 1 : 0 } :
      false);


      const propsFrom = propsTo.map((props, i) => {
        const from = parent(nodes[i]) === target && (currentProps[i] || getProps(nodes[i]));

        if (!from) {
          return false;
        }

        if (!props) {
          delete from.opacity;
        } else if (!('opacity' in props)) {
          const { opacity } = from;

          if (opacity % 1) {
            props.opacity = 1;
          } else {
            delete from.opacity;
          }
        }

        return from;
      });

      return [propsTo, propsFrom];
    }

    function reset(el) {
      css(el.children, {
        height: '',
        left: '',
        opacity: '',
        pointerEvents: '',
        position: '',
        top: '',
        marginTop: '',
        marginLeft: '',
        transform: '',
        width: '',
        zIndex: '' });

      css(el, { height: '', display: '', padding: '' });
    }

    function getPositionWithMargin(el) {
      const { height, width } = offset(el);
      const { top, left } = position(el);
      const { marginLeft, marginTop } = css(el, ['marginTop', 'marginLeft']);

      return { top, left, height, width, marginLeft, marginTop, transform: '' };
    }

    function awaitFrame() {
      return new Promise((resolve) => requestAnimationFrame(resolve));
    }

    var Animate = {
      props: {
        duration: Number,
        animation: Boolean },


      data: {
        duration: 150,
        animation: 'slide' },


      methods: {
        animate(action, target) {if (target === void 0) {target = this.$el;}
          const name = this.animation;
          const animationFn =
          name === 'fade' ?
          fade :
          name === 'delayed-fade' ?
          function () {for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}return fade(...args, 40);} :
          name ?
          slide :
          () => {
            action();
            return Promise.resolve();
          };

          return animationFn(action, target, this.duration).then(
          () => this.$update(target, 'resize'),
          noop);

        } } };

    var filter = {
      mixins: [Animate],

      args: 'target',

      props: {
        target: Boolean,
        selActive: Boolean },


      data: {
        target: null,
        selActive: false,
        attrItem: 'uk-filter-control',
        cls: 'uk-active',
        duration: 250 },


      computed: {
        toggles: {
          get(_ref, $el) {let { attrItem } = _ref;
            return $$("[" + attrItem + "],[data-" + attrItem + "]", $el);
          },

          watch() {
            this.updateState();

            if (this.selActive !== false) {
              const actives = $$(this.selActive, this.$el);
              this.toggles.forEach((el) => toggleClass(el, this.cls, includes(actives, el)));
            }
          },

          immediate: true },


        children: {
          get(_ref2, $el) {let { target } = _ref2;
            return $$(target + " > *", $el);
          },

          watch(list, old) {
            if (old && !isEqualList(list, old)) {
              this.updateState();
            }
          },

          immediate: true } },



      events: [
      {
        name: 'click',

        delegate() {
          return "[" + this.attrItem + "],[data-" + this.attrItem + "]";
        },

        handler(e) {
          e.preventDefault();
          this.apply(e.current);
        } }],



      methods: {
        apply(el) {
          const prevState = this.getState();
          const newState = mergeState(el, this.attrItem, this.getState());

          if (!isEqualState(prevState, newState)) {
            this.setState(newState);
          }
        },

        getState() {
          return this.toggles.
          filter((item) => hasClass(item, this.cls)).
          reduce((state, el) => mergeState(el, this.attrItem, state), {
            filter: { '': '' },
            sort: [] });

        },

        async setState(state, animate) {if (animate === void 0) {animate = true;}
          state = { filter: { '': '' }, sort: [], ...state };

          trigger(this.$el, 'beforeFilter', [this, state]);

          this.toggles.forEach((el) =>
          toggleClass(el, this.cls, !!matchFilter(el, this.attrItem, state)));


          await Promise.all(
          $$(this.target, this.$el).map((target) => {
            const filterFn = () => {
              applyState(state, target, children(target));
              this.$update(this.$el);
            };
            return animate ? this.animate(filterFn, target) : filterFn();
          }));


          trigger(this.$el, 'afterFilter', [this]);
        },

        updateState() {
          fastdom.write(() => this.setState(this.getState(), false));
        } } };



    function getFilter(el, attr) {
      return parseOptions(data(el, attr), ['filter']);
    }

    function isEqualState(stateA, stateB) {
      return ['filter', 'sort'].every((prop) => isEqual(stateA[prop], stateB[prop]));
    }

    function applyState(state, target, children) {
      const selector = getSelector(state);

      children.forEach((el) => css(el, 'display', selector && !matches(el, selector) ? 'none' : ''));

      const [sort, order] = state.sort;

      if (sort) {
        const sorted = sortItems(children, sort, order);
        if (!isEqual(sorted, children)) {
          append(target, sorted);
        }
      }
    }

    function mergeState(el, attr, state) {
      const filterBy = getFilter(el, attr);
      const { filter, group, sort, order = 'asc' } = filterBy;

      if (filter || isUndefined(sort)) {
        if (group) {
          if (filter) {
            delete state.filter[''];
            state.filter[group] = filter;
          } else {
            delete state.filter[group];

            if (isEmpty(state.filter) || '' in state.filter) {
              state.filter = { '': filter || '' };
            }
          }
        } else {
          state.filter = { '': filter || '' };
        }
      }

      if (!isUndefined(sort)) {
        state.sort = [sort, order];
      }

      return state;
    }

    function matchFilter(
    el,
    attr, _ref3)

    {let { filter: stateFilter = { '': '' }, sort: [stateSort, stateOrder] } = _ref3;
      const { filter = '', group = '', sort, order = 'asc' } = getFilter(el, attr);

      return isUndefined(sort) ?
      group in stateFilter && filter === stateFilter[group] ||
      !filter && group && !(group in stateFilter) && !stateFilter[''] :
      stateSort === sort && stateOrder === order;
    }

    function isEqualList(listA, listB) {
      return listA.length === listB.length && listA.every((el) => listB.includes(el));
    }

    function getSelector(_ref4) {let { filter } = _ref4;
      let selector = '';
      each(filter, (value) => selector += value || '');
      return selector;
    }

    function sortItems(nodes, sort, order) {
      return [...nodes].sort(
      (a, b) =>
      data(a, sort).localeCompare(data(b, sort), undefined, { numeric: true }) * (
      order === 'asc' || -1));

    }

    var Animations$2 = {
      slide: {
        show(dir) {
          return [{ transform: translate(dir * -100) }, { transform: translate() }];
        },

        percent(current) {
          return translated(current);
        },

        translate(percent, dir) {
          return [
          { transform: translate(dir * -100 * percent) },
          { transform: translate(dir * 100 * (1 - percent)) }];

        } } };



    function translated(el) {
      return Math.abs(css(el, 'transform').split(',')[4] / el.offsetWidth) || 0;
    }

    function translate(value, unit) {if (value === void 0) {value = 0;}if (unit === void 0) {unit = '%';}
      value += value ? unit : '';
      return "translate3d(" + value + ", 0, 0)";
    }

    function scale3d(value) {
      return "scale3d(" + value + ", " + value + ", 1)";
    }

    var Animations$1 = {
      ...Animations$2,
      fade: {
        show() {
          return [{ opacity: 0 }, { opacity: 1 }];
        },

        percent(current) {
          return 1 - css(current, 'opacity');
        },

        translate(percent) {
          return [{ opacity: 1 - percent }, { opacity: percent }];
        } },


      scale: {
        show() {
          return [
          { opacity: 0, transform: scale3d(1 - 0.2) },
          { opacity: 1, transform: scale3d(1) }];

        },

        percent(current) {
          return 1 - css(current, 'opacity');
        },

        translate(percent) {
          return [
          { opacity: 1 - percent, transform: scale3d(1 - 0.2 * percent) },
          { opacity: percent, transform: scale3d(1 - 0.2 + 0.2 * percent) }];

        } } };

    function Transitioner$1(prev, next, dir, _ref) {let { animation, easing } = _ref;
      const { percent, translate, show = noop } = animation;
      const props = show(dir);
      const deferred = new Deferred();

      return {
        dir,

        show(duration, percent, linear) {if (percent === void 0) {percent = 0;}
          const timing = linear ? 'linear' : easing;
          duration -= Math.round(duration * clamp(percent, -1, 1));

          this.translate(percent);

          triggerUpdate$1(next, 'itemin', { percent, duration, timing, dir });
          triggerUpdate$1(prev, 'itemout', { percent: 1 - percent, duration, timing, dir });

          Promise.all([
          Transition.start(next, props[1], duration, timing),
          Transition.start(prev, props[0], duration, timing)]).
          then(() => {
            this.reset();
            deferred.resolve();
          }, noop);

          return deferred.promise;
        },

        cancel() {
          Transition.cancel([next, prev]);
        },

        reset() {
          for (const prop in props[0]) {
            css([next, prev], prop, '');
          }
        },

        forward(duration, percent) {if (percent === void 0) {percent = this.percent();}
          Transition.cancel([next, prev]);
          return this.show(duration, percent, true);
        },

        translate(percent) {
          this.reset();

          const props = translate(percent, dir);
          css(next, props[1]);
          css(prev, props[0]);
          triggerUpdate$1(next, 'itemtranslatein', { percent, dir });
          triggerUpdate$1(prev, 'itemtranslateout', { percent: 1 - percent, dir });
        },

        percent() {
          return percent(prev || next, next, dir);
        },

        getDistance() {
          return prev == null ? void 0 : prev.offsetWidth;
        } };

    }

    function triggerUpdate$1(el, type, data) {
      trigger(el, createEvent(type, false, false, data));
    }

    var SliderAutoplay = {
      props: {
        autoplay: Boolean,
        autoplayInterval: Number,
        pauseOnHover: Boolean },


      data: {
        autoplay: false,
        autoplayInterval: 7000,
        pauseOnHover: true },


      connected() {
        this.autoplay && this.startAutoplay();
      },

      disconnected() {
        this.stopAutoplay();
      },

      update() {
        attr(this.slides, 'tabindex', '-1');
      },

      events: [
      {
        name: 'visibilitychange',

        el() {
          return document;
        },

        filter() {
          return this.autoplay;
        },

        handler() {
          if (document.hidden) {
            this.stopAutoplay();
          } else {
            this.startAutoplay();
          }
        } }],



      methods: {
        startAutoplay() {
          this.stopAutoplay();

          this.interval = setInterval(
          () =>
          (!this.draggable || !$(':focus', this.$el)) && (
          !this.pauseOnHover || !matches(this.$el, ':hover')) &&
          !this.stack.length &&
          this.show('next'),
          this.autoplayInterval);

        },

        stopAutoplay() {
          this.interval && clearInterval(this.interval);
        } } };

    const pointerOptions = { passive: false, capture: true };
    const pointerDown = 'touchstart mousedown';
    const pointerMove = 'touchmove mousemove';
    const pointerUp = 'touchend touchcancel mouseup click input';

    var SliderDrag = {
      props: {
        draggable: Boolean },


      data: {
        draggable: true,
        threshold: 10 },


      created() {
        for (const key of ['start', 'move', 'end']) {
          const fn = this[key];
          this[key] = (e) => {
            const pos = getEventPos(e).x * (isRtl ? -1 : 1);

            this.prevPos = pos === this.pos ? this.prevPos : this.pos;
            this.pos = pos;

            fn(e);
          };
        }
      },

      events: [
      {
        name: pointerDown,

        delegate() {
          return this.selSlides;
        },

        handler(e) {
          if (
          !this.draggable ||
          !isTouch(e) && hasSelectableText(e.target) ||
          closest(e.target, selInput) ||
          e.button > 0 ||
          this.length < 2)
          {
            return;
          }

          this.start(e);
        } },


      {
        name: 'dragstart',

        handler(e) {
          e.preventDefault();
        } },


      {
        // iOS workaround for slider stopping if swiping fast
        name: pointerMove + " " + pointerUp,
        el() {
          return this.list;
        },
        handler: noop,
        ...pointerOptions }],



      methods: {
        start() {
          this.drag = this.pos;

          if (this._transitioner) {
            this.percent = this._transitioner.percent();
            this.drag += this._transitioner.getDistance() * this.percent * this.dir;

            this._transitioner.cancel();
            this._transitioner.translate(this.percent);

            this.dragging = true;

            this.stack = [];
          } else {
            this.prevIndex = this.index;
          }

          on(document, pointerMove, this.move, pointerOptions);

          // 'input' event is triggered by video controls
          on(document, pointerUp, this.end, pointerOptions);

          css(this.list, 'userSelect', 'none');
        },

        move(e) {
          const distance = this.pos - this.drag;

          if (
          distance === 0 ||
          this.prevPos === this.pos ||
          !this.dragging && Math.abs(distance) < this.threshold)
          {
            return;
          }

          // prevent click event
          css(this.list, 'pointerEvents', 'none');

          e.cancelable && e.preventDefault();

          this.dragging = true;
          this.dir = distance < 0 ? 1 : -1;

          const { slides } = this;
          let { prevIndex } = this;
          let dis = Math.abs(distance);
          let nextIndex = this.getIndex(prevIndex + this.dir, prevIndex);
          let width = this._getDistance(prevIndex, nextIndex) || slides[prevIndex].offsetWidth;

          while (nextIndex !== prevIndex && dis > width) {
            this.drag -= width * this.dir;

            prevIndex = nextIndex;
            dis -= width;
            nextIndex = this.getIndex(prevIndex + this.dir, prevIndex);
            width = this._getDistance(prevIndex, nextIndex) || slides[prevIndex].offsetWidth;
          }

          this.percent = dis / width;

          const prev = slides[prevIndex];
          const next = slides[nextIndex];
          const changed = this.index !== nextIndex;
          const edge = prevIndex === nextIndex;

          let itemShown;

          [this.index, this.prevIndex].
          filter((i) => !includes([nextIndex, prevIndex], i)).
          forEach((i) => {
            trigger(slides[i], 'itemhidden', [this]);

            if (edge) {
              itemShown = true;
              this.prevIndex = prevIndex;
            }
          });

          if (this.index === prevIndex && this.prevIndex !== prevIndex || itemShown) {
            trigger(slides[this.index], 'itemshown', [this]);
          }

          if (changed) {
            this.prevIndex = prevIndex;
            this.index = nextIndex;

            !edge && trigger(prev, 'beforeitemhide', [this]);
            trigger(next, 'beforeitemshow', [this]);
          }

          this._transitioner = this._translate(Math.abs(this.percent), prev, !edge && next);

          if (changed) {
            !edge && trigger(prev, 'itemhide', [this]);
            trigger(next, 'itemshow', [this]);
          }
        },

        end() {
          off(document, pointerMove, this.move, pointerOptions);
          off(document, pointerUp, this.end, pointerOptions);

          if (this.dragging) {
            this.dragging = null;

            if (this.index === this.prevIndex) {
              this.percent = 1 - this.percent;
              this.dir *= -1;
              this._show(false, this.index, true);
              this._transitioner = null;
            } else {
              const dirChange =
              (isRtl ? this.dir * (isRtl ? 1 : -1) : this.dir) < 0 ===
              this.prevPos > this.pos;
              this.index = dirChange ? this.index : this.prevIndex;

              if (dirChange) {
                this.percent = 1 - this.percent;
              }

              this.show(
              this.dir > 0 && !dirChange || this.dir < 0 && dirChange ?
              'next' :
              'previous',
              true);

            }
          }

          css(this.list, { userSelect: '', pointerEvents: '' });

          this.drag = this.percent = null;
        } } };



    function hasSelectableText(el) {
      return (
        css(el, 'userSelect') !== 'none' &&
        toNodes(el.childNodes).some((el) => el.nodeType === 3 && el.textContent.trim()));

    }

    var SliderNav = {
      data: {
        selNav: false },


      computed: {
        nav(_ref, $el) {let { selNav } = _ref;
          return $(selNav, $el);
        },

        selNavItem(_ref2) {let { attrItem } = _ref2;
          return "[" + attrItem + "],[data-" + attrItem + "]";
        },

        navItems(_, $el) {
          return $$(this.selNavItem, $el);
        } },


      update: {
        write() {
          if (this.nav && this.length !== this.nav.children.length) {
            html(
            this.nav,
            this.slides.
            map((_, i) => "<li " + this.attrItem + "=\"" + i + "\"><a href></a></li>").
            join(''));

          }

          this.navItems.concat(this.nav).forEach((el) => el && (el.hidden = !this.maxIndex));

          this.updateNav();
        },

        events: ['resize'] },


      events: [
      {
        name: 'click',

        delegate() {
          return this.selNavItem;
        },

        handler(e) {
          e.preventDefault();
          this.show(data(e.current, this.attrItem));
        } },


      {
        name: 'itemshow',
        handler: 'updateNav' }],



      methods: {
        updateNav() {
          const i = this.getValidIndex();
          for (const el of this.navItems) {
            const cmd = data(el, this.attrItem);

            toggleClass(el, this.clsActive, toNumber(cmd) === i);
            toggleClass(
            el,
            'uk-invisible',
            this.finite && (
            cmd === 'previous' && i === 0 || cmd === 'next' && i >= this.maxIndex));

          }
        } } };

    var Slider = {
      mixins: [SliderAutoplay, SliderDrag, SliderNav, Resize],

      props: {
        clsActivated: Boolean,
        easing: String,
        index: Number,
        finite: Boolean,
        velocity: Number,
        selSlides: String },


      data: () => ({
        easing: 'ease',
        finite: false,
        velocity: 1,
        index: 0,
        prevIndex: -1,
        stack: [],
        percent: 0,
        clsActive: 'uk-active',
        clsActivated: false,
        Transitioner: false,
        transitionOptions: {} }),


      connected() {
        this.prevIndex = -1;
        this.index = this.getValidIndex(this.$props.index);
        this.stack = [];
      },

      disconnected() {
        removeClass(this.slides, this.clsActive);
      },

      computed: {
        duration(_ref, $el) {let { velocity } = _ref;
          return speedUp($el.offsetWidth / velocity);
        },

        list(_ref2, $el) {let { selList } = _ref2;
          return $(selList, $el);
        },

        maxIndex() {
          return this.length - 1;
        },

        selSlides(_ref3) {let { selList, selSlides } = _ref3;
          return selList + " " + (selSlides || '> *');
        },

        slides: {
          get() {
            return $$(this.selSlides, this.$el);
          },

          watch() {
            this.$emit('resize');
          } },


        length() {
          return this.slides.length;
        } },


      methods: {
        show(index, force) {if (force === void 0) {force = false;}
          if (this.dragging || !this.length) {
            return;
          }

          const { stack } = this;
          const queueIndex = force ? 0 : stack.length;
          const reset = () => {
            stack.splice(queueIndex, 1);

            if (stack.length) {
              this.show(stack.shift(), true);
            }
          };

          stack[force ? 'unshift' : 'push'](index);

          if (!force && stack.length > 1) {
            if (stack.length === 2) {
              this._transitioner.forward(Math.min(this.duration, 200));
            }

            return;
          }

          const prevIndex = this.getIndex(this.index);
          const prev = hasClass(this.slides, this.clsActive) && this.slides[prevIndex];
          const nextIndex = this.getIndex(index, this.index);
          const next = this.slides[nextIndex];

          if (prev === next) {
            reset();
            return;
          }

          this.dir = getDirection(index, prevIndex);
          this.prevIndex = prevIndex;
          this.index = nextIndex;

          if (
          prev && !trigger(prev, 'beforeitemhide', [this]) ||
          !trigger(next, 'beforeitemshow', [this, prev]))
          {
            this.index = this.prevIndex;
            reset();
            return;
          }

          const promise = this._show(prev, next, force).then(() => {
            prev && trigger(prev, 'itemhidden', [this]);
            trigger(next, 'itemshown', [this]);

            return new Promise((resolve) => {
              requestAnimationFrame(() => {
                stack.shift();
                if (stack.length) {
                  this.show(stack.shift(), true);
                } else {
                  this._transitioner = null;
                }
                resolve();
              });
            });
          });

          prev && trigger(prev, 'itemhide', [this]);
          trigger(next, 'itemshow', [this]);

          return promise;
        },

        getIndex(index, prev) {if (index === void 0) {index = this.index;}if (prev === void 0) {prev = this.index;}
          return clamp(getIndex(index, this.slides, prev, this.finite), 0, this.maxIndex);
        },

        getValidIndex(index, prevIndex) {if (index === void 0) {index = this.index;}if (prevIndex === void 0) {prevIndex = this.prevIndex;}
          return this.getIndex(index, prevIndex);
        },

        _show(prev, next, force) {
          this._transitioner = this._getTransitioner(prev, next, this.dir, {
            easing: force ?
            next.offsetWidth < 600 ?
            'cubic-bezier(0.25, 0.46, 0.45, 0.94)' /* easeOutQuad */ :
            'cubic-bezier(0.165, 0.84, 0.44, 1)' /* easeOutQuart */ :
            this.easing,
            ...this.transitionOptions });


          if (!force && !prev) {
            this._translate(1);
            return Promise.resolve();
          }

          const { length } = this.stack;
          return this._transitioner[length > 1 ? 'forward' : 'show'](
          length > 1 ? Math.min(this.duration, 75 + 75 / (length - 1)) : this.duration,
          this.percent);

        },

        _getDistance(prev, next) {
          return this._getTransitioner(prev, prev !== next && next).getDistance();
        },

        _translate(percent, prev, next) {if (prev === void 0) {prev = this.prevIndex;}if (next === void 0) {next = this.index;}
          const transitioner = this._getTransitioner(prev !== next ? prev : false, next);
          transitioner.translate(percent);
          return transitioner;
        },

        _getTransitioner(
        prev,
        next,
        dir,
        options)
        {if (prev === void 0) {prev = this.prevIndex;}if (next === void 0) {next = this.index;}if (dir === void 0) {dir = this.dir || 1;}if (options === void 0) {options = this.transitionOptions;}
          return new this.Transitioner(
          isNumber(prev) ? this.slides[prev] : prev,
          isNumber(next) ? this.slides[next] : next,
          dir * (isRtl ? -1 : 1),
          options);

        } } };



    function getDirection(index, prevIndex) {
      return index === 'next' ? 1 : index === 'previous' ? -1 : index < prevIndex ? -1 : 1;
    }

    function speedUp(x) {
      return 0.5 * x + 300; // parabola through (400,500; 600,600; 1800,1200)
    }

    var Slideshow = {
      mixins: [Slider],

      props: {
        animation: String },


      data: {
        animation: 'slide',
        clsActivated: 'uk-transition-active',
        Animations: Animations$2,
        Transitioner: Transitioner$1 },


      computed: {
        animation(_ref) {let { animation, Animations } = _ref;
          return { ...(Animations[animation] || Animations.slide), name: animation };
        },

        transitionOptions() {
          return { animation: this.animation };
        } },


      events: {
        beforeitemshow(_ref2) {let { target } = _ref2;
          addClass(target, this.clsActive);
        },

        itemshown(_ref3) {let { target } = _ref3;
          addClass(target, this.clsActivated);
        },

        itemhidden(_ref4) {let { target } = _ref4;
          removeClass(target, this.clsActive, this.clsActivated);
        } } };

    var LightboxPanel = {
      mixins: [Container, Modal, Togglable, Slideshow],

      functional: true,

      props: {
        delayControls: Number,
        preload: Number,
        videoAutoplay: Boolean,
        template: String },


      data: () => ({
        preload: 1,
        videoAutoplay: false,
        delayControls: 3000,
        items: [],
        cls: 'uk-open',
        clsPage: 'uk-lightbox-page',
        selList: '.uk-lightbox-items',
        attrItem: 'uk-lightbox-item',
        selClose: '.uk-close-large',
        selCaption: '.uk-lightbox-caption',
        pauseOnHover: false,
        velocity: 2,
        Animations: Animations$1,
        template: "<div class=\"uk-lightbox uk-overflow-hidden\"> <ul class=\"uk-lightbox-items\"></ul> <div class=\"uk-lightbox-toolbar uk-position-top uk-text-right uk-transition-slide-top uk-transition-opaque\"> <button class=\"uk-lightbox-toolbar-icon uk-close-large\" type=\"button\" uk-close></button> </div> <a class=\"uk-lightbox-button uk-position-center-left uk-position-medium uk-transition-fade\" href uk-slidenav-previous uk-lightbox-item=\"previous\"></a> <a class=\"uk-lightbox-button uk-position-center-right uk-position-medium uk-transition-fade\" href uk-slidenav-next uk-lightbox-item=\"next\"></a> <div class=\"uk-lightbox-toolbar uk-lightbox-caption uk-position-bottom uk-text-center uk-transition-slide-bottom uk-transition-opaque\"></div> </div>" }),










      created() {
        const $el = $(this.template);
        const list = $(this.selList, $el);
        this.items.forEach(() => append(list, '<li>'));

        this.$mount(append(this.container, $el));
      },

      computed: {
        caption(_ref, $el) {let { selCaption } = _ref;
          return $(selCaption, $el);
        } },


      events: [
      {
        name: pointerMove$1 + " " + pointerDown$1 + " keydown",

        handler: 'showControls' },


      {
        name: 'click',

        self: true,

        delegate() {
          return this.selSlides;
        },

        handler(e) {
          if (e.defaultPrevented) {
            return;
          }

          this.hide();
        } },


      {
        name: 'shown',

        self: true,

        handler() {
          this.showControls();
        } },


      {
        name: 'hide',

        self: true,

        handler() {
          this.hideControls();

          removeClass(this.slides, this.clsActive);
          Transition.stop(this.slides);
        } },


      {
        name: 'hidden',

        self: true,

        handler() {
          this.$destroy(true);
        } },


      {
        name: 'keyup',

        el() {
          return document;
        },

        handler(e) {
          if (!this.isToggled(this.$el) || !this.draggable) {
            return;
          }

          switch (e.keyCode) {
            case 37:
              this.show('previous');
              break;
            case 39:
              this.show('next');
              break;}

        } },


      {
        name: 'beforeitemshow',

        handler(e) {
          if (this.isToggled()) {
            return;
          }

          this.draggable = false;

          e.preventDefault();

          this.toggleElement(this.$el, true, false);

          this.animation = Animations$1['scale'];
          removeClass(e.target, this.clsActive);
          this.stack.splice(1, 0, this.index);
        } },


      {
        name: 'itemshow',

        handler() {
          html(this.caption, this.getItem().caption || '');

          for (let j = -this.preload; j <= this.preload; j++) {
            this.loadItem(this.index + j);
          }
        } },


      {
        name: 'itemshown',

        handler() {
          this.draggable = this.$props.draggable;
        } },


      {
        name: 'itemload',

        async handler(_, item) {
          const { source: src, type, alt = '', poster, attrs = {} } = item;

          this.setItem(item, '<span uk-spinner></span>');

          if (!src) {
            return;
          }

          let matches;
          const iframeAttrs = {
            frameborder: '0',
            allowfullscreen: '',
            style: 'max-width: 100%; box-sizing: border-box;',
            'uk-responsive': '',
            'uk-video': "" + this.videoAutoplay };


          // Image
          if (
          type === 'image' ||
          src.match(/\.(avif|jpe?g|jfif|a?png|gif|svg|webp)($|\?)/i))
          {
            try {
              const { width, height } = await getImage(src, attrs.srcset, attrs.size);
              this.setItem(item, createEl('img', { src, width, height, alt, ...attrs }));
            } catch (e) {
              this.setError(item);
            }

            // Video
          } else if (type === 'video' || src.match(/\.(mp4|webm|ogv)($|\?)/i)) {
            const video = createEl('video', {
              src,
              poster,
              controls: '',
              playsinline: '',
              'uk-video': "" + this.videoAutoplay,
              ...attrs });


            on(video, 'loadedmetadata', () => {
              attr(video, { width: video.videoWidth, height: video.videoHeight });
              this.setItem(item, video);
            });
            on(video, 'error', () => this.setError(item));

            // Iframe
          } else if (type === 'iframe' || src.match(/\.(html|php)($|\?)/i)) {
            this.setItem(
            item,
            createEl('iframe', {
              src,
              frameborder: '0',
              allowfullscreen: '',
              class: 'uk-lightbox-iframe',
              ...attrs }));



            // YouTube
          } else if (
          matches = src.match(
          /\/\/(?:.*?youtube(-nocookie)?\..*?[?&]v=|youtu\.be\/)([\w-]{11})[&?]?(.*)?/))

          {
            this.setItem(
            item,
            createEl('iframe', {
              src: "https://www.youtube" + (matches[1] || '') + ".com/embed/" + matches[2] + (
              matches[3] ? "?" + matches[3] : ''),

              width: 1920,
              height: 1080,
              ...iframeAttrs,
              ...attrs }));



            // Vimeo
          } else if (matches = src.match(/\/\/.*?vimeo\.[a-z]+\/(\d+)[&?]?(.*)?/)) {
            try {
              const { height, width } = await (
              await fetch("https://vimeo.com/api/oembed.json?maxwidth=1920&url=" +
              encodeURI(
              src),

              {
                credentials: 'omit' })).


              json();

              this.setItem(
              item,
              createEl('iframe', {
                src: "https://player.vimeo.com/video/" + matches[1] + (
                matches[2] ? "?" + matches[2] : ''),

                width,
                height,
                ...iframeAttrs,
                ...attrs }));


            } catch (e) {
              this.setError(item);
            }
          }
        } }],



      methods: {
        loadItem(index) {if (index === void 0) {index = this.index;}
          const item = this.getItem(index);

          if (!this.getSlide(item).childElementCount) {
            trigger(this.$el, 'itemload', [item]);
          }
        },

        getItem(index) {if (index === void 0) {index = this.index;}
          return this.items[getIndex(index, this.slides)];
        },

        setItem(item, content) {
          trigger(this.$el, 'itemloaded', [this, html(this.getSlide(item), content)]);
        },

        getSlide(item) {
          return this.slides[this.items.indexOf(item)];
        },

        setError(item) {
          this.setItem(item, '<span uk-icon="icon: bolt; ratio: 2"></span>');
        },

        showControls() {
          clearTimeout(this.controlsTimer);
          this.controlsTimer = setTimeout(this.hideControls, this.delayControls);

          addClass(this.$el, 'uk-active', 'uk-transition-active');
        },

        hideControls() {
          removeClass(this.$el, 'uk-active', 'uk-transition-active');
        } } };



    function createEl(tag, attrs) {
      const el = fragment("<" + tag + ">");
      attr(el, attrs);
      return el;
    }

    var lightbox = {
      install: install$1,

      props: { toggle: String },

      data: { toggle: 'a' },

      computed: {
        toggles: {
          get(_ref, $el) {let { toggle } = _ref;
            return $$(toggle, $el);
          },

          watch() {
            this.hide();
          } } },



      disconnected() {
        this.hide();
      },

      events: [
      {
        name: 'click',

        delegate() {
          return this.toggle + ":not(.uk-disabled)";
        },

        handler(e) {
          e.preventDefault();
          this.show(e.current);
        } }],



      methods: {
        show(index) {
          const items = uniqueBy(this.toggles.map(toItem), 'source');

          if (isElement(index)) {
            const { source } = toItem(index);
            index = findIndex(items, (_ref2) => {let { source: src } = _ref2;return source === src;});
          }

          this.panel = this.panel || this.$create('lightboxPanel', { ...this.$props, items });

          on(this.panel.$el, 'hidden', () => this.panel = false);

          return this.panel.show(index);
        },

        hide() {var _this$panel;
          return (_this$panel = this.panel) == null ? void 0 : _this$panel.hide();
        } } };



    function install$1(UIkit, Lightbox) {
      if (!UIkit.lightboxPanel) {
        UIkit.component('lightboxPanel', LightboxPanel);
      }

      assign(Lightbox.props, UIkit.component('lightboxPanel').options.props);
    }

    function toItem(el) {
      const item = {};

      for (const attr of ['href', 'caption', 'type', 'poster', 'alt', 'attrs']) {
        item[attr === 'href' ? 'source' : attr] = data(el, attr);
      }

      item.attrs = parseOptions(item.attrs);

      return item;
    }

    var notification = {
      mixins: [Container],

      functional: true,

      args: ['message', 'status'],

      data: {
        message: '',
        status: '',
        timeout: 5000,
        group: null,
        pos: 'top-center',
        clsContainer: 'uk-notification',
        clsClose: 'uk-notification-close',
        clsMsg: 'uk-notification-message' },


      install,

      computed: {
        marginProp(_ref) {let { pos } = _ref;
          return "margin" + (startsWith(pos, 'top') ? 'Top' : 'Bottom');
        },

        startProps() {
          return { opacity: 0, [this.marginProp]: -this.$el.offsetHeight };
        } },


      created() {
        const container =
        $("." + this.clsContainer + "-" + this.pos, this.container) ||
        append(
        this.container, "<div class=\"" +
        this.clsContainer + " " + this.clsContainer + "-" + this.pos + "\" style=\"display: block\"></div>");


        this.$mount(
        append(
        container, "<div class=\"" +
        this.clsMsg + (
        this.status ? " " + this.clsMsg + "-" + this.status : '') + "\" role=\"alert\"> <a href class=\"" +

        this.clsClose + "\" data-uk-close></a> <div>" +
        this.message + "</div> </div>"));



      },

      async connected() {
        const margin = toFloat(css(this.$el, this.marginProp));
        await Transition.start(css(this.$el, this.startProps), {
          opacity: 1,
          [this.marginProp]: margin });


        if (this.timeout) {
          this.timer = setTimeout(this.close, this.timeout);
        }
      },

      events: {
        click(e) {
          if (closest(e.target, 'a[href="#"],a[href=""]')) {
            e.preventDefault();
          }
          this.close();
        },

        [pointerEnter]() {
          if (this.timer) {
            clearTimeout(this.timer);
          }
        },

        [pointerLeave]() {
          if (this.timeout) {
            this.timer = setTimeout(this.close, this.timeout);
          }
        } },


      methods: {
        async close(immediate) {
          const removeFn = (el) => {
            const container = parent(el);

            trigger(el, 'close', [this]);
            remove$1(el);

            if (!(container != null && container.hasChildNodes())) {
              remove$1(container);
            }
          };

          if (this.timer) {
            clearTimeout(this.timer);
          }

          if (!immediate) {
            await Transition.start(this.$el, this.startProps);
          }

          removeFn(this.$el);
        } } };



    function install(UIkit) {
      UIkit.notification.closeAll = function (group, immediate) {
        apply(document.body, (el) => {
          const notification = UIkit.getComponent(el, 'notification');
          if (notification && (!group || group === notification.group)) {
            notification.close(immediate);
          }
        });
      };
    }

    const props = {
      x: transformFn,
      y: transformFn,
      rotate: transformFn,
      scale: transformFn,
      color: colorFn,
      backgroundColor: colorFn,
      borderColor: colorFn,
      blur: filterFn,
      hue: filterFn,
      fopacity: filterFn,
      grayscale: filterFn,
      invert: filterFn,
      saturate: filterFn,
      sepia: filterFn,
      opacity: cssPropFn,
      stroke: strokeFn,
      bgx: backgroundFn,
      bgy: backgroundFn };


    const { keys } = Object;

    var Parallax = {
      mixins: [Media],

      props: fillObject(keys(props), 'list'),

      data: fillObject(keys(props), undefined),

      computed: {
        props(properties, $el) {
          const stops = {};
          for (const prop in properties) {
            if (prop in props && !isUndefined(properties[prop])) {
              stops[prop] = properties[prop].slice();
            }
          }
          const result = {};
          for (const prop in stops) {
            result[prop] = props[prop](prop, $el, stops[prop], stops);
          }
          return result;
        } },


      events: {
        load() {
          this.$emit();
        } },


      methods: {
        reset() {
          for (const prop in this.getCss(0)) {
            css(this.$el, prop, '');
          }
        },

        getCss(percent) {
          const css = { transform: '', filter: '' };
          for (const prop in this.props) {
            this.props[prop](css, percent);
          }
          return css;
        } } };



    function transformFn(prop, el, stops) {
      let unit = getUnit(stops) || { x: 'px', y: 'px', rotate: 'deg' }[prop] || '';
      let transformFn;

      if (prop === 'x' || prop === 'y') {
        prop = "translate" + ucfirst(prop);
        transformFn = (stop) => toFloat(toFloat(stop).toFixed(unit === 'px' ? 0 : 6));
      } else if (prop === 'scale') {
        unit = '';
        transformFn = (stop) =>
        getUnit([stop]) ? toPx(stop, 'width', el, true) / el.offsetWidth : stop;
      }

      if (stops.length === 1) {
        stops.unshift(prop === 'scale' ? 1 : 0);
      }

      stops = parseStops(stops, transformFn);

      return (css, percent) => {
        css.transform += " " + prop + "(" + getValue(stops, percent) + unit + ")";
      };
    }

    function colorFn(prop, el, stops) {
      if (stops.length === 1) {
        stops.unshift(getCssValue(el, prop, ''));
      }

      stops = parseStops(stops, (stop) => parseColor(el, stop));

      return (css, percent) => {
        const [start, end, p] = getStop(stops, percent);
        const value = start.
        map((value, i) => {
          value += p * (end[i] - value);
          return i === 3 ? toFloat(value) : parseInt(value, 10);
        }).
        join(',');
        css[prop] = "rgba(" + value + ")";
      };
    }

    function parseColor(el, color) {
      return getCssValue(el, 'color', color).
      split(/[(),]/g).
      slice(1, -1).
      concat(1).
      slice(0, 4).
      map(toFloat);
    }

    function filterFn(prop, el, stops) {
      if (stops.length === 1) {
        stops.unshift(0);
      }

      const unit = getUnit(stops) || { blur: 'px', hue: 'deg' }[prop] || '%';
      prop = { fopacity: 'opacity', hue: 'hue-rotate' }[prop] || prop;
      stops = parseStops(stops);

      return (css, percent) => {
        const value = getValue(stops, percent);
        css.filter += " " + prop + "(" + (value + unit) + ")";
      };
    }

    function cssPropFn(prop, el, stops) {
      if (stops.length === 1) {
        stops.unshift(getCssValue(el, prop, ''));
      }

      stops = parseStops(stops);

      return (css, percent) => {
        css[prop] = getValue(stops, percent);
      };
    }

    function strokeFn(prop, el, stops) {
      if (stops.length === 1) {
        stops.unshift(0);
      }

      const unit = getUnit(stops);
      const length = getMaxPathLength(el);
      stops = parseStops(stops.reverse(), (stop) => {
        stop = toFloat(stop);
        return unit === '%' ? stop * length / 100 : stop;
      });

      if (!stops.some((_ref) => {let [value] = _ref;return value;})) {
        return noop;
      }

      css(el, 'strokeDasharray', length);

      return (css, percent) => {
        css.strokeDashoffset = getValue(stops, percent);
      };
    }

    function backgroundFn(prop, el, stops, props) {
      if (stops.length === 1) {
        stops.unshift(0);
      }

      const attr = prop === 'bgy' ? 'height' : 'width';
      props[prop] = parseStops(stops, (stop) => toPx(stop, attr, el));

      const bgProps = ['bgx', 'bgy'].filter((prop) => prop in props);
      if (bgProps.length === 2 && prop === 'bgx') {
        return noop;
      }

      if (getCssValue(el, 'backgroundSize', '') === 'cover') {
        return backgroundCoverFn(prop, el, stops, props);
      }

      const positions = {};
      for (const prop of bgProps) {
        positions[prop] = getBackgroundPos(el, prop);
      }

      return setBackgroundPosFn(bgProps, positions, props);
    }

    function backgroundCoverFn(prop, el, stops, props) {
      const dimImage = getBackgroundImageDimensions(el);

      if (!dimImage.width) {
        return noop;
      }

      const dimEl = {
        width: el.offsetWidth,
        height: el.offsetHeight };


      const bgProps = ['bgx', 'bgy'].filter((prop) => prop in props);

      const positions = {};
      for (const prop of bgProps) {
        const values = props[prop].map((_ref2) => {let [value] = _ref2;return value;});
        const min = Math.min(...values);
        const max = Math.max(...values);
        const down = values.indexOf(min) < values.indexOf(max);
        const diff = max - min;

        positions[prop] = (down ? -diff : 0) - (down ? min : max) + "px";
        dimEl[prop === 'bgy' ? 'height' : 'width'] += diff;
      }

      const dim = Dimensions.cover(dimImage, dimEl);

      for (const prop of bgProps) {
        const attr = prop === 'bgy' ? 'height' : 'width';
        const overflow = dim[attr] - dimEl[attr];
        positions[prop] = "max(" + getBackgroundPos(el, prop) + ",-" + overflow + "px) + " + positions[prop];
      }

      const fn = setBackgroundPosFn(bgProps, positions, props);
      return (css, percent) => {
        fn(css, percent);
        css.backgroundSize = dim.width + "px " + dim.height + "px";
        css.backgroundRepeat = 'no-repeat';
      };
    }

    function getBackgroundPos(el, prop) {
      return getCssValue(el, "background-position-" + prop.substr(-1), '');
    }

    function setBackgroundPosFn(bgProps, positions, props) {
      return function (css, percent) {
        for (const prop of bgProps) {
          const value = getValue(props[prop], percent);
          css["background-position-" + prop.substr(-1)] = "calc(" + positions[prop] + " + " + value + "px)";
        }
      };
    }

    const dimensions = {};
    function getBackgroundImageDimensions(el) {
      const src = css(el, 'backgroundImage').replace(/^none|url\(["']?(.+?)["']?\)$/, '$1');

      if (dimensions[src]) {
        return dimensions[src];
      }

      const image = new Image();
      if (src) {
        image.src = src;

        if (!image.naturalWidth) {
          image.onload = () => {
            dimensions[src] = toDimensions(image);
            trigger(el, createEvent('load', false));
          };
          return toDimensions(image);
        }
      }

      return dimensions[src] = toDimensions(image);
    }

    function toDimensions(image) {
      return {
        width: image.naturalWidth,
        height: image.naturalHeight };

    }

    function parseStops(stops, fn) {if (fn === void 0) {fn = toFloat;}
      const result = [];
      const { length } = stops;
      let nullIndex = 0;
      for (let i = 0; i < length; i++) {
        let [value, percent] = isString(stops[i]) ? stops[i].trim().split(' ') : [stops[i]];
        value = fn(value);
        percent = percent ? toFloat(percent) / 100 : null;

        if (i === 0) {
          if (percent === null) {
            percent = 0;
          } else if (percent) {
            result.push([value, 0]);
          }
        } else if (i === length - 1) {
          if (percent === null) {
            percent = 1;
          } else if (percent !== 1) {
            result.push([value, percent]);
            percent = 1;
          }
        }

        result.push([value, percent]);

        if (percent === null) {
          nullIndex++;
        } else if (nullIndex) {
          const leftPercent = result[i - nullIndex - 1][1];
          const p = (percent - leftPercent) / (nullIndex + 1);
          for (let j = nullIndex; j > 0; j--) {
            result[i - j][1] = leftPercent + p * (nullIndex - j + 1);
          }

          nullIndex = 0;
        }
      }

      return result;
    }

    function getStop(stops, percent) {
      const index = findIndex(stops.slice(1), (_ref3) => {let [, targetPercent] = _ref3;return percent <= targetPercent;}) + 1;
      return [
      stops[index - 1][0],
      stops[index][0],
      (percent - stops[index - 1][1]) / (stops[index][1] - stops[index - 1][1])];

    }

    function getValue(stops, percent) {
      const [start, end, p] = getStop(stops, percent);
      return isNumber(start) ? start + Math.abs(start - end) * p * (start < end ? 1 : -1) : +end;
    }

    const unitRe = /^-?\d+(\S+)/;
    function getUnit(stops, defaultUnit) {
      for (const stop of stops) {
        const match = stop.match == null ? void 0 : stop.match(unitRe);
        if (match) {
          return match[1];
        }
      }
      return defaultUnit;
    }

    function getCssValue(el, prop, value) {
      const prev = el.style[prop];
      const val = css(css(el, prop, value), prop);
      el.style[prop] = prev;
      return val;
    }

    function fillObject(keys, value) {
      return keys.reduce((data, prop) => {
        data[prop] = value;
        return data;
      }, {});
    }

    var parallax = {
      mixins: [Parallax, Resize, Scroll],

      props: {
        target: String,
        viewport: Number, // Deprecated
        easing: Number,
        start: String,
        end: String },


      data: {
        target: false,
        viewport: 1,
        easing: 1,
        start: 0,
        end: 0 },


      computed: {
        target(_ref, $el) {let { target } = _ref;
          return getOffsetElement(target && query(target, $el) || $el);
        },

        start(_ref2) {let { start } = _ref2;
          return toPx(start, 'height', this.target, true);
        },

        end(_ref3) {let { end, viewport } = _ref3;
          return toPx(
          end || (viewport = (1 - viewport) * 100) && viewport + "vh+" + viewport + "%",
          'height',
          this.target,
          true);

        } },


      update: {
        read(_ref4, types) {let { percent } = _ref4;
          if (!types.has('scroll')) {
            percent = false;
          }

          if (!this.matchMedia) {
            return;
          }

          const prev = percent;
          percent = ease(scrolledOver(this.target, this.start, this.end), this.easing);

          return {
            percent,
            style: prev === percent ? false : this.getCss(percent) };

        },

        write(_ref5) {let { style } = _ref5;
          if (!this.matchMedia) {
            this.reset();
            return;
          }

          style && css(this.$el, style);
        },

        events: ['scroll', 'resize'] } };



    /*
     * Inspired by https://gist.github.com/gre/1650294?permalink_comment_id=3477425#gistcomment-3477425
     *
     * linear: 0
     * easeInSine: 0.5
     * easeOutSine: -0.5
     * easeInQuad: 1
     * easeOutQuad: -1
     * easeInCubic: 2
     * easeOutCubic: -2
     * easeInQuart: 3
     * easeOutQuart: -3
     * easeInQuint: 4
     * easeOutQuint: -4
     */
    function ease(percent, easing) {
      return easing >= 0 ? Math.pow(percent, easing + 1) : 1 - Math.pow(1 - percent, 1 - easing);
    }

    // SVG elements do not inherit from HTMLElement
    function getOffsetElement(el) {
      return el ? 'offsetTop' in el ? el : getOffsetElement(parent(el)) : document.documentElement;
    }

    var SliderReactive = {
      update: {
        write() {
          if (this.stack.length || this.dragging) {
            return;
          }

          const index = this.getValidIndex(this.index);

          if (!~this.prevIndex || this.index !== index) {
            this.show(index);
          } else {
            this._translate(1, this.prevIndex, this.index);
          }
        },

        events: ['resize'] } };

    var SliderPreload = {
      mixins: [Lazyload],

      connected() {
        this.lazyload(this.slides, this.getAdjacentSlides);
      } };

    function Transitioner (prev, next, dir, _ref) {let { center, easing, list } = _ref;
      const deferred = new Deferred();

      const from = prev ?
      getLeft(prev, list, center) :
      getLeft(next, list, center) + dimensions$1(next).width * dir;
      const to = next ?
      getLeft(next, list, center) :
      from + dimensions$1(prev).width * dir * (isRtl ? -1 : 1);

      return {
        dir,

        show(duration, percent, linear) {if (percent === void 0) {percent = 0;}
          const timing = linear ? 'linear' : easing;
          duration -= Math.round(duration * clamp(percent, -1, 1));

          this.translate(percent);

          percent = prev ? percent : clamp(percent, 0, 1);
          triggerUpdate(this.getItemIn(), 'itemin', { percent, duration, timing, dir });
          prev &&
          triggerUpdate(this.getItemIn(true), 'itemout', {
            percent: 1 - percent,
            duration,
            timing,
            dir });


          Transition.start(
          list,
          { transform: translate(-to * (isRtl ? -1 : 1), 'px') },
          duration,
          timing).
          then(deferred.resolve, noop);

          return deferred.promise;
        },

        cancel() {
          Transition.cancel(list);
        },

        reset() {
          css(list, 'transform', '');
        },

        forward(duration, percent) {if (percent === void 0) {percent = this.percent();}
          Transition.cancel(list);
          return this.show(duration, percent, true);
        },

        translate(percent) {
          const distance = this.getDistance() * dir * (isRtl ? -1 : 1);

          css(
          list,
          'transform',
          translate(
          clamp(
          -to + (distance - distance * percent),
          -getWidth(list),
          dimensions$1(list).width) * (
          isRtl ? -1 : 1),
          'px'));



          const actives = this.getActives();
          const itemIn = this.getItemIn();
          const itemOut = this.getItemIn(true);

          percent = prev ? clamp(percent, -1, 1) : 0;

          for (const slide of children(list)) {
            const isActive = includes(actives, slide);
            const isIn = slide === itemIn;
            const isOut = slide === itemOut;
            const translateIn =
            isIn ||
            !isOut && (
            isActive ||
            dir * (isRtl ? -1 : 1) === -1 ^
            getElLeft(slide, list) > getElLeft(prev || next));

            triggerUpdate(slide, "itemtranslate" + (translateIn ? 'in' : 'out'), {
              dir,
              percent: isOut ? 1 - percent : isIn ? percent : isActive ? 1 : 0 });

          }
        },

        percent() {
          return Math.abs(
          (css(list, 'transform').split(',')[4] * (isRtl ? -1 : 1) + from) / (to - from));

        },

        getDistance() {
          return Math.abs(to - from);
        },

        getItemIn(out) {if (out === void 0) {out = false;}
          let actives = this.getActives();
          let nextActives = inView(list, getLeft(next || prev, list, center));

          if (out) {
            const temp = actives;
            actives = nextActives;
            nextActives = temp;
          }

          return nextActives[findIndex(nextActives, (el) => !includes(actives, el))];
        },

        getActives() {
          return inView(list, getLeft(prev || next, list, center));
        } };

    }

    function getLeft(el, list, center) {
      const left = getElLeft(el, list);

      return center ? left - centerEl(el, list) : Math.min(left, getMax(list));
    }

    function getMax(list) {
      return Math.max(0, getWidth(list) - dimensions$1(list).width);
    }

    function getWidth(list) {
      return children(list).reduce((right, el) => dimensions$1(el).width + right, 0);
    }

    function centerEl(el, list) {
      return dimensions$1(list).width / 2 - dimensions$1(el).width / 2;
    }

    function getElLeft(el, list) {
      return (
        el &&
        (position(el).left + (isRtl ? dimensions$1(el).width - dimensions$1(list).width : 0)) * (
        isRtl ? -1 : 1) ||
        0);

    }

    function inView(list, listLeft) {
      listLeft -= 1;
      const listWidth = dimensions$1(list).width;
      const listRight = listLeft + listWidth + 2;

      return children(list).filter((slide) => {
        const slideLeft = getElLeft(slide, list);
        const slideRight = slideLeft + Math.min(dimensions$1(slide).width, listWidth);

        return slideLeft >= listLeft && slideRight <= listRight;
      });
    }

    function triggerUpdate(el, type, data) {
      trigger(el, createEvent(type, false, false, data));
    }

    var slider = {
      mixins: [Class, Slider, SliderReactive, SliderPreload],

      props: {
        center: Boolean,
        sets: Boolean },


      data: {
        center: false,
        sets: false,
        attrItem: 'uk-slider-item',
        selList: '.uk-slider-items',
        selNav: '.uk-slider-nav',
        clsContainer: 'uk-slider-container',
        Transitioner },


      computed: {
        avgWidth() {
          return getWidth(this.list) / this.length;
        },

        finite(_ref) {let { finite } = _ref;
          return (
            finite ||
            Math.ceil(getWidth(this.list)) <
            Math.trunc(dimensions$1(this.list).width + getMaxElWidth(this.list) + this.center));

        },

        maxIndex() {
          if (!this.finite || this.center && !this.sets) {
            return this.length - 1;
          }

          if (this.center) {
            return last(this.sets);
          }

          let lft = 0;
          const max = getMax(this.list);
          const index = findIndex(this.slides, (el) => {
            if (lft >= max) {
              return true;
            }

            lft += dimensions$1(el).width;
          });

          return ~index ? index : this.length - 1;
        },

        sets(_ref2) {let { sets: enabled } = _ref2;
          if (!enabled) {
            return;
          }

          let left = 0;
          const sets = [];
          const width = dimensions$1(this.list).width;
          for (let i = 0; i < this.slides.length; i++) {
            const slideWidth = dimensions$1(this.slides[i]).width;

            if (left + slideWidth > width) {
              left = 0;
            }

            if (this.center) {
              if (
              left < width / 2 &&
              left + slideWidth + dimensions$1(this.slides[+i + 1]).width / 2 > width / 2)
              {
                sets.push(+i);
                left = width / 2 - slideWidth / 2;
              }
            } else if (left === 0) {
              sets.push(Math.min(+i, this.maxIndex));
            }

            left += slideWidth;
          }

          if (sets.length) {
            return sets;
          }
        },

        transitionOptions() {
          return {
            center: this.center,
            list: this.list };

        } },


      connected() {
        toggleClass(this.$el, this.clsContainer, !$("." + this.clsContainer, this.$el));
      },

      update: {
        write() {
          for (const el of this.navItems) {
            const index = toNumber(data(el, this.attrItem));
            if (index !== false) {
              el.hidden =
              !this.maxIndex ||
              index > this.maxIndex ||
              this.sets && !includes(this.sets, index);
            }
          }

          if (this.length && !this.dragging && !this.stack.length) {
            this.reorder();
            this._translate(1);
          }

          this.updateActiveClasses();
        },

        events: ['resize'] },


      events: {
        beforeitemshow(e) {
          if (
          !this.dragging &&
          this.sets &&
          this.stack.length < 2 &&
          !includes(this.sets, this.index))
          {
            this.index = this.getValidIndex();
          }

          const diff = Math.abs(
          this.index -
          this.prevIndex + (
          this.dir > 0 && this.index < this.prevIndex ||
          this.dir < 0 && this.index > this.prevIndex ?
          (this.maxIndex + 1) * this.dir :
          0));


          if (!this.dragging && diff > 1) {
            for (let i = 0; i < diff; i++) {
              this.stack.splice(1, 0, this.dir > 0 ? 'next' : 'previous');
            }

            e.preventDefault();
            return;
          }

          const index =
          this.dir < 0 || !this.slides[this.prevIndex] ? this.index : this.prevIndex;
          this.duration =
          speedUp(this.avgWidth / this.velocity) * (
          dimensions$1(this.slides[index]).width / this.avgWidth);

          this.reorder();
        },

        itemshow() {
          if (~this.prevIndex) {
            addClass(this._getTransitioner().getItemIn(), this.clsActive);
          }
        },

        itemshown() {
          this.updateActiveClasses();
        } },


      methods: {
        reorder() {
          if (this.finite) {
            css(this.slides, 'order', '');
            return;
          }

          const index = this.dir > 0 && this.slides[this.prevIndex] ? this.prevIndex : this.index;

          this.slides.forEach((slide, i) =>
          css(
          slide,
          'order',
          this.dir > 0 && i < index ? 1 : this.dir < 0 && i >= this.index ? -1 : ''));



          if (!this.center) {
            return;
          }

          const next = this.slides[index];
          let width = dimensions$1(this.list).width / 2 - dimensions$1(next).width / 2;
          let j = 0;

          while (width > 0) {
            const slideIndex = this.getIndex(--j + index, index);
            const slide = this.slides[slideIndex];

            css(slide, 'order', slideIndex > index ? -2 : -1);
            width -= dimensions$1(slide).width;
          }
        },

        updateActiveClasses() {
          const actives = this._getTransitioner(this.index).getActives();
          const activeClasses = [
          this.clsActive,
          (!this.sets || includes(this.sets, toFloat(this.index))) && this.clsActivated ||
          ''];

          for (const slide of this.slides) {
            toggleClass(slide, activeClasses, includes(actives, slide));
          }
        },

        getValidIndex(index, prevIndex) {if (index === void 0) {index = this.index;}if (prevIndex === void 0) {prevIndex = this.prevIndex;}
          index = this.getIndex(index, prevIndex);

          if (!this.sets) {
            return index;
          }

          let prev;

          do {
            if (includes(this.sets, index)) {
              return index;
            }

            prev = index;
            index = this.getIndex(index + this.dir, prevIndex);
          } while (index !== prev);

          return index;
        },

        getAdjacentSlides() {
          const { width } = dimensions$1(this.list);
          const left = -width;
          const right = width * 2;
          const slideWidth = dimensions$1(this.slides[this.index]).width;
          const slideLeft = this.center ? width / 2 - slideWidth / 2 : 0;
          const slides = new Set();
          for (const i of [-1, 1]) {
            let currentLeft = slideLeft + (i > 0 ? slideWidth : 0);
            let j = 0;
            do {
              const slide = this.slides[this.getIndex(this.index + i + j++ * i)];
              currentLeft += dimensions$1(slide).width * i;
              slides.add(slide);
            } while (this.slides.length > j && currentLeft > left && currentLeft < right);
          }
          return Array.from(slides);
        } } };



    function getMaxElWidth(list) {
      return Math.max(0, ...children(list).map((el) => dimensions$1(el).width));
    }

    var sliderParallax = {
      mixins: [Parallax],

      data: {
        selItem: '!li' },


      beforeConnect() {
        this.item = query(this.selItem, this.$el);
      },

      disconnected() {
        this.item = null;
      },

      events: [
      {
        name: 'itemin itemout',

        self: true,

        el() {
          return this.item;
        },

        handler(_ref) {let { type, detail: { percent, duration, timing, dir } } = _ref;
          fastdom.read(() => {
            const propsFrom = this.getCss(getCurrentPercent(type, dir, percent));
            const propsTo = this.getCss(isIn(type) ? 0.5 : dir > 0 ? 1 : 0);
            fastdom.write(() => {
              css(this.$el, propsFrom);
              Transition.start(this.$el, propsTo, duration, timing).catch(noop);
            });
          });
        } },


      {
        name: 'transitioncanceled transitionend',

        self: true,

        el() {
          return this.item;
        },

        handler() {
          Transition.cancel(this.$el);
        } },


      {
        name: 'itemtranslatein itemtranslateout',

        self: true,

        el() {
          return this.item;
        },

        handler(_ref2) {let { type, detail: { percent, dir } } = _ref2;
          fastdom.read(() => {
            const props = this.getCss(getCurrentPercent(type, dir, percent));
            fastdom.write(() => css(this.$el, props));
          });
        } }] };




    function isIn(type) {
      return endsWith(type, 'in');
    }

    function getCurrentPercent(type, dir, percent) {
      percent /= 2;

      return isIn(type) ^ dir < 0 ? percent : 1 - percent;
    }

    var Animations = {
      ...Animations$2,
      fade: {
        show() {
          return [{ opacity: 0, zIndex: 0 }, { zIndex: -1 }];
        },

        percent(current) {
          return 1 - css(current, 'opacity');
        },

        translate(percent) {
          return [{ opacity: 1 - percent, zIndex: 0 }, { zIndex: -1 }];
        } },


      scale: {
        show() {
          return [{ opacity: 0, transform: scale3d(1 + 0.5), zIndex: 0 }, { zIndex: -1 }];
        },

        percent(current) {
          return 1 - css(current, 'opacity');
        },

        translate(percent) {
          return [
          { opacity: 1 - percent, transform: scale3d(1 + 0.5 * percent), zIndex: 0 },
          { zIndex: -1 }];

        } },


      pull: {
        show(dir) {
          return dir < 0 ?
          [
          { transform: translate(30), zIndex: -1 },
          { transform: translate(), zIndex: 0 }] :

          [
          { transform: translate(-100), zIndex: 0 },
          { transform: translate(), zIndex: -1 }];

        },

        percent(current, next, dir) {
          return dir < 0 ? 1 - translated(next) : translated(current);
        },

        translate(percent, dir) {
          return dir < 0 ?
          [
          { transform: translate(30 * percent), zIndex: -1 },
          { transform: translate(-100 * (1 - percent)), zIndex: 0 }] :

          [
          { transform: translate(-percent * 100), zIndex: 0 },
          { transform: translate(30 * (1 - percent)), zIndex: -1 }];

        } },


      push: {
        show(dir) {
          return dir < 0 ?
          [
          { transform: translate(100), zIndex: 0 },
          { transform: translate(), zIndex: -1 }] :

          [
          { transform: translate(-30), zIndex: -1 },
          { transform: translate(), zIndex: 0 }];

        },

        percent(current, next, dir) {
          return dir > 0 ? 1 - translated(next) : translated(current);
        },

        translate(percent, dir) {
          return dir < 0 ?
          [
          { transform: translate(percent * 100), zIndex: 0 },
          { transform: translate(-30 * (1 - percent)), zIndex: -1 }] :

          [
          { transform: translate(-30 * percent), zIndex: -1 },
          { transform: translate(100 * (1 - percent)), zIndex: 0 }];

        } } };

    var slideshow = {
      mixins: [Class, Slideshow, SliderReactive, SliderPreload],

      props: {
        ratio: String,
        minHeight: Number,
        maxHeight: Number },


      data: {
        ratio: '16:9',
        minHeight: false,
        maxHeight: false,
        selList: '.uk-slideshow-items',
        attrItem: 'uk-slideshow-item',
        selNav: '.uk-slideshow-nav',
        Animations },


      update: {
        read() {
          if (!this.list) {
            return false;
          }

          let [width, height] = this.ratio.split(':').map(Number);

          height = height * this.list.offsetWidth / width || 0;

          if (this.minHeight) {
            height = Math.max(this.minHeight, height);
          }

          if (this.maxHeight) {
            height = Math.min(this.maxHeight, height);
          }

          return { height: height - boxModelAdjust(this.list, 'height', 'content-box') };
        },

        write(_ref) {let { height } = _ref;
          height > 0 && css(this.list, 'minHeight', height);
        },

        events: ['resize'] },


      methods: {
        getAdjacentSlides() {
          return [1, -1].map((i) => this.slides[this.getIndex(this.index + i)]);
        } } };

    var sortable = {
      mixins: [Class, Animate],

      props: {
        group: String,
        threshold: Number,
        clsItem: String,
        clsPlaceholder: String,
        clsDrag: String,
        clsDragState: String,
        clsBase: String,
        clsNoDrag: String,
        clsEmpty: String,
        clsCustom: String,
        handle: String },


      data: {
        group: false,
        threshold: 5,
        clsItem: 'uk-sortable-item',
        clsPlaceholder: 'uk-sortable-placeholder',
        clsDrag: 'uk-sortable-drag',
        clsDragState: 'uk-drag',
        clsBase: 'uk-sortable',
        clsNoDrag: 'uk-sortable-nodrag',
        clsEmpty: 'uk-sortable-empty',
        clsCustom: '',
        handle: false,
        pos: {} },


      created() {
        for (const key of ['init', 'start', 'move', 'end']) {
          const fn = this[key];
          this[key] = (e) => {
            assign(this.pos, getEventPos(e));
            fn(e);
          };
        }
      },

      events: {
        name: pointerDown$1,
        passive: false,
        handler: 'init' },


      computed: {
        target() {
          return (this.$el.tBodies || [this.$el])[0];
        },

        items() {
          return children(this.target);
        },

        isEmpty: {
          get() {
            return isEmpty(this.items);
          },

          watch(empty) {
            toggleClass(this.target, this.clsEmpty, empty);
          },

          immediate: true },


        handles: {
          get(_ref, el) {let { handle } = _ref;
            return handle ? $$(handle, el) : this.items;
          },

          watch(handles, prev) {
            css(prev, { touchAction: '', userSelect: '' });
            css(handles, { touchAction: hasTouch ? 'none' : '', userSelect: 'none' }); // touchAction set to 'none' causes a performance drop in Chrome 80
          },

          immediate: true } },



      update: {
        write(data) {
          if (!this.drag || !parent(this.placeholder)) {
            return;
          }

          const {
            pos: { x, y },
            origin: { offsetTop, offsetLeft },
            placeholder } =
          this;

          css(this.drag, {
            top: y - offsetTop,
            left: x - offsetLeft });


          const sortable = this.getSortable(document.elementFromPoint(x, y));

          if (!sortable) {
            return;
          }

          const { items } = sortable;

          if (items.some(Transition.inProgress)) {
            return;
          }

          const target = findTarget(items, { x, y });

          if (items.length && (!target || target === placeholder)) {
            return;
          }

          const previous = this.getSortable(placeholder);
          const insertTarget = findInsertTarget(
          sortable.target,
          target,
          placeholder,
          x,
          y,
          sortable === previous && data.moved !== target);


          if (insertTarget === false) {
            return;
          }

          if (insertTarget && placeholder === insertTarget) {
            return;
          }

          if (sortable !== previous) {
            previous.remove(placeholder);
            data.moved = target;
          } else {
            delete data.moved;
          }

          sortable.insert(placeholder, insertTarget);

          this.touched.add(sortable);
        },

        events: ['move'] },


      methods: {
        init(e) {
          const { target, button, defaultPrevented } = e;
          const [placeholder] = this.items.filter((el) => within(target, el));

          if (
          !placeholder ||
          defaultPrevented ||
          button > 0 ||
          isInput(target) ||
          within(target, "." + this.clsNoDrag) ||
          this.handle && !within(target, this.handle))
          {
            return;
          }

          e.preventDefault();

          this.touched = new Set([this]);
          this.placeholder = placeholder;
          this.origin = { target, index: index(placeholder), ...this.pos };

          on(document, pointerMove$1, this.move);
          on(document, pointerUp$1, this.end);

          if (!this.threshold) {
            this.start(e);
          }
        },

        start(e) {
          this.drag = appendDrag(this.$container, this.placeholder);
          const { left, top } = this.placeholder.getBoundingClientRect();
          assign(this.origin, { offsetLeft: this.pos.x - left, offsetTop: this.pos.y - top });

          addClass(this.drag, this.clsDrag, this.clsCustom);
          addClass(this.placeholder, this.clsPlaceholder);
          addClass(this.items, this.clsItem);
          addClass(document.documentElement, this.clsDragState);

          trigger(this.$el, 'start', [this, this.placeholder]);

          trackScroll(this.pos);

          this.move(e);
        },

        move(e) {
          if (this.drag) {
            this.$emit('move');
          } else if (
          Math.abs(this.pos.x - this.origin.x) > this.threshold ||
          Math.abs(this.pos.y - this.origin.y) > this.threshold)
          {
            this.start(e);
          }
        },

        end() {
          off(document, pointerMove$1, this.move);
          off(document, pointerUp$1, this.end);

          if (!this.drag) {
            return;
          }

          untrackScroll();

          const sortable = this.getSortable(this.placeholder);

          if (this === sortable) {
            if (this.origin.index !== index(this.placeholder)) {
              trigger(this.$el, 'moved', [this, this.placeholder]);
            }
          } else {
            trigger(sortable.$el, 'added', [sortable, this.placeholder]);
            trigger(this.$el, 'removed', [this, this.placeholder]);
          }

          trigger(this.$el, 'stop', [this, this.placeholder]);

          remove$1(this.drag);
          this.drag = null;

          for (const { clsPlaceholder, clsItem } of this.touched) {
            for (const sortable of this.touched) {
              removeClass(sortable.items, clsPlaceholder, clsItem);
            }
          }
          this.touched = null;
          removeClass(document.documentElement, this.clsDragState);
        },

        insert(element, target) {
          addClass(this.items, this.clsItem);

          const insert = () => target ? before(target, element) : append(this.target, element);

          this.animate(insert);
        },

        remove(element) {
          if (!within(element, this.target)) {
            return;
          }

          this.animate(() => remove$1(element));
        },

        getSortable(element) {
          do {
            const sortable = this.$getComponent(element, 'sortable');

            if (
            sortable && (
            sortable === this || this.group !== false && sortable.group === this.group))
            {
              return sortable;
            }
          } while (element = parent(element));
        } } };



    let trackTimer;
    function trackScroll(pos) {
      let last = Date.now();
      trackTimer = setInterval(() => {
        let { x, y } = pos;
        y += document.scrollingElement.scrollTop;

        const dist = (Date.now() - last) * 0.3;
        last = Date.now();

        scrollParents(document.elementFromPoint(x, pos.y), /auto|scroll/).
        reverse().
        some((scrollEl) => {
          let { scrollTop: scroll, scrollHeight } = scrollEl;

          const { top, bottom, height } = offsetViewport(scrollEl);

          if (top < y && top + 35 > y) {
            scroll -= dist;
          } else if (bottom > y && bottom - 35 < y) {
            scroll += dist;
          } else {
            return;
          }

          if (scroll > 0 && scroll < scrollHeight - height) {
            scrollEl.scrollTop = scroll;
            return true;
          }
        });
      }, 15);
    }

    function untrackScroll() {
      clearInterval(trackTimer);
    }

    function appendDrag(container, element) {
      const clone = append(
      container,
      element.outerHTML.replace(/(^<)(?:li|tr)|(?:li|tr)(\/>$)/g, '$1div$2'));


      css(clone, 'margin', '0', 'important');
      css(clone, {
        boxSizing: 'border-box',
        width: element.offsetWidth,
        height: element.offsetHeight,
        padding: css(element, 'padding') });


      height(clone.firstElementChild, height(element.firstElementChild));

      return clone;
    }

    function findTarget(items, point) {
      return items[findIndex(items, (item) => pointInRect(point, item.getBoundingClientRect()))];
    }

    function findInsertTarget(list, target, placeholder, x, y, sameList) {
      if (!children(list).length) {
        return;
      }

      const rect = target.getBoundingClientRect();
      if (!sameList) {
        if (!isHorizontal(list, placeholder)) {
          return y < rect.top + rect.height / 2 ? target : target.nextElementSibling;
        }

        return target;
      }

      const placeholderRect = placeholder.getBoundingClientRect();
      const sameRow = linesIntersect(
      [rect.top, rect.bottom],
      [placeholderRect.top, placeholderRect.bottom]);


      const pointerPos = sameRow ? x : y;
      const lengthProp = sameRow ? 'width' : 'height';
      const startProp = sameRow ? 'left' : 'top';
      const endProp = sameRow ? 'right' : 'bottom';

      const diff =
      placeholderRect[lengthProp] < rect[lengthProp] ?
      rect[lengthProp] - placeholderRect[lengthProp] :
      0;

      if (placeholderRect[startProp] < rect[startProp]) {
        if (diff && pointerPos < rect[startProp] + diff) {
          return false;
        }

        return target.nextElementSibling;
      }

      if (diff && pointerPos > rect[endProp] - diff) {
        return false;
      }

      return target;
    }

    function isHorizontal(list, placeholder) {
      const single = children(list).length === 1;

      if (single) {
        append(list, placeholder);
      }

      const items = children(list);
      const isHorizontal = items.some((el, i) => {
        const rectA = el.getBoundingClientRect();
        return items.slice(i + 1).some((el) => {
          const rectB = el.getBoundingClientRect();
          return !linesIntersect([rectA.left, rectA.right], [rectB.left, rectB.right]);
        });
      });

      if (single) {
        remove$1(placeholder);
      }

      return isHorizontal;
    }

    function linesIntersect(lineA, lineB) {
      return lineA[1] > lineB[0] && lineB[1] > lineA[0];
    }

    var tooltip = {
      mixins: [Container, Togglable, Position],

      args: 'title',

      props: {
        delay: Number,
        title: String },


      data: {
        pos: 'top',
        title: '',
        delay: 0,
        animation: ['uk-animation-scale-up'],
        duration: 100,
        cls: 'uk-active' },


      beforeConnect() {
        this._hasTitle = hasAttr(this.$el, 'title');
        attr(this.$el, 'title', '');
        this.updateAria(false);
        makeFocusable(this.$el);
      },

      disconnected() {
        this.hide();
        attr(this.$el, 'title', this._hasTitle ? this.title : null);
      },

      methods: {
        show() {
          if (this.isToggled(this.tooltip || null) || !this.title) {
            return;
          }

          this._unbind = once(
          document, "show keydown " +
          pointerDown$1,
          this.hide,
          false,
          (e) =>
          e.type === pointerDown$1 && !within(e.target, this.$el) ||
          e.type === 'keydown' && e.keyCode === 27 ||
          e.type === 'show' && e.detail[0] !== this && e.detail[0].$name === this.$name);


          clearTimeout(this.showTimer);
          this.showTimer = setTimeout(this._show, this.delay);
        },

        async hide() {
          if (matches(this.$el, 'input:focus')) {
            return;
          }

          clearTimeout(this.showTimer);

          if (!this.isToggled(this.tooltip || null)) {
            return;
          }

          await this.toggleElement(this.tooltip, false, false);
          remove$1(this.tooltip);
          this.tooltip = null;
          this._unbind();
        },

        _show() {
          this.tooltip = append(
          this.container, "<div class=\"uk-" +
          this.$options.name + "\"> <div class=\"uk-" +
          this.$options.name + "-inner\">" + this.title + "</div> </div>");



          on(this.tooltip, 'toggled', (e, toggled) => {
            this.updateAria(toggled);

            if (!toggled) {
              return;
            }

            this.positionAt(this.tooltip, this.$el);

            const [dir, align] = getAlignment(this.tooltip, this.$el, this.pos);

            this.origin =
            this.axis === 'y' ?
            flipPosition(dir) + "-" + align :
            align + "-" + flipPosition(dir);
          });

          this.toggleElement(this.tooltip, true);
        },

        updateAria(toggled) {
          attr(this.$el, 'aria-expanded', toggled);
        } },


      events: {
        focus: 'show',
        blur: 'hide',

        [pointerEnter + " " + pointerLeave](e) {
          if (!isTouch(e)) {
            this[e.type === pointerEnter ? 'show' : 'hide']();
          }
        },

        // Clicking a button does not give it focus on all browsers and platforms
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#clicking_and_focus
        [pointerDown$1](e) {
          if (isTouch(e)) {
            this.show();
          }
        } } };



    function makeFocusable(el) {
      if (!isFocusable(el)) {
        attr(el, 'tabindex', '0');
      }
    }

    function getAlignment(el, target, _ref) {let [dir, align] = _ref;
      const elOffset = offset(el);
      const targetOffset = offset(target);
      const properties = [
      ['left', 'right'],
      ['top', 'bottom']];


      for (const props of properties) {
        if (elOffset[props[0]] >= targetOffset[props[1]]) {
          dir = props[1];
          break;
        }
        if (elOffset[props[1]] <= targetOffset[props[0]]) {
          dir = props[0];
          break;
        }
      }

      const props = includes(properties[0], dir) ? properties[1] : properties[0];
      if (elOffset[props[0]] === targetOffset[props[0]]) {
        align = props[0];
      } else if (elOffset[props[1]] === targetOffset[props[1]]) {
        align = props[1];
      } else {
        align = 'center';
      }

      return [dir, align];
    }

    var upload = {
      props: {
        allow: String,
        clsDragover: String,
        concurrent: Number,
        maxSize: Number,
        method: String,
        mime: String,
        msgInvalidMime: String,
        msgInvalidName: String,
        msgInvalidSize: String,
        multiple: Boolean,
        name: String,
        params: Object,
        type: String,
        url: String },


      data: {
        allow: false,
        clsDragover: 'uk-dragover',
        concurrent: 1,
        maxSize: 0,
        method: 'POST',
        mime: false,
        msgInvalidMime: 'Invalid File Type: %s',
        msgInvalidName: 'Invalid File Name: %s',
        msgInvalidSize: 'Invalid File Size: %s Kilobytes Max',
        multiple: false,
        name: 'files[]',
        params: {},
        type: '',
        url: '',
        abort: noop,
        beforeAll: noop,
        beforeSend: noop,
        complete: noop,
        completeAll: noop,
        error: noop,
        fail: noop,
        load: noop,
        loadEnd: noop,
        loadStart: noop,
        progress: noop },


      events: {
        change(e) {
          if (!matches(e.target, 'input[type="file"]')) {
            return;
          }

          e.preventDefault();

          if (e.target.files) {
            this.upload(e.target.files);
          }

          e.target.value = '';
        },

        drop(e) {
          stop(e);

          const transfer = e.dataTransfer;

          if (!(transfer != null && transfer.files)) {
            return;
          }

          removeClass(this.$el, this.clsDragover);

          this.upload(transfer.files);
        },

        dragenter(e) {
          stop(e);
        },

        dragover(e) {
          stop(e);
          addClass(this.$el, this.clsDragover);
        },

        dragleave(e) {
          stop(e);
          removeClass(this.$el, this.clsDragover);
        } },


      methods: {
        async upload(files) {
          files = toArray(files);

          if (!files.length) {
            return;
          }

          trigger(this.$el, 'upload', [files]);

          for (const file of files) {
            if (this.maxSize && this.maxSize * 1000 < file.size) {
              this.fail(this.msgInvalidSize.replace('%s', this.maxSize));
              return;
            }

            if (this.allow && !match(this.allow, file.name)) {
              this.fail(this.msgInvalidName.replace('%s', this.allow));
              return;
            }

            if (this.mime && !match(this.mime, file.type)) {
              this.fail(this.msgInvalidMime.replace('%s', this.mime));
              return;
            }
          }

          if (!this.multiple) {
            files = files.slice(0, 1);
          }

          this.beforeAll(this, files);

          const chunks = chunk(files, this.concurrent);
          const upload = async (files) => {
            const data = new FormData();

            files.forEach((file) => data.append(this.name, file));

            for (const key in this.params) {
              data.append(key, this.params[key]);
            }

            try {
              const xhr = await ajax(this.url, {
                data,
                method: this.method,
                responseType: this.type,
                beforeSend: (env) => {
                  const { xhr } = env;
                  xhr.upload && on(xhr.upload, 'progress', this.progress);
                  for (const type of ['loadStart', 'load', 'loadEnd', 'abort']) {
                    on(xhr, type.toLowerCase(), this[type]);
                  }

                  return this.beforeSend(env);
                } });


              this.complete(xhr);

              if (chunks.length) {
                await upload(chunks.shift());
              } else {
                this.completeAll(xhr);
              }
            } catch (e) {
              this.error(e);
            }
          };

          await upload(chunks.shift());
        } } };



    function match(pattern, path) {
      return path.match(
      new RegExp("^" +
      pattern.
      replace(/\//g, '\\/').
      replace(/\*\*/g, '(\\/[^\\/]+)*').
      replace(/\*/g, '[^\\/]+').
      replace(/((?!\\))\?/g, '$1.') + "$",
      'i'));


    }

    function chunk(files, size) {
      const chunks = [];
      for (let i = 0; i < files.length; i += size) {
        chunks.push(files.slice(i, i + size));
      }
      return chunks;
    }

    function stop(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    var components = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Countdown: countdown,
        Filter: filter,
        Lightbox: lightbox,
        LightboxPanel: LightboxPanel,
        Notification: notification,
        Parallax: parallax,
        Slider: slider,
        SliderParallax: sliderParallax,
        Slideshow: slideshow,
        SlideshowParallax: sliderParallax,
        Sortable: sortable,
        Tooltip: tooltip,
        Upload: upload
    });

    each(components, (component, name) => UIkit.component(name, component));

    return UIkit;

}));
