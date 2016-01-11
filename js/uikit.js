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
	
	var _util = __webpack_require__(/*! ./lib/util */ 1);
	
	var _util2 = _interopRequireDefault(_util);
	
	var _dom = __webpack_require__(/*! ./lib/dom */ 2);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	var _support = __webpack_require__(/*! ./lib/support */ 3);
	
	var _support2 = _interopRequireDefault(_support);
	
	var _component = __webpack_require__(/*! ./lib/component */ 4);
	
	var _component2 = _interopRequireDefault(_component);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var UI = {};
	
	UI.util = _util2.default;
	UI.dom = _dom2.default;
	UI.support = _support2.default;
	UI.component = (0, _component2.default)(UI);
	
	exports.default = UI;
	module.exports = exports['default'];

/***/ },
/* 1 */
/*!****************************!*\
  !*** ./src/js/lib/util.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _dom = __webpack_require__(/*! ./dom */ 2);
	
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
	    },
	    attributes: function attributes(element) {
	
	        element = element[0] || element;
	
	        var attributes = {};
	
	        for (var val, i = 0; i < element.attributes.length; i++) {
	
	            val = this.str2json(element.attributes[i].value);
	            attributes[element.attributes[i].name] = val === false && element.attributes[i].value != 'false' ? element.attributes[i].value : val;
	        }
	
	        return attributes;
	    }
	};
	module.exports = exports['default'];

/***/ },
/* 2 */
/*!***************************!*\
  !*** ./src/js/lib/dom.js ***!
  \***************************/
/***/ function(module, exports) {

	"use strict";
	
	// small DOM pimping
	
	NodeList.prototype.forEach = NodeList.prototype.forEach || Array.prototype.forEach;
	
	var $ = window.jQuery;
	
	$.$doc = $(document);
	$.$win = $(window);
	$.$html = $('html');
	
	$.watch = function (el, fn, config) {
	    var observer = new MutationObserver(fn);
	    observer.observe(el, config || { attributes: true, childList: true, characterData: true });
	    return observer;
	};
	
	$.register = function (name, def) {
	    document.registerElement(name, { prototype: Object.assign(Object.create(HTMLElement.prototype), def || {}) });
	};
	
	module.exports = $;

/***/ },
/* 3 */
/*!*******************************!*\
  !*** ./src/js/lib/support.js ***!
  \*******************************/
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

