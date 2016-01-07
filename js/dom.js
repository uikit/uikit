(function(UI, $) {

    "use strict";

    // small DOM pimping
    NodeList.prototype.forEach = NodeList.prototype.forEach || Array.prototype.forEach;

    var $DOM = $ || function() {

        var doc = document,
            win = window,
            ArrayProto = Array.prototype,
            slice = ArrayProto.slice,
            filter = ArrayProto.filter;

        var idMatch = /^#[\w-]*$/,
            classMatch = /^\.[\w-]*$/,
            singlet = /^[\w-]*$/;

        function cash(selector, context) {
            return new cash.fn.init(selector, context);
        }

        var fn = cash.fn = cash.prototype = {
            cash: true,
            length: 0
        };

        fn.init = function(selector, context) {
            var result = [],
                matcher, elem;

            if (!selector) {
                return this;
            }

            this.length = 1;

            if (Object.prototype.toString.call(selector) == '[object Function]') {
                return document.readyState != 'loading' ? selector() : document.addEventListener('DOMContentLoaded', selector);
            }

            if (typeof selector !== "string") {
                if (selector.cash) {
                    return selector;
                }

                this[0] = selector;
                return this;
            }

            if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                result = cash.parseHTML(selector);
            } else {
                matcher = idMatch.test(selector);
                elem = selector.slice(1);

                if (!context && matcher) {
                    this[0] = doc.getElementById(elem);
                    return this;
                } else {
                    context = (cash(context)[0] || doc);

                    result = slice.call(singlet.test(elem) ? classMatch.test(selector) ? doc.getElementsByClassName(elem) : doc.getElementsByTagName(selector) : context.querySelectorAll(selector));
                }
            }

            this.length = 0;
            cash.merge(this, result);
            return this;
        };

        fn.init.prototype = fn;

        function buildFragment(str) {
            var fragment = fragment || doc.createDocumentFragment(),
                tmp = tmp || fragment.appendChild(doc.createElement("div"));
            tmp.innerHTML = str;
            return tmp;
        }

        cash.each = function(collection, callback) {
            var l = collection.length,
                i = 0;

            for (; i < l; i++) {
                callback.call(collection[i], collection[i], i, collection);
            }
        };

        cash.extend = fn.extend = function(target, source) {
            var prop;

            if (!source) {
                source = target;
                target = this;
            }

            for (prop in source) {
                if (source.hasOwnProperty(prop)) {
                    target[prop] = source[prop];
                }
            }

            return target;
        };

        cash.matches = function(el, selector) {
            return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
        };

        cash.merge = function(first, second) {
            var len = +second.length,
                i = first.length,
                j = 0;

            for (; j < len; i++, j++) {
                first[i] = second[j];
            }

            first.length = i;
            return first;
        };

        cash.parseHTML = function(str) {
            var parsed = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/).exec(str);

            if (parsed) {
                return [doc.createElement(parsed[1])];
            }

            parsed = buildFragment(str);
            return slice.call(parsed.childNodes);
        };

        cash.unique = function(collection) {
            return cash.merge(cash(), slice.call(collection).filter(function(item, index, self) {
                return self.indexOf(item) === index;
            }));
        };

        var notWhiteMatch = /\S+/g;

        fn.extend({
            addClass: function(className) {
                // TODO: tear out into module for IE9
                var classes = className.match(notWhiteMatch),
                    spacedName, l;

                this.each(function(v) {
                    l = classes.length;

                    if (v.classList) {
                        while (l--) {
                            v.classList.add(classes[l]);
                        }
                    } else {
                        while (l--) {
                            spacedName = " " + v.className + " ";

                            if (spacedName.indexOf(" " + classes[l] + " ") === -1) {
                                v.className += " " + classes[l];
                            }
                        }
                    }
                });

                return this;
            },

            attr: function(name, value) {
                if (!value) {
                    return this[0].getAttribute(name);
                } else {
                    this.each(function(v) {
                        return v.setAttribute(name, value);
                    });

                    return this;
                }
            },

            hasClass: function(className) {
                // TODO: tear out into module for IE9
                if (this[0].classList) {
                    return this[0].classList.contains(className);
                } else {
                    return this[0].className.indexOf(className) !== -1;
                }
            },

            prop: function(name) {
                return this[0][name];
            },

            removeAttr: function(name) {
                this.each(function(v) {
                    return v.removeAttribute(name);
                });
                return this;
            },

            removeClass: function(className) {
                // TODO: tear out into module for IE9
                var classes = className.match(notWhiteMatch),
                    l, newClassName;

                this.each(function(v) {
                    l = classes.length;

                    if (v.classList) {
                        while (l--) {
                            v.classList.remove(classes[l]);
                        }
                    } else {
                        newClassName = " " + v.className + " ";

                        while (l--) {
                            newClassName = newClassName.replace(" " + classes[l] + " ", " ");
                        }

                        v.className = newClassName.trim();
                    }
                });

                return this;
            }

        });

        fn.extend({
            add: function() {
                var arr = slice.call(this),
                    i = 0,
                    l;

                for (l = arguments.length; i < l; i++) {
                    arr = arr.concat(slice.call(cash(arguments[i])));
                }

                return cash.unique(arr);
            },

            each: function(callback) {
                cash.each(this, callback);
            },

            eq: function(index) {
                return cash(this[index]);
            },

            filter: function(selector) {
                if (typeof selector === "string") {
                    return filter.call(this, function(e) {
                        return cash.matches(e, selector);
                    });
                } else {
                    return filter.call(this, selector);
                }
            },

            first: function() {
                return cash(this[0]);
            },

            get: function(num) {
                return this[num];
            },

            index: function(elem) {
                if (!elem) {
                    return slice.call(cash(this[0]).parent().children()).indexOf(this[0]);
                } else {
                    return slice.call(cash(elem).children()).indexOf(this[0]);
                }
            },

            last: function() {
                return cash(this[this.length - 1]);
            }

        });

        fn.extend({
            css: function(prop, value) {
                if (typeof prop === "object") {
                    this.each(function(v) {
                        for (var key in prop) {
                            if (prop.hasOwnProperty(key)) {
                                v.style[key] = prop[key];
                            }
                        }
                    });
                } else if (value) {
                    this.each(function(v) {
                        return v.style[prop] = value;
                    });
                    return this;
                } else {
                    return win.getComputedStyle(this[0], null)[prop];
                }
            }

        });

        fn.extend({
            data: function(key, value) {
                // TODO: tear out into module for IE9
                if (!value) {
                    return this[0].dataset ? this[0].dataset[key] : cash(this[0]).attr("data-" + key);
                } else {
                    this.each(function(v) {
                        if (v.dataset) {
                            v.dataset[key] = value;
                        } else {
                            cash(v).attr("data-" + key, value);
                        }
                    });

                    return this;
                }
            },

            removeData: function(name) {
                // TODO: tear out into module for IE9
                this.each(function(v) {
                    if (v.dataset) {
                        delete v.dataset[name];
                    } else {
                        cash(v).removeAttr("data-" + name);
                    }
                });

                return this;
            }

        });

        function compute(el, prop) {
            return parseInt(win.getComputedStyle(el[0], null)[prop], 10);
        }

        fn.extend({
            height: function() {
                return this[0].getBoundingClientRect().height;
            },

            innerWidth: function() {
                return this[0].clientWidth;
            },

            innerHeight: function() {
                return this[0].clientHeight;
            },

            outerWidth: function(margins) {
                if (margins === true) {
                    return this[0].offsetWidth + (compute(this, "margin-left") || compute(this, "marginLeft") || 0) + (compute(this, "margin-right") || compute(this, "marginRight") || 0);
                }

                return this[0].offsetWidth;
            },

            outerHeight: function(margins) {
                if (margins === true) {
                    return this[0].offsetHeight + (compute(this, "margin-top") || compute(this, "marginTop") || 0) + (compute(this, "margin-bottom") || compute(this, "marginBottom") || 0);
                }

                return this[0].offsetHeight;
            },

            width: function() {
                return this[0].getBoundingClientRect().width;
            }

        });

        var _eventCache = {};

        function guid() {
            function _p8(s) {
                var p = (Math.random().toString(16) + "000000000").substr(2, 8);
                return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
            }

            return _p8() + _p8(true) + _p8(true) + _p8();
        }

        function registerEvent(node, eventName, callback) {
            var nid = cash(node).data("cshid") || guid();

            cash(node).data("cshid", nid);

            if (!(nid in _eventCache)) {
                _eventCache[nid] = {};
            }

            if (!(eventName in _eventCache[nid])) {
                _eventCache[nid][eventName] = [];
            }

            _eventCache[nid][eventName].push(callback);
        }

        fn.extend({
            off: function(eventName, callback) {
                this.each(function(v) {
                    if (callback) {
                        v.removeEventListener(eventName, callback);
                    } else {
                        for (var i in _eventCache[cash(v).data("cshid")][eventName]) {
                            v.removeEventListener(eventName, _eventCache[cash(v).data("cshid")][eventName][i]);
                        }
                    }
                });

                return this;
            },

            on: function(eventName, delegate, callback) {
                if (typeof delegate === "function") {
                    callback = delegate;

                    this.each(function(v) {
                        registerEvent(cash(v), eventName, callback);
                        v.addEventListener(eventName, callback);
                    });
                    return this;
                } else {
                    this.each(function(v) {
                        function handler(e) {
                            var t = e.target;

                            if (cash.matches(t, delegate)) {
                                callback.call(t);
                            } else {
                                while (!cash.matches(t, delegate)) {
                                    if (t === v) {
                                        return (t = false);
                                    }
                                    t = t.parentNode;
                                }

                                if (t) {
                                    callback.call(t);
                                }
                            }
                        }

                        registerEvent(cash(v), eventName, handler);
                        v.addEventListener(eventName, handler);
                    });

                    return this;
                }
            },

            ready: function(callback) {
                document.readyState != 'loading' ? callback() : this[0].addEventListener('DOMContentLoaded', callback);
            },

            trigger: function(eventName) {
                var evt = doc.createEvent("HTMLEvents");
                evt.initEvent(eventName, true, false);
                this.each(function(v) {
                    return v.dispatchEvent(evt);
                });
                return this;
            }

        });

        var encode = encodeURIComponent;

        fn.extend({
            serialize: function() {
                var form = this[0],
                    query = "",
                    field, i, j;

                for (i = form.elements.length - 1; i >= 0; i--) {
                    field = form.elements[i];

                    if (field.name && field.type !== "file" && field.type !== "reset") {
                        if (field.type === "select-multiple") {
                            for (j = form.elements[i].options.length - 1; j >= 0; j--) {
                                if (field.options[j].selected) {
                                    query += "&" + field.name + "=" + encode(field.options[j].value).replace(/%20/g, "+");
                                }
                            }
                        } else if ((field.type !== "submit" && field.type !== "button")) {
                            query += "&" + field.name + "=" + encode(field.value).replace(/%20/g, "+");
                        }
                    }
                }

                return query.substr(1);
            },

            val: function(value) {
                if (value === undefined) {
                    return this[0].value;
                } else {
                    this.each(function(v) {
                        return v.value = value;
                    });
                    return this;
                }
            }

        });

        fn.extend({
            append: function(content) {
                this[0].appendChild(cash(content)[0]);
                return this;
            },

            appendTo: function(content) {
                cash(content)[0].appendChild(this[0]);
                return this;
            },

            clone: function() {
                return cash(this[0].cloneNode(true));
            },

            empty: function() {
                this.each(function(v) {
                    return v.innerHTML = "";
                });
                return this;
            },

            html: function(content) {
                var source;

                if (typeof content == "undefined") {
                    return this[0].innerHTML;
                } else {
                    source = typeof content === "object" ? cash(content)[0].outerHTML : content;
                    this.each(function(v) {
                        return v.innerHTML = "" + source;
                    });
                    return this;
                }
            },

            insertAfter: function(selector) {
                cash(selector)[0].insertAdjacentHTML("afterend", this[0].outerHTML);
                return this;
            },

            insertBefore: function(selector) {
                cash(selector)[0].insertAdjacentHTML("beforebegin", this[0].outerHTML);
                return this;
            },

            prepend: function(selector) {
                cash(this)[0].insertAdjacentHTML("afterBegin", cash(selector)[0].outerHTML);
                return this;
            },

            prependTo: function(selector) {
                cash(selector)[0].insertAdjacentHTML("afterBegin", this[0].outerHTML);
                return this;
            },

            remove: function() {
                this.each(function(v) {
                    return v.parentNode.removeChild(v);
                });
            },

            text: function(content) {
                if (typeof content == "undefined") {
                    return this[0].textContent;
                } else {
                    this.each(function(v) {
                        return v.textContent = content;
                    });
                    return this;
                }
            }

        });

        fn.extend({
            children: function(selector) {
                if (!selector) {
                    return cash.fn.extend(this[0].children, cash.fn);
                } else {
                    return cash(this[0].children).filter(function(v) {
                        return cash.matches(v, selector);
                    });
                }
            },

            closest: function(selector) {
                if (!selector || cash.matches(this[0], selector)) {
                    return this;
                } else {
                    return this.parent().closest(selector);
                }
            },

            is: function(selector) {
                if (!selector) {
                    return false;
                }

                if (selector.cash) {
                    return this[0] === selector[0];
                }

                return typeof selector === "string" ? cash.matches(this[0], selector) : false;
            },

            find: function(selector) {
                return cash.fn.extend(this[0].querySelectorAll(selector), cash.fn);
            },

            has: function(selector) {
                return filter.call(this, function(el) {
                    return cash(el).find(selector).length !== 0;
                });
            },

            next: function() {
                return cash(this[0].nextElementSibling);
            },

            not: function(selector) {
                return filter.call(this, function(el) {
                    return !cash.matches(el, selector);
                });
            },

            parent: function() {
                var result = ArrayProto.map.call(this, function(item) {
                    return item.parentElement || doc.body.parentNode;
                });

                return cash.unique(result);
            },

            parents: function(selector) {
                var last, result = [],
                    count = 0;

                this.each(function(item) {
                    last = item;

                    while (last !== doc.body.parentNode) {
                        last = last.parentElement;

                        if (!selector || (selector && cash.matches(last, selector))) {
                            result[count] = last;
                            count++;
                        }
                    }
                });

                return cash.unique(result);
            },

            prev: function() {
                return cash(this[0].previousElementSibling);
            },

            siblings: function() {
                var collection = this.parent().children(),
                    el = this[0];

                return filter.call(collection, function(i) {
                    return i !== el;
                });
            }

        });

        return cash;

    }();

    $DOM.watch = function(el, fn, config) {
        var observer = new MutationObserver(fn);
        observer.observe(el, config || { attributes: true, childList: true, characterData: true });
        return observer;
    };

    UI.dom = $DOM;

})(window.UIkit || {}, window.jQuery);
