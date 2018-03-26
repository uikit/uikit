/*
    Based on:
    Copyright (c) 2010-2016 Thomas Fuchs
    http://zeptojs.com/
*/
import {ready} from './dom';
import {within} from './filter';
import {on, trigger} from './event';
import {pointerDown, pointerMove, pointerUp} from './env';

let touch = {}, clickTimeout, swipeTimeout, tapTimeout, clicked;

function swipeDirection({x1, x2, y1, y2}) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
}

function cancelAll() {
    clickTimeout && clearTimeout(clickTimeout);
    swipeTimeout && clearTimeout(swipeTimeout);
    tapTimeout && clearTimeout(tapTimeout);
    clickTimeout = swipeTimeout = tapTimeout = null;
    touch = {};
}

ready(() => {

    on(document, 'click', () => clicked = true, true);

    on(document, pointerDown, e => {

        const {target} = e;
        const {x, y} = getPos(e);
        const now = Date.now();
        const type = getType(e.type);

        if (touch.type && touch.type !== type) {
            return;
        }

        touch.el = 'tagName' in target ? target : target.parentNode;

        clickTimeout && clearTimeout(clickTimeout);

        touch.x1 = x;
        touch.y1 = y;

        if (touch.last && now - touch.last <= 250) {
            touch = {};
        }

        touch.type = type;
        touch.last = now;

        clicked = e.button > 0;

    });

    on(document, pointerMove, e => {

        if (e.defaultPrevented) {
            return;
        }

        const {x, y} = getPos(e);

        touch.x2 = x;
        touch.y2 = y;

    });

    on(document, pointerUp, ({type, target}) => {

        if (touch.type !== getType(type)) {
            return;
        }

        // swipe
        if (touch.x2 && Math.abs(touch.x1 - touch.x2) > 30 || touch.y2 && Math.abs(touch.y1 - touch.y2) > 30) {

            swipeTimeout = setTimeout(() => {
                if (touch.el) {
                    trigger(touch.el, 'swipe');
                    trigger(touch.el, `swipe${swipeDirection(touch)}`);
                }
                touch = {};
            });

        // normal tap
        } else if ('last' in touch) {

            tapTimeout = setTimeout(() => trigger(touch.el, 'tap'));

            // trigger single click after 350ms of inactivity
            if (touch.el && type !== 'mouseup' && within(target, touch.el)) {
                clickTimeout = setTimeout(() => {
                    clickTimeout = null;
                    if (touch.el && !clicked) {
                        trigger(touch.el, 'click');
                    }
                    touch = {};
                }, 350);
            }

        } else {
            touch = {};
        }

    });

    on(document, 'touchcancel', cancelAll);
    on(window, 'scroll', cancelAll);

});

let touching = false;
on(document, 'touchstart', () => touching = true, true);
on(document, 'click', () => {touching = false;});
on(document, 'touchcancel', () => touching = false, true);

export function isTouch(e) {
    return touching || e.pointerType === 'touch';
}

export function getPos(e) {
    const {touches, changedTouches} = e;
    const {pageX: x, pageY: y} = touches && touches[0] || changedTouches && changedTouches[0] || e;

    return {x, y};
}

function getType(type) {
    return type.slice(0, 5);
}
