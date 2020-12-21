import {css, fastdom, getEventPos, inBrowser, isTouch, on, once, parent, pointerCancel, pointerDown, pointerUp, toMs, trigger} from 'uikit-util';

export default function (UIkit) {

    if (!inBrowser) {
        return;
    }

    // throttle 'resize'
    let pendingResize;
    const handleResize = () => {
        if (pendingResize) {
            return;
        }
        pendingResize = true;
        fastdom.write(() => pendingResize = false);
        UIkit.update(null, 'resize');
    };

    on(window, 'load resize', handleResize);
    on(document, 'loadedmetadata load', handleResize, true);

    if ('ResizeObserver' in window) {
        (new ResizeObserver(handleResize)).observe(document.documentElement);
    }

    // throttle `scroll` event (Safari triggers multiple `scroll` events per frame)
    let pending;
    on(window, 'scroll', e => {

        if (pending) {
            return;
        }
        pending = true;
        fastdom.write(() => pending = false);

        UIkit.update(null, e.type);

    }, {passive: true, capture: true});

    let started = 0;
    on(document, 'animationstart', ({target}) => {
        if ((css(target, 'animationName') || '').match(/^uk-.*(left|right)/)) {

            started++;
            css(document.documentElement, 'overflowX', 'hidden');
            setTimeout(() => {
                if (!--started) {
                    css(document.documentElement, 'overflowX', '');
                }
            }, toMs(css(target, 'animationDuration')) + 100);
        }
    }, true);

    on(document, pointerDown, e => {

        if (!isTouch(e)) {
            return;
        }

        // Handle Swipe Gesture
        const pos = getEventPos(e);
        const target = 'tagName' in e.target ? e.target : parent(e.target);
        once(document, `${pointerUp} ${pointerCancel} scroll`, e => {

            const {x, y} = getEventPos(e);

            // swipe
            if (e.type !== 'scroll' && target && x && Math.abs(pos.x - x) > 100 || y && Math.abs(pos.y - y) > 100) {

                setTimeout(() => {
                    trigger(target, 'swipe');
                    trigger(target, `swipe${swipeDirection(pos.x, pos.y, x, y)}`);
                });

            }

        });

    }, {passive: true});

}

function swipeDirection(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2)
        ? x1 - x2 > 0
            ? 'Left'
            : 'Right'
        : y1 - y2 > 0
            ? 'Up'
            : 'Down';
}
