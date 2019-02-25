import {on, once, trigger} from './event';
import {pointerDown, pointerUp} from './env';

let off;

on(document, pointerDown, e => {

    off && off();

    if (!isTouch(e)) {
        return;
    }

    const pos = getPos(e);
    const target = 'tagName' in e.target ? e.target : e.target.parentNode;
    off = once(document, pointerUp, e => {

        const {x, y} = getPos(e);

        // swipe
        if (target && x && Math.abs(pos.x - x) > 100 || y && Math.abs(pos.y - y) > 100) {

            setTimeout(() => {
                trigger(target, 'swipe');
                trigger(target, `swipe${swipeDirection(pos.x, pos.y, x, y)}`);
            });

        }

    });
});

export function isTouch(e) {
    return e.pointerType === 'touch' || e.touches;
}

export function getPos(e, prop = 'client') {
    const {touches, changedTouches} = e;
    const {[`${prop}X`]: x, [`${prop}Y`]: y} = touches && touches[0] || changedTouches && changedTouches[0] || e;

    return {x, y};
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
