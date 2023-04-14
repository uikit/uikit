import { css } from './style';
import { isVisible, parents } from './filter';
import { offset, offsetPosition } from './dimensions';
import {
    clamp,
    findIndex,
    includes,
    intersectRect,
    isWindow,
    toFloat,
    toWindow,
    ucfirst,
} from './lang';

export function isInView(element, offsetTop = 0, offsetLeft = 0) {
    if (!isVisible(element)) {
        return false;
    }

    return intersectRect(
        ...overflowParents(element)
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

export function scrollIntoView(element, { offset: offsetBy = 0 } = {}) {
    const parents = isVisible(element) ? scrollParents(element, false, ['hidden']) : [];
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

                element.scrollTop = scroll + top * percent;

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

    const [scrollElement] = scrollParents(element, true);
    const { scrollHeight, scrollTop } = scrollElement;
    const { height: viewportHeight } = offsetViewport(scrollElement);
    const maxScroll = scrollHeight - viewportHeight;
    const elementOffsetTop = offsetPosition(element)[0] - offsetPosition(scrollElement)[0];

    const start = Math.max(0, elementOffsetTop - viewportHeight + startOffset);
    const end = Math.min(maxScroll, elementOffsetTop + element.offsetHeight - endOffset);

    return clamp((scrollTop - start) / (end - start));
}

export function scrollParents(element, scrollable = false, props = []) {
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
                    css(parent, 'overflow')
                        .split(' ')
                        .some((prop) => includes(['auto', 'scroll', ...props], prop)) &&
                    (!scrollable || parent.scrollHeight > offsetViewport(parent).height)
            )
        )
        .reverse();
}

export function overflowParents(element) {
    return scrollParents(element, false, ['hidden', 'clip']);
}

export function offsetViewport(scrollElement) {
    const window = toWindow(scrollElement);
    const {
        visualViewport,
        document: { documentElement },
    } = window;
    let viewportElement =
        scrollElement === scrollingElement(scrollElement) ? window : scrollElement;

    if (isWindow(viewportElement) && visualViewport) {
        let { height, width, scale, pageTop: top, pageLeft: left } = visualViewport;
        height = Math.round(height * scale);
        width = Math.round(width * scale);
        return { height, width, top, left, bottom: top + height, right: left + width };
    }

    let rect = offset(viewportElement);
    if (css(viewportElement, 'display') === 'inline') {
        return rect;
    }

    for (let [prop, dir, start, end] of [
        ['width', 'x', 'left', 'right'],
        ['height', 'y', 'top', 'bottom'],
    ]) {
        if (isWindow(viewportElement)) {
            // iOS 12 returns <body> as scrollingElement
            viewportElement = documentElement;
        } else {
            rect[start] += toFloat(css(viewportElement, `border-${start}-width`));
        }
        const subpixel = rect[prop] % 1;
        rect[prop] = rect[dir] =
            viewportElement[`client${ucfirst(prop)}`] -
            (subpixel ? (subpixel < 0.5 ? -subpixel : 1 - subpixel) : 0);
        rect[end] = rect[prop] + rect[start];
    }
    return rect;
}

function scrollingElement(element) {
    return toWindow(element).document.scrollingElement;
}
