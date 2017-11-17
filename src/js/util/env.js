/* global DocumentTouch */
import { doc, Promise, win } from './index';

export const Observer = win.MutationObserver;
export const requestAnimationFrame = win.requestAnimationFrame;

var hasTouchEvents = 'ontouchstart' in win;
var hasPointerEvents = win.PointerEvent;
export const hasTouch = 'ontouchstart' in win
    || win.DocumentTouch && doc instanceof DocumentTouch
    || navigator.pointerEnabled && navigator.maxTouchPoints; // IE >=11

export const pointerDown = !hasTouch ? 'mousedown' : `mousedown ${hasTouchEvents ? 'touchstart' : 'pointerdown'}`;
export const pointerMove = !hasTouch ? 'mousemove' : `mousemove ${hasTouchEvents ? 'touchmove' : 'pointermove'}`;
export const pointerUp = !hasTouch ? 'mouseup' : `mouseup ${hasTouchEvents ? 'touchend' : 'pointerup'}`;
export const pointerEnter = hasTouch && hasPointerEvents ? 'pointerenter' : 'mouseenter';
export const pointerLeave = hasTouch && hasPointerEvents ? 'pointerleave' : 'mouseleave';

export function getImage(src) {

    return new Promise((resolve, reject) => {
        var img = new Image();

        img.onerror = reject;
        img.onload = () => resolve(img);

        img.src = src;
    });

}
