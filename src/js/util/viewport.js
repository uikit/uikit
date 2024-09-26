import { hasClass } from './class';
import { dimensions, offset, offsetPosition } from './dimensions';
import { isVisible, parent, parents } from './filter';
import {
    clamp,
    findIndex,
    includes,
    intersectRect,
    isNode,
    toFloat,
    toWindow,
    ucfirst,
} from './lang';
import { css } from './style';

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
            .concat(offset(element)),
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

            return () => scrollTo(scrollElement, top - scrollTop, element, maxScroll).then(fn);
        },
        () => Promise.resolve(),
    )();

    function scrollTo(element, top, targetEl, maxScroll) {
        return new Promise((resolve) => {
            const scroll = element.scrollTop;
            const duration = getDuration(Math.abs(top));
            const start = Date.now();
            const isScrollingElement = scrollingElement(element) === element;
            const targetTop = offset(targetEl).top + (isScrollingElement ? 0 : scroll);

            let prev = 0;
            let frames = 15;

            (function step() {
                const percent = ease(clamp((Date.now() - start) / duration));
                let diff = 0;
                if (parents[0] === element && scroll + top < maxScroll) {
                    diff =
                        offset(targetEl).top +
                        (isScrollingElement ? 0 : element.scrollTop) -
                        targetTop -
                        dimensions(getCoveringElement(targetEl)).height;
                }

                if (css(element, 'scrollBehavior') !== 'auto') {
                    css(element, 'scrollBehavior', 'auto');
                }

                element.scrollTop = scroll + (top + diff) * percent;

                css(element, 'scrollBehavior', '');

                // scroll more if we have not reached our destination
                // if element changes position during scroll try another step
                if (percent === 1 && (prev === diff || !frames--)) {
                    resolve();
                } else {
                    prev = diff;
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

    const scrollElement = scrollParent(element, true);
    const { scrollHeight, scrollTop } = scrollElement;
    const { height: viewportHeight } = offsetViewport(scrollElement);
    const maxScroll = scrollHeight - viewportHeight;
    const elementOffsetTop = offsetPosition(element)[0] - offsetPosition(scrollElement)[0];

    const start = Math.max(0, elementOffsetTop - viewportHeight + startOffset);
    const end = Math.min(maxScroll, elementOffsetTop + element.offsetHeight - endOffset);

    return start < end ? clamp((scrollTop - start) / (end - start)) : 1;
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
                    (!scrollable || parent.scrollHeight > offsetViewport(parent).height),
            ),
        )
        .reverse();
}

export function scrollParent(...args) {
    return scrollParents(...args)[0];
}

export function overflowParents(element) {
    return scrollParents(element, false, ['hidden', 'clip']);
}

export function offsetViewport(scrollElement) {
    const window = toWindow(scrollElement);
    const documentScrollingElement = scrollingElement(scrollElement);
    const useWindow = !isNode(scrollElement) || scrollElement.contains(documentScrollingElement);

    if (useWindow && window.visualViewport) {
        let { height, width, scale, pageTop: top, pageLeft: left } = window.visualViewport;
        height = Math.round(height * scale);
        width = Math.round(width * scale);
        return { height, width, top, left, bottom: top + height, right: left + width };
    }

    let rect = offset(useWindow ? window : scrollElement);
    if (css(scrollElement, 'display') === 'inline') {
        return rect;
    }

    const { body, documentElement } = window.document;
    const viewportElement = useWindow
        ? documentScrollingElement === documentElement ||
          // In quirks mode the scrolling element is body, even though the viewport is html
          documentScrollingElement.clientHeight < body.clientHeight
            ? documentScrollingElement
            : body
        : scrollElement;
    for (let [prop, dir, start, end] of [
        ['width', 'x', 'left', 'right'],
        ['height', 'y', 'top', 'bottom'],
    ]) {
        const subpixel = rect[prop] % 1;

        rect[start] += toFloat(css(viewportElement, `border-${start}-width`));
        rect[prop] = rect[dir] =
            viewportElement[`client${ucfirst(prop)}`] -
            (subpixel ? (subpixel < 0.5 ? -subpixel : 1 - subpixel) : 0);
        rect[end] = rect[prop] + rect[start];
    }

    return rect;
}

export function getCoveringElement(target) {
    const { left, width, top } = dimensions(target);
    for (const position of top ? [0, top] : [0]) {
        let coverEl;
        for (const el of toWindow(target).document.elementsFromPoint(left + width / 2, position)) {
            if (
                !el.contains(target) &&
                // If e.g. Offcanvas is not yet closed
                !hasClass(el, 'uk-togglable-leave') &&
                ((hasPosition(el, 'fixed') &&
                    zIndex(
                        parents(target)
                            .reverse()
                            .find(
                                (parent) => !parent.contains(el) && !hasPosition(parent, 'static'),
                            ),
                    ) < zIndex(el)) ||
                    (hasPosition(el, 'sticky') && parent(el).contains(target))) &&
                (!coverEl || dimensions(coverEl).height < dimensions(el).height)
            ) {
                coverEl = el;
            }
        }
        if (coverEl) {
            return coverEl;
        }
    }
}

function zIndex(element) {
    return toFloat(css(element, 'zIndex'));
}

function hasPosition(element, position) {
    return css(element, 'position') === position;
}

function scrollingElement(element) {
    return toWindow(element).document.scrollingElement;
}
