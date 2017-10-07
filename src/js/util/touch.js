/*
    Based on:
    Copyright (c) 2010-2016 Thomas Fuchs
    http://zeptojs.com/
*/

import { doc, on, pointerDown, pointerMove, pointerUp, ready, trigger, win, within } from './index';

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

    on(doc, 'click', () => clicked = true, true);

    on(doc, pointerDown, function (e) {

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

    on(doc, pointerMove, function (e) {

        var {pageX, pageY} = e.touches ? e.touches[0] : e;

        touch.x2 = pageX;
        touch.y2 = pageY;
    });

    on(doc, pointerUp, function ({target}) {

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
            if (touch.el && within(target, touch.el)) {
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

    on(doc, 'touchcancel', cancelAll);
    on(win, 'scroll', cancelAll);
});

var touching = false;
on(doc, 'touchstart', () => touching = true, true);
on(doc, 'click', () => {touching = false});
on(doc, 'touchcancel', () => touching = false, true);

export function isTouch(e) {
    return touching || e.pointerType === 'touch';
}
