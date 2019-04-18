import {css, fastdom, getEventPos, isTouch, on, once, pointerDown, pointerUp, ready, toMs, trigger} from 'uikit-util';

export default function (UIkit) {

    ready(() => {

        UIkit.update();
        on(window, 'load resize', () => UIkit.update(null, 'resize'));
        on(document, 'loadedmetadata load', ({target}) => UIkit.update(target, 'resize'), true);

        // throttle `scroll` event (Safari triggers multiple `scroll` events per frame)
        let pending;
        on(window, 'scroll', e => {

            if (pending) {
                return;
            }
            pending = true;
            fastdom.write(() => pending = false);

            const {target} = e;
            UIkit.update(target.nodeType !== 1 ? document.body : target, e.type);

        }, {passive: true, capture: true});

        let started = 0;
        on(document, 'animationstart', ({target}) => {
            if ((css(target, 'animationName') || '').match(/^uk-.*(left|right)/)) {

                started++;
                css(document.body, 'overflowX', 'hidden');
                setTimeout(() => {
                    if (!--started) {
                        css(document.body, 'overflowX', '');
                    }
                }, toMs(css(target, 'animationDuration')) + 100);
            }
        }, true);

    });

    let off;

    on(document, pointerDown, e => {

        off && off();

        if (!isTouch(e)) {
            return;
        }

        const pos = getEventPos(e);
        const target = 'tagName' in e.target ? e.target : e.target.parentNode;
        off = once(document, pointerUp, e => {

            const {x, y} = getEventPos(e);

            // swipe
            if (target && x && Math.abs(pos.x - x) > 100 || y && Math.abs(pos.y - y) > 100) {

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
