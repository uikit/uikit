import {css} from './style';
import {Promise} from './promise';
import {isVisible, parents} from './filter';
import {height, offset, offsetPosition, position} from './dimensions';
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

    if (!isVisible(element)) {
        return;
    }

    const parents = scrollParents(element);
    let diff = 0;
    return parents.reduce((fn, scrollElement, i) => {

        const {scrollTop, scrollHeight} = scrollElement;
        const viewport = getViewport(scrollElement);
        const maxScroll = scrollHeight - height(viewport);

        let top = Math.ceil(position(parents[i - 1] || element, viewport).top - offsetBy) + diff + scrollTop;

        if (top > maxScroll) {
            diff = top - maxScroll;
            top = maxScroll;
        } else {
            diff = 0;
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

    const [scrollElement] = scrollParents(element, /auto|scroll/);
    const {scrollHeight, scrollTop} = scrollElement;
    const viewport = getViewport(scrollElement);
    const viewportHeight = height(viewport);
    const viewportTop = offsetPosition(element)[0] - scrollTop - offsetPosition(scrollElement)[0];
    const viewportDist = Math.min(viewportHeight, viewportTop + scrollTop);

    const top = viewportTop - viewportDist;
    const dist = Math.min(
        height(element) + heightOffset + viewportDist,
        scrollHeight - (viewportTop + scrollTop),
        scrollHeight - viewportHeight
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
        overflowRe.test(css(parent, 'overflow')) && (!scrollable || parent.scrollHeight > height(parent))
    )).reverse();
}

export function getViewport(scrollElement) {
    return scrollElement === getScrollingElement(scrollElement) ? window : scrollElement;
}

function getScrollingElement(element) {
    const {document} = toWindow(element);
    return document.scrollingElement || document.documentElement;
}
