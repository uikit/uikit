import $ from 'jquery';
import {animationend, each, extend, isString, transitionend, requestAnimationFrame} from './index';

export const langDirection = $('html').attr('dir') == 'rtl' ? 'right' : 'left';

export function isReady() {
    return document.readyState === 'complete' || document.readyState !== 'loading' && !document.documentElement.doScroll;
}

export function ready(fn) {

    var handle = function () {
        document.removeEventListener('DOMContentLoaded', handle);
        window.removeEventListener('load', handle);
        fn();
    };

    if (isReady()) {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', handle);
        window.addEventListener('load', handle);
    }

}

export function transition(element, props, duration, transition) {

    var d = $.Deferred();

    element = $(element);

    for (var name in props) {
        element.css(name, element.css(name));
    }

    let timer = setTimeout(() => element.trigger(transitionend || 'transitionend'), duration);

    element
        .one(transitionend || 'transitionend', () => {
            clearTimeout(timer);
            element.removeClass('uk-transition').css('transition', '');
            d.resolve();
        })
        .addClass('uk-transition')
        .css('transition', `all ${duration}ms ${transition || 'linear'}`)
        .css(props);

    return d.promise();
}

export const Transition = {

    start: transition,

    stop(element) {

        element = $(element);

        $(element).trigger(transitionend || 'transitionend');

        return this;
    },

    inProgress(element) {
        return $(element).hasClass('uk-transition');
    }

};

export function animate(element, animation, duration, origin, out) {

    var d = $.Deferred(), cls = out ? 'uk-animation-leave' : 'uk-animation-enter';

    element = $(element);

    if (animation.indexOf('uk-animation-') === 0) {

        if (origin) {
            animation += ` uk-animation-${origin}`;
        }

        if (out) {
            animation += ' uk-animation-reverse';
        }

    }

    reset();

    element
        .one(animationend || 'animationend', () => {
            reset();
            d.resolve();
        })
        .css('animation-duration', duration + 'ms')
        .addClass(animation);

    requestAnimationFrame(() => element.addClass(cls));

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
        $(element).trigger(animationend || 'animationend');
        return this;
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

export function isInView(element, offsetTop, offsetLeft) {

    element = $(element);

    if (!element.is(':visible')) {
        return false;
    }

    var win = $(window), scrollLeft = win.scrollLeft(), scrollTop = win.scrollTop(), offset = element.offset();

    return offset.top + element.height() >= scrollTop
        && offset.top - offsetTop <= scrollTop + win.height()
        && offset.left + element.width() >= scrollLeft
        && offset.left - offsetLeft <= scrollLeft + win.width();
}

export function getIndex(index, elements, current = 0) {

    elements = $(elements);

    var length = $(elements).length;

    index = (typeof index === 'number'
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

export function isVoidElement(element) {
    element = $(element);
    return require('void-elements')[element[0].tagName.toLowerCase()];
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
        dimensions = extend({}, dimensions);

        each(dimensions, prop => dimensions = dimensions[prop] < maxDimensions[prop] ? this.ratio(dimensions, prop, maxDimensions[prop]) : dimensions);

        return dimensions;
    }

};
