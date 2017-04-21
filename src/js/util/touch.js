/*
    Based on:
    Copyright (c) 2010-2016 Thomas Fuchs
    http://zeptojs.com/
*/

import { $, Event, on, pointerCancel, pointerDown, pointerMove, pointerUp, ready } from './index';

var touch = {}, touchTimeout, tapTimeout, swipeTimeout, gesture, clicked;

function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
}

function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout);
    if (tapTimeout) clearTimeout(tapTimeout);
    if (swipeTimeout) clearTimeout(swipeTimeout);
    touchTimeout = tapTimeout = swipeTimeout = null;
    touch = {};
}

ready(function () {

    var now, delta, deltaX = 0, deltaY = 0, firstTouch;

    if ('MSGesture' in window) {
        gesture = new MSGesture();
        gesture.target = document.body;
    }

    on(document, 'click', () => clicked = true, true);

    var gestureHandler = function (e) {

        var swipeDirectionFromVelocity = e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;

        if (swipeDirectionFromVelocity && touch.el !== undefined) {
            touch.el.trigger('swipe');
            touch.el.trigger(`swipe${swipeDirectionFromVelocity}`);
        }
    };

    on(document, 'MSGestureEnd', gestureHandler);
    on(document, 'gestureend', gestureHandler);

    on(document, pointerDown, function (e) {

        firstTouch = e.touches ? e.touches[0] : e;

        now = Date.now();
        delta = now - (touch.last || now);
        touch.el = $('tagName' in firstTouch.target ? firstTouch.target : firstTouch.target.parentNode);

        if (touchTimeout) clearTimeout(touchTimeout);

        touch.x1 = firstTouch.pageX;
        touch.y1 = firstTouch.pageY;

        if (delta > 0 && delta <= 250) touch.isDoubleTap = true;

        touch.last = now;

        // adds the current touch contact for IE gesture recognition
        if (gesture && (e.type === 'pointerdown' || e.type === 'touchstart')) {
            gesture.addPointer(e.pointerId);
        }

        clicked = e.button > 0;

    });

    on(document, pointerMove, function (e) {

        firstTouch = e.touches ? e.touches[0] : e;

        touch.x2 = firstTouch.pageX;
        touch.y2 = firstTouch.pageY;

        deltaX += Math.abs(touch.x1 - touch.x2);
        deltaY += Math.abs(touch.y1 - touch.y2);
    });

    on(document, pointerUp, function () {

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {

            swipeTimeout = setTimeout(function () {
                if (touch.el !== undefined) {
                    touch.el.trigger('swipe');
                    touch.el.trigger(`swipe${swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)}`);
                }
                touch = {};
            }, 0);

            // normal tap
        } else if ('last' in touch) {

            // don't fire tap when delta position changed by more than 30 pixels,
            // for instance when moving to a point and back to origin
            if (isNaN(deltaX) || (deltaX < 30 && deltaY < 30)) {
                // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
                // ('tap' fires before 'scroll')
                tapTimeout = setTimeout(function () {

                    // trigger universal 'tap' with the option to cancelTouch()
                    // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
                    var event = Event('tap');
                    event.cancelTouch = cancelAll;

                    if (touch.el !== undefined) {
                        touch.el.trigger(event);
                    }

                    // trigger double tap immediately
                    if (touch.isDoubleTap) {
                        if (touch.el !== undefined) touch.el.trigger('doubleTap');
                        touch = {};
                    }

                    // trigger single tap after 300ms of inactivity
                    else {
                        touchTimeout = setTimeout(function () {
                            touchTimeout = null;
                            if (touch.el !== undefined) {
                                touch.el.trigger('singleTap');

                                if (!clicked) {
                                    touch.el.trigger('click');
                                }

                            }
                            touch = {};
                        }, 300);
                    }
                });
            } else {
                touch = {};
            }
            deltaX = deltaY = 0;
        }
    });

    // when the browser window loses focus,
    // for example when a modal dialog is shown,
    // cancel all ongoing events
    on(document, pointerCancel, cancelAll);

    // scrolling the window indicates intention of the user
    // to scroll, not tap or swipe, so cancel all ongoing events
    on(window, 'scroll', cancelAll);
});

var touching = false;
on(document, 'touchstart', () => touching = true, true);
on(document, 'click', () => {touching = false});
on(document, 'touchcancel', () => touching = false, true);

export function isTouch(e) {
    return touching || (e.originalEvent || e).pointerType === 'touch';
}
