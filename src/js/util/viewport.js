import { css } from './style';
import { isVisible, parents } from './filter';
import { offset, offsetPosition } from './dimensions';
import {
    clamp,
    findIndex,
    intersectRect,
    isDocument,
    isUndefined,
    isWindow,
    toFloat,
    toNode,
    toWindow,
    ucfirst,
} from './lang';

export function isInView(element, offsetTop = 0, offsetLeft = 0) {
    if (!isVisible(element)) {
        return false;
    }

    return intersectRect(
        ...scrollParents(element)
            .map((parent) => {
                const { top, left, bottom, right } = offsetViewport(parent);

                return {
                    top: top - offsetTop,
                    left: left - offsetLeft,
                    bottom: bottom + offsetTop,
                    right: right + offsetLeft,
                };
            })
            .concat(offset(element))
    );
}

export function scrollTop(element, top) {
    if (isWindow(element) || isDocument(element)) {
        element = scrollingElement(element);
    } else {
        element = toNode(element);
    }

    if (isUndefined(top)) {
        return element.scrollTop;
    } else {
        element.scrollTop = top;
    }
}

export function scrollIntoView(element, { offset: offsetBy = 0 } = {}) {
    const parents = isVisible(element) ? scrollParents(element) : [];
    return parents.reduce(
        (fn, scrollElement, i) => {
            const { scrollTop, scrollHeight, offsetHeight } = scrollElement;
            const viewport = offsetViewport(scrollElement);
            const maxScroll = scrollHeight - viewport.height;
            const { height: elHeight, top: elTop } = parents[i - 1]
                ? offsetViewport(parents[i - 1])
                : offset(element);

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
        () => Promise.resolve()
    )();

    function scrollTo(element, top) {
        return new Promise((resolve) => {
            const scroll = element.scrollTop;
            const duration = getDuration(Math.abs(top));
            const start = Date.now();

            (function step() {
                const percent = ease(clamp((Date.now() - start) / duration));

                scrollTop(element, scroll + top * percent);

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

export function scrolledOver(element, startOffset = 0, endOffset = 0) {
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

export function scrollParents(element, overflowRe = /auto|scroll|hidden/, scrollable = false) {
    const scrollEl = scrollingElement(element);

    let ancestors = parents(element).reverse();
    ancestors = ancestors.slice(ancestors.indexOf(scrollEl) + 1);

    const fixedIndex = findIndex(ancestors, (el) => css(el, 'position') === 'fixed');
    if (~fixedIndex) {
        ancestors = ancestors.slice(fixedIndex);
    }

    return [scrollEl]
        .concat(
            ancestors.filter(
                (parent) =>
                    overflowRe.test(css(parent, 'overflow')) &&
                    (!scrollable || parent.scrollHeight > offsetViewport(parent).height)
            )
        )
        .reverse();
}

export function offsetViewport(scrollElement) {
    let viewportElement = getViewport(scrollElement);

    // iOS 12 returns <body> as scrollingElement
    if (viewportElement === scrollingElement(viewportElement)) {
        viewportElement = document.documentElement;
    }

    let rect = offset(viewportElement);
    for (let [prop, dir, start, end] of [
        ['width', 'x', 'left', 'right'],
        ['height', 'y', 'top', 'bottom'],
    ]) {
        if (!isWindow(getViewport(viewportElement))) {
            rect[start] += toFloat(css(viewportElement, `border${ucfirst(start)}Width`));
        }
        rect[prop] = rect[dir] = (
            isWindow(viewportElement) ? scrollingElement(viewportElement) : viewportElement
        )[`client${ucfirst(prop)}`];
        rect[end] = rect[prop] + rect[start];
    }
    return rect;
}

function scrollingElement(element) {
    const {
        document: { scrollingElement },
    } = toWindow(element);
    return scrollingElement;
}

function getViewport(scrollElement) {
    return scrollElement === scrollingElement(scrollElement) ? window : scrollElement;
}
