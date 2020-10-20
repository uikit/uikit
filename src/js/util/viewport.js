import {css} from './style';
import {Promise} from './promise';
import {isVisible, parents} from './filter';
import {offset, offsetPosition, position} from './dimensions';
import {clamp, intersectRect, isDocument, isWindow, last, toNode, toWindow} from './lang';

export function isInView(element, offsetTop = 0, offsetLeft = 0) {

    if (!isVisible(element)) {
        return false;
    }

    const parents = overflowParents(element);

    return parents.every((parent, i) => {

        const client = offset(parents[i + 1] || element);
        const {top, left, bottom, right} = offset(getViewport(parent));

        return intersectRect(client, {
            top: top - offsetTop,
            left: left - offsetLeft,
            bottom: bottom + offsetTop,
            right: right + offsetLeft
        });
    });
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

    const parents = overflowParents(element).reverse();
    let diff = 0;
    return parents.reduce((fn, scrollElement, i) => {

        const {scrollTop, scrollHeight, clientHeight} = scrollElement;
        const maxScroll = scrollHeight - clientHeight;

        let top = Math.ceil(position(parents[i - 1] || element, getViewport(scrollElement)).top - offsetBy) + diff + scrollTop;

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

    const scrollElement = last(scrollParents(element));
    const {scrollHeight, scrollTop} = scrollElement;
    const viewport = getViewport(scrollElement);
    const viewportHeight = offset(viewport).height;
    const viewportTop = offsetPosition(element)[0] - scrollTop - offsetPosition(scrollElement)[0];
    const viewportDist = Math.min(viewportHeight, viewportTop + scrollTop);

    const top = viewportTop - viewportDist;
    const dist = Math.min(
        offset(element).height + heightOffset + viewportDist,
        scrollHeight - (viewportTop + scrollTop),
        scrollHeight - viewportHeight
    );

    return clamp(-1 * top / dist);
}

export function scrollParents(element, overflowRe = /auto|scroll/) {
    const scrollEl = getScrollingElement(element);
    const scrollParents = parents(element).filter(parent =>
        parent === scrollEl
        || overflowRe.test(css(parent, 'overflow'))
        && parent.scrollHeight > Math.round(offset(parent).height)
    ).reverse();
    return scrollParents.length ? scrollParents : [scrollEl];
}

export function getViewport(scrollElement) {
    return scrollElement === getScrollingElement(scrollElement) ? window : scrollElement;
}

function overflowParents(element) {
    return scrollParents(element, /auto|scroll|hidden/);
}

function getScrollingElement(element) {
    const {document} = toWindow(element);
    return document.scrollingElement || document.documentElement;
}
