import $ from 'jquery';
import { animationend, each, extend, getContextSelectors, isNumber, isString, toJQuery, transitionend, requestAnimationFrame } from './index';

export const win = $(window);
export const doc = $(document);

export const langDirection = $('html').attr('dir') == 'rtl' ? 'right' : 'left';

export function isReady() {
    return document.readyState === 'complete' || document.readyState !== 'loading' && !document.documentElement.doScroll;
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

export function on(el, type, listener, useCapture) {
    $(el)[0].addEventListener(type, listener, useCapture)
}

export function off(el, type, listener, useCapture) {
    $(el)[0].removeEventListener(type, listener, useCapture)
}

export function transition(element, props, duration = 400, transition = 'linear') {

    var d = $.Deferred();

    element = $(element);

    for (var name in props) {
        element.css(name, element.css(name));
    }

    let timer = setTimeout(() => element.trigger(transitionend || 'transitionend'), duration);

    element
        .one(transitionend || 'transitionend', (e, cancel) => {
            clearTimeout(timer);
            element.removeClass('uk-transition').css('transition', '');
            if (!cancel) {
                d.resolve();
            } else {
                d.reject();
            }
        })
        .addClass('uk-transition')
        .css('transition', `all ${duration}ms ${transition}`)
        .css(props);

    return d.promise();
}

export const Transition = {

    start: transition,

    stop(element) {
        $(element).trigger(transitionend || 'transitionend');
        return this;
    },

    cancel(element) {
        $(element).trigger(transitionend || 'transitionend', [true]);
        return this;
    },

    inProgress(element) {
        return $(element).hasClass('uk-transition');
    }

};

export function animate(element, animation, duration = 200, origin, out) {

    var d = $.Deferred(), cls = out ? 'uk-animation-leave' : 'uk-animation-enter';

    element = $(element);

    if (animation.lastIndexOf('uk-animation-', 0) === 0) {

        if (origin) {
            animation += ` uk-animation-${origin}`;
        }

        if (out) {
            animation += ' uk-animation-reverse';
        }

    }

    reset();

    element
        .one(animationend || 'animationend', () => d.resolve().then(reset))
        .css('animation-duration', duration + 'ms')
        .addClass(animation)
        .addClass(cls);

    if (!animationend) {
        requestAnimationFrame(() => Animation.cancel(element));
    }

    return d.promise();

    function reset() {
        element.css('animation-duration', '').removeClass(`${cls} ${animation}`);
    }
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
        var deferred = $.Deferred();
        $(element).trigger(animationend || 'animationend');
        requestAnimationFrame(() => deferred.resolve());
        return deferred.promise();
    }

};

export function isWithin(element, selector) {
    element = $(element);
    return element.is(selector) || !!(isString(selector) ? element.parents(selector).length : $.contains(selector instanceof $ ? selector[0] : selector, element[0]));
}

export function attrFilter(element, attr, pattern, replacement) {
    element = $(element);
    return element.attr(attr, (i, value) => value ? value.replace(pattern, replacement) : value);
}

export function removeClass(element, cls) {
    return attrFilter(element, 'class', new RegExp(`(^|\\s)${cls}(?!\\S)`, 'g'), '');
}

export function createEvent(e, bubbles = true, cancelable = false) {
    if (isString(e)) {
        var event = document.createEvent('Event');
        event.initEvent(e, bubbles, cancelable);
        return event;
    }

    return e;
}

export function isInView(element, offsetTop = 0, offsetLeft = 0) {

    element = $(element);

    if (!element.is(':visible')) {
        return false;
    }

    var scrollLeft = win.scrollLeft(), scrollTop = win.scrollTop(), {top, left} = element.offset();

    return top + element.height() >= scrollTop
        && top - offsetTop <= scrollTop + win.height()
        && left + element.width() >= scrollLeft
        && left - offsetLeft <= scrollLeft + win.width();
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
    element = $(element);
    return voidElements[element[0].tagName.toLowerCase()];
}

export const Dimensions = {

    ratio(dimensions, prop, value) {

        var aProp = prop === 'width' ? 'height' : 'width';

        return {
            [aProp]: Math.round(value * dimensions[aProp] / dimensions[prop]),
            [prop]: value
        };
    },

    fit(dimensions, maxDimensions) {
        dimensions = extend({}, dimensions);

        each(dimensions, prop => dimensions = dimensions[prop] > maxDimensions[prop] ? this.ratio(dimensions, prop, maxDimensions[prop]) : dimensions);

        return dimensions;
    },

    cover(dimensions, maxDimensions) {
        dimensions = this.fit(dimensions, maxDimensions);

        each(dimensions, prop => dimensions = dimensions[prop] < maxDimensions[prop] ? this.ratio(dimensions, prop, maxDimensions[prop]) : dimensions);

        return dimensions;
    }

};

export function query(selector, context) {
    var selectors = getContextSelectors(selector);
    return selectors ? selectors.reduce((context, selector) => toJQuery(selector, context), context) : toJQuery(selector);
}