/***/ },
/* 4 */
/*!*********************************!*\
  !*** ./src/js/lib/component.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	/*
	
	Example:
	
	UIkit.component('alert', {
	
	    webcomponent: true,
	
	    props: {
	        close: false
	    },
	
	    created: function () {
	        console.log('created');
	    },
	
	    attached: function () {
	        console.log('attached');
	        console.log(this.$el);
	        console.log(this.close);
	    },
	
	    detached: function () {}
	
	});
	
	*/
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function (container) {
	
	    if (container) {
	        collection = container;
	    }
	
	    return register;
	};
	
	var _dom = __webpack_require__(/*! ./dom */ 2);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	var _support = __webpack_require__(/*! ./support */ 3);
	
	var _support2 = _interopRequireDefault(_support);
	
	var _util = __webpack_require__(/*! ./util */ 1);
	
	var _util2 = _interopRequireDefault(_util);
	
	var _documentRegisterElement = __webpack_require__(/*! document-register-element */ 5);
	
	var _documentRegisterElement2 = _interopRequireDefault(_documentRegisterElement);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var collection = {};
	var components = {};
	
	var registerElement = function registerElement(name, def) {
	
	    var webcomponent = _dom2.default.extend({
	        prototype: Object.create(HTMLElement.prototype),
	        tag: name
	    }, def);
	
	    if (typeof webcomponent.prototype == 'string') {
	        webcomponent.prototype = Object.create(window[webcomponent.prototype]);
	    }
	
	    _util2.default.extend(webcomponent.prototype, {
	
	        attachedCallback: function attachedCallback() {
	            collection[name](this, _util2.default.attributes(this)); // attached is called in the constructor
	        },
	        detachedCallback: function detachedCallback() {
	            collection[name](this).detached();
	        },
	        attributeChangedCallback: function attributeChangedCallback() {
	            collection[name](this).attributeChanged.apply(this, arguments);
	        }
	    });
	
	    document.registerElement('uk-' + webcomponent.tag, { prototype: webcomponent.prototype });
	};
	
	function register(name, def) {
	
	    var fn = function fn(element, options) {
	
	        var $this = this;
	
	        this.$el = (0, _dom2.default)(element).data(name, this);
	        this.$opts = _dom2.default.extend(true, {}, this.props, options);
	
	        Object.keys(this.props).forEach(function (prop) {
	            $this[prop] = $this.$opts[prop];
	        });
	
	        this.created();
	        this.attached();
	        this.init();
	
	        this.$trigger('init.uk.component', [name, this]);
	
	        return this;
	    };
	
	    _dom2.default.extend(true, fn.prototype, {
	
	        props: {},
	
	        init: function init() {},
	
	        // triggerd as webcomponent
	        attached: function attached() {},
	        created: function created() {},
	        detached: function detached() {},
	
	        attributeChanged: function attributeChanged() {},
	
	        $on: function $on(a1, a2, a3) {
	            return (0, _dom2.default)(this.$el || this).on(a1, a2, a3);
	        },
	        $one: function $one(a1, a2, a3) {
	            return (0, _dom2.default)(this.$el || this).one(a1, a2, a3);
	        },
	        $off: function $off(evt) {
	            return (0, _dom2.default)(this.$el || this).off(evt);
	        },
	        $trigger: function $trigger(evt, params) {
	            return (0, _dom2.default)(this.$el || this).trigger(evt, params);
	        },
	        $find: function $find(selector) {
	            return (0, _dom2.default)(this.$el ? this.$el : []).find(selector);
	        },
	        $proxy: function $proxy(obj, methods) {
	
	            var $this = this;
	
	            methods.split(' ').forEach(function (method) {
	                if (!$this[method]) $this[method] = function () {
	                    return obj[method].apply(obj, arguments);
	                };
	            });
	        },
	        $mixin: function $mixin(obj, methods) {
	
	            var $this = this;
	
	            methods.split(' ').forEach(function (method) {
	                if (!$this[method]) $this[method] = obj[method].bind($this);
	            });
	        }
	    }, def);
	
	    components[name] = fn;
	    collection[name] = function (element, options) {
	
	        element = (0, _dom2.default)(element);
	
	        element.each(function (idx) {
	            if (!(0, _dom2.default)(element).data(name)) {
	                return new fn(element, options);
	            }
	        });
	
	        return element.eq(0).data(name);
	    };
	
	    if (def.webcomponent) {
	        registerElement(name, def.webcomponent);
	    }
	
	    return fn;
	};
	
	exports.components = components;
	
	;
	module.exports = exports['default'];

/***/ },
/* 5 */
/*!************************************************************************!*\
  !*** ./~/document-register-element/build/document-register-element.js ***!
  \************************************************************************/
