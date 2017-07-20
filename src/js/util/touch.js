/*
    Based on:
    Copyright (c) 2010-2016 Thomas Fuchs
    http://zeptojs.com/
*/

import { isWithin, on, pointerDown, pointerMove, pointerUp, ready, trigger } from './index';

var touch = {}, clickTimeout, swipeTimeout, tapTimeout, clicked;

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

ready(function () {

    on(document, 'click', () => clicked = true, true);

    on(document, pointerDown, function (e) {

        var {target, pageX, pageY} = e.touches ? e.touches[0] : e,
            now = Date.now();

        touch.el = 'tagName' in target ? target : target.parentNode;

        clickTimeout && clearTimeout(clickTimeout);

        touch.x1 = pageX;
        touch.y1 = pageY;

        if (touch.last && now - touch.last <= 250) {
            touch = {};
        }

        touch.last = now;

        clicked = e.button > 0;

    });

    on(document, pointerMove, function (e) {

        var {pageX, pageY} = e.touches ? e.touches[0] : e;

        touch.x2 = pageX;
        touch.y2 = pageY;
    });

    on(document, pointerUp, function ({target}) {

        // swipe
        if (touch.x2 && Math.abs(touch.x1 - touch.x2) > 30 || touch.y2 && Math.abs(touch.y1 - touch.y2) > 30) {

            swipeTimeout = setTimeout(function () {
                if (touch.el) {
                    trigger(touch.el, 'swipe');
                    trigger(touch.el, `swipe${swipeDirection(touch)}`);
                }
                touch = {};
            });

        // normal tap
        } else if ('last' in touch) {

            tapTimeout = setTimeout(() => touch.el && trigger(touch.el, 'tap'));

            // trigger single click after 350ms of inactivity
            if (touch.el && isWithin(target, touch.el)) {
                clickTimeout = setTimeout(function () {
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

var touching = false;
on(document, 'touchstart', () => touching = true, true);
on(document, 'click', () => {touching = false});
on(document, 'touchcancel', () => touching = false, true);

export function isTouch(e) {
    return touching || (e.originalEvent || e).pointerType === 'touch';
}
