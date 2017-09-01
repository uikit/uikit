import $ from 'jquery';
import { addClass, animationend, assign, attr, clamp, each, getContextSelectors, hasClass, height, isNumber, isString, on, one, promise, removeClass, removeClasses, requestAnimationFrame, toJQuery, toNode, toNodes, transitionend, trigger, width } from './index';

export const win = window;
export const doc = document;
export const docEl = doc.documentElement;

export const isRtl = attr(docEl, 'dir') === 'rtl';

export function isReady() {
    return doc.readyState === 'complete' || doc.readyState !== 'loading' && !docEl.doScroll;
}

export function ready(fn) {

    if (isReady()) {
        fn();
        return;
    }

    var handle = function () {
            unbind1();
            unbind2();
            fn();
        },
        unbind1 = on(doc, 'DOMContentLoaded', handle),
        unbind2 = on(win, 'load', handle);
}

var transitioncancel = 'transitioncancel';

export function transition(element, props, duration = 400, transition = 'linear') {

    return promise.all(toNodes(element).map(element =>
        promise((resolve, reject) => {

            element = $(element);

            for (var name in props) {
                element.css(name, element.css(name));
            }

            var timer = setTimeout(() => trigger(element, transitionend), duration);

            one(element, `${transitionend} ${transitioncancel}`, ({type}) => {
                clearTimeout(timer);
                removeClass(element, 'uk-transition');
                element.css('transition', '');
                type === transitioncancel ? reject() : resolve();
            }, false, ({target}) => element.is(target));

            addClass(element, 'uk-transition');
            element
                .css('transition', `all ${duration}ms ${transition}`)
                .css(props);

        })
    ));

}

export const Transition = {

    start: transition,

    stop(element) {
        trigger(element, transitionend);
        return promise.resolve();
    },

    cancel(element) {
        trigger(element, transitioncancel);
        return promise.resolve();
    },

    inProgress(element) {
        return hasClass(element, 'uk-transition');
    }

};

var animationcancel = 'animationcancel',
    animationprefix = 'uk-animation-',
    clsCancelAnimation = 'uk-cancel-animation';

export function animate(element, animation, duration = 200, origin, out) {

    return promise.all(toNodes(element).map(element =>
        promise((resolve, reject) => {

            element = $(element);

            if (hasClass(element, clsCancelAnimation)) {
                requestAnimationFrame(() =>
                    promise.resolve().then(() =>
                        animate.apply(null, arguments).then(resolve, reject)
                    )
                );
                return;
            }

            var cls = `${animation} ${animationprefix}${out ? 'leave' : 'enter'}`;

            if (animation.lastIndexOf(animationprefix, 0) === 0) {

                if (origin) {
                    cls += ` ${animationprefix}${origin}`;
                }

                if (out) {
                    cls += ` ${animationprefix}reverse`;
                }

            }

            reset();

            one(element, `${animationend || 'animationend'} ${animationcancel}`, ({type}) => {

                var hasReset = false;

                type === animationcancel ? reject() : resolve();

                requestAnimationFrame(() => {
                    if (!hasReset) {
                        addClass(element, clsCancelAnimation);

                        requestAnimationFrame(() => removeClass(element, clsCancelAnimation));
                    }
                });

                promise.resolve().then(() => {
                    hasReset = true;
                    reset();
                });

            }, false, ({target}) => element.is(target));

            element.css('animation-duration', `${duration}ms`);
            addClass(element, cls);

            if (!animationend) {
                requestAnimationFrame(() => Animation.cancel(element));
            }

            function reset() {
                element.css('animation-duration', '');
                removeClasses(element, `${animationprefix}\\S*`);
            }

        })
    ));

}

var inProgress = new RegExp(`${animationprefix}(enter|leave)`);
export const Animation = {

    in(element, animation, duration, origin) {
        return animate(element, animation, duration, origin, false);
    },

    out(element, animation, duration, origin) {
        return animate(element, animation, duration, origin, true);
    },

    inProgress(element) {
        return inProgress.test(attr(element, 'class'));
    },

    cancel(element) {
        trigger(element, animationcancel);
        return promise.resolve();
    }

};

export function within(element, selector) {
    element = $(element);
    return element.is(selector)
        ? true
        : isString(selector)
            ? element.parents(selector).length
            : toNode(selector).contains(element[0]);
}

export function isInView(element, offsetTop = 0, offsetLeft = 0) {

    var rect = toNode(element).getBoundingClientRect();

    return rect.bottom >= -1 * offsetTop
        && rect.right >= -1 * offsetLeft
        && rect.top <= height(win) + offsetTop
        && rect.left <= width(win) + offsetLeft;
}

export function scrolledOver(element) {

    element = toNode(element);

    var elHeight = element.offsetHeight,
        top = positionTop(element),
        vp = height(win),
        vh = vp + Math.min(0, top - vp),
        diff = Math.max(0, vp - (height(doc) - (top + elHeight)));

    return clamp(((vh + win.pageYOffset - top) / ((vh + (elHeight - (diff < vp ? diff : 0)) ) / 100)) / 100);
}

function positionTop(element) {
    var top = 0;

    do {

        top += element.offsetTop;

    } while (element = element.offsetParent);

    return top;
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

var voidElements = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'menuitem',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
];

export function isVoidElement(element) {
    return ~voidElements.indexOf(toNode(element).tagName.toLowerCase());
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

export function isVisible(element) {
    return !!toNode(element).offsetHeight;
}
