import {on, trigger} from './event';
import {pointerCancel, pointerDown, pointerUp} from './env';

let touch = {}, swipeTimeout, touching;

on(document, pointerDown, e => {

    if (touch.el) {
        touch = {};
    }

    const {target} = e;
    const {x, y} = getPos(e);

    touch.el = 'tagName' in target ? target : target.parentNode;
    touch.x = x;
    touch.y = y;

    touching = isTouch(e);

});

on(document, pointerUp, e => {

    const {x, y} = getPos(e);

    // swipe
    if (touch.el && x && Math.abs(touch.x - x) > 100 || y && Math.abs(touch.y - y) > 100) {

        swipeTimeout = setTimeout(() => {
            if (touch.el) {
                trigger(touch.el, 'swipe');
                trigger(touch.el, `swipe${swipeDirection(touch.x, touch.y, x, y)}`);
            }
            touch = {};
        });

    } else {
        touch = {};
    }

    setTimeout(() => touching = false);

});

on(document, pointerCancel, cancelAll);

export function isTouch(e) {
    return e.pointerType === 'touch' || e.touches || touching;
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

function cancelAll() {
    swipeTimeout && clearTimeout(swipeTimeout);
    swipeTimeout = null;
    touch = {};
}
