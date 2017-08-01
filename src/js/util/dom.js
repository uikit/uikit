import $ from 'jquery';
import { animationend, assign, clamp, each, Event, getContextSelectors, isBoolean, isNumber, isString, promise, requestAnimationFrame, toNode, toJQuery, transitionend } from './index';

var docEl = document.documentElement;
export const win = $(window);
export const doc = $(document);
export const docElement = $(docEl);

export const isRtl = docEl.getAttribute('dir') === 'rtl';

export function isReady() {
    return document.readyState === 'complete' || document.readyState !== 'loading' && !docEl.doScroll;
}

export function ready(fn) {

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

export function on(el, type, listener, useCapture = false) {
    type.split(' ').forEach(type => toNode(el).addEventListener(type, listener, useCapture));
}

export function off(el, type, listener, useCapture = false) {
    type.split(' ').forEach(type => toNode(el).removeEventListener(type, listener, useCapture));
}

export function one(el, type, listener, useCapture, condition) {
    type.split(' ').forEach(type => {
        var handler = e => {
            var result = !condition || condition(e);
            if (result) {
                off(el, type, handler, useCapture);
                listener(isBoolean(result) ? e : result);
            }
        };

        on(el, type, handler, useCapture);
    });
}

export function trigger(element, event) {
    var e = createEvent(event);
    toNode(element).dispatchEvent(e);
    return e;
}

export function $trigger(element, event, data, local = false) {
    var e = event instanceof Event ? event : Event(event);
    $(element)[local ? 'triggerHandler' : 'trigger'](e, data);
    return e;
}

export function transition(element, props, duration = 400, transition = 'linear') {

    return promise((resolve, reject) => {

        element = $(element);

        for (var name in props) {
            element.css(name, element.css(name));
        }

        var timer = setTimeout(() => element.trigger(transitionend), duration);

        element
            .one(transitionend, (e, cancel) => {

                clearTimeout(timer);
                element.removeClass('uk-transition').css('transition', '');
                if (!cancel) {
                    resolve();
                } else {
                    reject();
                }

            })
            .addClass('uk-transition')
            .css('transition', `all ${duration}ms ${transition}`)
            .css(props);

    });

}

export const Transition = {

    start: transition,

    stop(element, cancel) {
        $trigger(element, transitionend, [cancel], true);
        return promise.resolve();
    },

    cancel(element) {
        return this.stop(element, true);
    },

    inProgress(element) {
        return $(element).hasClass('uk-transition');
    }

};

export function animate(element, animation, duration = 200, origin, out) {

    var p = promise(resolve => {

        var cls = `${animation}${out ? ' uk-animation-leave' : ' uk-animation-enter'}`;

        element = $(element);

        if (animation.lastIndexOf('uk-animation-', 0) === 0) {

            if (origin) {
                cls += ` uk-animation-${origin}`;
            }

            if (out) {
                cls += ' uk-animation-reverse';
            }

        }

        reset();

        element
            .one(animationend || 'animationend', () => {
                p.then(reset);
                resolve();
            })
            .css('animation-duration', `${duration}ms`)
            .addClass(cls);

        if (!animationend) {
            requestAnimationFrame(() => Animation.cancel(element));
        }

        function reset() {
            element.css('animation-duration', '').removeClass(cls);
        }

    });

    return p;
}

export const Animation = {

    in(element, animation, duration, origin) {
        return animate(element, animation, duration, origin, false);
    },

    out(element, animation, duration, origin) {
        return animate(element, animation, duration, origin, true);
    },

    inProgress(element) {
        return $(element).hasClass('uk-animation-enter') || $(element).hasClass('uk-animation-leave');
    },

    cancel(element) {
        $trigger(element, animationend || 'animationend', null, true);
        return promise(resolve => requestAnimationFrame(resolve));
    }

};

export function isJQuery(obj) {
    return obj instanceof $;
}

export function isWithin(element, selector) {
    element = $(element);
    return element.is(selector)
        ? true
        : isString(selector)
            ? element.parents(selector).length
            : toNode(selector).contains(element[0]);
}

export function attrFilter(element, attr, pattern, replacement) {
    element = $(element);
    return element.attr(attr, (i, value) => value ? value.replace(pattern, replacement) : value);
}

export function removeClass(element, cls) {
    return attrFilter(element, 'class', new RegExp(`(^|\\s)${cls}(?!\\S)`, 'g'), '');
}

export function createEvent(e, bubbles = true, cancelable = false, data = false) {
    if (isString(e)) {
        var event = document.createEvent('Event');
        event.initEvent(e, bubbles, cancelable);
        e = event;
    }

    if (data) {
        assign(e, data);
    }

    return e;
}

export function isInView(element, offsetTop = 0, offsetLeft = 0) {

    var rect = toNode(element).getBoundingClientRect();

    return rect.bottom >= -1 * offsetTop
        && rect.right >= -1 * offsetLeft
        && rect.top <= window.innerHeight + offsetTop
        && rect.left <= window.innerWidth + offsetLeft;
}

export function scrolledOver(element) {

    element = toNode(element);

    var height = element.offsetHeight,
        top = positionTop(element),
        vp = window.innerHeight,
        vh = vp + Math.min(0, top - vp),
        diff = Math.max(0, vp - (docHeight() - (top + height)));

    return clamp(((vh + window.pageYOffset - top) / ((vh + (height - (diff < vp ? diff : 0)) ) / 100)) / 100);
}

function positionTop(element) {
    var top = 0;

    do {

        top += element.offsetTop;

    } while (element = element.offsetParent);

    return top;
}

export function docHeight() {
    return Math.max(docEl.offsetHeight, docEl.scrollHeight);
}

export function getIndex(index, elements, current = 0) {

    elements = $(elements);

    var length = $(elements).length;

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
export function isVoidElement(element) {
    return voidElements[toNode(element).tagName.toLowerCase()];
}

export const Dimensions = {

    ratio(dimensions, prop, value) {

        var aProp = prop === 'width' ? 'height' : 'width';

        return {
            [aProp]: Math.round(value * dimensions[aProp] / dimensions[prop]),
            [prop]: value
        };
    },

    contain(dimensions, maxDimensions) {
        dimensions = assign({}, dimensions);

        each(dimensions, prop => dimensions = dimensions[prop] > maxDimensions[prop] ? this.ratio(dimensions, prop, maxDimensions[prop]) : dimensions);

        return dimensions;
    },

    cover(dimensions, maxDimensions) {
        dimensions = this.contain(dimensions, maxDimensions);

        each(dimensions, prop => dimensions = dimensions[prop] < maxDimensions[prop] ? this.ratio(dimensions, prop, maxDimensions[prop]) : dimensions);

        return dimensions;
    }

};

export function query(selector, context) {
    var selectors = getContextSelectors(selector);
    return selectors ? selectors.reduce((context, selector) => toJQuery(selector, context), context) : toJQuery(selector);
}

export function preventClick() {

    var timer = setTimeout(() => trigger(doc, 'click'), 0);

    one(doc, 'click', e => {
        e.preventDefault();
        e.stopImmediatePropagation();

        clearTimeout(timer);
    }, true);

}

export function getData(el, attribute) {
    el = toNode(el);
    for (var i = 0, attrs = [attribute, `data-${attribute}`]; i < attrs.length; i++) {
        if (el.hasAttribute(attrs[i])) {
            return el.getAttribute(attrs[i]);
        }
    }
}
