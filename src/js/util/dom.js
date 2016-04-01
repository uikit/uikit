import $ from 'jquery';
import {animationend, transitionend, requestAnimationFrame} from './env';
import {isString, extend} from './lang';

export const langDirection = $('html').attr('dir') == 'rtl' ? 'right' : 'left';

export function ready(fn) {

    var handle = function () {
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

export function transition(element, props, duration, transition) {

    var d = $.Deferred();

    element = $(element);

    for (var name in props) {
        element.css(name, element.css(name));
    }

    let timer = setTimeout(() => element.trigger(transitionend || 'transitionend'), duration);

    element
        .one(transitionend || 'transitionend', () => {
            d.resolve();
            clearTimeout(timer);
            element.removeClass('uk-transition').css('transition', '');
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

export function animate(element, animation, duration, out) {

    var d = $.Deferred(), cls = out ? 'uk-animation-leave' : 'uk-animation-enter';

    element = $(element);

    if (out && animation.indexOf('uk-animation-') === 0) {
        animation += ' uk-animation-reverse';
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

    in(element, animation, duration) {
        return animate(element, animation, duration, false);
    },

    out(element, animation, duration) {
        return animate(element, animation, duration, true);
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
    element.attr(attr, (i, value) => value ? value.replace(pattern, replacement) : value);
    return element;
}

export function removeClass(element, cls) {
    return attrFilter(element, 'class', new RegExp(`(^|\\s)${cls}(?!\\S)`, 'g'), '');
}

export function createEvent(e) {
    if (isString(e)) {
        var ev = document.createEvent('Event');
        ev.initEvent(e, true, false);
        return ev;
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
