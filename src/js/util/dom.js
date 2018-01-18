import { attr } from './attr';
import { css, propName } from './style';
import { doc, docEl, win } from './env';
import { height, width } from './position';
import { on, once, trigger } from './event';
import { matches, toNode, toNodes } from './selector';
import { addClass, hasClass, removeClass, removeClasses } from './class';
import { assign, clamp, each, intersectRect, isNumeric, isString, isUndefined, Promise, startsWith, toNumber } from './lang';

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

export function transition(element, props, duration = 400, timing = 'linear') {

    return Promise.all(toNodes(element).map(element =>
        new Promise((resolve, reject) => {

            for (var name in props) {
                var value = css(element, name);
                if (value === '') {
                    css(element, name, value);
                }
            }

            var timer = setTimeout(() => trigger(element, 'transitionend'), duration);

            once(element, 'transitionend transitioncanceled', ({type}) => {
                clearTimeout(timer);
                removeClass(element, 'uk-transition');
                css(element, {
                    'transition-property': '',
                    'transition-duration': '',
                    'transition-timing-function': ''
                });
                type === 'transitioncanceled' ? reject() : resolve();
            }, false, ({target}) => element === target);

            addClass(element, 'uk-transition');
            css(element, assign({
                'transition-property': Object.keys(props).map(propName).join(','),
                'transition-duration': `${duration}ms`,
                'transition-timing-function': timing
            }, props));

        })
    ));

}

export const Transition = {

    start: transition,

    stop(element) {
        trigger(element, 'transitionend');
        return Promise.resolve();
    },

    cancel(element) {
        trigger(element, 'transitioncanceled');
    },

    inProgress(element) {
        return hasClass(element, 'uk-transition');
    }

};

var animationPrefix = 'uk-animation-',
    clsCancelAnimation = 'uk-cancel-animation';

export function animate(element, animation, duration = 200, origin, out) {

    return Promise.all(toNodes(element).map(element =>
        new Promise((resolve, reject) => {

            if (hasClass(element, clsCancelAnimation)) {
                requestAnimationFrame(() =>
                    Promise.resolve().then(() =>
                        animate.apply(null, arguments).then(resolve, reject)
                    )
                );
                return;
            }

            var cls = `${animation} ${animationPrefix}${out ? 'leave' : 'enter'}`;

            if (startsWith(animation, animationPrefix)) {

                if (origin) {
                    cls += ` uk-transform-origin-${origin}`;
                }

                if (out) {
                    cls += ` ${animationPrefix}reverse`;
                }

            }

            reset();

            once(element, 'animationend animationcancel', ({type}) => {

                var hasReset = false;

                if (type === 'animationcancel') {
                    reject();
                    reset();
                } else {
                    resolve();
                    Promise.resolve().then(() => {
                        hasReset = true;
                        reset();
                    });
                }

                requestAnimationFrame(() => {
                    if (!hasReset) {
                        addClass(element, clsCancelAnimation);

                        requestAnimationFrame(() => removeClass(element, clsCancelAnimation));
                    }
                });

            }, false, ({target}) => element === target);

            css(element, 'animationDuration', `${duration}ms`);
            addClass(element, cls);

            function reset() {
                css(element, 'animationDuration', '');
                removeClasses(element, `${animationPrefix}\\S*`);
            }

        })
    ));

}

var inProgress = new RegExp(`${animationPrefix}(enter|leave)`);
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
        trigger(element, 'animationcancel');
    }

};

export function isInView(element, top = 0, left = 0) {
    return intersectRect(toNode(element).getBoundingClientRect(), {
        top,
        left,
        bottom: top + height(win),
        right: left + width(win)
    });
}

export function scrolledOver(element) {

    element = toNode(element);

    var elHeight = element.offsetHeight,
        top = positionTop(element),
        vp = height(win),
        vh = vp + Math.min(0, top - vp),
        diff = Math.max(0, vp - (height(doc) - (top + elHeight)));

    return clamp(((vh + win.pageYOffset - top) / ((vh + (elHeight - (diff < vp ? diff : 0))) / 100)) / 100);
}