/***/ function(module, exports) {

	/*! (C) WebReflection Mit Style License */
	(function(e,t,n,r){"use strict";function rt(e,t){for(var n=0,r=e.length;n<r;n++)vt(e[n],t)}function it(e){for(var t=0,n=e.length,r;t<n;t++)r=e[t],nt(r,b[ot(r)])}function st(e){return function(t){j(t)&&(vt(t,e),rt(t.querySelectorAll(w),e))}}function ot(e){var t=e.getAttribute("is"),n=e.nodeName.toUpperCase(),r=S.call(y,t?v+t.toUpperCase():d+n);return t&&-1<r&&!ut(n,t)?-1:r}function ut(e,t){return-1<w.indexOf(e+'[is="'+t+'"]')}function at(e){var t=e.currentTarget,n=e.attrChange,r=e.attrName,i=e.target;Q&&(!i||i===t)&&t.attributeChangedCallback&&r!=="style"&e.prevValue!==e.newValue&&t.attributeChangedCallback(r,n===e[a]?null:e.prevValue,n===e[l]?null:e.newValue)}function ft(e){var t=st(e);return function(e){X.push(t,e.target)}}function lt(e){K&&(K=!1,e.currentTarget.removeEventListener(h,lt)),rt((e.target||t).querySelectorAll(w),e.detail===o?o:s),B&&pt()}function ct(e,t){var n=this;q.call(n,e,t),G.call(n,{target:n})}function ht(e,t){D(e,t),et?et.observe(e,z):(J&&(e.setAttribute=ct,e[i]=Z(e),e.addEventListener(p,G)),e.addEventListener(c,at)),e.createdCallback&&Q&&(e.created=!0,e.createdCallback(),e.created=!1)}function pt(){for(var e,t=0,n=F.length;t<n;t++)e=F[t],E.contains(e)||(n--,F.splice(t--,1),vt(e,o))}function dt(e){throw new Error("A "+e+" type is already registered")}function vt(e,t){var n,r=ot(e);-1<r&&(tt(e,b[r]),r=0,t===s&&!e[s]?(e[o]=!1,e[s]=!0,r=1,B&&S.call(F,e)<0&&F.push(e)):t===o&&!e[o]&&(e[s]=!1,e[o]=!0,r=1),r&&(n=e[t+"Callback"])&&n.call(e))}if(r in t)return;var i="__"+r+(Math.random()*1e5>>0),s="attached",o="detached",u="extends",a="ADDITION",f="MODIFICATION",l="REMOVAL",c="DOMAttrModified",h="DOMContentLoaded",p="DOMSubtreeModified",d="<",v="=",m=/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,g=["ANNOTATION-XML","COLOR-PROFILE","FONT-FACE","FONT-FACE-SRC","FONT-FACE-URI","FONT-FACE-FORMAT","FONT-FACE-NAME","MISSING-GLYPH"],y=[],b=[],w="",E=t.documentElement,S=y.indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},x=n.prototype,T=x.hasOwnProperty,N=x.isPrototypeOf,C=n.defineProperty,k=n.getOwnPropertyDescriptor,L=n.getOwnPropertyNames,A=n.getPrototypeOf,O=n.setPrototypeOf,M=!!n.__proto__,_=n.create||function mt(e){return e?(mt.prototype=e,new mt):this},D=O||(M?function(e,t){return e.__proto__=t,e}:L&&k?function(){function e(e,t){for(var n,r=L(t),i=0,s=r.length;i<s;i++)n=r[i],T.call(e,n)||C(e,n,k(t,n))}return function(t,n){do e(t,n);while((n=A(n))&&!N.call(n,t));return t}}():function(e,t){for(var n in t)e[n]=t[n];return e}),P=e.MutationObserver||e.WebKitMutationObserver,H=(e.HTMLElement||e.Element||e.Node).prototype,B=!N.call(H,E),j=B?function(e){return e.nodeType===1}:function(e){return N.call(H,e)},F=B&&[],I=H.cloneNode,q=H.setAttribute,R=H.removeAttribute,U=t.createElement,z=P&&{attributes:!0,characterData:!0,attributeOldValue:!0},W=P||function(e){J=!1,E.removeEventListener(c,W)},X,V=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.msRequestAnimationFrame||function(e){setTimeout(e,10)},$=!1,J=!0,K=!0,Q=!0,G,Y,Z,et,tt,nt;O||M?(tt=function(e,t){N.call(t,e)||ht(e,t)},nt=ht):(tt=function(e,t){e[i]||(e[i]=n(!0),ht(e,t))},nt=tt),B?(J=!1,function(){var e=k(H,"addEventListener"),t=e.value,n=function(e){var t=new CustomEvent(c,{bubbles:!0});t.attrName=e,t.prevValue=this.getAttribute(e),t.newValue=null,t[l]=t.attrChange=2,R.call(this,e),this.dispatchEvent(t)},r=function(e,t){var n=this.hasAttribute(e),r=n&&this.getAttribute(e),i=new CustomEvent(c,{bubbles:!0});q.call(this,e,t),i.attrName=e,i.prevValue=n?r:null,i.newValue=t,n?i[f]=i.attrChange=1:i[a]=i.attrChange=0,this.dispatchEvent(i)},s=function(e){var t=e.currentTarget,n=t[i],r=e.propertyName,s;n.hasOwnProperty(r)&&(n=n[r],s=new CustomEvent(c,{bubbles:!0}),s.attrName=n.name,s.prevValue=n.value||null,s.newValue=n.value=t[r]||null,s.prevValue==null?s[a]=s.attrChange=0:s[f]=s.attrChange=1,t.dispatchEvent(s))};e.value=function(e,o,u){e===c&&this.attributeChangedCallback&&this.setAttribute!==r&&(this[i]={className:{name:"class",value:this.className}},this.setAttribute=r,this.removeAttribute=n,t.call(this,"propertychange",s)),t.call(this,e,o,u)},C(H,"addEventListener",e)}()):P||(E.addEventListener(c,W),E.setAttribute(i,1),E.removeAttribute(i),J&&(G=function(e){var t=this,n,r,s;if(t===e.target){n=t[i],t[i]=r=Z(t);for(s in r){if(!(s in n))return Y(0,t,s,n[s],r[s],a);if(r[s]!==n[s])return Y(1,t,s,n[s],r[s],f)}for(s in n)if(!(s in r))return Y(2,t,s,n[s],r[s],l)}},Y=function(e,t,n,r,i,s){var o={attrChange:e,currentTarget:t,attrName:n,prevValue:r,newValue:i};o[s]=e,at(o)},Z=function(e){for(var t,n,r={},i=e.attributes,s=0,o=i.length;s<o;s++)t=i[s],n=t.name,n!=="setAttribute"&&(r[n]=t.value);return r})),t[r]=function(n,r){c=n.toUpperCase(),$||($=!0,P?(et=function(e,t){function n(e,t){for(var n=0,r=e.length;n<r;t(e[n++]));}return new P(function(r){for(var i,s,o,u=0,a=r.length;u<a;u++)i=r[u],i.type==="childList"?(n(i.addedNodes,e),n(i.removedNodes,t)):(s=i.target,Q&&s.attributeChangedCallback&&i.attributeName!=="style"&&(o=s.getAttribute(i.attributeName),o!==i.oldValue&&s.attributeChangedCallback(i.attributeName,i.oldValue,o)))})}(st(s),st(o)),et.observe(t,{childList:!0,subtree:!0})):(X=[],V(function E(){while(X.length)X.shift().call(null,X.shift());V(E)}),t.addEventListener("DOMNodeInserted",ft(s)),t.addEventListener("DOMNodeRemoved",ft(o))),t.addEventListener(h,lt),t.addEventListener("readystatechange",lt),t.createElement=function(e,n){var r=U.apply(t,arguments),i=""+e,s=S.call(y,(n?v:d)+(n||i).toUpperCase()),o=-1<s;return n&&(r.setAttribute("is",n=n.toLowerCase()),o&&(o=ut(i.toUpperCase(),n))),Q=!t.createElement.innerHTMLHelper,o&&nt(r,b[s]),r},H.cloneNode=function(e){var t=I.call(this,!!e),n=ot(t);return-1<n&&nt(t,b[n]),e&&it(t.querySelectorAll(w)),t}),-2<S.call(y,v+c)+S.call(y,d+c)&&dt(n);if(!m.test(c)||-1<S.call(g,c))throw new Error("The type "+n+" is invalid");var i=function(){return f?t.createElement(l,c):t.createElement(l)},a=r||x,f=T.call(a,u),l=f?r[u].toUpperCase():c,c,p;return f&&-1<S.call(y,d+l)&&dt(l),p=y.push((f?v:d)+c)-1,w=w.concat(w.length?",":"",f?l+'[is="'+n.toLowerCase()+'"]':l),i.prototype=b[p]=T.call(a,"prototype")?a.prototype:_(H),rt(t.querySelectorAll(w),s),i}})(window,document,Object,"registerElement");

/***/ }
/******/ ])
});
;
//# sourceMappingURL=uikit.js.map