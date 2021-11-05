import {css} from './style';
import {Promise} from './promise';
import {isVisible, parents} from './filter';
import {offset, offsetPosition} from './dimensions';
import {clamp, findIndex, intersectRect, isDocument, isWindow, toNode, toWindow} from './lang';

export function isInView(element, offsetTop = 0, offsetLeft = 0) {

    if (!isVisible(element)) {
        return false;
    }

    return intersectRect(...scrollParents(element).map(parent => {

        const {top, left, bottom, right} = offset(getViewport(parent));

        return {
            top: top - offsetTop,
            left: left - offsetLeft,
            bottom: bottom + offsetTop,
            right: right + offsetLeft
        };
    }).concat(offset(element)));
}

export function scrollTop(element, top) {

    if (isWindow(element) || isDocument(element)) {
        element = getScrollingElement(element);
    } else {
        element = toNode(element);
    }

    element.scrollTop = top;
}

export function scrollIntoView(element, {offset: offsetBy = 0} = {}) {

    const parents = isVisible(element) ? scrollParents(element) : [];
    return parents.reduce((fn, scrollElement, i) => {

        const {scrollTop, scrollHeight, offsetHeight} = scrollElement;
        const maxScroll = scrollHeight - getViewportClientHeight(scrollElement);
        const {height: elHeight, top: elTop} = offset(parents[i - 1] || element);

        let top = Math.ceil(
            elTop
            - offset(getViewport(scrollElement)).top
            - offsetBy
            + scrollTop
        );

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

    }, () => Promise.resolve())();

    function scrollTo(element, top) {
        return new Promise(resolve => {

            const scroll = element.scrollTop;
            const duration = getDuration(Math.abs(top));
            const start = Date.now();

            (function step() {

                const percent = ease(clamp((Date.now() - start) / duration));

                scrollTop(element, scroll + top * percent);

                // scroll more if we have not reached our destination
                if (percent !== 1) {
                    requestAnimationFrame(step);
                } else {
                    resolve();
                }

            })();
        });
    }

    function getDuration(dist) {
        return 40 * Math.pow(dist, .375);
    }

    function ease(k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
    }

}

export function scrolledOver(element, heightOffset = 0) {

    if (!isVisible(element)) {
        return 0;
    }

    const [scrollElement] = scrollParents(element, /auto|scroll/, true);
    const {scrollHeight, scrollTop} = scrollElement;
    const clientHeight = getViewportClientHeight(scrollElement);
    const viewportTop = offsetPosition(element)[0] - scrollTop - offsetPosition(scrollElement)[0];
    const viewportDist = Math.min(clientHeight, viewportTop + scrollTop);

    const top = viewportTop - viewportDist;
    const dist = Math.min(
        element.offsetHeight + heightOffset + viewportDist,
        scrollHeight - (viewportTop + scrollTop),
        scrollHeight - clientHeight
    );

    return clamp(-1 * top / dist);
}

export function scrollParents(element, overflowRe = /auto|scroll|hidden/, scrollable = false) {
    const scrollEl = getScrollingElement(element);

    let ancestors = parents(element).reverse();
    ancestors = ancestors.slice(ancestors.indexOf(scrollEl) + 1);

    const fixedIndex = findIndex(ancestors, el => css(el, 'position') === 'fixed');
    if (~fixedIndex) {
        ancestors = ancestors.slice(fixedIndex);
    }

    return [scrollEl].concat(ancestors.filter(parent =>
        overflowRe.test(css(parent, 'overflow')) && (!scrollable || parent.scrollHeight > getViewportClientHeight(parent)))
    ).reverse();
}

export function getViewport(scrollElement) {
    return scrollElement === getScrollingElement(scrollElement) ? window : scrollElement;
}

// iOS 12 returns <body> as scrollingElement
export function getViewportClientHeight(scrollElement) {
    return (scrollElement === getScrollingElement(scrollElement) ? document.documentElement : scrollElement).clientHeight;
}

function getScrollingElement(element) {
    const {document} = toWindow(element);
    return document.scrollingElement || document.documentElement;
}
