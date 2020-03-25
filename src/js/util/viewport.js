import {css} from './style';
import {Promise} from './promise';
import {isVisible, parents} from './filter';
import {offset, offsetPosition, position} from './dimensions';
import {clamp, intersectRect, isDocument, isWindow, last, pointInRect, toNode, toWindow} from './lang';

export function isInView(element, offsetTop = 0, offsetLeft = 0) {

    if (!isVisible(element)) {
        return false;
    }

    const parents = overflowParents(element).concat(element);

    for (let i = 0; i < parents.length - 1; i++) {
        const {top, left, bottom, right} = offset(getViewport(parents[i]));
        const vp = {
            top: top - offsetTop,
            left: left - offsetLeft,
            bottom: bottom + offsetTop,
            right: right + offsetLeft
        };

        const client = offset(parents[i + 1]);

        if (!intersectRect(client, vp) && !pointInRect({x: client.left, y: client.top}, vp)) {
            return false;
        }
    }

    return true;
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

    const parents = overflowParents(element).concat(element);

    let promise = Promise.resolve();
    for (let i = 0; i < parents.length - 1; i++) {
        promise = promise.then(() =>
            new Promise(resolve => {

                const scrollElement = parents[i];
                const element = parents[i + 1];

                const {scrollTop: scroll} = scrollElement;
                const top = Math.ceil(position(element, getViewport(scrollElement)).top - offsetBy);
                const duration = getDuration(Math.abs(top));

                const start = Date.now();
                const step = () => {

                    const percent = ease(clamp((Date.now() - start) / duration));

                    scrollTop(scrollElement, scroll + top * percent);

                    // scroll more if we have not reached our destination
                    if (percent !== 1) {
                        requestAnimationFrame(step);
                    } else {
                        resolve();
                    }

                };

                step();
            })
        );
    }

    return promise;

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
