(function(UI){

    // dummy MutationObserver polyfill
    window.MutationObserver = window.MutationObserver || function() {
        this.observe = this.disconnect = this.takeRecords = function(){};
    };

    // small DOM pimping
    NodeList.prototype.forEach = NodeList.prototype.forEach || Array.prototype.forEach;

    var dom = {

        parseHTML: function(str) {
            var tmp = document.implementation.createHTMLDocument();
            tmp.body.innerHTML = str.trim();
            return tmp.body.children.length ? tmp.body.children[0] : null;
        },

        ready: function(fn) {
            return document.readyState != 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);
        },

        on: function(el, name, delegate, fn) {

            if (arguments.length !== 3) {
                return el.addEventListener(name, arguments[1]);
            }

            return el.addEventListener(name, function (e) {
                if (e.target.matches(delegate)){
                    return fn.apply(e.target, arguments);
                }
            });
        },

        trigger: function(el, name, data) {
            var  evt = new CustomEvent(name, data || {});
            el.dispatchEvent(evt);
        },

        find: function(selector, contex) {
            return (context || document).querySelectorAll(selector);
        },

        first: function(selector, contex) {
            return (context || document).querySelector(selector);
        },

        closest: function(el, fn) {
            while (el) {
                if (fn(el)) return el;
                el = el.parentNode;
            }
        },

        css: function(el, prop, val) {
            return val !== undefined ? (el.style[prop] = val):getComputedStyle(el)[prop];
        },

        show: function(el) {
            el.style.display = '';
        },

        hide: function(el) {
            el.style.display = 'none';
        },

        attr: function(el, attr, val) {
            return el[(val === false) ? 'removeAttribute':(val ? 'setAttribute':'getAttribute')](attr, val);
        },

        text: function(el, text) {
            return (text) ? (el.textContent = text) : el.textContent;
        },

        html: function(el, html) {
            return (html) ? (el.innerHTML = html) : el.innerHTML;
        },

        is: function(el, misc) {
            return typeof(misc)=='string' ? (el.matches || el.msMatchesSelector || el.webkitMatchesSelector).call(el, misc) : (el===misc);
        },

        offset: function(el) {
            var o = el.getBoundingClientRect()
            return {
                top: o.top + document.body.scrollTop,
                left: o.left + document.body.scrollLeft,
                width: o.width,
                height: o.height
            };
        },

        position: function(el) {
            return {left: el.offsetLeft, top: el.offsetTop};
        },

        append: function(el, misc) {
            el.appendChild(typeof(misc)=='string' ? this.parseHTML(misc) : misc);
        },

        prepend: function(el, misc) {
            el.insertBefore(typeof(misc)=='string' ? this.parseHTML(misc) : misc, el.firstChild);
        },

        remove: function(el) {
            el.parentNode.removeChild(el);
        },

        watch: function(el, fn, config) {
            var observer = new MutationObserver(fn);
            observer.observe(el, config || { attributes: true, childList: true, characterData: true });
            return observer;
        }
    };

    UI.dom = dom;

})(window.UIkit || {});