function positionTop(element) {
    var top = 0;

    do {

        top += element.offsetTop;

    } while (element = element.offsetParent);

    return top;
}

export function getIndex(i, elements, current = 0, finite = false) {

    elements = toNodes(elements);

    var length = elements.length;

    i = isNumeric(i)
        ? toNumber(i)
        : i === 'next'
            ? current + 1
            : i === 'previous'
                ? current - 1
                : index(elements, i);

    if (finite) {
        return clamp(i, 0, length - 1);
    }

    i %= length;

    return i < 0 ? i + length : i;
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

        each(dimensions, (_, prop) => dimensions = dimensions[prop] > maxDimensions[prop]
            ? this.ratio(dimensions, prop, maxDimensions[prop])
            : dimensions
        );

        return dimensions;
    },

    cover(dimensions, maxDimensions) {
        dimensions = this.contain(dimensions, maxDimensions);

        each(dimensions, (_, prop) => dimensions = dimensions[prop] < maxDimensions[prop]
            ? this.ratio(dimensions, prop, maxDimensions[prop])
            : dimensions
        );

        return dimensions;
    }

};

export function preventClick() {

    var timer = setTimeout(() => trigger(doc, 'click'), 0);

    once(doc, 'click', e => {
        e.preventDefault();
        e.stopImmediatePropagation();

        clearTimeout(timer);
    }, true);

}

export function isVisible(element) {
    return toNodes(element).some(element => element.offsetHeight);
}

export const selInput = 'input,select,textarea,button';
export function isInput(element) {
    return toNodes(element).some(element => matches(element, selInput));
}

export function empty(element) {
    element = toNode(element);
    element.innerHTML = '';
    return element;
}

export function html(parent, html) {
    parent = toNode(parent);
    return isUndefined(html)
        ? parent.innerHTML
        : append(parent.hasChildNodes() ? empty(parent) : parent, html);
}

export function prepend(parent, element) {

    parent = toNode(parent);

    if (!parent.hasChildNodes()) {
        return append(parent, element);
    } else {
        return insertNodes(element, element => parent.insertBefore(element, parent.firstChild));
    }
}

export function append(parent, element) {
    parent = toNode(parent);
    return insertNodes(element, element => parent.appendChild(element));
}

export function before(ref, element) {
    ref = toNode(ref);
    return insertNodes(element, element => ref.parentNode.insertBefore(element, ref));
}

export function after(ref, element) {
    ref = toNode(ref);
    return insertNodes(element, element => ref.nextSibling
        ? before(ref.nextSibling, element)
        : append(ref.parentNode, element)
    );
}

function insertNodes(element, fn) {
    element = isString(element) ? fragment(element) : element;
    return element
        ? 'length' in element
            ? toNodes(element).map(fn)
            : fn(element)
        : null;
}

export function remove(element) {
    toNodes(element).map(element => element.parentNode && element.parentNode.removeChild(element));
}

export function wrapAll(element, structure) {

    structure = toNode(before(element, structure));

    while (structure.firstChild) {
        structure = structure.firstChild;
    }

    append(structure, element);

    return structure;
}

export function wrapInner(element, structure) {
    return toNodes(toNodes(element).map(element =>
        element.hasChildNodes ? wrapAll(toNodes(element.childNodes), structure) : append(element, structure)
    ));
}

export function unwrap(element) {
    toNodes(element)
        .map(element => element.parentNode)
        .filter((value, index, self) => self.indexOf(value) === index)
        .forEach(parent => {
            before(parent, parent.childNodes);
            remove(parent);
        });
}

var fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;

export function fragment(html) {

    var matches;

    if (matches = singleTagRE.exec(html)) {
        return doc.createElement(matches[1]);
    }

    var container = doc.createElement('div');
    if (fragmentRE.test(html)) {
        container.insertAdjacentHTML('beforeend', html.trim());
    } else {
        container.textContent = html;
    }

    return container.childNodes.length > 1 ? toNodes(container.childNodes) : container.firstChild;

}

export function index(element, ref) {
    return ref
        ? toNodes(element).indexOf(toNode(ref))
        : toNodes((element = toNode(element)) && element.parentNode.children).indexOf(element);
}
